########################################################################################################################
# IMPORTS
########################################################################################################################
from django.db import models
from django import forms
from subs.validators import error_generator, validate_plan, validate_amount

########################################################################################################################
# SUBSCRIPTION MODEL
########################################################################################################################
class Subscription(models.Model):
    amount = models.FloatField(blank=True, default=0)
    plan = models.CharField(max_length=200, blank=True, default=None)

    def clean(self):
        errors = error_generator([('plan', (validate_plan, [str(self.plan), ])),
                                  ('amount', (validate_amount, [str(self.amount), ]))])

        if len(errors) != 0:
            raise forms.ValidationError(errors)

