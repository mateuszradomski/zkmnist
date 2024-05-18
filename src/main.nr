// Credit: https://github.com/0x3327/ZKFloat
struct Float {
    sign: Field,
    mantissa: Field,
    exponent: Field,
}

// Float number precision of mantissa
global precision : Field = 7;

// ReLU activation function used for neural network ML models
unconstrained fn relu(x: Float) -> Float {
    let mut res = x;
    if x.sign as u64 == 1 {
        res = Float { sign: 0, mantissa: 0, exponent: 100 };
    }

    res
}

// Truncate Float to "precision" number of digits, 5 in the example
unconstrained fn truncate(num: Float) -> Float {
    let lookup : [Field; 25] = [
        1,
        10,
        100,
        1000,
        10000,
        100000,
        1000000,
        10000000,
        100000000,
        1000000000,
        10000000000,
        100000000000,
        1000000000000,
        10000000000000,
        100000000000000,
        1000000000000000,
        10000000000000000,
        100000000000000000,
        1000000000000000000,
        10000000000000000000,
        100000000000000000000,
        1000000000000000000000,
        10000000000000000000000,
        100000000000000000000000,
        1000000000000000000000000
    ];

    let maxValue : Field = 10.pow_32(precision);
    let mut decValue : Field = 1;
    let mut logValue : Field = 0;

    for i in 0..25 {
        if num.mantissa as u64 >= lookup[i] as u64 {
            decValue = lookup[i];
            logValue = i as Field;
        }
    }

    decValue *= 10;
    logValue += 1;

    let mut res : Float = Float { sign: num.sign, mantissa: num.mantissa, exponent: num.exponent };

    if logValue as u64 > precision as u64 {
        let diff = (decValue / maxValue) as u64;
        res = Float { sign: num.sign, mantissa: (num.mantissa as u64 / diff) as Field, exponent: num.exponent + (logValue - precision)};
    }

    if res.mantissa == 0 {
        res = Float { sign: res.sign, mantissa: 0, exponent: 100 };
    }

    res
}

// Multiplication of Float numbers
unconstrained fn mulFloats(x: Float, y: Float) -> Float {
    let mant = x.mantissa * y.mantissa;
    let exp = x.exponent + y.exponent - 100;
    let mut sign : Field = 0;

    if x.sign != y.sign {
        sign = 1;
    }

    truncate(Float { sign, mantissa: mant, exponent: exp })
}

// Dividing of Float numbers
unconstrained fn divFloats(x: Float, y: Float) -> Float {
    assert(y.mantissa as u64 > 0);

    let mut exp1: Field = x.exponent;
    let mut mant1: u64 = x.mantissa as u64;

    let exp2: Field = y.exponent;
    let mant2: Field = y.mantissa;

    // Can't divide lower by higher number with same precision, result will be 0
    // The lower must be multiplied by 10, it means at the same time exponent must be reduced by 1
    if mant1 < mant2 as u64 {
        mant1 *= 10;
        exp1 -= 1;
    }

    let mut new_mant: u64 = 0;
    for i in 0..7 {
        let div = mant1 / mant2 as u64;
        mant1 = (mant1 - mant2 as u64 * div) * 10;

        // For precision N, the highest exponent is 10^(N-1)
        let exp = precision - i as Field - 1;
        let pow = 10.pow_32(exp) as u64;
        new_mant += div * pow;
    }

    let new_exp = 100 + exp1 - exp2 - precision + 1;

    let mut new_sign : Field = 0;

    if x.sign as u64 != y.sign as u64 {
        new_sign = 1;
    }

    Float { sign: new_sign, mantissa: new_mant as Field, exponent: new_exp }
}

// Sumation of Float numbers
unconstrained fn addFloats(x: Float, y: Float) -> Float {
    let mut mant_1 = x.mantissa;
    let mut mant_2 = y.mantissa;

    let mut exp_1 = x.exponent;
    let mut exp_2 = y.exponent;

    let mut diff : Field = 0;

    if exp_1 as u64 > exp_2 as u64 {
        diff = exp_1 - exp_2;
    } else {
        diff = exp_2 - exp_1;
    }

    let mut pow10 : Field = 10.pow_32(diff);

    if x.exponent as u64 < y.exponent as u64 {
        mant_2 *= pow10;
        exp_1 = x.exponent;
    } else {
        mant_1 *= pow10;
        exp_1 = y.exponent;
    }

    let mut sum_mant = mant_1 + mant_2;
    let mut sign = x.sign;

    if x.sign != y.sign {
        if mant_1 as u64 > mant_2 as u64 {
            sum_mant = mant_1 - mant_2;
        } else {
            sum_mant = mant_2 - mant_1;
            sign = y.sign;
        }
    }

    truncate(Float { sign, mantissa: sum_mant, exponent: exp_1 })
}

// Subtraction of float numbers
unconstrained fn subFloats(x: Float, y: Float) -> Float {
    addFloats(
        x,
        Float { sign: 1 - y.sign, mantissa: y.mantissa, exponent: y.exponent }
    )
}

unconstrained fn isGreaterFloats(x: Float, y: Float) -> bool {
    let mut result = false;

    if x.sign as u64 == 1 {
        if y.sign as u64 == 0 {
            result = false;
        } else if x.exponent as u64 > y.exponent as u64 {
            result = false;
        } else if x.exponent as u64 < y.exponent as u64 {
            result = true;
        } else if x.mantissa as u64 > y.mantissa as u64 {
            result = false;
        } else {
            result = true;
        }
    } else if y.sign as u64 == 1 {
        result = true;
    } else if x.exponent as u64 > y.exponent as u64 {
        result = true;
    } else if x.exponent as u64 < y.exponent as u64 {
        result = false;
    } else if x.mantissa as u64 > y.mantissa as u64 {
        result = true;
    } else {
        result = false;
    }

    result
}

unconstrained fn taylorExponent(x: Float) -> Float {
    let floatHalf = Float { sign: 0, exponent: 93, mantissa: 5000000 };
    let floatOne = Float { sign: 0, exponent: 100, mantissa: 1 };
    // 1 + x + 0.5x^2
    addFloats(addFloats(floatOne, x), mulFloats(mulFloats(x, x), floatHalf))
}

global N = 28;
global K = 14;
global DIGITS = 10;

global IMAGE_SIZE = N * N;
global CONV_IMAGE_SIZE = K * K;
global CONV_IMAGE_SIZE_WITH_BIAS = CONV_IMAGE_SIZE + 1;
global HIDDEN_SIZE = 19700;
global OUTPUT_SIZE = 1010;

unconstrained fn forward_prop(
    img: [Field; IMAGE_SIZE],
    w_hidden: [Float; HIDDEN_SIZE],
    w_output: [Float; OUTPUT_SIZE]
) -> Field {
    // 0.471 sec
    // @luca make sure this is 0.0 and 4.0
    let floatZero = Float { sign: 0, exponent: 100, mantissa: 0 };
    let floatOne = Float { sign: 0, exponent: 94, mantissa: 1000000 };
    let floatFour = Float { sign: 0, exponent: 94, mantissa: 4000000 };
    let lookupTable = [floatZero, floatOne];
    let mut conv_img = [floatZero; CONV_IMAGE_SIZE_WITH_BIAS];

    // 11.420 sec
    for i in 0..K {
        for j in 0..K {
            let mut sum = floatZero;
            sum = addFloats(sum, lookupTable[img[2 * i * 28 + 2 * j]]);
            sum = addFloats(sum, lookupTable[img[2 * i * 28 + (2 * j + 1)]]);
            sum = addFloats(sum, lookupTable[img[(2 * i + 1) * 28 + 2 * j]]);
            sum = addFloats(sum, lookupTable[img[(2 * i + 1) * 28 + (2 * j + 1)]]);
            conv_img[i * 14 + j] = divFloats(sum, floatFour);
        }
    }

    conv_img[196] = floatOne;

    let mut layer_hidden = [floatZero; 100 + 1];
    for i in 0..100 {
        let mut sum = floatZero;
        for j in 0..CONV_IMAGE_SIZE_WITH_BIAS {
            sum = addFloats(sum, mulFloats(conv_img[j], w_hidden[i * CONV_IMAGE_SIZE_WITH_BIAS + j]));
        }
        layer_hidden[i] = relu(sum);
    }
    layer_hidden[100] = floatOne;

    let mut esum = floatZero;
    let mut layer_output = [floatZero; DIGITS];
    for i in 0..DIGITS {
        let mut sum = floatZero;
        for j in 0..100 {
            sum = addFloats(sum, mulFloats(layer_hidden[j], w_output[i * 101 + j]));
        }
        layer_output[i] = sum;
        esum = addFloats(esum, layer_output[i]);
    }

    println(layer_output);
    let mut max = layer_output[0];
    let mut imax = 0;
    for i in 0..DIGITS {
        println(i);
        println(layer_output[i]);
        println(max);
        if isGreaterFloats(layer_output[i], max) {
            max = layer_output[i];
            imax = i;
        }
        layer_output[i] = divFloats(layer_output[i], esum);
    }

    imax as Field
}

fn main(
    img: [Field; IMAGE_SIZE],
    w_hidden: [Float; HIDDEN_SIZE],
    w_output: [Float; OUTPUT_SIZE],
    digit: pub Field
) {
    let output = forward_prop(img, w_hidden, w_output);
    println(output);
    assert(output == digit);
}

/*
fn main(x: Float, y: Float) {
    println(x);
    println(y);
    let res = divFloats(x, y);
    let res2 = mulFloats(x, res);
    let res3 = divFloats(x, res2);
    println(res);
    println(res2);
    println(res3);
}

#[test]
fn test_main() {
    main(
        Float { sign: 0, mantissa: 20777782, exponent: 100 },
        Float { sign: 0, mantissa: 19278346, exponent: 100 }
    );
}
*/
