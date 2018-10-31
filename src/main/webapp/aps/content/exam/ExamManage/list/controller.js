(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	

            	/**
                 * 添加
                 */
                eventBusService.subscribe(controllerName, controllerName+'.add', function(event, ojb) {
                		var m2 = {
    						"url" : "aps/content/exam/ExamManage/add/config.json",
    						text:"新建评测",
    						size:"modal-lg",
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
 							"url" : "aps/content/exam/ExamManage/update/config.json?pk="+values.pop(),
 							text:"修改评测",
 							size:"modal-lg",
 							"contentName" : "modal"
 						}
 						eventBusService.publish(controllerName,'appPart.load.modal', m2);
	              	}
 	            });
                
           		

                /**
                 * 删除
                 */
                eventBusService.subscribe(controllerName, controllerName+'.delete', function(event, ojb) {
                	var ExamId=null;
                    var values = [];
	              	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
	              		values.push($(this).val());
	              	});
	              	
	              	
	              	if(values.length < 1){
	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
	              	}else if(values.length > 1){
	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时删除多行数据，请选择一条数据。"});
	              	}else{
	              		
	              		ExamId={"ExamId":values.pop()};
		              	if(confirm("是否确认删除！")){
		                  //获取本次考试的 数据
		              		$httpService.post(config.deleteExaminfoURL,ExamId).success(function(data) {
	                    		$scope.select();
		                     }).error(function(data) {
		                         loggingService.info('删除 出错');
		                     });
		              	}
	              	}
                	
                });
            	
    
            	
            	//删除考试信息
            	$scope.deleteExaminfo=function(){
            		var examinfo = {
	            				"ExamId":$scope.examList[0].EXAMID,
	            				"examSchoolList":$scope.examSchoolList,
	            				"examCourseList":$scope.examCourseList
            				};
            		
            		var examJsoninfo ={"examJsoninfo":JSON.stringify(examinfo)};
            	};
            	
            	
            	
            	
            	//接收 事件 刷新表格
            	eventBusService.subscribe(controllerName,'appPart.expertinfo.reload', function(event, m2) {
					$scope.find();
				});
            	
            
            	//获取 科目 列表
            	$httpService.post(config.findCourseListURL).success(function(data) {
                	if(data.code != '0000'){
                		loggingService.info(data.msg);
                	}else{
                		$scope.CourseList = data.data;
                		$scope.$apply();
                	}

                 }).error(function(data) {
                     loggingService.info('获取科目出错');
                 });
            	
            	//获取 年级 列表
                $scope.initGrade = function(){
                	$httpService.post(config.findGradeListURL).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.GradeList = data.data;
                    		$scope.$apply();
                    	}
	
	                 }).error(function(data) {
	                     loggingService.info('获取年级出错');
	                 });
                };	
            	
                
                //获取 考试类型 列表
                $scope.initExamType = function(){
                	$httpService.post(config.findExamTypeListURL).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.ExamTypeList = data.data;
                    		$scope.$apply();
                    	}
	
	                 }).error(function(data) {
	                     loggingService.info('获取评测类型出错');
	                 });
                };	
                
                $scope.initExamType();
                

    			//分项管理
    			$scope.ScoreSumManage = function(EXAMID){
    				var menu = {
    						"CONTROLLER_NAME": "ScoreSumManage",
    						"CREATE_BY": "SJAAAAX44858",
    						"CREATE_TIME": 1515772800000,
    						"MENU_CODE": "0000730103",
    						"MENU_FATHER_PK": "53679dbd79134d4fb055f4e80c7369f7",
    						"MENU_IMG": "file",
    						"MENU_LINK": "aps/content/exam/ScoreSumManage/list/config.json?EXAMID="+EXAMID,
    						"MENU_NAME": "分项管理",
    						"MENU_PK": "692136e22a6942e0be28895c3fe18fb0",
    						"MENU_STATUS": "0",
    						"MENU_TYPE": "0",
    						"UPDATE_BY": "SJAAAAX44858",
    						"UPDATE_TIME": 1517241600000
    			        };
    				
						//给当前菜单设置样式
	            		$("#sidebar a").removeClass("active");
	                	$("#app_left .menuPk-"+menu.MENU_PK).addClass("active");
    				
    					//根据导航节点判断加载模块
    					var changeControllerData = {
    					          url:menu.MENU_LINK,
    					          contentName:"content",
    					          hasButton:"right",
    					          data:menu
    					        }
    					return eventBusService.publish(controllerName,'appPart.load.content', changeControllerData);
    			}
    			
    			//成绩导入
				$scope.ScoreImport = function(EXAMID){
					var menu = {
							"CONTROLLER_NAME": "ScoreImport",
							"CREATE_BY": "SJAAAAX44858",
							"CREATE_TIME": 1515772800000,
							"MENU_CODE": "0000730104",
							"MENU_FATHER_PK": "53679dbd79134d4fb055f4e80c7369f7",
							"MENU_IMG": "file",
							"MENU_LINK": "aps/content/exam/ScoreImport/list/config.json?EXAMID="+EXAMID,
							"MENU_NAME": "成绩导入",
							"MENU_PK": "80279c57fd2b40439e220953e2cfc397",
							"MENU_STATUS": "0",
							"MENU_TYPE": "0"
    			        };
    					
						//给当前菜单设置样式
	            		$("#sidebar a").removeClass("active");
	                	$("#app_left .menuPk-"+menu.MENU_PK).addClass("active");
					
    					//根据导航节点判断加载模块
    					var changeControllerData = {
    					          url:menu.MENU_LINK,
    					          contentName:"content",
    					          hasButton:"right",
    					          data:menu
    					        }
    					return eventBusService.publish(controllerName,'appPart.load.content', changeControllerData);		
    			}
				
				//分项分析
				$scope.ScoreSumAnalysis = function(EXAMID){
					var menu = {
							"CONTROLLER_NAME": "ScoreSumAnalysis",
							"CREATE_BY": "SJAAAAX44858",
							"CREATE_TIME": 1515772800000,
							"MENU_CODE": "0000730105",
							"MENU_FATHER_PK": "53679dbd79134d4fb055f4e80c7369f7",
							"MENU_IMG": "file",
							"MENU_LINK": "aps/content/exam/ScoreSumAnalysis/list/config.json?EXAMID="+EXAMID,
							"MENU_NAME": "分项分析",
							"MENU_PK": "5879766b7f964505a9f668335d202319",
							"MENU_STATUS": "0",
							"MENU_TYPE": "0"
    			        };
					
						//给当前菜单设置样式
	            		$("#sidebar a").removeClass("active");
	                	$("#app_left .menuPk-"+menu.MENU_PK).addClass("active");
    					
    					//根据导航节点判断加载模块
    					var changeControllerData = {
    					          url:menu.MENU_LINK,
    					          contentName:"content",
    					          hasButton:"right",
    					          data:menu
    					        }
    					return eventBusService.publish(controllerName,'appPart.load.content', changeControllerData);
				}
                
                
                $scope.select = function(){
                	$scope.page.current = 1;
                	$scope.find();
                };
                
                
                
            	//获取考试信息
            	$scope.find = function() { 
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findExaminfoListURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		
                    		$scope.dataList = data.data;
		     	            PAGE.buildPage($scope,data);
                    	}
	
	                 }).error(function(data) {
	                     loggingService.info('获取评测出错');
	                 });
            		
	            };
     
	            PAGE.iniPage($scope);
	            $scope.initGrade();
            }
        ];
    });
}).call(this);
