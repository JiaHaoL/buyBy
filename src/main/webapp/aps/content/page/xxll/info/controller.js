(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	
            	$httpService.post(config.findByIdURL, {"PK_HOMEWORK":params.pk}).success(function(data) {
            		$scope.form = data.data;
        			$scope.$apply();
	            });
            	
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
                
            	
            	var init = function(){
            		$httpService.post(config.MsgUserInsertURL, {
            			"MESSAGE_PK":params.pk,
            			"MESSAGE_TYPE":"XXLL",
            			"READ_CLIENT":"1",
            			"READ_SYSTEM":"JXHD"
            		 }).success(function(data) {
    	             });
            	}
            	init();		
            	//VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
