'use strict';

angular
    .module('clientNR')
    .controller('mainController', mainController);

function mainController($window, $scope, $http, BigInteger, rsaFunctions, bigInt){
    var vm = this,
        keys;

    vm.res = "No data";
    vm.postData = postData;
    //vm.getData = getData;
    vm.number = number;
    //load();

    function load(){
        keys = rsaFunctions.generateKeys(512);
        console.log(keys);
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

    /*function getData(){
        var uri = 'http://localhost:3000/object/destiny/' + vm.username;

        return $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function succesCallback(response){
            vm.res = response.data;
        }, function errorCallback(response){
            vm.res = "error" + response;
        });
    }*/

    function number(){
        var a = new BigInteger('91823918239182398123');
        alert(a.bitLength()); // 67
    }
}