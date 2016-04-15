'use strict';

angular
    .module('clientNR')
    .controller('mainController', mainController);

function mainController($window, $scope, $http, BigInteger, rsaFunctions, bigInt){
    var vm = this,
        keys;

    vm.res = "No data";
    vm.postData = postData;
    vm.postDataBs = postDataBs;

    vm.getData = getData;
    vm.number = number;
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
        console.log(vm.e);
        console.log(vm.n);
        ////probando
        var N = bigInt(keys.publicKey.n.toString(10));
        var num = bigInt("134123412412414341441324");
        console.log('num³ mod N',num.modPow(3,N).mod(N).toString(10));
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

        var blindMsg = m.multiply(r.modPow(vm.e, vm.n)).mod(vm.n);
        console.log('blind msg   m·r^e mod n:', '\n', blindMsg.toString(10), '\n');

        var bc = blindMsg;

        var uri = 'http://localhost:3000/object/bs',
            message = {
                "data": bc.toString(10),
                "source": "Client",
                "destiny": "Server",
                "N": keys.publicKey.n.toString(10),
                "R": r.toString(10),
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
            var d = c.modPow(vm.e,vm.n);
            alert(d.toString(10));
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
        var uri = 'http://localhost:3000/object/',
            message = {
                "data": "Mensaje",
                "source": "Client",
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

    function number(){
        var a = new BigInteger('91823918239182398123');
        alert(a.bitLength()); // 67
    }
}