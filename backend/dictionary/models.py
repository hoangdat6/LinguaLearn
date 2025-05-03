from django.db import models

class Vocabulary(models.Model):
    content = models.CharField(max_length=255)
    category = models.CharField(
        max_length=50,
        choices=[('noun','Noun'),('verb','Verb'),('adj','Adjective'),('adv','Adverb'),('other','Other')]
    )
    phonetic_uk = models.CharField(max_length=100, blank=True, null=True)
    phonetic_us = models.CharField(max_length=100, blank=True, null=True)
    audio_uk = models.CharField(max_length=255, blank=True, null=True)
    audio_us = models.CharField(max_length=255, blank=True, null=True)
    frequency = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content


class WordDefinition(models.Model):
    vocabulary = models.ForeignKey(Vocabulary, on_delete=models.CASCADE, related_name="words")

    picture = models.CharField(max_length=255, blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    content = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=50, blank=True, null=True)
    phonetic = models.CharField(max_length=50, blank=True, null=True)
    definition = models.TextField(blank=True, null=True)
    definition_gpt = models.TextField(blank=True, null=True)
    trans = models.TextField(blank=True, null=True)

    cefr_level = models.CharField(max_length=10)
    cefr_gpt = models.CharField(max_length=50, blank=True, null=True)
    ielts_level = models.CharField(max_length=10)
    toeic = models.CharField(max_length=20, blank=True, null=True)

    single = models.BooleanField(default=False)
    collo = models.BooleanField(default=False)
    synonym = models.BooleanField(default=False)
    review = models.BooleanField(default=False)

    created_at = models.DateTimeField()

    def __str__(self):
        return f"Word of {self.vocabulary.content}"


class SentenceAudio(models.Model):
    word = models.ForeignKey(WordDefinition, on_delete=models.CASCADE, related_name="sentence_audios")

    key = models.TextField()  # câu gốc
    audio = models.CharField(max_length=255, blank=True, null=True)
    trans = models.TextField()

    def __str__(self):
        return self.key[:50]


class Collocation(models.Model):
    word = models.ForeignKey(WordDefinition, on_delete=models.CASCADE, related_name="collocations")

    collocations = models.CharField(max_length=255)
    audio_uk = models.URLField(blank=True, null=True)
    audio = models.URLField(blank=True, null=True)
    definition = models.TextField(blank=True, null=True)
    example = models.TextField(blank=True, null=True)
    example2 = models.TextField(blank=True, null=True)
    collo_ex_audio = models.CharField(max_length=255, blank=True, null=True)
    stressed = models.CharField(max_length=255, blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    answer = models.CharField(max_length=255, blank=True, null=True)
    review = models.BooleanField(default=False)

    def __str__(self):
        return self.collocations


class CollocationTrans(models.Model):
    collocation = models.OneToOneField(Collocation, on_delete=models.CASCADE, related_name="translation")

    collo = models.CharField(max_length=255)
    explain = models.TextField(blank=True, null=True)
    definition = models.TextField(blank=True, null=True)
    example = models.TextField(blank=True, null=True)
    example2 = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.collo


class VerbForm(models.Model):
    word = models.OneToOneField(WordDefinition, related_name='verb_form', on_delete=models.CASCADE)

    present_simple = models.CharField(max_length=100, null=True, blank=True)
    present_simple_phonetic = models.CharField(max_length=100, null=True, blank=True)
    present_simple_audio_us = models.URLField(null=True, blank=True)
    present_simple_audio_uk = models.URLField(null=True, blank=True)

    singular_verb = models.CharField(max_length=100, null=True, blank=True)
    singular_verb_phonetic = models.CharField(max_length=100, null=True, blank=True)
    singular_verb_audio_us = models.URLField(null=True, blank=True)
    singular_verb_audio_uk = models.URLField(null=True, blank=True)

    past_simple = models.CharField(max_length=100, null=True, blank=True)
    past_simple_phonetic = models.CharField(max_length=100, null=True, blank=True)
    past_simple_audio_us = models.URLField(null=True, blank=True)
    past_simple_audio_uk = models.URLField(null=True, blank=True)

    past_participle = models.CharField(max_length=100, null=True, blank=True)
    past_participle_phonetic = models.CharField(max_length=100, null=True, blank=True)
    past_participle_audio_us = models.URLField(null=True, blank=True)
    past_participle_audio_uk = models.URLField(null=True, blank=True)

    ing_form = models.CharField(max_length=100, null=True, blank=True)
    ing_form_phonetic = models.CharField(max_length=100, null=True, blank=True)
    ing_form_audio_us = models.URLField(null=True, blank=True)
    ing_form_audio_uk = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"VerbForm of {self.word.content}"


class ThesaurusEntry(models.Model):
    word = models.ForeignKey(WordDefinition, related_name='thesaurus_entries', on_delete=models.CASCADE)

    position = models.CharField(max_length=50)  # e.g., verb
    position_content = models.CharField(max_length=255)

    strongest_match = models.TextField(null=True, blank=True)
    strong_match = models.TextField(null=True, blank=True)
    weak_match = models.TextField(null=True, blank=True)

    strongest_opposite = models.TextField(null=True, blank=True)
    strong_opposite = models.TextField(null=True, blank=True)
    weak_opposite = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    def __str__(self):
        return f"Thesaurus for {self.word.content} - {self.position}"

class WordOrigin(models.Model):
    word = models.OneToOneField(WordDefinition, related_name='origin', on_delete=models.CASCADE)

    origin_en = models.TextField(null=True, blank=True)
    origin_vi = models.TextField(null=True, blank=True)

    oxford_link = models.URLField(null=True, blank=True)
    cambridge_link = models.URLField(null=True, blank=True)
    longman_link = models.URLField(null=True, blank=True)
    merriam_webster_link = models.URLField(null=True, blank=True)
    collins_link = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Origin of {self.word.content}"
