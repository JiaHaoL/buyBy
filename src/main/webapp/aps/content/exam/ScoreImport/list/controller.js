(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	
            	$scope.initParams =function(){
            		if (params.EXAMID != null & params.EXAMID != "undefined") {
            			$scope.form.EXAMID = params.EXAMID;
            			$scope.select();
					}
            	}
            	
            	//接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	            
            	//初始化考试列表数据
            	$httpService.post(config.findExamListURL).success(function(data) {
   	             	if(data.code != '0000'){
   	             		loggingService.info(data.msg);
   	             	}else{
   	             		$scope.ExamList = data.data;
   	             		$scope.form.EXAMID = $scope.ExamList[0].EXAMID;
   	             		$scope.initParams();
	             		//PAGE.iniPage($scope);
   	             		$scope.examListChange();
   	             	}
            	}).error(function(data) {
                    loggingService.info('获取初始化数据出错');
                });
            
            	//获取考试ID下的课程
            	$scope.examListChange =function(){
		        	  var examId={"EXAMID":$scope.form.EXAMID};
		        	  //获取科目
		        	  $httpService.post(config.findStuCourseListURL,examId).success(function(data) {
		                	if(data.code != '0000'){
		                		loggingService.info(data.msg);
		                	}else{
		                		$scope.CourseList = data.data;
		                		if ($scope.CourseList.length > 0) {
		                			$scope.form.FK_COURSE = $scope.CourseList[0].FK_COURSE;
								}
		                		$scope.$apply();
		                	}
		
		                 }).error(function(data) {
		                     loggingService.info('获取科目出错');
		                 });
		        	  
		        	  var examId={"ExamId":$scope.form.EXAMID};
		        	  //获取班级
		        	  $httpService.post(config.findExamClassListURL,examId).success(function(data) {
		                	if(data.code != '0000'){
		                		loggingService.info(data.msg);
		                	}else{
		                		$scope.classList = data.data;
		                		$scope.$apply();
		                	}
		
		                 }).error(function(data) {
		                     loggingService.info('获取科目出错');
		                 });
		         } 
            	   
            	
            	//导出
            	eventBusService.subscribe(controllerName, controllerName+'.export', function(event, ojb) {
            		if ($scope.form.EXAMID == null | $scope.form.EXAMID == '' ) {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一次评测。"});
            			return;
            		}
            		
            		if ($scope.form.FK_COURSE == null | $scope.form.FK_COURSE== '' ) {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择科目。"});
            			return;
            		}
            		
            		if ($scope.form.FK_CLASS == null | $scope.form.FK_CLASS == '' ) {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择班级。"});
            			return;
            		}
            		
            		$httpService.post(config.exportExamStuListURL,$scope.form).success(function(data) {
	                	if(data.code != '0000'){
	                		loggingService.info(data.msg);
	                	}else{
	                		var m2 = {
  									"url" : "aps/content/exam/ScoreImport/export/config.json?fileName="+data.data,
  									text:"Excel导出",
  									"contentName" : "modal"
  								}
  							eventBusService.publish(controllerName,'appPart.load.modal', m2);
	                		$scope.$apply();
	                	}
	                 }).error(function(data) {
	                     loggingService.info('获取科目出错');
	                 });
            	})
            	
            	//导入
            	eventBusService.subscribe(controllerName, controllerName+'.import', function(event, ojb) {
            		if ($scope.form.EXAMID == null | $scope.form.EXAMID == '' ) {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一次评测。"});
            			return;
            		}
            		
            		if ($scope.form.FK_CLASS == null | $scope.form.FK_CLASS == '' ) {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择班级。"});
            			return;
            		}
            		
            		var str = "?EXAMID="+$scope.form.EXAMID+"&FK_COURSE="+$scope.form.FK_COURSE+"&FK_CLASS="+$scope.form.FK_CLASS;
            		var m2 = {
							"url" : "aps/content/exam/ScoreImport/import/config.json"+str,
							text:"Excel导入",
							"contentName" : "modal"
						}
					eventBusService.publish(controllerName,'appPart.load.modal', m2);
            	})
            	
            	
            	
            	//删除
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
 	              		if (confirm("请确认是否删除此次导入的成绩？")) {
	 	              		var SCORESUMIMPORTID = {SCORESUMIMPORTID:values[0]};
	 	              		$httpService.post(config.deleteScoreSumImportURL,SCORESUMIMPORTID).success(function(data) {
			                	if(data.code != '0000'){
			                		loggingService.info(data.msg);
			                	}else{
			                		$scope.find();
			                	}
			                 }).error(function(data) {
			                     loggingService.info('删除成绩出错');
			                 });
 	              		}
 	              	}
            	})
            	

 	            $scope.select = function(){
 	            	$scope.page.current = 1;
 	            	$scope.find();
 	            }
            	
            	//
            	
            	
            	//获取 分项成绩 导入信息
            	$scope.find = function() { 
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findScoreSumImportListURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.dataList = data.data;
		     	            PAGE.buildPage($scope,data);
                    	}
	
	                 }).error(function(data) {
	                     loggingService.info('获取导入信息出错');
	                 });
            		
	            };
     
	            PAGE.iniPage($scope);
            	
 	            
            }
        ];
    });
}).call(this);
