########################################################################################################################
# IMPORTS
########################################################################################################################
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from places.models import Studio, Class
from places.validators import *


########################################################################################################################
# CLASS SERIALIZER
########################################################################################################################
class ClassSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Class
        fields = ('name',
                  'description',
                  'keywords',
                  'capacity',
                  'coach',
                  'times')

    def create(self, validated_data):
        return Class.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.keywords = validated_data.get('keywords', instance.keywords)
        instance.capacity = validated_data.get('capacity', instance.capacity)
        instance.coach = validated_data.get('coach', instance.coach)
        instance.times = validated_data.get('times', instance.times)
        instance.save()
        return instance


########################################################################################################################
# STUDIO SERIALIZER HELPER FUNCTIONS
########################################################################################################################

def is_number(number_string):
    try:
        float(number_string)
    except ValueError:
        if not number_string.isdigit():
            return False
    return True


def correct_location_format(location_string):
    lst = location_string.replace(' ', '').split(',')
    print(lst)
    if len(lst) != 2:
        return False
    if not is_number(lst[0]):
        return False
    if not is_number(lst[1]):
        return False
    return -90 <= float(lst[0]) <= 90 and -180 <= float(lst[1]) <= 180


########################################################################################################################
# STUDIO SERIALIZER
########################################################################################################################

class StudioSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Studio
        fields = ('name',
                  'address',
                  'location',
                  'postal_code',
                  'phone_number',
                  'classes',
                  'images',
                  'amenities')

    def validate_location(self, location):
        location = location.replace(' ', '')
        data = self._kwargs['data']
        errors = error_generator([
            Validation(name='location',
                       validation_function=(validate_location, [location, ]),
                       missing_list=data,
                       received_object=data.get('location'),
                       expected_types=[str])
        ], non_dictionary=True)
        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return location

    def validate_postal_code(self, postal_code):
        postal_code = postal_code.replace(' ', '')
        data = self._kwargs['data']
        errors = error_generator([
            Validation(name='postal_code',
                       validation_function=(validate_postal_code, [postal_code, ]),
                       missing_list=data,
                       received_object=data.get('postal_code'),
                       expected_types=[str])
        ], non_dictionary=True)
        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return postal_code

    def validate_phone_number(self, phone_number):
        data = self._kwargs['data']
        errors = error_generator([
            Validation(name='phone_number',
                       validation_function=(validate_phone_number, [phone_number, ]),
                       missing_list=data,
                       received_object=data.get('phone_number'),
                       expected_types=[int])
        ], non_dictionary=True)
        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return phone_number

    def validate_images(self, images):
        images = images.replace(' ', '')
        data = self._kwargs['data']
        errors = error_generator([
            Validation(name='images',
                       validation_function=(validate_images, [images, ]),
                       missing_list=data,
                       received_object=data.get('images'),
                       expected_types=[str])
        ], non_dictionary=True)
        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return images

    def validate_amenities(self, amenities):
        amenities = amenities.replace(' ', '')
        data = self._kwargs['data']
        errors = error_generator([
            Validation(name='amenities',
                       validation_function=(validate_amenities, [amenities, ]),
                       missing_list=data,
                       received_object=data.get('amenities'),
                       expected_types=[str])
        ], non_dictionary=True)
        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return amenities


########################################################################################################################
# LOCATION SERIALIZER
########################################################################################################################

class LocationSerializer(serializers.HyperlinkedModelSerializer):
    latitude: serializers.FloatField()
    longitude: serializers.FloatField()

    def is_valid(self, *, raise_exception=False):
        data = self._kwargs['data']

        for i in data:
            if i not in ['latitude', 'longitude']:
                raise ValidationError({i: 'incorrect parameter detected'})

        errors = error_generator([
            Validation(name='latitude', validation_function=(validate_latitude, [str(data.get('latitude')), ]),
                       missing_list=data, received_object=data.get('latitude'), expected_types=[float, int]),
            Validation(name='longitude', validation_function=(validate_longitude, [str(data.get('longitude')), ]),
                       missing_list=data, received_object=data.get('longitude'), expected_types=[float, int])
        ])
        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return True


########################################################################################################################
# AMENITIES SERIALIZER
########################################################################################################################

class AmenitiesSerializer(serializers.HyperlinkedModelSerializer):
    type: serializers.CharField()
    quantity: serializers.IntegerField()

    def is_valid(self, *, raise_exception=False):
        data = self._kwargs['data']

        for i in data:
            if i not in ['type', 'quantity']:
                raise ValidationError({i: 'incorrect parameter detected'})

        errors = error_generator([
            Validation(name='type', missing_list=data, received_object=data.get('type'), expected_types=[str]),
            Validation(name='quantity', validation_function=(validate_quantity, [str(data.get('quantity')), ]),
                       missing_list=data, received_object=data.get('quantity'), expected_types=[int])
        ])
        if len(errors) != 0:
            raise ValidationError(errors)
        else:
            return True


########################################################################################################################
# STUDIO FILTER SERIALIZER
########################################################################################################################

class StudioFilterSerializer(serializers.HyperlinkedModelSerializer):
    type: serializers.CharField()
    value: serializers.CharField()

    def is_valid(self, *, raise_exception=False):
        data = self._kwargs['data']

        if 'type' not in data:
            raise ValidationError({'type': 'must provide type'})

        if 'value' not in data:
            raise ValidationError({'value': 'must provide value'})

        for i in data:
            if i not in ['type', 'value']:
                raise ValidationError({i: 'incorrect parameter detected'})

        if str(data.get('type')) not in {'name', 'amenities', 'class_name', 'coach'}:
            raise ValidationError(
                {str(data.get('type')): 'invalid type, must be in [name, amenities, class_name, coach]'})

        return True


########################################################################################################################
# CLASS FILTER SERIALIZER
########################################################################################################################

class ClassFilterSerializer(serializers.HyperlinkedModelSerializer):
    studio_name: serializers.CharField()
    type: serializers.CharField()
    value: serializers.CharField()

    def is_valid(self, *, raise_exception=False):
        data = self._kwargs['data']

        if 'studio_name' not in data:
            raise ValidationError({'studio_name': 'must provide studio_name'})

        if 'type' not in data:
            raise ValidationError({'type': 'must provide type'})

        if 'value' not in data:
            raise ValidationError({'value': 'must provide value'})

        for i in data:
            if i not in ['type', 'value', 'studio_name']:
                raise ValidationError({i: 'incorrect parameter detected'})

        if not Studio.objects.filter(name=str(data.get('studio_name'))).exists():
            raise ValidationError({'studio_name': 'a studio with this name does not exist}'})

        if str(data.get('type')) not in {'class_name', 'coach', 'date', 'time_range'}:
            raise ValidationError(
                {str(data.get('type')): 'invalid type, must be in [class_name, coach, date, time_range]'})

        if data.get('type') == 'date':
            if not str(data.get('value')).isnumeric():
                raise ValidationError('date must be numeric')
            if len(str(data.get('value'))) != 6:
                raise ValidationError('date must be in the format MMDDYY')
            else:
                month = int(str(data.get('value'))[:2])
                day = int(str(data.get('value'))[2:4])
                year = int("20" + str(data.get('value'))[4:])

                try:
                    date = datetime(year, month, day)
                except:
                    raise ValidationError('incorrect date format')

        if data.get('type') == 'time_range':
            if len(str(data.get('value'))) != 11:
                raise ValidationError('incorrect date format, expected HH:MM,HH:MM')
            else:
                if len(str(data.get('value')).split(',')) != 2:
                    raise ValidationError('incorrect date format, expected HH:MM,HH:MM')
                else:
                    if len(str(data.get('value')).split(',')[0].split(':')[0]) != 2:
                        raise ValidationError('incorrect date format, expected HH:MM,HH:MM')
                    if len(str(data.get('value')).split(',')[0].split(':')[1]) != 2:
                        raise ValidationError('incorrect date format, expected HH:MM,HH:MM')
                    if len(str(data.get('value')).split(',')[1].split(':')[0]) != 2:
                        raise ValidationError('incorrect date format, expected HH:MM,HH:MM')
                    if len(str(data.get('value')).split(',')[1].split(':')[1]) != 2:
                        raise ValidationError('incorrect date format, expected HH:MM,HH:MM')

                    if not str(data.get('value')).split(',')[0].split(':')[0].isnumeric():
                        raise ValidationError('incorrect date format, expected HH:MM,HH:MM')
                    if not str(data.get('value')).split(',')[0].split(':')[1].isnumeric():
                        raise ValidationError('incorrect date format, expected HH:MM,HH:MM')
                    if not str(data.get('value')).split(',')[1].split(':')[0].isnumeric():
                        raise ValidationError('incorrect date format, expected HH:MM,HH:MM')
                    if not str(data.get('value')).split(',')[1].split(':')[1].isnumeric():
                        raise ValidationError('incorrect date format, expected HH:MM,HH:MM')

                    if not (str(data.get('value')).split(',')[0] < str(data.get('value')).split(',')[1]):
                        raise ValidationError('start time must be smaller than end time in the specified range')

        return True


########################################################################################################################
# SCHEDULE SERIALIZER
########################################################################################################################

class ScheduleStudioSerializer(serializers.HyperlinkedModelSerializer):
    studio_name: serializers.CharField()

    def is_valid(self, *, raise_exception=False):
        data = self._kwargs['data']

        for i in data:
            if i not in ['studio_name']:
                raise ValidationError({i: 'incorrect parameter detected'})

        if not Studio.objects.filter(name=str(data.get('studio_name'))).exists():
            raise ValidationError(f"studio with name {data.get('studio_name')} does not exist")

        return True
