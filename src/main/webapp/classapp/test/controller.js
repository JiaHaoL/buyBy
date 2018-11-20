(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	
            	$scope.form.username = $routeParams.name;
            	$scope.form.userpwd = $routeParams.pwd;
            	
            	var init = function(){
            		
            	}
            	
            }
        ];
    });
}).call(this);
