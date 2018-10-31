(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	
            	//根据设备pk查看设备详情		
            	$httpService.post(config.findDeviceManageURL,{"UNIT_DEVICE_PK":params.pk}).success(function(data) {
   	             	if(data.code != '0000'){
   	             		loggingService.info(data.msg);
   	             	}else{
   	             		 $scope.form = data.data;
	   	             	 $scope.DevChange();
	   	             	 $scope.$apply();
	   	             	 
   	             	}
            	}).error(function(data) {
                    loggingService.info('获取初始化数据出错');
                });
            	
            	//查询所有学校
            	$scope.DevChange=function(){
            	$httpService.post(config.findSchoolURL).success(function(data) {
   	             	if(data.code != '0000'){
   	             		loggingService.info(data.msg);
   	             	}else{
	   	             	 $scope.schoolNameList = data.data;
	   	             	 $scope.$apply();
	   	             	 $scope.schoolChange();
   	             	}
            	}).error(function(data) {
                    loggingService.info('获取初始化数据出错');
                });
            	}
            	
            //根据学校pk查找所有年级
            	$scope.schoolChange=function(){
            		if($scope.form.FK_UNIT!=''&&$scope.form.FK_UNIT!=null&&$scope.form.FK_UNIT!=undefined){
            			var FK_UNIT={"FK_UNIT":$scope.form.FK_UNIT};
    		        	$httpService.post(config.findGradeNameByURL,FK_UNIT).success(function(data) {
    	                	if(data.code != '0000'){
    	                		loggingService.info(data.msg);
    	                	}else{
    	                		$scope.unitList = data.data;
    	   	         		    console.log( $scope.unitList);
    	                		$scope.$apply();
    	                		$scope.classChange();
    	                	}
    	
    	                 }).error(function(data) {
    	                     loggingService.info('获取年级出错');
    	                 });
                			
                	  }
            	}
    
            	//通过年级PK查询班级名称
            	$scope.classChange=function(){
            		if($scope.form.FK_GRADE!=''&&$scope.form.FK_GRADE!=null&&$scope.form.FK_GRADE!=undefined){
            			var FK_GRADE={"FK_GRADE":$scope.form.FK_GRADE};
    		        	$httpService.post(config.findClassByGradeURL,FK_GRADE).success(function(data) {
    	                	if(data.code != '0000'){
    	                		loggingService.info(data.msg);
    	                	}else{
    	                		$scope.classList = data.data;
    	                		console.log( $scope.classList);
    	                		$scope.$apply();
    	                	}
    	
    	                 }).error(function(data) {
    	                     loggingService.info('获取班级出错');
    	                 });
            		}	
            	}
            	//保存按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}
            		$scope.form.UNIT_DEVICE_PK=params.pk;
            		console.log($scope.form);
            		$httpService.post(config.updateDeviceManageURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改成功！"});
                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件，刷新数据
                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
                    	}
                     }).error(function(data) {
                         loggingService.info('修改设备信息出错！');
                     });
            		
            		
            	});
            	//初始化表单校验
            	VALIDATE.iniValidate($scope);
            	
            		
            		
                	
            	
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                });
            	
            	
            	
            }
        ];
    });
}).call(this);
