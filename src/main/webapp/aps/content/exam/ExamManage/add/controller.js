(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	$scope.form.CREATEPAPER = 1;
            	
            	//初始化 数据
            	$httpService.post(config.addExamInitURL).success(function(data) {
                	if(data.code != '0000'){
                		loggingService.info(data.msg);
                	}else{
                		var initData = data.data;
                		$scope.CourseList = initData.courseList;
                		$scope.GradeList=initData.gradeList;
                		$scope.ExamTypeList = initData.examTypeList;
                		$scope.$apply();
                	}
                 }).error(function(data) {
                     loggingService.info('获取初始化信息出错');
                 });
            	
            	
            	
            	
            	//年级 改变事件 获取相应学校
            	$scope.gradeChange=function(){
            		$httpService.post(config.findClassListbyGradeURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.ClassList = data.data;
                    		$scope.$apply();
                    	}
                     }).error(function(data) {
                         loggingService.info('获取班级列表出错');
                     });
            	};
            	
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
                     var CLASSID = {"CLASSID":id};
                     FK_CLASSList.push(CLASSID);
                  });
        		 
        		 $scope.form.FK_CLASSList = JSON.stringify(FK_CLASSList);
        		 
        		 //验证考试名称
        		 if($scope.form.EXAMNAME =="" || $scope.form.EXAMNAME == undefined){
        			 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请键入考试名称"});	//弹出提示框
        			 return;
        		 }
        		 //验证年级
        		 if($scope.form.GRADE_CODE == "" || $scope.form.GRADE_CODE == undefined){
					 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择年级"});	//弹出提示框		 
					 return;
				 }
        		 //验证班级
        		 if(FK_CLASSList.length == 0){
					 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择班级"});	//弹出提示框
					 return;
				 }
        		 //验证科目
				 if(FK_COURSEList.length == 0){
					 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择科目"});	//弹出提示框
					 return;
				 }
        		 
			 	$httpService.post(config.addExaminfoURL,$scope.form).success(function(data) {
                	if(data.code != '0000'){
                		loggingService.info(data.msg);
                	}else{
                		eventBusService.publish(controllerName,'appPart.expertinfo.reload', {});	//刷新数据
                  		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
                	}
                 }).error(function(data) {
                     loggingService.info('添加测评出错');
                 });
        	});

        	
        	//接收关闭按钮事件
        	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
              	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            });
            	
            }
        ];
    });
}).call(this);
