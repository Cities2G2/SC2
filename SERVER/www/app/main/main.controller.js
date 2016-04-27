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
    vm.getData = getData;
    vm.n= "1";
    vm.e= bigInt("65537");
    load();

    function load(){
        keys = rsaFunctions.generateKeys(512);
        console.log(keys);
    }

    function postDataBs(){
        console.log("hola");
        console.log(vm.dataBs);
        //console.log(vm.e);
        //console.log(vm.n);
        ////probando
        var N = bigInt(keys.publicKey.n.toString(10));
        var num = bigInt("134123412412414341441324");
        //console.log('num³ mod N',num.modPow(3,N).mod(N).toString(10));
        ////
/*
        var m = bigInt(vm.dataBs.toString('hex'), 16);
        console.log('m es: ', m.toString(10));
        var r = bigInt.randBetween(0, keys.publicKey.n);

        var blindMsg = m.multiply(r.modPow(keys.publicKey.e, keys.publicKey.n)).mod(keys.publicKey.n);
        console.log('blind msg   m·r^e mod n:', '\n', blindMsg.toString(10), '\n');

        //var bc = blindMsg;
        var bc = keys.privateKey.encrypt(blindMsg);
        console.log('bc, blindMsg encriptado(es lo que envio)',bc.toString(10));
        //var N = bigInt(keys.publicKey.n.toString(10));
        //console.log('bc ^3 mod N',bc.modPow(3,N).mod(N).toString(10));

        //var dec = keys.publicKey.decrypt(bc);
        //console.log('blindMsg desencriptado(igual a blindMsg)', dec.toString(10));
*/
        var m = bigInt(vm.dataBs.toString('hex'), 16);
        console.log('m es: ', m.toString(10));
        var r = bigInt.randBetween(0, vm.n);
        console.log('r es: ', r.toString(10));
        var blindMsg = m.multiply(r.modPow(vm.e, vm.n)).mod(vm.n);
        console.log('blind msg   m·r^e mod n:', '\n', blindMsg.toString(10), '\n');

        var bc = blindMsg;


        var uri = 'http://localhost:3000/object/bs',
            message = {
                "data": bc.toString(10),
                "source": "Client",
                "destiny": "Server",
                "N": keys.publicKey.n.toString(10),
                "R": r.toString(10)
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
            var c = O.multiply(rsaFunctions.modInv(r,vm.n));
            console.log('(unblinded) valid encryption    *1/r mod n:', '\n', c.toString(10), '\n');
            var d = c.modPow(vm.e,vm.n);
            alert('Decryption with public:\n' + d.toString(10));
            /*console.log(c.toString(10));

            var d = keys.publicKey.decrypt(c);
            alert(d.toString(10));
            console.log(response);
            //vm.res = response.data;*/

        }, function errorCallback(response){
            console.log(response);
        });
    }


    function postData(){
       var uri = 'http://localhost:3000/object/datanr',
           hash = CryptoJS.SHA1(vm.data).toString(),
           identMsg = createId(),
           keyMsg = createId(),
           proofString = "SERVER" + "AAA" + identMsg + "AAA" + hash,
           proofBigInt = bigInt(proofString.toString('hex'), 16),
           proofOrg = keys.privateKey.encrypt(proofBigInt),
           msgEncrypt = CryptoJS.AES.encrypt(vm.data, keyMsg).toString(),
           message = {
                "identMsg": identMsg,
                "data": msgEncrypt,
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
            postTTP(keyMsg);
        }, function errorCallback(response){
            console.log(response);
        });
    }

    function postTTP(keyMsg){
        var uri = 'http://localhost:3002/object/',
            proofString = "SERVER" + "AAA" + vm.res.identMsg + "AAA" + keyMsg,
            proofBigInt = bigInt(proofString.toString('hex'), 16),
            proofKeyOrg = keys.privateKey.encrypt(proofBigInt),
            message = {
                "source": "CLIENTE",
                "destiny": "SERVER",
                "identMsg": vm.res.identMsg,
                "key": keyMsg,
                "PKO": proofKeyOrg
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

    function getData(){
        var uri = 'http://localhost:3000/object/data';

        return $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function succesCallback(response){
            vm.n=bigInt(response.data.data);

            console.log(vm.n);
        }, function errorCallback(response){
            vm.res = "error" + response;
        });
    }

    function createId() {
        return Math.random().toString(36).substr(2, 9);
    }
}