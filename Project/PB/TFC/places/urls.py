########################################################################################################################
# IMPORTS
########################################################################################################################
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from places.models import Class, Studio
from places.views import NearbyStudiosView, UpdateAmenitiesView, ClassManagerView, ClassHistory, FilterStudios, FilterClasses, ScheduleStudioView, GetStudio

########################################################################################################################
# ADMIN PANEL FUNCTIONS
########################################################################################################################
admin.site.register(Class)
admin.site.register(Studio)

########################################################################################################################
# URLS
########################################################################################################################
router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('nearby_studios/', NearbyStudiosView.as_view()),
    path('studio/<str:studio_name>/update_amenities/', UpdateAmenitiesView.as_view()),
    path('studio/<str:studio_name>/', GetStudio.as_view()),
    path('my_classes/', ClassManagerView.as_view()),
    path('class_history/', ClassHistory.as_view()),
    path('filter_studios/', FilterStudios.as_view()),
    path('filter_classes/', FilterClasses.as_view()),
    path('studio_schedule/', ScheduleStudioView.as_view()),
]
