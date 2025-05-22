import { TimeUntilNextReview } from "@/services/user-word-service"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { audioService } from "./audio-service"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeUntilNextReview = (timeUntilNextReview: TimeUntilNextReview) : string => {
  const { hours, minutes, seconds } = timeUntilNextReview
  
  if(hours == 0 && minutes == 0 && seconds == 0) {
    return '0'
  }
  
  return `${hours}h ${minutes}m ${seconds}s`
}

// Global audio player instance to prevent playback from being interrupted

export function playAudioByUrl(url: string) {
  return audioService.playAudioFromUrl(url).catch(error => {
    console.error("Failed to play audio:", error);
  });
}

export function playAudioByWord(word: string, lang: string = 'en-US') {
  return audioService.speakText(word, lang).catch(error => {
    console.error("Failed to speak text:", error);
  });
}



/**
 * Tạo câu có khoảng trống bằng cách tìm và thay thế từ vựng và các dạng biến thể của nó.
 */
export function createSentenceWithBlank(sentence: string, baseWord: string): string {
    // 1. Tạo danh sách các biến thể phổ biến của từ
    const wordVariations = generateWordVariations(baseWord);
    
    // 2. Sắp xếp các biến thể theo độ dài giảm dần để tránh thay thế một phần của từ
    const sortedVariations = [...wordVariations].sort((a, b) => b.length - a.length);
    
    // 3. Tìm và thay thế biến thể đầu tiên tìm thấy trong câu
    for (const variation of sortedVariations) {
        // Sử dụng regex với ranh giới từ (\b) để tìm đúng từ hoàn chỉnh
        const regex = new RegExp(`\\b${variation}\\b`, 'i');
        if (regex.test(sentence)) {
            return sentence.replace(regex, '_'.repeat(variation.length));
        }
    }
    
    // 4. Nếu không tìm thấy biến thể nào, thử tìm không phân biệt ranh giới từ
    for (const variation of sortedVariations) {
        const indexOfWord = sentence.toLowerCase().indexOf(variation.toLowerCase());
        if (indexOfWord >= 0) {
            return (
                sentence.substring(0, indexOfWord) + 
                '_'.repeat(variation.length) + 
                sentence.substring(indexOfWord + variation.length)
            );
        }
    }
    
    // 5. Nếu không tìm thấy, trả về câu gốc với từ cơ bản được thay thế
    return sentence.replace(baseWord, '_'.repeat(baseWord.length));
}

/**
 * Tạo các biến thể phổ biến của từ
 */
function generateWordVariations(word: string): string[] {
    const variations: string[] = [word];
    const lowerWord = word.toLowerCase();
    
    // Thêm các biến thể số nhiều
    if (lowerWord.endsWith('y')) {
        variations.push(lowerWord.slice(0, -1) + 'ies');  // city -> cities
    } else if (lowerWord.endsWith('s') || lowerWord.endsWith('ch') || 
               lowerWord.endsWith('sh') || lowerWord.endsWith('x') || 
               lowerWord.endsWith('z')) {
        variations.push(lowerWord + 'es');  // box -> boxes, church -> churches
    } else {
        variations.push(lowerWord + 's');  // dog -> dogs
    }
    
    // Thêm các biến thể động từ phổ biến
    variations.push(lowerWord + 'ed');  // walk -> walked
    variations.push(lowerWord + 'ing');  // walk -> walking
    
    // Xử lý một số trường hợp đặc biệt
    if (lowerWord.endsWith('e')) {
        variations.push(lowerWord.slice(0, -1) + 'ing');  // move -> moving
    } else if (lowerWord.length > 2 && 
               !['a','e','i','o','u'].includes(lowerWord[lowerWord.length-2]) && 
               ['a','e','i','o','u'].includes(lowerWord[lowerWord.length-3])) {
        // Quy tắc "gấp đôi phụ âm cuối" cho động từ ngắn
        variations.push(lowerWord + lowerWord.slice(-1) + 'ed');  // stop -> stopped
        variations.push(lowerWord + lowerWord.slice(-1) + 'ing');  // run -> running
    }
    
    return variations;
}


