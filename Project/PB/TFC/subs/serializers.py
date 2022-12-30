########################################################################################################################
# IMPORTS
########################################################################################################################
from rest_framework import serializers
from subs.models import Subscription
from rest_framework.exceptions import ValidationError
from subs.validators import error_generator, validate_amount, validate_plan

########################################################################################################################
# SUBSCRIPTION SERIALIZER
########################################################################################################################
class SubscriptionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Subscription
        fields = ('amount',
                  'plan')

    def is_valid(self):
        data = self._kwargs['data']

        for i in data:
            if i not in ['amount', 'plan']:
                raise ValidationError({i: 'incorrect parameter detected'})

        if 'amount' not in data:
            raise ValidationError({'amount': 'missing amount'})

        if 'plan' not in data:
            raise ValidationError({'plan': 'missing plan'})

        errors = error_generator([
            ('amount', (validate_amount, [str(data.get('amount')), ])),
            ('plan', (validate_plan, [str(data.get('plan')), ]))
        ])

        if len(errors) != 0:
            raise ValidationError(errors)

        return True

