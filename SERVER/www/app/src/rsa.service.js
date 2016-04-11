'use strict';

angular
    .module('clientNR')
    .factory('rsaFunctions', rsaFunctions);

/*function rsaFunctions(BigInteger) {

    var service = {
        eGcd: eGcd,
        modInv: modInv,
        generateKeys: generateKeys
    };

    return service;

    function prime(bitlength) {
        var rnd = BigInteger.ZERO;
        var isPrime = false;
        var two = new BigInteger('2');

        while (!isPrime) {
            rnd = randBetween(two.pow(bitlength - 1), two.pow(bitlength));
            if (rnd.isProbablePrime()) {
                isPrime = true;
            }
        }
        return new BigInteger(rnd);
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        return v;
    }

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return new SmallInteger(x);
            throw "Invalid integer: " + v;
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (isPrecise(v)) return new SmallInteger(v);
        return parseStringValue(v.toString());
    }

    function eGcd(a, b) {
        // Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).
        var x = BigInteger.ZERO;
        var y = BigInteger.ONE;
        var u = BigInteger.ONE;
        var v = BigInteger.ZERO;

        while (a.notEquals(BigInteger.ZERO)) {
            var modDiv = b.divmod(a);
            var q = modDiv.quotient;
            var r = modDiv.remainder;
            var m = x.minus(u.multiply(q));
            var n = y.minus(v.multiply(q));
            b = a;
            a = r;
            x = u;
            y = v;
            u = m;
            v = n;
        }
        return {
            b: b,
            x: x,
            y: y
        }
    }

    function modInv(a, n) {
        var egcd = eGcd(a, n);
        console.log(egcd);
        if (egcd.b.notEquals(BigInteger.ONE)) {
            return null; // modular inverse does not exist
        } else {
            var ret = egcd.x.mod(n);
            if (ret.isNegative()) {
                ret = ret.add(n);
            }
            return ret;
        }
    }

    function randBetween(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        var low = min(a, b), high = max(a, b);
        console.log(low);
        console.log(high);
        var range = high.subtract(low);
        console.log(range);
        if (range.isSmall) return low.add(Math.round(Math.random() * range));
        console.log(range);
        var length = range.value.length - 1;
        var result = [], restricted = true;
        for (var i = length; i >= 0; i--) {
            var top = restricted ? range.value[i] : BASE;
            var digit = truncate(Math.random() * top);
            result.unshift(digit);
            if (digit < top) restricted = false;
        }
        result = arrayToSmall(result);
        return low.add(typeof result === "number" ? new SmallInteger(result) : new BigInteger(result, false));
    }

    function generateKeys(bitlength) {
        var p, q, n, phi, e, d, keys = {};
        // if p and q are bitlength/2 long, n is then bitlength long
        this.bitlength = bitlength || 2048;
        console.log("Generating RSA keys of", this.bitlength, "bits");
        p = prime(this.bitlength / 2);
        do {
            q = prime(this.bitlength / 2);
        } while (q.compare(p) === 0);
        n = p.multiply(q);

        phi = p.subtract(1).multiply(q.subtract(1));

        e = BigInteger(65537);
        d = BigInteger.modInv(e, phi);

        keys.publicKey = new rsa.publicKey(this.bitlength, n, e);
        keys.privateKey = new rsa.privateKey(p, q, d, keys.publicKey);
        return keys;
    }

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a,b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }

    function greater(v) {
        return this.compare(v) > 0;
    }
    function lesser(v) {
        return this.compare(v) < 0;
    }
}*/
function rsaFunctions(bigInt) {

    var service = {
        publicKey: publicKey,
        privateKey: privateKey,
        generateKeys: generateKeys
    };

    return service;

    function prime(bitLength) {
        var rnd = bigInt.zero;
        var isPrime = false;
        var two = new bigInt(2);

        while (!isPrime) {
            rnd = bigInt.randBetween(two.pow(bitLength - 1), two.pow(bitLength));
            if (rnd.isProbablePrime()) {
                isPrime = true;
            }
        }
        return new bigInt(rnd);
    };

    function eGcd(a, b) {
        // Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).
        var x = bigInt.zero;
        var y = bigInt.one;
        var u = bigInt.one;
        var v = bigInt.zero;

        while (a.notEquals(bigInt.zero)) {
            var modDiv = b.divmod(a);
            var q = modDiv.quotient;
            var r = modDiv.remainder;
            var m = x.minus(u.multiply(q));
            var n = y.minus(v.multiply(q));
            b = a;
            a = r;
            x = u;
            y = v;
            u = m;
            v = n;
        }
        return {
            b: b,
            x: x,
            y: y
        }
    };

    function modInv(a, n) {
        var egcd = eGcd(a, n);
        if (egcd.b.notEquals(bigInt.one)) {
            return null; // modular inverse does not exist
        } else {
            var ret = egcd.x.mod(n);
            if (ret.isNegative()) {
                ret = ret.add(n);
            }
            return ret;
        }
    };

    ////FUNCIONES RSA////

    function publicKey(bits, n, e,m,c) {
        this.bits = bits;
        this.n = n;
        this.e = e;
    };

    publicKey.prototype = {
        encrypt: function(m) {
            return m.modPow(this.e, this.n);
        },
        decrypt: function(c) {
            return c.modPow(this.e, this.n);
        }
    };



    function privateKey (p, q, d, publicKey,m,c) {
        this.p = p;
        this.q = q;
        this.d = d;
        this.publicKey = publicKey;
    };

    privateKey.prototype = {
        encrypt: function(m) {
            return m.modPow(this.d, this.publicKey.n);
        },
        decrypt: function(c) {
            return c.modPow(this.d, this.publicKey.n);
        }
    };

     function generateKeys(bitlength) {
        var p, q, n, phi, e, d, keys = {};
        // if p and q are bitlength/2 long, n is then bitlength long
        this.bitlength = bitlength || 2048;
        console.log("Generating RSA keys of", this.bitlength, "bits");
        p = prime(this.bitlength / 2);
        do {
            q = prime(this.bitlength / 2);
        } while (q.compare(p) === 0);
        n = p.multiply(q);

        phi = p.subtract(1).multiply(q.subtract(1));

        e = bigInt(65537);
        d = modInv(e, phi);

        keys.publicKey = new publicKey(this.bitlength, n, e);
        keys.privateKey = new privateKey(p, q, d, keys.publicKey);
        return keys;
    }


}
