(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
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
            	
            	//查询所有的荣誉类型
            	var findHonorsTypeList=function(){
            		$httpService.post(config.findHonorsTypeListURL,{}).success(function(data) {
                		$scope.honorsTypeList=data.data;
                		$scope.$apply();
    	            });
            	}
            	
            	var init=function(){
            		findGradeList();
            		findHonorsTypeList();
            	}
            	
            	init();
            	
            	/**
                 * 添加
                 */
                eventBusService.subscribe(controllerName, controllerName+'.add', function(event, ojb) {
                	var m2 = {
    						url : "aps/content/api/appSet/honorsManage/add/config.json",
    						text:"添加班级荣誉",
    						size:"modal-lg",
    						contentName : "modal"
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
	 							"url" : "aps/content/api/appSet/honorsManage/update/config.json?pk="+values[0],
	 							text:"修改班级荣誉",
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
                	
                    var values = [];
	              	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
	              		values.push($(this).val());
	              	});
	              	if(values.length < 1){
	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
	              	}else if(values.length > 1){
	              		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时删除多行数据，请选择一条数据。"});
	              	}else{
		              	if(confirm("是否确认删除！")){
		              		$httpService.post(config.deleteURL,{"CLASS_HONORS_PK":values[0]}).success(function(data) {
	                    		$scope.select();
		                     }).error(function(data) {
		                         loggingService.info('删除 出错');
		                     });
		              	}
	              	}
                	
                });
            	
                 //在线预览图片
	           	 $scope.info = function(pk){            		 	           		
	           		var m2 = {
	           			"url":"aps/content/api/appSet/honorsManage/info/config.json?pk="+pk,
	           			 text:"查看",
	                  	 size:"modal-lg",
	                  	 "contentName":"modal"
	                 }   
	                 eventBusService.publish(controllerName,'appPart.load.modal', m2);     	  	
	             }
                
              //初始化数据
           	 $scope.find = function() { 
            	$scope.form.page = JSON.stringify($scope.page);
            	$httpService.post(config.findURL, $scope.form).success(function(data) {
            		$scope.dataList = data.data;
                	console.log($scope.dataList);
                	PAGE.buildPage($scope,data); 
    	        });
	         };
 
	            $scope.select = function(){
	            	$scope.page.current = 1;
	            	$scope.find();
	            }
	            
	            PAGE.iniPage($scope);
           	
           	//接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
            }
        ];
    });
}).call(this);
