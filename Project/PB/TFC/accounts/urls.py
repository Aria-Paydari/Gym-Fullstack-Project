########################################################################################################################
# IMPORTS
########################################################################################################################

from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib import admin
from accounts.models import Member
from accounts import views

########################################################################################################################
# ADMIN PANEL FUNCTIONS
########################################################################################################################

admin.site.register(Member)

########################################################################################################################
# URLS
########################################################################################################################

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.MemberRegister.as_view()),
    path('profile/', views.MemberProfile.as_view()),
    path('edit_payment/', views.CreditView.as_view()),
    path('view_payment/', views.PaymentView.as_view()),
    path('login/', obtain_auth_token),
]
