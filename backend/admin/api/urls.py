from django.urls import path
from .views import *

urlpatterns = [
    path("hello", Hello.as_view()),
    path("user/signup", SignupView.as_view()),
    path("user/signin", SinginView.as_view()),
    path("table/createTable", CreateTableView.as_view()),
]