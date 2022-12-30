########################################################################################################################
# IMPORTS
########################################################################################################################
from django import forms
from django.db import models
from places.validators import *


########################################################################################################################
# CLASS MODEL
########################################################################################################################

# Create your models here.
# Class times format:
# DAY|Start time|End time|Start date|End date
# "Day|HH:MM|HH:MM|MMDDYY|MMDDYY"
# E.g. Friday|14:15|15:20|111822|121622
class Class(models.Model):
    name = models.CharField(max_length=200, blank=True, default=None, unique=True)
    description = models.CharField(max_length=200, blank=True, default=None)
    keywords = models.CharField(max_length=200, blank=True, default=None)
    capacity = models.PositiveIntegerField(blank=True, default=None)
    coach = models.CharField(max_length=200, blank=True, default=None)
    times = models.CharField(max_length=200, blank=True, default=None)

    def clean(self):
        errors = error_generator([
            Validation(name='capacity', validation_function=(validate_empty, [self.capacity, ])),
            Validation(name='coach', validation_function=(validate_empty, [str(self.coach), ])),
            Validation(name='name', validation_function=(validate_empty, [str(self.name), ])),
            Validation(name='times', validation_function=(validate_times, [str(self.times), ]))
        ])
        if len(errors) != 0:
            raise forms.ValidationError(errors)


########################################################################################################################
# STUDIO MODEL
########################################################################################################################
class Studio(models.Model):
    name = models.CharField(max_length=200, blank=True, default=None, unique=True)
    address = models.CharField(max_length=200, blank=True, default=None, unique=True)
    location = models.CharField(max_length=200, blank=True, default=None)
    postal_code = models.CharField(max_length=7, blank=True, default=None)
    phone_number = models.PositiveIntegerField(blank=True, default=None)
    classes = models.ManyToManyField(Class, blank=True, default=None)
    images = models.TextField(blank=True, default="")
    amenities = models.TextField(blank=True, default="")

    def clean(self):
        errors = error_generator([
            Validation(name='name', validation_function=(validate_empty, [str(self.name)])),
            Validation(name='location', validation_function=(validate_location, [str(self.location), ])),
            Validation(name='postal_code', validation_function=(validate_postal_code, [str(self.postal_code), ])),
            Validation(name='phone_number', validation_function=(validate_phone_number, [str(self.phone_number), ])),
            Validation(name='images', validation_function=(validate_images, [str(self.images), ])),
            Validation(name='amenities', validation_function=(validate_amenities, [str(self.amenities), ]))
        ])
        if len(errors) != 0:
            raise forms.ValidationError(errors)
