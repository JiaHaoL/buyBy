(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	var asset=function(){
            		$httpService.post(config.findAssetByURL).success(function(data) {
       	             	if(data.code != '0000'){
       	             		loggingService.info(data.msg);
       	             	}else{
    	   	             	 $scope.assetList = data.data;
    	   	             	 $scope.$apply();
       	             	}
                	}).error(function(data) {
                        loggingService.info('获取初始化数据出错');
                    });
            	}
            	
            	
            	var temp=function(){
            		$httpService.post(config.findTempURL).success(function(data) {
       	             	if(data.code != '0000'){
       	             		loggingService.info(data.msg);
       	             	}else{
    	   	             	 $scope.temList = data.data;
    	   	             	 $scope.$apply();
       	             	}
                	}).error(function(data) {
                        loggingService.info('获取初始化数据出错');
                    });
            	}
            	var snmp=function(){
            		$httpService.post(config.findSnmpURL).success(function(data) {
       	             	if(data.code != '0000'){
       	             		loggingService.info(data.msg);
       	             	}else{
    	   	             	 $scope.snmpList = data.data;
    	   	             	 $scope.$apply();
       	             	}
                	}).error(function(data) {
                        loggingService.info('获取初始化数据出错');
                    });
            	}
            	var cert=function(){
            		$httpService.post(config.findCertURL).success(function(data) {
       	             	if(data.code != '0000'){
       	             		loggingService.info(data.msg);
       	             	}else{
    	   	             	 $scope.certList = data.data;
    	   	             	 $scope.$apply();
       	             	}
                	}).error(function(data) {
                        loggingService.info('获取初始化数据出错');
                    });
            	}
            	var encry=function(){
            		$httpService.post(config.findEncryURL).success(function(data) {
       	             	if(data.code != '0000'){
       	             		loggingService.info(data.msg);
       	             	}else{
    	   	             	 $scope.encryList = data.data;
    	   	             	 $scope.$apply();
       	             	}
                	}).error(function(data) {
                        loggingService.info('获取初始化数据出错');
                    });
            	}
            	var init = function(){
            		//查询设备类型
                	$httpService.post(config.findDeviceURL).success(function(data) {
       	             	if(data.code != '0000'){
       	             		loggingService.info(data.msg);
       	             	}else{
    	   	             	 $scope.deviceList = data.data;
    	   	             	 console.log($scope.deviceList);
    	   	             	 $scope.$apply();
    	   	       
       	             	}
                	}).error(function(data) {
                        loggingService.info('获取初始化数据出错');
                    });
                	     asset();
                	     temp();
    	             	 snmp();
    	             	 cert();
    	             	 encry();
            	}

            	//根据设备pk查看主机详情		
            	$httpService.post(config.findMasterManageURL,{"HOST_COMPUTER_PK":params.pk}).success(function(data) {
   	             	if(data.code != '0000'){
   	             		loggingService.info(data.msg);
   	             	}else{
   	             		 $scope.form = data.data;
	   	             	 $scope.$apply();
	   	             	init();
   	             	}
            	}).error(function(data) {
                    loggingService.info('获取初始化数据出错');
                });
            	
            	
            	
            	//保存按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}
            		$scope.form.HOST_COMPUTER_PK=params.pk;
            		console.log($scope.form);
            		$httpService.post(config.updateMasterManageURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改成功！"});
                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件，刷新数据
                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
                    	}
                     }).error(function(data) {
                         loggingService.info('修改主机信息出错！');
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
