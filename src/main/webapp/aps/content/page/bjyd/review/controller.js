(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.replyForm = {};
            	$scope.replyForm.PK_CLASSPLOT = params.pk;
            	
            	$httpService.post(config.findByIdURL, {"PK_CLASSPLOT":params.pk}).success(function(data) {
            		$scope.form = data.data;
        			$scope.$apply();
	            });
            	
               
            	eventBusService.subscribe(controllerName, controllerName+'.success', function(event, btn) {
            	   $scope.replyForm.STATE = 1;
            	   $httpService.post(config.updateURL, $scope.replyForm).success(function(data) {
            			if(data.code=="0000"){
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"审核成功"});
	                		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"bjyd"});
	                		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"审核出错"});
                    });
            		
	            });
            	
            	
            	eventBusService.subscribe(controllerName, controllerName+'.faile', function(event, btn) {
             	   $scope.replyForm.STATE = 2;
             	   $httpService.post(config.updateURL, $scope.replyForm).success(function(data) {
             			if(data.code=="0000"){
 	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"审核成功"});
 	                		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"bjyd"});
	                		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
             			}
     	            }).error(function(data) {
     	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"审核出错"});
                     });
             		
 	            });
            	
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            		
            	//VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
