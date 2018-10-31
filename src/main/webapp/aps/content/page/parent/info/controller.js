(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	
            	var findParentInfo = function(){
            		$('#'+controllerName+' .INPUT_USER_PHONE').hide();
            		$httpService.post(config.findByIdURL, {"USER_PK":params.pk}).success(function(data) {
                		$scope.form = data.data;
                		
            			if($scope.form.USER_PHONE == null || $scope.form.USER_PHONE == undefined || $scope.form.USER_PHONE == ''){
            				$('#'+controllerName+' .INPUT_USER_PHONE').show();
                		}
                		
            			$scope.$apply();
    	            });
            	}
            	
            	
            	
            	$scope.updatePhone = function(){
            		$httpService.post(config.updatePhoneURL, $scope.form).success(function(data) {
                		$scope.form = data.data;
                		findParentInfo();
    	            });
            	}
            	
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            		
            	findParentInfo();
            }
        ];
    });
}).call(this);
