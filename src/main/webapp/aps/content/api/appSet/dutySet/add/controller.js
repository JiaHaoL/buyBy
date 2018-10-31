(function() {
    define(['swfobject','uploadify','uploadauto'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	var uploadfiletype ='.png,jpg';
            	var uploadapp="jky";
            	var UserID= "";
            	var url=config.uploadurl;
            	
            	
            	//获取年级
            	var findGradeList=function(){
            		$httpService.post(config.findGradeByTeacherURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.gradeList = data.data;
            				$scope.form.FK_GRADE=data.data[0].GRADE_PK;
            				$scope.$apply();
            				$scope.findClass();
            			}
            		}).error(function(data) {
            			loggingService.info('获取年级出错');
            		});
            	}
            	
            	//获取班级
            	$scope.findClass = function(){	
            		$httpService.post(config.findClassByTeacherURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.classList = data.data;
            				$scope.form.FK_CLASS=data.data[0].CLASS_PK;
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取班级出错');
            	});
            	}
            	
            	//附件上传（回调函数）
            	var callonComplete = function(event, queueID, fileObj, response, dataObj) {
              	    //转换为json对象
                	console.log(response);
                	var data = eval("("+response+")");
                	if(data.code == "4444"){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不支持此类型文件的上传!"});
                		return;
                	}
                   if(data.code == "0000"){
                	   $scope.form.FILE_PATH = data.data.FILE_PATH;
                	   $scope.form.FILE_LINK_PK=data.data.RES_FILE_LINK_PK
                	   $scope.form.FILE_ID=data.data.FILE_ID;
                	   $scope.form.EXTNAME=data.data.EXTNAME;
                	   $('#'+controllerName+' .uploadfile').show();
                       $('#'+controllerName+' .uploadresult').show();
                       $('#'+controllerName+' .uploadfile').html(data.data.ORI_FILENAME+"."+data.data.EXTNAME);
                   }
                    
                };
            	//初始化数据
            	var init = function(){
            		findGradeList();
            		UPLOADAUTO.iniUploadauto($('#uploadifyfile'),uploadfiletype,uploadapp,"0",UserID,url,callonComplete);		
            	}
            	init();
        		
            	
            	//保存事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}
            		$httpService.post(config.saveURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            		        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存成功!"});
            	            eventBusService.publish(controllerName,'appPart.load.reload', {});
            			}
            		}).error(function(data) {
            			loggingService.info('保存班级值日项目出错');
            	});
            	});
            	
            	//关闭事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
            		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            	});
            	
            	//初始化表单校验
            	VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
