# floating point number implementation
# base 10
# mantissa is 7 significant digits
# exponent value is centered at 100
# sign is explicit, 0 is positive, 1 is negative
# example: 10 is { sign: 0, mantissa: 1, exponent: 101 }
# example: 100 is { sign: 0, mantissa: 1, exponent: 102 }
# example: 0.1 is { sign: 0, mantissa: 1, exponent: 99 }
# example: 0.01 is { sign: 0, mantissa: 1, exponent: 98 }

PRECISION = 7
EXP_PAD = 100


def number_to_float(n):
    """Convert a number to a floating point representation."""
    sign = 0 if n >= 0 else 1
    n = abs(n)
    mantissa = n
    exponent = 0
    while mantissa >= 10:
        mantissa /= 10
        exponent += 1
    while mantissa < 1:
        mantissa *= 10
        exponent -= 1
    mantissa = int(mantissa * 10 ** PRECISION)
    return {'sign': sign, 'mantissa': mantissa, 'exponent': exponent + EXP_PAD}


def get_noir_input(n):
    sign = 0
    mantissa = n['mantissa']
    exp = n['exponent']
    if mantissa < 0:
        sign = 1
        mantissa = -mantissa

    return 'Float {' f'sign: {sign}, mantissa: {mantissa}, exponent: {exp}' + ' }'


def get_prover_input(n):
    sign = 0
    mantissa = n['mantissa']
    exp = n['exponent']
    if mantissa < 0:
        sign = 1
        mantissa = -mantissa

    return f'["{sign}", "{mantissa}", "{exp}"]'


def zkfloat_to_string(sign: int, mantissa: int, exponent: int) -> str:
    """
    Convert ZKFloat representation to a string of a floating point number.

    Parameters:
    sign (int): The sign of the number (0 for positive, 1 for negative).
    mantissa (int): The mantissa of the number.
    exponent (int): The exponent of the number in ZKFloat format (centered around 100).

    Returns:
    str: The string representation of the floating point number.
    """
    # Adjust the exponent from ZKFloat format to standard floating-point format
    adjusted_exponent = exponent - 100

    # Convert mantissa to float
    mantissa_float = float(mantissa) / (10 ** (len(str(mantissa)) - 1))

    # Calculate the actual floating point value
    float_value = mantissa_float * (10 ** adjusted_exponent)

    # Apply the sign
    if sign == 1:
        float_value = -float_value

    return f"{float_value}"


n = 1
print(number_to_float(n))
print(get_noir_input(number_to_float(n)))
print(get_prover_input(number_to_float(n)))
