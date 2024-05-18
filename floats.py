# given a decimal number e.g. 0.000245
# write a function that takes the significant digits i.e. 245 and
#  writes an integer with 7 digits starting with the significant digits
# i.e. 2450000 and then divide the two number and return it as separate value
# this is a ba

# read json with two arrays, "hidden" and "output"
import json

# read json file


def read_json(file):
    with open(file, 'r') as f:
        data = json.load(f)
    return data


data = read_json('weights/weights.json')


def num_to_float(num):
    sign = 0 if num > 0 else 1
    num = abs(num)
    orig_num = num
    num_str = f"{num:.9f}"
    num_str = num_str.replace('.', '')
    num_str = num_str.lstrip('0')
    num_str = num_str[:7]
    num_str = num_str.ljust(7, '0')
    try:
        num_str = int(num_str)
    except ValueError:
        print(num_str)
        print(orig_num)

    try:
        exp = round(num_str / orig_num)
    except ZeroDivisionError:
        exp = 1
    exp_log = len(str(exp)) - 1
    o = num_str / exp
    assert o == orig_num
    try:
        assert abs(exp - 10 ** exp_log) < 1e-5
    except AssertionError:
        print(exp, 10 ** exp_log)

    return sign, num_str, exp_log, o


print(num_to_float(0.5))  # 2450000

# convert data['hidden'] to floats
hidden = data['output']
hidden_float = [num_to_float(num) for num in hidden]
# save it to another json file
with open('weights/weights_output_float.json', 'w') as f:
    json.dump(hidden_float, f)
