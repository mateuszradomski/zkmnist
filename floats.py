# given a decimal number e.g. 0.000245
# write a function that takes the significant digits i.e. 245 and
#  writes an integer with 7 digits starting with the significant digits
# i.e. 2450000 and then divide the two number and return it as separate value
# this is a ba

def num_to_float(num):
    orig_num = num
    num_str = str(num)
    num_str = num_str.replace('.', '')
    num_str = num_str.lstrip('0')
    num_str = num_str[:7]
    num_str = num_str.ljust(7, '0')
    num_str = int(num_str)
    exp = num_str / orig_num
    exp_log = len(str(exp)) - 1 - 2  # remove decimal .0 too
    o = num_str / exp
    assert o == orig_num
    assert 10 ** exp_log == exp
    return num_str, exp, exp_log, o


print(num_to_float(0.5))  # 2450000
