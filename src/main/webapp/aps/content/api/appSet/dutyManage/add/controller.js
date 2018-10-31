(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//初始化
            	$scope.form={};
            	$scope.form.WEEK_STATUS=0;
            	$scope.stuList = []; //学生信息
            	
            	var FK_StuList=new Array();
            	$scope.newStuList;
            	//添加一个学生
            	$scope.add=function(stuVo){
            		$scope.stuList.remove(stuVo);
            		FK_StuList.push(stuVo);
            		$scope.newStuList=FK_StuList;
            		$scope.form.FK_StuList=JSON.stringify(FK_StuList);             	
            	}
            	//移除一个学生
            	$scope.remove=function(stuVo){
            		$scope.newStuList.remove(stuVo);
            		$scope.stuList.push(stuVo);
            		FK_StuList.remove(stuVo);
            		$scope.form.FK_StuList=JSON.stringify(FK_StuList);
            		/*console.log("$scope.form.FK_StuList");
                	console.log($scope.form.FK_StuList);*/
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
            				$scope.stuChange();
            				findDutyList();
            			}
            		}).error(function(data) {
            			loggingService.info('获取年级出错');
            		});
            	}
        		
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
            			loggingService.info('获取年级出错');
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
        		
            	var init = function(){
            		findWeekDay();
            		findGradeList();           		
            	}
            	
            	init();
            	
            	
            	
            	//获取这个班级的所有学生
            	$scope.stuChange=function(){
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
            		
            		$httpService.post(config.addURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件，刷新数据
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
