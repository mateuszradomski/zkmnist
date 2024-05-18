// Credit: https://github.com/0x3327/ZKFloat
struct Float {
    sign: Field,
    mantissa: Field,
    exponent: Field,
}

// Float number precision of mantissa
global precision : Field = 7;

// ReLU activation function used for neural network ML models
fn relu(x : Float) -> Float {
    let mut res = x;
    if x.sign as u64 == 1 {
        res = Float { sign: 0, mantissa: 0, exponent: 100 };
    }

    res
}

// Truncate Float to "precision" number of digits, 5 in the example
fn truncate(num: Float) -> Float {
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
        1000000000000000000000000,
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
fn mulFloats(x : Float, y : Float) -> Float {
    let mant = x.mantissa * y.mantissa;
    let exp = x.exponent + y.exponent - 100;
    let mut sign : Field = 0;

    if x.sign != y.sign {
        sign = 1;
    }

    truncate(Float { sign: sign, mantissa: mant, exponent: exp })
}

// Dividing of Float numbers
fn divFloats(x : Float, y: Float) -> Float {

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

    Float{sign: new_sign, mantissa: new_mant as Field, exponent: new_exp}
}

// Sumation of Float numbers
fn addFloats(x : Float, y : Float) -> Float {
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

    truncate(Float { sign: sign, mantissa: sum_mant, exponent: exp_1 })
}

// Subtraction of float numbers
fn subFloats(x : Float, y : Float) -> Float {
    addFloats(x, Float { sign: 1 - y.sign, mantissa: y.mantissa, exponent: y.exponent })
}

global N = 28;
global K = 14;
global DIGITS = 10;

global IMAGE_SIZE = N * N;
global CONV_IMAGE_SIZE = K * K;
global CONV_IMAGE_SIZE_WITH_BIAS = CONV_IMAGE_SIZE + 1;
global HIDDEN_SIZE = IMAGE_SIZE * CONV_IMAGE_SIZE;
global OUTPUT_SIZE = CONV_IMAGE_SIZE * DIGITS;

fn forward_prop(img: [Field; IMAGE_SIZE],
                w_hidden: [Field; HIDDEN_SIZE],
                w_output: [Field; OUTPUT_SIZE]) -> Field {
    let mut conv_img = [0; CONV_IMAGE_SIZE_WITH_BIAS];

    for i in 0..K {
        for j in 0..K {
            let mut sum = 0; // @luca this is 0.0
            sum += img[2 * i * 28 + 2 * j];
            sum += img[2 * i * 28 + (2 * j + 1)];
            sum += img[(2 * i + 1) * 28 + 2 * j];
            sum += img[(2 * i + 1) * 28 + (2 * j + 1)];
            conv_img[i * 14 + j] = sum; // @luca this should divided by 4.0 (/ 4.0);
        }
    };
    conv_img[196] = 1; // @luca this should be set to 1.0

    for i in 0..HIDDEN_SIZE {
        let mut sum = 0; // @luca this is 0.0
        for j in 0..CONV_IMAGE_SIZE_WITH_BIAS {
            sum += conv_img[j] * w_hidden[i * CONV_IMAGE_SIZE_WITH_BIAS + j];
        }
        conv_img[i] = sum; //TODO(radomski): this should be [relu(sum)];
    }

    let mut esum = 0; // @luca this is 0.0
    let mut layer_output = [0; DIGITS];
    for i in 0..DIGITS {
        let mut sum = 0; // @luca this is 0.0
        for j in 0..HIDDEN_SIZE {
            sum += conv_img[j] * w_output[i * HIDDEN_SIZE + j];
        }
        layer_output[i] = sum; // @luca this should be Math.exp(sum);
        esum += layer_output[i];
    }

    let mut max = layer_output[0];
    let mut imax = 0;
    for i in 0..DIGITS {
        // TODO(radomski): How do we handle floating point comparision
        if layer_output[i] as u64 > max as u64 {
            max = layer_output[i];
            imax = i;
        }
        layer_output[i] = layer_output[i] / esum;
    }

    imax as Field
}

fn main(img: [Field; IMAGE_SIZE],
        w_hidden: pub [Field; HIDDEN_SIZE],
        w_output: pub [Field; OUTPUT_SIZE],
        digit: pub Field) {

    assert(img[0] != 4);
    let output = forward_prop(img, w_hidden, w_output);
    assert(output == digit);
}
