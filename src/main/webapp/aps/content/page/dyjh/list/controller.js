(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	
            	$scope.appPartSrc = config.defaultURL;
	            
            	$scope.selectAll = function(){
	            	$scope.appPartSrc = config.listURL;
                	$("#"+controllerName+" .dyjh").removeClass("active");
	            	$("#"+controllerName+" .all").addClass("active");
                	
	            	$scope.$apply();
	            }
            	
            	$scope.selectSchool = function(){
	            	$scope.appPartSrc = config.schoolURL;
                	$("#"+controllerName+" .dyjh").removeClass("active");
	            	$("#"+controllerName+" .school").addClass("active");
                	
	            	$scope.$apply();
	            }
	           
	            $scope.selectClass = function(){
	            	$scope.appPartSrc = config.classURL;
                	$("#"+controllerName+" .dyjh").removeClass("active");
	            	$("#"+controllerName+" .class").addClass("active");
                	
	            	$scope.$apply();
	            }
	            
	            $scope.selectMy = function(){
	            	$scope.appPartSrc = config.defaultURL;
                	$("#"+controllerName+" .dyjh").removeClass("active");
                	$("#"+controllerName+" .my").addClass("active");
                	
	            	$scope.$apply();
	            }
	            
	            $scope.selectReview = function(){
	            	$scope.appPartSrc = config.defaultURL;
                	$("#"+controllerName+" .dyjh").removeClass("active");
                	$("#"+controllerName+" .review").addClass("active");
                	
	            	$scope.$apply();
	            }
	            
	            $scope.addBjyd = function() {
	            	var m2 = {
  	                  url:"aps/content/page/dyjh/add/config.json",
  	                  contentName:"modal",
  	                  size:"modal-lg",
	                  text:"我要提问",
	                  icon:"question-sign"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            };
	            
	            //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	            
            		
            }
        ];
    });
}).call(this);
