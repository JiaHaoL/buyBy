(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	
            	$scope.bindingCheck = function(){
            		$('#'+controllerName+' .info').removeClass("active"); 
            		$('#'+controllerName+' .check').addClass("active"); 
            		$scope.appPartSrc = "aps/content/page/parent/bindingCheck/config.json";
            		$scope.$apply();
            	}
            	
            	$scope.parentInfo = function(){
            		$('#'+controllerName+' .info').removeClass("active"); 
            		$('#'+controllerName+' .parent').addClass("active"); 
            		$scope.appPartSrc = "aps/content/page/parent/parentInfo/config.json";
            		$scope.$apply();
            	}
            	
            	var init = function(){
                	$scope.appPartSrc = "aps/content/page/parent/parentInfo/config.json";
                	
            	}   	
                init();   
            		
            }
        ];
    });
}).call(this);
