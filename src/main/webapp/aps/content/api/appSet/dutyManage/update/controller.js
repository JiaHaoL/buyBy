(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//初始化
            	$scope.form={};
            	//初始化数据
            	var findInfo=function(){
            		$httpService.post(config.findByIdURL,{"DUTY_TASK_PK":params.pk}).success(function(data) {
                		$scope.form=data.data;
                		$scope.$apply();
                		findDutyList();
                		findWeekDay();
                		$scope.stuChangeList();
    	            });
            	}
            	
            	findInfo();
            	
        		//所有值日任务
            	var findDutyList=function(){
            		$httpService.post(config.findClassDutySetURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.dutyList = data.data;
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取出错');
            		});
            	}
        		
        		//查询一周值日的天数
            	var findWeekDay=function(){
            		$httpService.post(config.findWeekDayListURL,{}).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.weekList = data.data;
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取年级出错');
            		});
            	}
            	
            	//获取这个班级的所有学生
            	$scope.stuChangeList=function(){
            		$httpService.post(config.findStuListURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.stuList = data.data;
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取年级出错');
            		});
            	}
            	
            	
            	//保存事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		//校验表单
               		if(!$scope.validateForm()){
               			return;
               		}
            		
            		$httpService.post(config.updateURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件
                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                    	}
                     }).error(function(data) {
                         loggingService.info('添加出错！');
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
