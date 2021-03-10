from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Task(models.Model):
    task_name = models.CharField(max_length=200)
    isCompleted = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='tasks')

    class Meta:
        ordering = ('created_on',)

    def __str__(self):
        return self.task_name
