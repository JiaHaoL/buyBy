(function() {
    define([], function() {
        return [
            '$scope','$location','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$location,$httpService,config, eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	
            	$scope.save = function(){
            		$scope.form.content = uedesign.getAllHtml();
            		
            		$httpService.post(config.saveURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            				eventBusService.publish(controllerName,'appPart.load.reload2', {});
            				$scope.form = {};
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取班级学员信息出错');
            		});
            	}
            	
            	 var uedesign = UE.getEditor('design_argument');
            	 //uedesign.getPlainTxt();
            	 
            }
        ];
    });
}).call(this);
