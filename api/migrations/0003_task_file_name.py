# Generated by Django 3.1.7 on 2021-03-11 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_task_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='file_name',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
    ]
