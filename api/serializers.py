from rest_framework import serializers
from .models import Topic, Entry
from django.contrib.auth.models import User


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = '__all__'


class TopicSerializer(serializers.ModelSerializer):
    entry_set = EntrySerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    topic_set = TopicSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = '__all__'
