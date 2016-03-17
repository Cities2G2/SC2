'use strict';

angular
    .module('clientNR')
    .controller('mainController', mainController);

function mainController($window, $scope, $http){
    var vm = this;

    vm.res = "No data";

    vm.postData = postData;
    vm.getData = getData;

    function postData(){
        var uri = 'http://localhost:3000/object/',
            message = {
                "data": vm.data,
                "source": vm.source,
                "destiny": vm.adressee
            };


        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(message),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            console.log(response);
        }, function errorCallback(response){
            console.log(response);
        });
    }

    function getData(){
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
    }

}