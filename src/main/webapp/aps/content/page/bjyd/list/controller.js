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
	            
	            eventBusService.subscribe(controllerName, controllerName+'.add', function(event, ojb) {
	            	var m2 = {
  	                  url:"aps/content/page/bjyd/add/config.json",
  	                  contentName:"modal",
  	                  size:"modal-lg",
	                  text:"发表文章",
	                  icon:"pencil"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            });
	            
            		
            }
        ];
    });
}).call(this);
