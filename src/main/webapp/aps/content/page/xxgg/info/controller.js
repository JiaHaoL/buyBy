(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	
            	$httpService.post(config.findByIdURL, {"PK_CLASSNEWS":params.pk}).success(function(data) {
            		$scope.form = data.data;
        			$scope.$apply();
	            });
            	
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            	//"MsgUserInsertURL":"json/Open_insert_MsgUserInsert.json"
            	var init = function(){
            		$httpService.post(config.MsgUserInsertURL, {
            			"MESSAGE_PK":params.pk,
            			"MESSAGE_TYPE":"XXGG",
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
