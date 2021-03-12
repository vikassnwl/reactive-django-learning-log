from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.files.storage import default_storage


# Create your views here.


class TasksView(APIView):
    def get(self, request, format=None):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class DeleteTaskView(APIView):
    def delete(self, request, format=None, pk=None):
        task = Task.objects.get(pk=pk)
        default_storage.delete(task.item_name)
        task.delete()
        return Response('Task deleted successfully')


class CreateTaskView(APIView):
    def post(self, request, format=None):
        serializer = TaskSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


class UpdateTaskView(APIView):
    def post(self, request, format=None, pk=None):
        task = Task.objects.get(pk=pk)
        serializer = TaskSerializer(instance=task, data=self.request.data)
        if serializer.is_valid():
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
        return Response(file_name)
