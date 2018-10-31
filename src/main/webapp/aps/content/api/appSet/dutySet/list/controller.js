(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	 //添加
            	 eventBusService.subscribe(controllerName, controllerName+'.add', function(event, ojb) {
             		var m2 = {
 						"url" : "aps/content/api/appSet/dutySet/add/config.json",
 						text:"新增值日项目",
 						/*size:"modal-lg",*/
 						"contentName" : "modal"
 					}
 					eventBusService.publish(controllerName,'appPart.load.modal', m2);
            	 });
            	 
            	 
            	 //修改
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
 	    						"url" : "aps/content/api/appSet/dutySet/update/config.json?pk="+values[0],
 	    						text:"修改值日项目",
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
 		              		$httpService.post(config.deleteURL,{"DUTY_PK":values[0]}).success(function(data) {
 	                    		$scope.select();
 		                     }).error(function(data) {
 		                         loggingService.info('删除 出错');
 		                     });
 		              	}
 	              	}
                 	
                 });
            	 
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
            			loggingService.info('获取年级出错');
            	});
            	}
            	
            	var init = function(){
            		//获取年级
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
            	init();
            	
            	//初始化数据
            	$scope.find = function(){
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findClassDutySetURL,$scope.form).success(function(data) {
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
            	
            	//接受刷新事件
            	eventBusService.subscribe(controllerName, "appPart.load.reload", function(event, btn) {
           			$scope.find();
             	 });
            	
            	PAGE.iniPage($scope);
            	
            }
        ];
    });
}).call(this);
