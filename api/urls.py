from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('tasks/', views.TasksView.as_view()),
    path('delete-task/<int:pk>/', views.DeleteTaskView.as_view()),
    path('create-task/', views.CreateTaskView.as_view()),
    path('update-task/<int:pk>/', views.UpdateTaskView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('check-authenticated/', views.CheckAuthenticatedView.as_view()),
    path('users/', views.UsersView.as_view()),
    path('users/<int:pk>/', views.UsersView.as_view()),
    path('register/', views.RegisterView.as_view()),
    path('save-file/', views.SaveFileView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
