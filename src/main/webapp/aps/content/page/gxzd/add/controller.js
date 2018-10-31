(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	$scope.form.STATE = 3;
            	
            	$httpService.css("http://portal.sjedu.cn/ewebeditor/_example/example.css");
               
            	
            	$httpService.post(config.findStudentURL, {}).success(function(data) {
        			$scope.studentsData = data.data;
        			$scope.$apply();
	            });
            	
            	
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		
            		if(!$scope.validateForm()){
            			return;
            		}
            		var o_Editor = document.getElementById("eWebEditor1").contentWindow;
            		//$scope.form.DOCCONTENT = o_Editor.getText();
            		$scope.form.CONTENT = o_Editor.getHTML();
            		if(o_Editor.getHTML() == null || o_Editor.getHTML() == ""){
            			alert("内容不能为空！");
            			return;
            		}
            		$httpService.post(config.addURL, $scope.form).success(function(data) {
            			if(data.code=="0000"){
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增成功"});
	                		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"bjyd"});
	                		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            			}else{
            				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增失败"});
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增出错"});
                    });
            		
	            });
            	
            	eventBusService.subscribe(controllerName, controllerName+'.send', function(event, btn) {

            		if(!$scope.validateForm()){
            			return;
            		}
            		$scope.form.STATE = 1;
            		var o_Editor = document.getElementById("eWebEditor1").contentWindow;
            		$scope.form.CONTENT = o_Editor.getHTML();
            		if(o_Editor.getHTML() == null || o_Editor.getHTML() == ""){
            			alert("内容不能为空！");
            			return;
            		}
            		$httpService.post(config.addURL, $scope.form).success(function(data) {
            			if(data.code=="0000"){
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增成功"});
	                		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"bjyd"});
	                		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"文档新增出错"});
                    });
            		
	            });
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            		
            	VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
