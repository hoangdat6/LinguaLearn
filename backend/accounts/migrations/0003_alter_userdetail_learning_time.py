# Generated by Django 5.1.6 on 2025-05-03 15:27

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_userdetail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdetail',
            name='learning_time',
            field=models.DurationField(default=datetime.timedelta(0)),
        ),
    ]
