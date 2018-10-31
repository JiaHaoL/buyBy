(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};

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
            			loggingService.info('获取值日日期出错');
            		});
            	}
            	
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
            				findDutyList();
            			}
            		}).error(function(data) {
            			loggingService.info('获取班级出错');
            		});
            	}
        		
        		//所有值日任务
            	var findDutyList=function(){
            		$httpService.post(config.findClassDutySetURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.dutyList = data.data;
            				console.log("$scope.dutyList");
            				console.log($scope.dutyList);
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取年级出错');
            		});
            	}
            	
            	var init = function(){
            		findWeekDay();
            		findGradeList();           		
            	}
            	
            	init();
            	
            	//添加
	           	 eventBusService.subscribe(controllerName, controllerName+'.add', function(event, ojb) {
	            		var m2 = {
							"url" : "aps/content/api/appSet/dutyManage/add/config.json",
							text:"新增值日任务分组",
							size:"modal-lg",
							"contentName" : "modal"
						}
						eventBusService.publish(controllerName,'appPart.load.modal', m2);
	           	 });
	           	 
	           	/**
                  *修改
                  */
                 eventBusService.subscribe(controllerName, controllerName+'.update', function(event, ojb) {
                     var values = [];
 	              	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
 	              		values.push($(this).val());
 	              	});
 	              	if(values.length < 1){
 	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
 	              	}else if(values.length > 1){
 	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时删除多行数据，请选择一条数据。"});
 	              	}else{
 	              		var m2 = {
 								"url" : "aps/content/api/appSet/dutyManage/update/config.json?pk="+values[0],
 								text:"修改值日任务分配",
 								/*size:"modal-lg",*/
 								"contentName" : "modal"
 							}
 							eventBusService.publish(controllerName,'appPart.load.modal', m2);
 	              	}
                 	
                 });

	           	/**
                  * 删除
                  */
                 eventBusService.subscribe(controllerName, controllerName+'.delete', function(event, ojb) {
                     var values = [];
 	              	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
 	              		values.push($(this).val());
 	              	});
 	              	if(values.length < 1){
 	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
 	              	}else if(values.length > 1){
 	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时删除多行数据，请选择一条数据。"});
 	              	}else{
 		              	if(confirm("是否确认删除！")){
 		              		$httpService.post(config.deleteURL,{"DUTY_TASK_PK":values[0]}).success(function(data) {
 		              			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件
 		              			/*$scope.select();*/
 		                     }).error(function(data) {
 		                         loggingService.info('删除 出错');
 		                     });
 		              	}
 	              	}
                 	
                 });
            	
               //接收刷新事件
 	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
 	            	$scope.find();
 	            });
                 
                 //初始化
            	$scope.find = function(){
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findURL,$scope.form).success(function(data) {
            				if(data.code != '0000'){
            					loggingService.info(data.msg);
            				}else{
            					$scope.dataList = data.data;
            					PAGE.buildPage($scope,data);
            				}
            			}).error(function(data) {
            				loggingService.info('获取班级设置值日项目出错');
            		});
            	}
            	//查询
            	$scope.select = function(){
            		$scope.find();
            	}
            	
            	PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
