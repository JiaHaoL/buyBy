(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//初始化表单
            	$scope.form= {};
            	$scope.form.OLDEXAMID=params.EXAMID;
            	
            	//初始化考试列表数据
            	$httpService.post(config.findExamListURL).success(function(data) {
   	             	if(data.code != '0000'){
   	             		loggingService.info(data.msg);
   	             	}else{
   	             		$scope.ExamList = data.data;
   	             		$scope.$apply();
   	             		
   	             	}
            	}).error(function(data) {
                    loggingService.info('获取初始化数据出错');
                });
            
            	    
            	    
        	   //保存按钮事件
        	   eventBusService.subscribe(controllerName, controllerName+'.save', function(event, arg) {
            		 //校验表单
               		if(!$scope.validateForm()){
               			return;
               		}
               		
               		$httpService.post(config.copyScoreSumURL,$scope.form).success(function(data) {
                       	if(data.code != '0000'){
                       		loggingService.info(data.msg);
                       	}else{
	                         eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件
	                   		 eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
                       	}
                       }).error(function(data) {
                           loggingService.info('复制失败！');
                       });
   	            });
            	
            	 //接收关闭按钮事件
               	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                     	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                   });
               	
              //初始化表单校验
            	VALIDATE.iniValidate($scope);
            	
            }
        ];
    });
}).call(this);
