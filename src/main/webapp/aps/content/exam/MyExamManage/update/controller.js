(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//获取主键pk
            	var pk = params.pk;
            	var ExamId={"ExamId":pk};
            	//$scope.form.CREATEPAPER = 1;
            	
            	//初始化 数据
            	$httpService.post(config.addExamInitURL).success(function(data) {
                	if(data.code != '0000'){
                		loggingService.info(data.msg);
                	}else{
                		var initData = data.data;
                		$scope.CourseList = initData.courseList;
                		$scope.GradeList = initData.gradeList;
                		$scope.ExamTypeList = initData.examTypeList;
                		$scope.$apply();
                		$scope.initCourse();
                	}
                 }).error(function(data) {
                     loggingService.info('获取科目信息出错');
                 });
            	
            	
            	//获取本次考试的 数据
            	$scope.initCourse = function(){
	            	$httpService.post(config.findUpdateExamInitURL,ExamId).success(function(data) {
	                	if(data.code != '0000'){
	                		loggingService.info(data.msg);
	                	}else{
	                		var initData = data.data;
	                		$scope.examList = initData.examList;
	                		$scope.examCourseList = initData.examCourseList;
	                		$scope.examClassList = initData.examClassList;
	                		$scope.form = $scope.examList[0];
	                		$scope.form.EXAMTYPEID = $scope.form.FK_EXAMTYPE;
	                		$scope.$apply();
	                		$scope.gradeChange();
	                		$scope.CoursecheckboxInit();
	                	}
	                 }).error(function(data) {
	                     loggingService.info('获取科目信息出错');
	                 });
            	}
            	

            	
            	
            	//初始化 课程 checkbox 的选择状态
            	$scope.CoursecheckboxInit=function(){
            		 //遍历 考试  科目
	           		 $("input[name = 'sc_Courseinfo_checkbox']").each(function(){
	           			 var courseCheckBox = $(this);
	                     id = $(this).val();
	                       $($scope.examCourseList).each(function(key,data){
	                    	   if(id==data.FK_COURSE){
	                    		   courseCheckBox.prop("checked",true);
	                    	   }
	                       });
	      
	                  });	
            	};
            	
            	
            	//初始化 班级 checkbox 的选择状态
            	$scope.ClasscheckboxInit=function(){
            		 //遍历 考试  科目
	           		 $("input[name = 'sc_Classinfo_checkbox']").each(function(){
	           			 var classCheckBox = $(this);
	                     id = $(this).val();
	                       $($scope.examClassList).each(function(key,data){
	                    	   if(id==data.FK_CLASS){
	                    		   classCheckBox.prop("checked",true);
	                    	   }
	                       });
	                  });	
            	};
            	
            	
            	
            	
            	//获取相应班级
            	$scope.gradeChange = function(){
	        		$httpService.post(config.findClassByTeacherURL,$scope.form).success(function(data) {
	                	if(data.code != '0000'){
	                		loggingService.info(data.msg);
	                	}else{
	                		$scope.ClassList = data.data;
	                		$scope.$apply();
                    		$scope.ClasscheckboxInit();
	                	}
	                 }).error(function(data) {
	                     loggingService.info('获取班级列表出错');
	                 });
            	}
            	
            	//全选/全不选
            	$scope.allClassClick=function(){
            		 $('input[name="sc_Classinfo_checkbox"]').each(function(){
            			 this.checked = $('#allClassCheckBox').prop("checked");
                      });
            	};
            	
            	//反选
            	$scope.reverseClassClick=function(){
           		 $('input[name="sc_Classinfo_checkbox"]').each(function(){
           			 this.checked = !this.checked;
                     });
            	};
            	
          
            	
            	
            	
            	//接收保存按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		$scope.form.EXAMID = pk;
            		
            		var FK_COURSEList = new Array();
            		var FK_CLASSList = new Array();
            	
            		 //获取 考试  科目
            		 $('input[name="sc_Courseinfo_checkbox"]:checked').each(function(){
                         id=$(this).val();
                         var courseId={"courseId":id};
                         FK_COURSEList.push(courseId);
                      });
            		 
            		 $scope.form.FK_COURSEList = JSON.stringify(FK_COURSEList);
            		
            		 
            		 $('input[name="sc_Classinfo_checkbox"]:checked').each(function(){
                         id=$(this).val();
                         var CLASSID={"CLASSID":id};
                         FK_CLASSList.push(CLASSID);
                      });
            		 $scope.form.FK_CLASSList = JSON.stringify(FK_CLASSList);
            	
            		 $httpService.post(config.updateMyExaminfoURL,$scope.form).success(function(data) {
 	                	if(data.code != '0000'){
 	                		loggingService.info(data.msg);
 	                	}else{
 	                		
 	                	}
 	                 }).error(function(data) {
 	                     loggingService.info('修改测评出错');
 	                 });
            		
            		 eventBusService.publish(controllerName,'appPart.expertinfo.reload', {});	//刷新数据
               		 eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
        
            	});
            	
            	
            	
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                });
            	
            	
            	
            }
        ];
    });
}).call(this);
