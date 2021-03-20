from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('topics/', views.TopicsView.as_view()),
    path('entries/', views.EntriesView.as_view()),
    path('delete-topic/<int:pk>/', views.DeleteTopicView.as_view()),
    path('delete-entry/<int:pk>/', views.DeleteEntryView.as_view()),
    path('create-topic/', views.CreateTopicView.as_view()),
    path('create-entry/', views.CreateEntryView.as_view()),
    path('update-topic/<int:pk>/', views.UpdateTopicView.as_view()),
    path('update-entry/<int:pk>/', views.UpdateEntryView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('check-authenticated/', views.CheckAuthenticatedView.as_view()),
    path('users/', views.UsersView.as_view()),
    path('users/<int:pk>/', views.UsersView.as_view()),
    path('register/', views.RegisterView.as_view()),
    path('save-file/', views.SaveFileView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
