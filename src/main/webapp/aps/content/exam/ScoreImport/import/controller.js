(function() {
    define(['jqueryForm'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.SCORETYPE ="1";

            	//初始化考试列表数据
            	$httpService.post(config.findExamListURL).success(function(data) {
   	             	if(data.code != '0000'){
   	             		loggingService.info(data.msg);
   	             	}else{
   	             		$scope.ExamList = data.data;
   	             		$scope.form.EXAMID = $scope.ExamList[0].EXAMID;
   	             		$scope.$apply();
   	             		if (params.EXAMID != null & params.EXAMID != "undefined") {
   	             			$(".ExamSelect").val(params.EXAMID);
						}
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
		                		$scope.$apply();
		                		if ($scope.CourseList.length > 0) {
		                			$(".CourseSelect").val($scope.CourseList[0].FK_COURSE);
		                			$scope.form.FK_COURSE = $scope.CourseList[0].FK_COURSE;
								}
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
		                		if (params.FK_CLASS != null & params.FK_CLASS != "undefined") {
		   	             			$(".ClassSelect").val(params.FK_CLASS);
		   	             			$scope.form.FK_CLASS = params.FK_CLASS;
								}
		                	}
		                 }).error(function(data) {
		                     loggingService.info('获取科目出错');
		                 });
	         	} 
            	
            	
         
            
       
  
            
            	 //JS校验form表单信息  
            	$scope.checkData = function(){
            		if(!$scope.validateForm()){
            			return false;
            		}
            		
                   var fileDir = $("#upfile").val();  
                   var suffix = fileDir.substr(fileDir.lastIndexOf("."));  
                   if("" == fileDir){  
                       eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"选择需要导入的Excel文件！"});	//弹出提示框
                       return false;  
                   }  
                   if(".xls" != suffix && ".xlsx" != suffix ){ 
                	   eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"选择Excel格式的文件导入！"});	//弹出提示框
                       return false;  
                   }  
                   return true;  
                }  
            	
            	
            	//接收保存按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		 if($scope.checkData()){
            			 $httpService.post(config.findScoreSumImportListURL,$scope.form).success(function(data) {
                         	if(data.code != '0000'){
                         		loggingService.info(data.msg);
                         	}else{
                         		$scope.dataList = data.data;
                         		if ($scope.dataList.length > 0) {
                         			 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"已经导入,请勿重复导入！"});	//弹出提示框
                                     return false;  
								}else {
									$scope.importData();
								}
                         	}
     	                 }).error(function(data) {
     	                     loggingService.info('获取导入信息出错');
     	                 });
                     }  
            	});
            	
            	
            	$scope.importData = function(){
	   			 //关闭模态窗
	   			 eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	   			 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"正在导入..."});
	   			 
	       		  $('#form1').ajaxSubmit({ 
	                     url:config.ImportDataUploadURL,  
	                     dataType: 'text',  
	                     success: resutlMsg,  
	                     error: errorMsg  
	                 });   
	                 function resutlMsg(msg){
	               	  var data = JSON.parse(msg);
	               		if(data.code != '0000'){
	                   		 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"导入excel出错！"});	//弹出提示框  
	                   	}else{
	                   		 $("#upfile").val(""); 
	                   		 eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件
	                   		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"提示信息","content":data.data});	//弹出提示框
	                   	}
	                 }  
	                 function errorMsg(){   
	                     eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"导入excel出错！"});	//弹出提示框  
	                 }
            	}
            	
            	
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
