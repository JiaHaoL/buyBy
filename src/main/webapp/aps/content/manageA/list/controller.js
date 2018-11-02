(function() {
    define([], function() {
        return [
            '$scope','$location','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$location,$httpService,config, eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	
            	$scope.titleInfo = function(obj){
            		//跳转窗口
            		var m2 = {
            				  url:"aps/content/manageA/info/config.json?id="+obj.id+"&3=3",
            		          text:""+obj.title,
            		          size:"modal-lg",
            		          contentName:"modal"
            		}   
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
            	}
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                 	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            	});
            	
            	eventBusService.subscribe(controllerName, "appPart.load.reload2", function(event, btn) {
                   	$scope.find();
                });
            	
            	$scope.add = function(){
            		//跳转窗口
            		var m2 = {
            				  url:"aps/content/manageA/add/config.json",
            		          text:"添加",
            		          size:"modal-lg",
            		          contentName:"modal"
            		}   
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
            	}
            	
            	$scope.find = function(){
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.getURL,$scope.form).success(function(data) {
            				if(data.code != '0000'){
            					loggingService.info(data.msg);
            				}else{
            					$scope.dataList = data.data;
            					PAGE.buildPage($scope,data);
            				}
            			}).error(function(data) {
            				loggingService.info('出错');
            		});
            	}
            	
            	
            	PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
