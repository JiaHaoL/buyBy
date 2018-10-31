(function() {
    define(['uploadConntrolle'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	$scope.form.STATE = 0;
            	
            	$httpService.css("https://cdn.sjedu.cn/js/jquery.uploadify-v2.1.0/uploadify.css");
               
            	$httpService.post(config.findResTypeURL, {"FK_RULE":"SJAAAAA10233"}).success(function(data) {
        			$scope.typesData = data.data;
        			$scope.$apply();
	            });
            	
            	
            	var callonComplete = function(event, queueID, fileObj, response, dataObj){
        			//转换为json对象
	       			 var data = eval("("+response+")");
	       			
	       			 if(data.code=="0000"){
	       			    $scope.form.FILENAME =data.data.RES_FILE_LINK_PK;
	       			    $scope.form.FILEOLDNAME =data.data.ORI_FILENAME;
	       			    $scope.form.FILEPATH =data.data.FILE_PATH;
	       			    $scope.form.FILESIZE =data.data.FILE_SIZE;
	       			    $scope.form.FILEEXT =data.data.EXTNAME;
	       			
	       			 }		
       		    };
       		    
            	UPLOAD.iniUpload($("#uploadify"),null,'jzpd',0,'SJAACDH35070','http://rescenter.sjedu.cn/ResCenter/upload/Upload_fileUploadDomain_fileUploadDomain.json',callonComplete);
            	
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		/*
            		if(!$scope.validateForm()){
            			return;
            		}*/
            		if($scope.form.FILENAME){
            			if($scope.form.FILENAME != undefined && $scope.form.FILENAME != null && $scope.form.FILENAME != ""){
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
            			}else{
                			alert("请选择图片");
                		}
            		}else{
            			alert("请选择图片");
            		}
            		
            		
            		
	            });
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            		
            	//VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
