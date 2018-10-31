(function() {
    define(['jztree'], function() {
        return [
            '$scope','$location','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$location,$httpService,config, eventBusService,controllerName,loggingService) {
              $scope.form = {};
              $scope.product_typeClick=function(){
            	  $scope.find();
              }
              $scope.find = function(){
 	        	  $scope.form.page = JSON.stringify($scope.page);
 	        	  $httpService.post(config.TrafficStatistics,$scope.form).success(function(data) {
 	 	         		if(data.code != '0000'){
 	 	         			loggingService.info(data.msg);
 	 	         		}else{
 	 	         			$scope.dataList = data.data;
 	 	         			PAGE.buildPage($scope,data);
 	 	         		}
 	 	         	}).error(function(data) {
 	 	         		loggingService.info('获取应用信息出错');
 	 	         });
 	           }
              PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
