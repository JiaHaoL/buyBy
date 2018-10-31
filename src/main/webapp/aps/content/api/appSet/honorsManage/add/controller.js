(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$httpService.css("assets/css/uploadify.css");
            	//初始化 form 表单
            	$scope.form={};
            	$scope.yearList = new Array();
            	for (var int = 2016 ; int < 2117; int++) {
            		$scope.yearList.push(int);
				}
            	
            	$scope.monthList = new Array();
            	for (var int = 1 ; int <= 12; int++) {
            		$scope.monthList.push(int);
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
            	
            	/*//查询当前老师是班主任的班级
            	var findClassList=function(){
            		$httpService.post(config.findURL,{}).success(function(data) {
                		$scope.classList=data.data;
                		$scope.$apply();
    	            });
            	}*/
            	
            	var findHonorsTypeList=function(){
            		$httpService.post(config.findHonorsTypeListURL,{}).success(function(data) {
                		$scope.honorsTypeList=data.data;
                		$scope.$apply();
    	            });
            	}
            	
            	
        		
            	//初始化数据
            	var init = function(){
            		findGradeList();
            		findHonorsTypeList();
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
               		
            		$httpService.post(config.addURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
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
