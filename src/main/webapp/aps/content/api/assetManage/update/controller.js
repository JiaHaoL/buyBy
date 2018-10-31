(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	
            	var init = function(){
            		//查询资产类型
                	$httpService.post(config.findAssetURL).success(function(data) {
       	             	if(data.code != '0000'){
       	             		loggingService.info(data.msg);
       	             	}else{
    	   	             	 $scope.assetList = data.data;
    	   	             	 console.log($scope.assetList);
    	   	             	 $scope.$apply();
    	   	       
       	             	}
                	}).error(function(data) {
                        loggingService.info('获取初始化数据出错');
                    });
                	     
            	}

            	//根据设备pk查看资产详情		
            	$httpService.post(config.findAssetManageURL,{"SC_ASSET_MANAG_PK":params.pk}).success(function(data) {
   	             	if(data.code != '0000'){
   	             		loggingService.info(data.msg);
   	             	}else{
   	             		 $scope.form = data.data;
   	             		 console.log($scope.form);
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
            		$scope.form.SC_ASSET_MANAG_PK=params.pk;
            		console.log($scope.form);
            		$httpService.post(config.updateAssetManageURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改成功！"});
                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件，刷新数据
                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
                    	}
                     }).error(function(data) {
                         loggingService.info('修改资产信息出错！');
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
