(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
               var FK_STUDENT=params.FK_STUDENT;
               var SP_PK = params.SP_PK;
               var flag = 0;
               eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                 	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	           });
               /**
                * 通过
                */
               eventBusService.subscribe(controllerName, controllerName+'.checkpass', function(event, btn) {
            	   if(flag==1){
            		   return;
            	   }
            	    flag=1;
            	    console.log(FK_STUDENT);
            	    $httpService.post(config.checkURL, {
            	    	FK_STUDENT:FK_STUDENT,
            	    	SP_PK:SP_PK,
            	    	STATUS:0
            	    }).success(function(data) {
                          eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                          eventBusService.publish(controllerName,'appPart.data.reload', {});	//刷新数据
    	            });
	            });
               
               /**
                * 不通过
               */
               eventBusService.subscribe(controllerName, controllerName+'.checkno', function(event, btn) {
            	   if(flag==1){
            		   return;
            	   }
            	   flag=1;
            	   $httpService.post(config.checkURL, {
	           	    	FK_STUDENT:FK_STUDENT,
	           	    	STATUS:1
	           	    }).success(function(data) {
	                     eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	                     eventBusService.publish(controllerName,'appPart.data.reload', {});	//刷新数据
	   	            });
                	
	           });
               
               var init = function(){
            	   $httpService.post(config.loadURL, {FK_STUDENT:FK_STUDENT}).success(function(data) {
               		  $scope.obj = data.data;
               		  console.log(data.data);
                      $scope.$apply();
   	               });
               }
               
               init();
            	
            }
        ];
    });
}).call(this);
