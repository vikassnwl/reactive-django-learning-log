from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Topic(models.Model):
    name = models.CharField(max_length=200)
    created_on = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.name


class Entry(models.Model):
    content = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    isCompleted = models.BooleanField(default=False)
    image = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.content
