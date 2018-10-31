(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	
            	//获取年级
            	$httpService.post(config.findGradeByTeacherURL,$scope.form).success(function(data) {
        			if(data.code != '0000'){
        				loggingService.info(data.msg);
        			}else{
        				$scope.gradeList = data.data;
        				$scope.init();
        				$scope.$apply();
        				$scope.findClass();
        			}
        		}).error(function(data) {
        			loggingService.info('获取年级出错');
        		});
            	
            	//获取班级
            	$scope.findClass = function(){
            		$httpService.post(config.findClassByTeacherURL,{"FK_GRADE":$scope.form.FK_GRADE}).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$scope.classList = data.data;
            				$scope.$apply();
            				$scope.findStu();
            			}
            		}).error(function(data) {
            			loggingService.info('获取年级出错');
            	});
            	}
            	
            	//获取当前班级的所有学生
            	$scope.findStu=function(){
            		$httpService.post(config.findStuByClassURL,{"FK_CLASS":$scope.form.FK_CLASS}).success(function(data) {
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
            	//初始化数据
            	$scope.init=function(){
            		 $scope.form.FK_GRADE=params.FK_GRADE;
         	    	$scope.form.FK_CLASS=params.FK_CLASS;
         	    }
            	
            	
            	//保存事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		$httpService.post(config.addURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		/*var pk=data.data.result;
                    		alert(pk);*/
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存成功！"});
                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件，刷新数据
                    		$scope.goback();
                    		/*$scope.theNext(pk);*/
                    		
                    	}
                     }).error(function(data) {
                         loggingService.info('保存出错！');
                     });
            	});
            	
            	/*//下一步
        		$scope.theNext=function(pk){
        			var m2 = {
    						"url" : "aps/content/api/appSet/dutyGroupManage/set/config.json?pk="+pk,
    						text:"",
    						size:"modal-lg",
    						"contentName" : "content"
    					}
    					eventBusService.publish(controllerName,'appPart.load.content', m2);
        		}*/
            	
            	
            	
	          //关闭事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
            		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            	});
            }
        ];
    });
}).call(this);
