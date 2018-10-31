(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	$scope.form.isset = "";
            	$scope.form.FK_CLASS = params.pk;
            	
            	
            	var init = function(){
            		$httpService.post(config.getClassZymURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.data);
                    	}else{
                    		if(data.data.length == 0){
                    			$scope.form.isset = "0";
                    		}else{
                    			$scope.form.isset = "1";
                    			$scope.form.REMARK = data.data[0].CLASS_MOTTO;
                    			$scope.$apply();
                    		}
                    	}
                     }).error(function(data) {
                         loggingService.info('获取班级座右铭出错');
                     });
            	}
            	init();
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                 	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            	});
            	
            	/*//学校办别
            	$httpService.post(config.findRuleURL, {"FK_RULE":"c3547dff15484941b2c1d7b5ab9e65d9"}).success(function(data) {
        			$scope.unitBbs = data.data;
        			$scope.$apply();
	            });
            	
            	//学校类别
            	$httpService.post(config.findRuleURL, {"FK_RULE":"182c0cbc8924435ab6773779d9f2f48f"}).success(function(data) {
        			$scope.unitLbs = data.data;
        			$scope.$apply();
	            });*/
            	
            	
            	//保存事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		var url = "";
            		if($scope.form.isset == "0"){
            			url = config.addClassMottor;
            		}else{
            			url = config.updateClassMottor;
            		}
            		console.log($scope.form);
            		$httpService.post(url,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.data);
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存成功!"});
                            eventBusService.publish(controllerName,'appPart.data.reload', {});
                    	}
                     }).error(function(data) {
                         loggingService.info('保存班级座右铭出错');
                     });
            		
            	});
            	
            	
            	//查询数据
            	$scope.find = function() { 
            		$scope.form.page = JSON.stringify($scope.page);
            		$scope.form.UNIT_TYPE = 1;
            		$httpService.post(config.findURL, $scope.form).success(function(data) {
                		$scope.dataList = data.data;
                        PAGE.buildPage($scope,data);	//处理分页
    	            });
	            };
	            
	            //查询按钮点击事件
	            $scope.select = function(){
	            	$scope.page.current = 1;
	            	$scope.find();
	            }
	            
	            //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	           
	            //初始化分布
	            PAGE.iniPage($scope);
            		
            }
        ];
    });
}).call(this);
