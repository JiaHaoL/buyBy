(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	
            	$scope.appPartSrc = config.defaultURL;
	            
	           
	            $scope.selectClass = function(){
	            	$scope.appPartSrc = config.listURL;
	            	$("#"+controllerName+" .class").addClass("active");
                	$("#"+controllerName+" .my").removeClass("active");
                	
	            	$scope.$apply();
	            }
	            
	            $scope.selectMy = function(){
	            	$scope.appPartSrc = config.defaultURL;
	            	$("#"+controllerName+" .class").removeClass("active");
                	$("#"+controllerName+" .my").addClass("active");
                	
	            	$scope.$apply();
	            }
	            
	            eventBusService.subscribe(controllerName, controllerName+'.upload', function(event, ojb) {
	            	var m2 = {
  	                  url:"aps/content/page/bjxc/add/config.json",
  	                  contentName:"modal",
  	                  size:"modal-lg",
	                  text:"上传",
	                  icon:"open"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            });
	            
	            //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	            
            		
            }
        ];
    });
}).call(this);
