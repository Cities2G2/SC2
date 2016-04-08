'use strict';

angular
    .module('clientNR')
    .config(config);

function config($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: '/app/main/mainTemplate.html',
            controller: 'mainController',
            controllerAs: 'mainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}
