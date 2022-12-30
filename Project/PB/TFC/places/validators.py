########################################################################################################################
# IMPORTS
########################################################################################################################
from datetime import datetime
from typing import Optional, Callable, List, Tuple, Any


########################################################################################################################
# VALIDATOR CLASS
########################################################################################################################
class Validator:
    valid: bool
    message: Optional[str]

    def __init__(self, valid: bool, message: str = None):
        self.valid = valid
        self.message = message


########################################################################################################################
# HELPER FUNCTIONS
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
# VALIDATION FUNCTIONS
########################################################################################################################

def validate_location(location):
    if not correct_location_format(location):
        return Validator(False,
                         "incorrect format: must be in the form latitude,longitude (note the comma between); latitude is an integer or float in the domain [-90, 90]; longitude is an integer or float in the domain [-180, 180]")
    return Validator(True)


def validate_postal_code(postal_code):
    postal_code = postal_code.replace(' ', '')
    if len(postal_code) != 6:
        return Validator(False, "a postal code can only contain 6 characters (excluding spaces)")
    if not (postal_code[0].isalpha() and postal_code[1].isnumeric() and postal_code[2].isalpha() and postal_code[
        3].isnumeric() and postal_code[4].isalpha() and postal_code[5].isnumeric()):
        return Validator(False,
                         "incorrect format: postal codes must be in the format (letter, number, letter, number, letter, number), ex: M5S 1A4")
    return Validator(True)


def validate_phone_number(phone_number):
    if len(str(phone_number)) != 10:
        return Validator(False, "a phone number must be composed of 10 digits")
    return Validator(True)


def validate_images(images):
    images = images.replace(' ', '')
    images_lst = images.split(',')
    for image in images_lst:
        if not (image.endswith('.png') or image.endswith('.jpg')):
            return Validator(False,
                             "images must be in .png or .jpg format, here is an example input 'sample.com/image.png, sample.com/image.jpg'")
    return Validator(True)


def validate_amenities(amenities):
    elements = amenities.split(',')
    amenities_dictionary = {}
    for x in elements:
        item = x.split(':')
        if len(item) != 2:
            return Validator(False,
                             'amenities must be in the following format: type:quantity,type:quantity,type:quantity,...')
        else:
            if item[0] in amenities_dictionary.keys():
                return Validator(False, 'cannot have duplicate amenities')
            if not item[1].isnumeric():
                return Validator(False, 'quantity must be an integer string')
            else:
                amenities_dictionary[item[0]] = item[1]
    return Validator(True)


def validate_quantity(quantity):
    if not quantity.isnumeric():
        return Validator(False, "quantity must be an integer")
    return Validator(True)


def validate_latitude(latitude):
    if not is_number(latitude):
        return Validator(False, "latitude must be an integer or float")
    if not (-90 <= float(latitude) <= 90):
        return Validator(False, "latitude must be in the domain [-90, 90]")
    return Validator(True)


def validate_longitude(longitude):
    if not is_number(longitude):
        return Validator(False, "longitude must be an integer or float")
    if not (-180 <= float(longitude) <= 180):
        return Validator(False, "longitude must be in the domain [-180, 180]")
    return Validator(True)


def validate_times(times):
    times = times.replace(' ', '')
    elements = times.split(',')
    if len(elements) != 1:
        return Validator(False, "cannot have multiple time objects")
    for element in elements:
        item = element.split('|')
        if len(item) != 5:
            return Validator(False, "incorrect format: times must be in the format 'Day|HH:MM|HH:MM|MMDDYY|MMDDYY'")
        else:
            if item[0] not in ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']:
                return Validator(False,
                                 "invalid day: day must be one of [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]")
            start_time = item[1].split(':')
            if len(start_time) != 2:
                return Validator(False, "invalid start time: start time must be in the format 'HH:MM'")
            else:
                if not (start_time[0].isnumeric() and start_time[1].isnumeric()):
                    return Validator(False,
                                     "invalid start time: hours and minutes must be numeric, ex: '10:45' or '11:05'")
                else:
                    if not (len(start_time[0]) == 2 and len(start_time[1]) == 2):
                        return Validator(False, "invalid start time: must be in the format HH:MM")
                    if not (0 <= int(start_time[0]) <= 23 and 0 <= int(start_time[1]) <= 59):
                        return Validator(False,
                                         "invalid start time: hour must be between 0 and 23 inclusive minute must be set between 0 and 59 inclusive")
            end_time = item[2].split(':')
            if len(end_time) != 2:
                return Validator(False, "invalid end time: end_time must be in the format 'HH:MM'")
            else:
                if not (end_time[0].isnumeric() and end_time[1].isnumeric()):
                    return Validator(False,
                                     "invalid end time: hours and minutes must be numeric, ex: '10:45' or '11:05'")
                else:
                    if not (len(end_time[0]) == 2 and len(end_time[1]) == 2):
                        return Validator(False, "invalid end time: must be in the format HH:MM")
                    if not (0 <= int(end_time[0]) <= 23 and 0 <= int(end_time[1]) <= 59):
                        return Validator(False,
                                         "invalid end time: hour must be between 0 and 23 inclusive minute must be set between 0 and 59 inclusive")
            if not (start_time <= end_time):
                return Validator(False, "start time must be less than the end time")
            if len(item[3]) != 6 or not item[3].isnumeric():
                return Validator(False,
                                 "invalid start date: must be in the format 'MMDDYY', ex: '111722' represents November 17 2022")
            if len(item[4]) != 6 or not item[4].isnumeric():
                return Validator(False,
                                 "invalid end date: must be in the format 'MMDDYY', ex: '111722' represents November 17 2022")

            start_month = int(item[3][:2])
            start_day = int(item[3][2:4])
            start_year = int("20" + item[3][4:])

            print(start_month, start_day, start_year)

            if not (1 <= start_month <= 12):
                return Validator(False, "invalid date: month must be in the range [1, 12]")
            if not (1 <= start_day <= 31):
                return Validator(False, "invalid date: day must be in the range [1, 31]")
            if not (2000 <= start_year <= 2099):
                return Validator(False, "invalid date: year must be in the range [00, 99]")

            try:
                start_date = datetime(start_year, start_month, start_day)
            except:
                return Validator(False, "invalid date detected")

            end_month = int(item[4][:2])
            end_day = int(item[4][2:4])
            end_year = int("20" + item[4][4:])

            if not (1 <= end_month <= 12):
                return Validator(False, "invalid date: month must be in the range [1, 12]")
            if not (1 <= end_day <= 31):
                return Validator(False, "invalid date: day must be in the range [1, 31]")
            if not (2000 <= end_year <= 2099):
                return Validator(False, "invalid date: year must be in the range [00, 99]")

            try:
                end_date = datetime(end_year, end_month, end_day)
            except:
                return Validator(False, "invalid date detected")

            if not (start_date <= end_date):
                return Validator(False, "start date must occur before end date or they must be the same date")

    return Validator(True)


def validate_empty(item):
    if item is None or item == "":
        return Validator(False, "field must not be empty")
    return Validator(True)


########################################################################################################################
# ERROR GENERATOR
########################################################################################################################

class Validation:
    name: str
    validation_function: Optional[Tuple[Callable, List[Any]]]
    missing_list: Optional[List[str]]
    received_object: Optional[Any]
    expected_types: Optional[List[object]]

    def __init__(self, name: str, validation_function: Tuple[Callable, List[Any]] = None,
                 missing_list: List[str] = None, received_object: Any = None, expected_types: List[object] = None):
        self.name = name
        self.validation_function = validation_function
        self.missing_list = missing_list
        self.received_object = received_object
        self.expected_types = expected_types


def error_generator(validations: List[Validation], non_dictionary: bool = None):
    errors = {}
    errors_lst = []
    for validation in validations:
        if validation.expected_types is not None and validation.received_object is not None and not (
                type(validation.received_object) in validation.expected_types):
            message = f"incorrect type: expected type '{validation.expected_types}' got '{type(validation.received_object)}' instead"
            errors[validation.name] = message
            errors_lst.append(message)
        elif validation.missing_list is not None and validation.name not in validation.missing_list:
            message = f"missing parameter: '{validation.name}'"
            errors[validation.name] = message
            errors_lst.append(message)
        elif validation.validation_function is not None:
            result = validation.validation_function[0](*validation.validation_function[1])
            assert type(result) == Validator
            if not result.valid:
                message = result.message
                errors[validation.name] = message
                errors_lst.append(message)
    if non_dictionary is not None and non_dictionary is True and len(errors) != 0:
        return errors_lst[0]
    return errors
