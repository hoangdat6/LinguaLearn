from django.contrib import admin
from .models import Lesson, Word, Course, CustomUser

admin.site.register(Lesson)
admin.site.register(Word)
admin.site.register(Course)
admin.site.register(CustomUser)