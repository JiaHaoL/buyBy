(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	
            	//学校办别
            	$httpService.post(config.findRuleURL, {"FK_RULE":"c3547dff15484941b2c1d7b5ab9e65d9"}).success(function(data) {
        			$scope.unitBbs = data.data;
        			$scope.$apply();
	            });
            	
            	//学校类别
            	$httpService.post(config.findRuleURL, {"FK_RULE":"182c0cbc8924435ab6773779d9f2f48f"}).success(function(data) {
        			$scope.unitLbs = data.data;
        			$scope.$apply();
	            });
            	
            	
            	//保存事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		var values = [];
                	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});
                	if(values.length < 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择您要一条记录。"});
                	}else if(values.length > 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"您选择了多行记录，请选择一条记录。"});
                	}else{
                		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                		var m2 = {
        						"url" : "aps/content/api/appSet/schoolSet/add/uploadPicture/config.json?pk="+values[0],
        						text:"",
        						/*size:"modal-lg",*/
        						"contentName" : "content"
        					}
        					eventBusService.publish(controllerName,'appPart.load.content', m2);
                	}
            		
            		
            		/*$httpService.post(config.addExaminfoURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.expertinfo.reload', {});	//刷新数据
                      		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
                    	}
                     }).error(function(data) {
                         loggingService.info('获取初始化信息出错');
                     });
    				 	*/
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
