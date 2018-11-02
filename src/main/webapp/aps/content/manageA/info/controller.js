(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	$scope.form.id = params.id;
            	
            	console.log($scope.form.id);
            	
            	var init = function(){
            		$httpService.post(config.getURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.form = data.data[0];
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('出错');
            		});
            	}
            	
            	init();
            	
            	
            }
        ];
    });
}).call(this);
