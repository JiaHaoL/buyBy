(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	
            	$scope.initParams =function(){
            		if (params.EXAMID != null & params.EXAMID != "undefined") {
            			$scope.form.EXAMID = params.EXAMID;
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
	             		PAGE.iniPage($scope);
   	             		$scope.examListChange();
   	             	}
            	}).error(function(data) {
                    loggingService.info('获取初始化数据出错');
                });
            
            	//获取考试ID下的课程
            	$scope.examListChange =function(){
		        	  var examId={"EXAMID":$scope.form.EXAMID};
		        	  $httpService.post(config.findStuCourseListURL,examId).success(function(data) {
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
            	   
            	

              	 /**
                   * 设置指标
                   */
                eventBusService.subscribe(controllerName, controllerName+'.cog', function(event, ojb) {
                  	var values = [];
                  	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                  		values.push($(this).val());
                  	});
  	              	if(values.length < 1){
  	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
  	              	}else if(values.length > 1){
  	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时选择多行数据，请选择一条数据。"});
  	              	}else{
  	              		var m2 = {
   							"url" : "aps/content/exam/ScoreSumManage/cog/config.json?pk="+values[0],
   							text:"设置指标",
   							size:"modal-lg",
   							"contentName" : "modal"
   						}
   						eventBusService.publish(controllerName,'appPart.load.modal', m2);
  	              	}
   	            });
              	
                  /**
                   *关联试题
                   */
                  eventBusService.subscribe(controllerName, controllerName+'.set', function(event, ojb) {
                  	   
                    	var values = [];
                    	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                    		values.push($(this).val());
                    	});
    	              	if(values.length < 1){
    	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
    	              	}else if(values.length > 1){
    	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时选择多行数据，请选择一条数据。"});
    	              	}else{
    	              		var m2 = {
     							"url" : "aps/content/LevelManage/ScoreSumManage/set/list/config.json?pk="+values[0],
     							text:"关联试题",
     							size:"modal-lg",
     							"contentName" : "modal"
     						}
     						eventBusService.publish(controllerName,'appPart.load.modal', m2);
    	              	}
     	            });
                	
                  
                  
                  
               		/**
                    * 添加
                    */
                   eventBusService.subscribe(controllerName, controllerName+'.add', function(event, ojb) {
                	   if ($scope.form.EXAMID == null |$scope.form.EXAMID == '') {
                		   eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一次评测。"});
                		   return;
                	   }
                	   
   						var m2 = {
   							"url" : "aps/content/exam/ScoreSumManage/add/config.json?EXAMID="+$scope.form.EXAMID+"&FK_COURSE="+$scope.form.FK_COURSE,
   							text:"添加分项",
//  							size:"modal-lg",
   							"contentName" : "modal"
   						}
   						eventBusService.publish(controllerName,'appPart.load.modal', m2);
                   });
    

            	
            	
            	 /**
                 * 修改
                 */
                eventBusService.subscribe(controllerName, controllerName+'.update', function(event, ojb) {
             	   
                	var values = [];
                	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});
	              	
	              	
	              	if(values.length < 1){
	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
	              	}else if(values.length > 1){
	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时修改多行数据，请选择一条数据。"});
	              	}else{
	              		

 	               var m2 = {
 							"url" : "aps/content/exam/ScoreSumManage/update/config.json?pk="+values[0],
 							text:"修改分项",
// 							size:"modal-lg",
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
	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时修改多行数据，请选择一条数据。"});
	              	}else{
	              		
		              	if(confirm("是否确认删除！")){
		                	$httpService.post(config.UpdateScoreSumURL,{"SCORESUMID":values[0]}).success(function(data) {
		                    	if(data.code != '0000'){
		                    		loggingService.info(data.msg);
		                    	}else{
		                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除成功！"});
		                    		$scope.find();
		                    	}
		                     }).error(function(data) {
		                         loggingService.info('获取初始化数据出错');
		                     });
		              	}
	              	}
                	
                });

                
                //复制分项
                eventBusService.subscribe(controllerName, controllerName+'.copy', function(event, ojb) {
                	if ($scope.form.EXAMID == null | $scope.form.EXAMID == '') {
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一次评测。"});
                		return;
					}
                	var m2 = {
 							"url" : "aps/content/exam/ScoreSumManage/copy/config.json?EXAMID="+$scope.form.EXAMID,
 							text:"复制分项",
 							//size:"modal-lg",
 							"contentName" : "modal"
					}
					eventBusService.publish(controllerName,'appPart.load.modal', m2);
                })
                
                
                $scope.find = function() { 
             		$scope.form.page = JSON.stringify($scope.page);
             		$httpService.post(config.findScoreSumListURL,$scope.form).success(function(data) {
             			$scope.dataList = data.data;
                        PAGE.buildPage($scope,data);
     	            });
 	            };
 	            
 	            $scope.select = function(){
 	            	$scope.page.current = 1;
 	            	$scope.find();
 	            }
 	            
            }
        ];
    });
}).call(this);
