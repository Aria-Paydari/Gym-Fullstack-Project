########################################################################################################################
# VALIDATOR CLASS
########################################################################################################################
from typing import Optional, Callable, List, Tuple, Any


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


########################################################################################################################
# VALIDATION FUNCTIONS
########################################################################################################################

def validate_plan(plan):
    accepted = ['Weekly', "Biweekly", 'Monthly', 'Yearly']
    print(plan)
    if plan not in accepted:
        return Validator(False,
                         "Incorrect format: Plan must be one of Weekly, Biweekly, Monthly or Yearly")
    return Validator(True)


def validate_missing(item, lst):
    if item not in lst:
        return Validator(False, f"{item} is missing")
    return Validator(True)


def validate_amount(amount):
    if not is_number(amount):
        return Validator(False, "amount must be an integer or a float")
    elif float(amount) == 0:
        return Validator(False, "cannot be 0")
    elif float(amount) < 0:
        return Validator(False, "cannot be negative")
    else:
        remainder = str(float(amount)).split('.')[1]
        if len(remainder) > 2:
            return Validator(False, "cannot have more that 2 digits after the decimal place")
    return Validator(True)


########################################################################################################################
# ERROR GENERATOR
########################################################################################################################

def error_generator(validations: List[Tuple[str, Tuple[Callable, List[Any]]]]):
    errors = {}
    for validation in validations:
        name = validation[0]
        result = validation[1][0](*validation[1][1])
        assert type(result) == Validator
        if not result.valid:
            errors[name] = result.message
    return errors
