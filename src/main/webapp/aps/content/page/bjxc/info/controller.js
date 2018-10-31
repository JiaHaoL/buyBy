(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.replyForm = {};
            	$scope.replyForm.PK_CLASSPHOTO = params.pk;
            	
            	$httpService.post(config.findByIdURL, {"PK_CLASSPHOTO":params.pk}).success(function(data) {
            		$scope.form = data.data;
        			$scope.$apply();
	            });
            
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            		
            	//VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
