########################################################################################################################
# IMPORTS
########################################################################################################################

import re
from typing import Optional, Callable, List, Tuple, Any
from django.contrib.auth.models import User


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
# VALIDATION FUNCTIONS
########################################################################################################################

def validate_phone_number(phone_number):
    if len(str(phone_number)) != 10:
        return Validator(False, "Invalid format: A phone number must be composed of 10 digits")
    return Validator(True)


def validate_avatar(avatar):
    if not (avatar.endswith('.png') or avatar.endswith('.jpg')):
        return Validator(False, "Invalid format: Avatar must be a url to a png or jpg image")
    return Validator(True)


def validate_credit_card(credit_card):
    credit_card = credit_card.replace(' ', '')
    if len(credit_card) != 16:
        return Validator(False, "Invalid format: Credit card number must contain 16 digits")
    if not credit_card.isnumeric():
        return Validator(False, "invalid format: Credit card number can only be composed of digits")
    return Validator(True)


def validate_username(username):
    if User.objects.filter(username=username).exists():
        return Validator(False, "Username already exists")
    return Validator(True)


# https://www.geeksforgeeks.org/check-if-email-address-valid-or-not-in-python/
def validate_email(email):
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if not (re.match(pattern, email)):
        return Validator(False, "Invalid email")
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
            message = f"Incorrect type: expected type '{validation.expected_types}' got '{type(validation.received_object)}' instead"
            errors[validation.name] = message
            errors_lst.append(message)
        elif validation.missing_list is not None and validation.name not in validation.missing_list:
            message = f"Missing parameter: '{validation.name}'"
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
