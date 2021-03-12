from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Task(models.Model):
    ITEM_CHOICES = (
        ('task', 'Task'),
        ('file', 'File')
    )

    item_type = models.CharField(
        max_length=10, choices=ITEM_CHOICES, default='task')
    item_name = models.CharField(max_length=200)
    isCompleted = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='tasks')

    class Meta:
        ordering = ('created_on',)

    def __str__(self):
        return self.item_name
