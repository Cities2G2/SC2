var bigInt = require('../src/big-integer-scii');

rsa = {
    publicKey: function (bits, n, e) {
        this.bits = bits;
        this.n = n;
        this.e = e;
    },
    privateKey: function (p, q, d, publicKey) {
        this.p = p;
        this.q = q;
        this.d = d;
        this.publicKey = publicKey;
    },
    generateKeys: function (bitlength) {
        var p, q, n, phi, e, d, keys = {};
        // if p and q are bitlength/2 long, n is then bitlength long
        this.bitlength = bitlength || 2048;
        console.log("Generating RSA keys of", this.bitlength, "bits");
        p = bigInt.prime(this.bitlength / 2);
        do {
            q = bigInt.prime(this.bitlength / 2);
        } while (q.compare(p) === 0);
        n = p.multiply(q);

        phi = p.subtract(1).multiply(q.subtract(1));
        gcd = bigInt.gcd(n, phi);
        console.log('gcd', gcd.toString());
        e = bigInt(65537);
        d = bigInt.modInv(e, phi);

        keys.publicKey = new rsa.publicKey(this.bitlength, n, e);
        keys.privateKey = new rsa.privateKey(p, q, d, keys.publicKey);
        return keys;
    },

    publicKeyP: function (n, g) {
        // this.bits = bits;
        this.n = n;
        this.g = g;
    },
    privateKeyP: function (lamda, mu,publicKey) {
        this.lamda = lamda;
        this.mu = mu;
        // this.d = d;
        this.publicKeyP = publicKey;
    },

    generateKeysP: function (bitlength) {

        var p, q, n, phi, e, d, keysP, g = {};

        //////////////////////////////////////////////// Punto 1 ///////////////////////////////////////////////////////

        // if p and q are bitlength/2 long, n is then bitlength long
        this.bitlength = bitlength || 2048;
        console.log("Generating Paillier keys of", this.bitlength, "bits");

        //////////////////////////////////////////////// Punto 2 ///////////////////////////////////////////////////////

        p = bigInt.prime(this.bitlength / 2);
        do {
            q = bigInt.prime(this.bitlength / 2);
        } while (q.compare(p) === 0);

        n = p.multiply(q);
        console.log("n es: ", n.toString());
        phi = p.subtract(1).multiply(q.subtract(1));
        gcd = bigInt.gcd(n, phi);
        console.log("gcd tiene que se 1 y el resultado es: ", gcd.toString());

        //////////////////////////////////////////////// Punto 3 ///////////////////////////////////////////////////////

        lcm = bigInt.lcm(p.subtract(1), q.subtract(1));
        var lamda = lcm;
        console.log("Lamda es: ", lamda.toString());

        //////////////////////////////////////////////// Punto 4 ///////////////////////////////////////////////////////

        var alfa = bigInt.randBetween(0, n);
        var beta = bigInt.randBetween(0, n);
        console.log("alfa es: ", alfa.toString());
        console.log("beta es: ", beta.toString());

        var a = bigInt(alfa.multiply(n)).add(1);
        console.log("a es: ", a.toString());
        var n_square = n.multiply(n);
        var b = beta.modPow(n, n_square);
        console.log("b es: ", b.toString());
        g = a.multiply(b);
        console.log("El generador g es: ", g.toString());

        //////////////////////////////////////////////// Punto 5 ///////////////////////////////////////////////////////

        var u = g.modPow(lamda, n_square);
        console.log("u es: ", u.toString());
        var l = bigInt(u.subtract(1)).divide(n);
        //var l = bigInt(u.subtract(1));
        //var l2= bigInt(l).divide(n);
        console.log("l es: ", l.toString());
        //console.log("l2 es: ", l2.toString());
        var n1 = bigInt(1).minus(2);
        //var mu = bigInt(l).modPow(n1, n);// nose yo esto
        var mu = bigInt.modInv(l,n);
        console.log("El inverso multiplicativo modular es: ", mu.toString());

        //e = bigInt(65537);
        //d = bigInt.modInv(e, phi);

        var publicKeyP = new rsa.publicKeyP(n, g);
        var privateKeyP = new rsa.privateKeyP(lamda, mu,publicKeyP);

        keysP = {
            publicKeyP: publicKeyP,
            privateKeyP: privateKeyP
        };
        return keysP;
    }


};


rsa.publicKey.prototype = {
    encrypt: function (m) {
        return m.modPow(this.e, this.n);
    },
    decrypt: function (c) {
        return c.modPow(this.e, this.n);
    }
};

rsa.privateKey.prototype = {
    encrypt: function (m) {
        return m.modPow(this.d, this.publicKey.n);
    },
    decrypt: function (c) {
        return c.modPow(this.d, this.publicKey.n);
    }


};

rsa.publicKeyP.prototype = {
    encrypt: function (m) {


        var r = bigInt.randBetween(0, this.n);
        var n2 = this.n.multiply(this.n);
        //console.log("r es: ", r.toString());
        //var c1= this.g.modPow(m,n2).mod(n2);
        //var c2 = r.modPow(this.n,n2).mod(n2);
        var c=(this.g.modPow(m,n2)).multiply(r.modPow(this.n,n2));
        //var c = c1.multiply(c2).mod(this.n);
        //var s = bigInt(this.g).modPow(m,this.n);

        //console.log("s es: ", s.toString());
        //console.log("n2 es: ", n2.toString());
        return c;
    },
    decrypt: function (x) {

        var n2 = this.n.multiply(this.n);
        var c = bigInt.randBetween(0, n2);
        var u = c.modPow(this.lamda, n2);
        var l = bigInt(u.subtract(1)).divide(this.n);
        var x = l.multiply(this.mu);
        return x.modPow(1, this.n);

    }
};

rsa.privateKeyP.prototype = {
    encrypt: function (m) {
        return m.modPow(this.d, this.publicKey.n);
    },
    decrypt: function (c) {
        var n2 = this.publicKeyP.n.multiply(this.publicKeyP.n);
        var u = c.modPow(this.lamda, n2);
        var l = bigInt(u.subtract(1)).divide(this.publicKeyP.n);
        var x = l.multiply(this.mu).mod(this.publicKeyP.n);
        return x;
    }
};


module.exports = rsa;
