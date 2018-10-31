(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	
            	$httpService.post(config.findByIdURL, {"PK_CLASSPLOT":params.pk}).success(function(data) {
            		$scope.form = data.data;
        			var o_Editor = document.getElementById("eWebEditor1").contentWindow;
        			o_Editor.setHTML(data.data.CONTENT, false);
        			$scope.$apply();
	            });
            	
            	
            	$httpService.css("http://portal.sjedu.cn/ewebeditor/_example/example.css");
               
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		/*
            		if(!$scope.validateForm()){
            			return;
            		}*/
            		var o_Editor = document.getElementById("eWebEditor1").contentWindow;
            		//$scope.form.DOCCONTENT = o_Editor.getText();
            		$scope.form.CONTENT = o_Editor.getHTML();
            		
            		$httpService.post(config.addURL, $scope.form).success(function(data) {
            			if(data.code=="0000"){
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增成功"});
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增出错"});
                    });
            		
	            });
            	
            	eventBusService.subscribe(controllerName, controllerName+'.send', function(event, btn) {
            		$scope.form.STATE = 1;
            		var o_Editor = document.getElementById("eWebEditor1").contentWindow;
            		$scope.form.CONTENT = o_Editor.getHTML();
            		$httpService.post(config.addURL, $scope.form).success(function(data) {
            			if(data.code=="0000"){
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增成功"});
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增出错"});
                    });
            		
	            });
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            		
            	//VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
