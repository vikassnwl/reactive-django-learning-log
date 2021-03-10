from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

# Create your views here.


class TasksView(APIView):
    def get(self, request, format=None):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class DeleteTaskView(APIView):
    def delete(self, request, format=None, pk=None):
        task = Task.objects.get(pk=pk)
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

        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                login(request, user)
                return Response({'success': 'logged in successfully', 'user_id': user.id})
        return Response({'error': 'something went wrong when logging in'})


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
            return Response({'success': 'user is authenticated', 'user_id': request.user.id})
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