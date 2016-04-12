'use strict';

angular
    .module('clientNR')
    .factory('rsaFunctions', rsaFunctions);


function rsaFunctions(bigInt) {

    var service = {
        publicKey: publicKey,
        privateKey: privateKey,
        generateKeys: generateKeys,
        modInv: modInv,
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

        this.encrypt = function(m) {
            return m.modPow(this.e, this.n);
        };

        this.decrypt = function(c) {
            return c.modPow(this.e, this.n);
        };
    };





    function privateKey (p, q, d, publicKey,m,c) {
        this.p = p;
        this.q = q;
        this.d = d;
        this.publicKey = publicKey;

        this.encrypt = function(m) {
            return m.modPow(this.d, this.publicKey.n);
        };

        this.decrypt = function(c) {
            return c.modPow(this.d, this.publicKey.n);
        };
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
