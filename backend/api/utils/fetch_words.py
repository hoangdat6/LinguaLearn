import requests
import cloudinary.uploader
from concurrent.futures import ThreadPoolExecutor, as_completed
from api.models import Word, Lesson

# API endpoint để lấy từ vựng
word_api_template = "https://mochien-server-release.mochidemy.com/api/v5.0/lesson/words?lesson_id={lesson_id}"

# Headers cho request
headers = {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMTg3MzcyLCJlbWFpbCI6ImRvdHVhbmd2QGdtYWlsLmNvbSIsInRva2VuIjoiNjdjNWJjM2U5ZDdjYSIsImlwIjoiMTE4LjcxLjIyMS4xOTciLCJleHAiOjE3NzI1NDgwMzB9.7McKOsunhE8UaoV-ADrxLwCuPHlYzekV345CqjQ4sBA",
    "PrivateKey": "M0ch1M0ch1_En_$ecret_k3y",
    "Accept": "application/json"
}

def upload_to_cloudinary(url, folder, resource_type="image"):
    """Upload file lên Cloudinary"""
    if not url:
        return None

    try:
        response = cloudinary.uploader.upload(url, folder=folder, resource_type=resource_type)
        return response["secure_url"]
    except Exception as e:
        print(f"❌ Lỗi upload {resource_type}: {e}")
        return None

def process_lesson(lesson):
    if lesson.course_id not in [16, 17, 11, 8]:
        return
    if lesson.words.count() > 0:
        print(f"🔹 Bài học {lesson.title} đã có từ vựng, bỏ qua!")
    """Xử lý từ vựng cho từng bài học"""
    print(f"🔹 Đang xử lý bài học: {lesson.title}")
    word_url = word_api_template.format(lesson_id=lesson.id)
    response = requests.get(word_url, headers=headers)

    if response.status_code != 200:
        print(f"❌ Lỗi API {response.status_code} - {response.text}")
        return

    try:
        words_data = response.json().get("data", [])
    except requests.exceptions.JSONDecodeError:
        print("❌ Lỗi: API không trả về JSON hợp lệ!")
        return

    with ThreadPoolExecutor(max_workers=20) as executor:  # Giới hạn 5 luồng upload
        futures = {}

        for word in words_data:
            image_url = word.get("picture")
            audio_url = word.get("audio")

            # Upload ảnh và audio đồng thời
            future_image = executor.submit(upload_to_cloudinary, image_url, "words", "image")
            future_audio = executor.submit(upload_to_cloudinary, audio_url, "audio", "video")

            futures[future_image] = ("image", word)
            futures[future_audio] = ("audio", word)

        uploaded_files = {}
        for future in as_completed(futures):
            file_type, word = futures[future]
            uploaded_files[file_type] = future.result()

            print(f"✅ Đã upload {file_type}: {uploaded_files[file_type]}")

            # Lưu vào database sau khi upload xong
            Word.objects.update_or_create(
                lesson=lesson,
                word=word.get("content", ""),
                defaults={
                    "pronunciation": word.get("phonetic", ""),
                    "meaning": word.get("trans", ""),
                    "example": word.get("sentence1", ""),
                    "example_vi": word.get("vi_sentence1", ""),
                    "image": uploaded_files.get("image"),
                    "audio": uploaded_files.get("audio"),
                }
            )

    print(f"✅ Đã lưu {len(words_data)} từ vựng cho bài {lesson.title}")

def fetch_words():
    """Hàm chính để tải toàn bộ từ vựng"""
    lessons = Lesson.objects.filter(course__id__in=[16, 17, 11, 8])  # Lấy tất cả bài học của khóa học 16 và 17
    with ThreadPoolExecutor(max_workers=10) as executor:  # Giới hạn 3 luồng tải bài học
        executor.map(process_lesson, lessons)


