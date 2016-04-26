'use strict';

angular
    .module('clientNR')
    .controller('mainController', mainController);

function mainController($http, rsaFunctions, bigInt){
    var vm = this,
        keys;

    vm.res = "No data";
    vm.postData = postData;
    vm.postDataBs = postDataBs;
    load();

    function load(){
        keys = rsaFunctions.generateKeys(512);
        console.log(keys);
    }

    function postDataBs(){
        console.log("hola");
        console.log(vm.dataBs);

        ////probando
        var N = bigInt(keys.publicKey.n.toString(10));
        var num = bigInt("134123412412414341441324");
        console.log('num³ mod N',num.modPow(3,N).mod(N));
        ////

        var m = bigInt(vm.dataBs.toString('hex'), 16);
        console.log('m es: ',m);
        var r = bigInt.randBetween(0, keys.publicKey.n);

        var blindMsg = m.multiply(r.modPow(keys.publicKey.e, keys.publicKey.n)).mod(keys.publicKey.n);
        console.log('blind msg   m·r^e mod n:', '\n', blindMsg.toString(10), '\n');

        var bc = keys.privateKey.encrypt(blindMsg);
        console.log('bc, blindMsg encriptado(es lo que envio)',bc.toString(10));
        //var N = bigInt(keys.publicKey.n.toString(10));
        console.log('bc ^3 mod N',bc.modPow(3,N).mod(N).toString(10));

        var dec = keys.publicKey.decrypt(bc);
        console.log('blindMsg desencriptado(igual a blindMsg)', dec.toString(10));

        var uri = 'http://localhost:3000/object/bs',
            message = {
                "data": bc.toString(10),
                "source": "Client",
                "destiny": "Server",
                "N": keys.publicKey.n.toString(10),
            };


        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(message),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){

            var o = response.data.data;
            console.log('o es: (el post modpow)',o);
            var O = bigInt(o);
            var c = O.multiply(rsaFunctions.modInv(r,keys.publicKey.n));
            console.log(c.toString(10));

            var d = keys.publicKey.decrypt(c);
            alert(d.toString(10));
            console.log(response);
            //vm.res = response.data;

        }, function errorCallback(response){
            console.log(response);
        });
    }


    function postData(){
        var uri = 'http://localhost:3000/object/',
            hash = CryptoJS.SHA1(vm.data).toString(),
            m = bigInt(hash.toString('hex'), 16),
            proofString = "SERVER" + "AAA" + createId() + "AAA" + hash,
            proofBigInt = bigInt(proofString.toString('hex'), 16),
            proofOrg = keys.privateKey.encrypt(proofBigInt),
            msgEncrypt = CryptoJS.AES.encrypt(vm.data, '12345').toString(),
            message = {
                "data": msgEncrypt,//vm.data,
                "destiny": uri,
                "PO": proofOrg,
                "publicKey": keys.publicKey
            };

        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(message),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            console.log(response);
            vm.res = response.data;
            postTTP();
        }, function errorCallback(response){
            console.log(response);
        });
    }

    function postTTP(){
        var uri = 'http://localhost:3002/object/',
            message = {
                "key": "Key",
                "source": "Cliente",
                "destiny": "Server"
            };


        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(message),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            console.log(response);
            vm.res = response.data;
        }, function errorCallback(response){
            console.log(response);
        });
    }

    function createId(){
        return Math.random().toString(36).substr(2, 9);
    }
}