'use strict';

angular
    .module('clientNR')
    .factory('rsaFunctions', rsaFunctions);

function rsaFunctions(BigInteger) {

    var service = {
        prime: prime,
        eGcd: eGcd,
        modInv: modInv,
        generateKeys: generateKeys
    };

    return service;

    function prime(bitlength) {
        var rnd = BigInteger.ZERO;
        var isPrime = false;
        var two = new BigInteger(2);

        while (!isPrime) {
            rnd = BigInteger.randBetween(two.pow(bitLength - 1), two.pow(bitLength));
            if (rnd.isProbablePrime()) {
                isPrime = true;
            }
        }
        return new BigInteger(rnd);
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
}