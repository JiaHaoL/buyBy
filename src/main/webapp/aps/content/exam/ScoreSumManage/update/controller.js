(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//初始化表单
            	$scope.form= {};
            	var scoreSumPk=params.pk;
            	var SCORESUMID={"SCORESUMID":scoreSumPk};
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                });
            	
            	var init =function(){
            		//初始化考试列表数据
                	$httpService.post(config.findExamListURL).success(function(data) {
       	             	if(data.code != '0000'){
       	             		loggingService.info(data.msg);
       	             	}else{
       	             		$scope.ExamList = data.data;
       	             		$scope.form.EXAMID = $scope.ExamList[0].EXAMID;
       	             		$scope.ScoreSumInfo();
       	             		$scope.$apply();
       	             		$scope.examListChange();
       	             	}
                	}).error(function(data) {
                        loggingService.info('获取初始化数据出错');
                    });
            	}
            	
            
            
            	//获取考试ID下的课程
            	   $scope.examListChange =function(){
		        	  var examId={"EXAMID":$scope.form.EXAMID};
		        	  $httpService.post(config.findSubmitExamStuCourseListURL,examId).success(function(data) {
		                	if(data.code != '0000'){
		                		loggingService.info(data.msg);
		                	}else{
		                		$scope.CourseList = data.data;
		                		$scope.$apply();
		                	}
		
		                 }).error(function(data) {
		                     loggingService.info('获取科目出错');
		                 });
		          }

            	 //查询数据
            	   $scope.ScoreSumInfo = function(){
               			$httpService.post(config.findByIdURL,SCORESUMID).success(function(data) {
	               			$scope.form.EXAMID = data.data.EXAMID ;
	            			$scope.form.FK_COURSE=data.data.FK_COURSE;
	            			$scope.form.SCORESUMNAME=data.data.SCORESUMNAME;
	            			$scope.form.SUMSCORE=data.data.SUMSCORE;
	            			$scope.$apply();
          	            });
               		}
            	
            	 //保存按钮事件
         	   eventBusService.subscribe(controllerName, controllerName+'.save', function(event, arg) {
         		   $scope.form.SCORESUMID=scoreSumPk;
        		   
         		   //校验表单
              		if(!$scope.validateForm()){
              			return;
              		}	  
            		$httpService.post(config.updataScoreSumURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
//                    		loggingService.info(data.msg);
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改失败！"});
                    	}else{
                    	 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改成功！"});
                    	 eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件
                		 eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口

                    	}
                    }).error(function(data) {
//                        loggingService.info('修改失败！');
                        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改失败！"});
                    });
	            });
         	
            	 //接收关闭按钮事件
               	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                     	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                   });
               	
                //初始化表单校验
            	VALIDATE.iniValidate($scope);
            	
            	//初始化数据
            	init();
            	
            	
            }
        ];
    });
}).call(this);
