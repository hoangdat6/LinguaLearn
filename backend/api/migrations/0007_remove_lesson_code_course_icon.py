# Generated by Django 5.1.6 on 2025-03-14 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_lesson_course'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='code',
        ),
        migrations.AddField(
            model_name='course',
            name='icon',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
