(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//初始化 form 表单
            	$scope.form={};
            	$scope.form.CLASS_HONORS_PK=params.pk;
            	//年份
            	$scope.yearList = new Array();
            	for (var int = 2016 ; int < 2117; int++) {
            		var str=int+"";
            		var object={"YEAR_PK":str};
            		$scope.yearList.push(object);
            		$scope.$apply();
				}
            	//月份
            	$scope.monthList = new Array();
            	for (var int = 1 ; int <= 12; int++) {
            		var str=int+"";
            		var object={"MONTH_PK":str};
            		$scope.monthList.push(object);
            		$scope.$apply();
				}
            	//初始化数据
            	var findInfo=function(){
            		$httpService.post(config.findByIdURL,{"CLASS_HONORS_PK":params.pk}).success(function(data) {
                		$scope.form=data.data;
                		var option=data.data.WEEK;
                		if(option==0){
                			$("#"+controllerName+" #month").show();
                			$("#"+controllerName+" #weekn").hide();
                		}else if(option==1){	
                			$("#"+controllerName+" #week").show();
                			$("#"+controllerName+" #month").hide();
                		}	
                		$scope.$apply();
                		findGradeList();
                		$scope.findClassList();
                		findHonorsTypeList();
    	            });
            	}
            	
            	//获取该学校的所有荣誉类型
            	var findHonorsTypeList=function(){
            		$httpService.post(config.findHonorsTypeListURL,{}).success(function(data) {
                		$scope.honorsTypeList=data.data;
                		$scope.$apply();
    	            });
            	}
            	
            	//获取年级
            	var findGradeList=function(){
            		$httpService.post(config.findGradeListURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.gradeList = data.data;
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取年级出错');
            		});
            	}
            	
            	
            	//获取班级
            	$scope.findClassList= function(){
            		console.log($scope.form.FK_GRADE);
            		$httpService.post(config.findClassListURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.classList = data.data;
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取班级出错');
            		});
            	}
            	
            	//查询这个荣誉名称的类型是按周还是按月
            	$scope.findStatus=function(){
            		$httpService.post(config.findStatusURL,{"HONORS_TYPE_PK":$scope.form.HONOR_TYPE}).success(function(data) {
            			var option=data.data.WEEK;
                		if(option==0){
                			$("#"+controllerName+" #month").show();
                			$("#"+controllerName+" #weekn").hide();
                		}else if(option==1){	
                			$("#"+controllerName+" #week").show();
                			$("#"+controllerName+" #month").hide();
                		}	
                		$scope.$apply();
    	            });
            	}
            	
            	
            	//初始化数据
            	var init = function(){
            		findInfo();
            	}
            	init();

            	//保存事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		var num=$("#weekNum").val();
            		if(!isNaN(num)){
            			 
            		}else{
            			  alert("周，请填写数字！！！");
            		}
            		//校验表单
               		if(!$scope.validateForm()){
               			return;
               		}	
            		$httpService.post(config.updateURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改成功！"});
                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件，刷新数据
                    		$scope.goback();
                    	}
                     }).error(function(data) {
                         loggingService.info('保存班级荣誉出错！');
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
