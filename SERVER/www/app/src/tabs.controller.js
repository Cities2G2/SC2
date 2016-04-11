'use strict';

angular
    .module('clientNR')
    .controller('tabController', tabController);

function tabController(){
    var vm = this;
    vm.tab = 1;

    vm.setTab = function(setTab){
        vm.tab = setTab;
    };
    vm.isSet = function(isSet){
        return vm.tab === isSet;
    };
}