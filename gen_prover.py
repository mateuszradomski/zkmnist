import json

digit = 4
img = json.loads(open("./numbers.json", "r").read())

print("digit = ", digit)
print("img = ", end="")
print(img['four'])

hidden = json.loads(open("./weights/weights_hidden_float.json", "r").read())
output = json.loads(open("./weights/weights_output_float.json", "r").read())

print("")

for value in hidden:
    print("[[w_hidden]]")
    print(f"exponent = {100-value[2]}")
    print(f"mantissa = {value[1]}")
    print(f"sign = {value[0]}")
    print("")

for value in output:
    print("[[w_output]]")
    print(f"exponent = {100-value[2]}")
    print(f"mantissa = {value[1]}")
    print(f"sign = {value[0]}")
    print("")
