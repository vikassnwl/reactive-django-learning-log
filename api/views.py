from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Topic, Entry
from .serializers import TopicSerializer, UserSerializer, EntrySerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from PIL import Image
import os
from pathlib import Path
from .utils import handleThumbnail


# Create your views here.


class TopicsView(APIView):
    def get(self, request, format=None):
        topics = Topic.objects.all()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)


class EntriesView(APIView):
    def get(self, request, format=None):
        entries = Entry.objects.all()
        serializer = EntrySerializer(entries, many=True)
        return Response(serializer.data)


class DeleteTopicView(APIView):

    def delete(self, request, format=None, pk=None):
        topic = Topic.objects.get(pk=pk)
        topic.delete()
        return Response('Topic deleted successfully')


class DeleteEntryView(APIView):
    def delete(self, request, format=None, pk=None):
        entry = Entry.objects.get(pk=pk)
        if entry.image:
            file, ext = os.path.splitext(entry.image)
            default_storage.delete(entry.image)
            default_storage.delete(file+'-thumb'+ext)
        entry.delete()
        return Response('Entry deleted successfully')


class CreateTopicView(APIView):
    def post(self, request, format=None):
        serializer = TopicSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


class CreateEntryView(APIView):
    def post(self, request, format=None):
        serializer = EntrySerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


class UpdateTopicView(APIView):
    def post(self, request, format=None, pk=None):
        topic = Topic.objects.get(pk=pk)
        serializer = TopicSerializer(instance=topic, data=self.request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


class UpdateEntryView(APIView):
    def post(self, request, format=None, pk=None):
        entry = Entry.objects.get(pk=pk)
        serializer = EntrySerializer(instance=entry, data=self.request.data)
        if serializer.is_valid():
            print(entry.image)
            print(self.request.data['image'])
            if entry.image == self.request.data['image']:
                pass
            else:
                file, ext = os.path.splitext(entry.image)
                default_storage.delete(entry.image)
                default_storage.delete(file+'-thumb'+ext)
            serializer.save()

        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request, format=None):
        username = self.request.data['username']
        password = self.request.data['password']
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    login(request, user)
                    return Response({'success': 'logged in successfully', 'user_id': user.id, 'user_name': user.username})
            return Response({'error': 'invalid credentials'})
        return Response({'error': 'all fields are required'})


class LogoutView(APIView):
    def get(self, request, format=None):
        try:
            logout(request)
            return Response({'success': 'logged out successfully'})
        except:
            return Response({'error': 'something went wrong when logging out'})


class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated:
            return Response({'success': 'user is authenticated', 'user_id': request.user.id, 'user_name': request.user.username})
        return Response({'error': 'user is not authenticated'})


class UsersView(APIView):
    def get(self, request, format=None, pk=None):
        if not pk:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
        else:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
        return Response(serializer.data)


class RegisterView(APIView):
    def post(self, request, format=None):
        username = self.request.data['username']
        password = self.request.data['password']
        password2 = self.request.data['password2']

        if username and password and password2:
            if password == password2:
                if not User.objects.filter(username=username).exists():
                    user = User.objects.create_user(
                        username=username, password=password)
                    return Response({'success': 'user created successfully', 'user_id': user.id, 'user_name': user.username})
                else:
                    return Response({'error': 'username already taken'})
            return Response({'error': 'passwords did not match'})
        return Response({'error': 'all fields are required'})


class SaveFileView(APIView):
    def post(self, request, format=None):
        file = self.request.FILES['myFile']
        file_name = default_storage.save(file.name, file)
        handleThumbnail(file, file_name, (100, 100))
        return Response(file_name)
