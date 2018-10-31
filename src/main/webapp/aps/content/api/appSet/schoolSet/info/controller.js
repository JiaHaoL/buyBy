(function() {
    define(['flexpaper'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            $scope.form = {};
            $scope.form.UNIT_INFO_PK = params.pk;
            var findInfo=function(){
        		$httpService.post(config.findByIdURL,{"UNIT_INFO_PK":params.pk}).success(function(data) {
        			console.log(data.data);
            		$scope.form=data.data;
            		$scope.$apply();
	            });
        		
        	}
            
            findInfo();
            }
        ];
    });
}).call(this);
