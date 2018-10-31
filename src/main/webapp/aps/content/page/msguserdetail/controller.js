(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
               console.log(controllerName,"loaded");
               $scope.form={};
               $scope.form.READ_USERTYPE=params.TYPE;
               $scope.form.MESSAGE_PK = params.PK;
               
               
               $scope.find = function(){
            	   $scope.form.page = JSON.stringify($scope.page);
            	   $httpService.post(config.findMsgUserListURL,$scope.form).success(function(data) {
	           			 $scope.listdata = data.data;
	           			 console.log(data);
	           			PAGE.buildPage($scope,data);
	   	           });
               }
               
            	 PAGE.iniPage($scope);
               
            
            }
        ];
    });
}).call(this);
