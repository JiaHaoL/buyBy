(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	
            	
            	$scope.teacherReport = function(){
            		$('#'+controllerName+' .school').removeClass("active"); 
            		$('#'+controllerName+' .class').removeClass("active"); 
            		$('#'+controllerName+' .teacher').addClass("active");
            	    $scope.appPartSrc = "aps/content/page/columnReport/teacher/config.json";
            		$scope.$apply();
            		
            	}
            	
            	$scope.classReport = function(){
            		$('#'+controllerName+' .school').removeClass("active"); 
            		$('#'+controllerName+' .class').addClass("active"); 
            		$('#'+controllerName+' .teacher').removeClass("active");
            		
            		if($scope.userinfo.FK_UNIT=="SJAAAAG10089"){
            			$scope.appPartSrc = "aps/content/page/columnReport/class/config.json";
            		}else{
            			$scope.appPartSrc = "aps/content/page/columnReport/classX/config.json";
            		}
            		$scope.$apply();
            	}
            	
            	$scope.schoolReport = function(){
            		$('#'+controllerName+' .class').removeClass("active"); 
            		$('#'+controllerName+' .school').addClass("active"); 
            		$('#'+controllerName+' .teacher').removeClass("active");
            		$scope.appPartSrc = "aps/content/page/columnReport/school/config.json";
            		$scope.$apply();
            	}
            	
            	var init = function(){
            		$httpService.post(config.getuserInfoURL, $scope.form).success(function(data) {
                		$scope.userinfo = data.data;
                		if($scope.userinfo.FK_UNIT=="SJAAAAG10089"){
                			$scope.appPartSrc = "aps/content/page/columnReport/class/config.json";
                			$scope.$apply();
                			$('#'+controllerName+' .teacher').hide();
                		}else{
                			$scope.appPartSrc = "aps/content/page/columnReport/classX/config.json";
                			$scope.$apply();
                		}
    	            });
                	$scope.$apply();
            	}   	
                init();   
            }
        ];
    });
}).call(this);
