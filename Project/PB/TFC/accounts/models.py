########################################################################################################################
# IMPORTS
########################################################################################################################

from django.contrib.auth.models import User
from django.db import models
from places.models import Class
from subs.models import Subscription


########################################################################################################################
# MEMBER MODEL
########################################################################################################################

class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)
    phone_number = models.PositiveIntegerField(blank=True, default=0)
    avatar = models.TextField(blank=True, default="")
    classes = models.ManyToManyField(Class, blank=True, default=None)
    credit_card = models.CharField(max_length=200, blank=True, default=None)
    subscription = models.ForeignKey(Subscription, on_delete=models.RESTRICT, default=None, blank=True, null=True, unique=False)
    payment_history = models.TextField(blank=True, default="", null=True)
    class_history = models.TextField(blank=True, default="", null=True)
