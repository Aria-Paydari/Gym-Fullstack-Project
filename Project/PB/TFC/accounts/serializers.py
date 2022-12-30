########################################################################################################################
# IMPORTS
########################################################################################################################

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from accounts.models import Member
from accounts.validators import *


########################################################################################################################
# MEMBER SERIALIZER
########################################################################################################################

class MemberSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Member
        fields = ('timestamp',
                  'phone_number',
                  'avatar',
                  'classes',
                  'credit_card',
                  'subscription',
                  'payment_history')


########################################################################################################################
# USER SERIALIZER
########################################################################################################################

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username',
                  'password',
                  'first_name',
                  'last_name',
                  'email')


########################################################################################################################
# COMBINED USER MEMBER SERIALIZER
########################################################################################################################

class CombinedUserMemberSerializer(serializers.HyperlinkedModelSerializer):
    username: serializers.CharField()
    password: serializers.CharField()
    first_name: serializers.CharField()
    last_name: serializers.CharField()
    email: serializers.EmailField()
    phone_number: serializers.IntegerField()
    avatar: serializers.CharField()
    credit_card: serializers.CharField()

    def is_valid(self, *, raise_exception=False):
        data = self._kwargs['data']

        for i in data:
            if i not in ['username', 'password', 'first_name', 'last_name', 'email', 'phone_number', 'avatar', 'credit_card']:
                raise ValidationError({i: 'incorrect parameter detected'})

        errors = error_generator([
            Validation(name='phone_number',
                       validation_function=(validate_phone_number, [str(data.get('phone_number')), ]),
                       missing_list=data,
                       received_object=data.get('phone_number'),
                       expected_types=[int]),
            Validation(name='avatar',
                       validation_function=(validate_avatar, [str(data.get('avatar')), ]),
                       missing_list=data,
                       received_object=data.get('avatar'),
                       expected_types=[str]),
            Validation(name='credit_card',
                       validation_function=(validate_credit_card, [str(data.get('credit_card')), ]),
                       missing_list=data,
                       received_object=data.get('credit_card'),
                       expected_types=[str]),
            Validation(name='username',
                       validation_function=(validate_username, [str(data.get('username')), ]),
                       missing_list=data,
                       received_object=data.get('username'),
                       expected_types=[str]),
            Validation(name='email',
                       validation_function=(validate_email, [str(data.get('email')), ]),
                       missing_list=data,
                       received_object=data.get('email'),
                       expected_types=[str]),
            Validation(name='password',
                       missing_list=data,
                       received_object=data.get('password'),
                       expected_types=[str]),
            Validation(name='first_name',
                       missing_list=data,
                       received_object=data.get('first_name'),
                       expected_types=[str]),
            Validation(name='last_name',
                       missing_list=data,
                       received_object=data.get('last_name'),
                       expected_types=[str])
        ])
        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return True


########################################################################################################################
# PROFILE SERIALIZER
########################################################################################################################


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    first_name: serializers.CharField()
    last_name: serializers.CharField()
    email: serializers.EmailField()
    avatar: serializers.CharField()
    phone_number: serializers.IntegerField()

    def is_valid(self, *, raise_exception=False):
        data = self._kwargs['data']

        for i in data:
            if i not in ['first_name', 'last_name', 'email', 'avatar', 'phone_number']:
                raise ValidationError({i: 'incorrect parameter detected'})

        error_lst = []
        if 'phone_number' in data:
            error_lst.append(Validation(name='phone_number',
                                        validation_function=(validate_phone_number, [str(data.get('phone_number')), ]),
                                        missing_list=data,
                                        received_object=data.get('phone_number'),
                                        expected_types=[int]))
        if 'avatar' in data:
            error_lst.append(Validation(name='avatar',
                                        validation_function=(validate_avatar, [str(data.get('avatar')), ]),
                                        missing_list=data,
                                        received_object=data.get('avatar'),
                                        expected_types=[str]))
        if 'email' in data:
            error_lst.append(Validation(name='email',
                                        validation_function=(validate_email, [str(data.get('email')), ]),
                                        missing_list=data,
                                        received_object=data.get('email'),
                                        expected_types=[str]))

        errors = error_generator(error_lst)

        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return True


########################################################################################################################
# SUB SERIALIZER
########################################################################################################################

class SubSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Member
        fields = ('subscription',)


########################################################################################################################
# CREDIT SERIALIZER
########################################################################################################################

class CreditSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Member
        fields = ('credit_card',)

    def is_valid(self, *, raise_exception=False):
        data = self._kwargs['data']

        for i in data:
            if i not in ['credit_card']:
                raise ValidationError({i: 'incorrect parameter detected'})

        errors = error_generator([
            Validation(name='credit_card',
                       validation_function=(validate_credit_card, [str(data.get('credit_card')), ]),
                       missing_list=data,
                       received_object=data.get('credit_card'),
                       expected_types=[str])
        ])

        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return True
