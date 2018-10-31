(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	var scoreSumPk=params.pk;
            	 //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });

	            
	            //添加等级
	            $scope.add = function(){
            		var m2 = {
        	                  url:"aps/content/exam/ScoreSumManage/cog/add/config.json?pk="+scoreSumPk,
        	                  contentName:"modal",
        	                  text:"添加等级",
//        	                  size:"modal-lg",
        	                  icon:"sort-by-alphabet"
        	                }
                  	eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            	
            	}
	            
	            $scope.update = function(){
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
          	                  url:"aps/content/exam/ScoreSumManage/cog/update/config.json?pk="+values.pop()+"&scoreSumPk="+scoreSumPk,
          	                  contentName:"modal",
//          	                  size:"modal-lg",
          	                  text:"修改等级",
          	                  icon:"sort-by-alphabet"
          	                }
                    	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	}
            	}
	            
	            //移除等级
	            $scope.removeRule = function(){
	            	var values = [];
                	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});
                	if(values.length < 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条要删除的数据数据！"});
                	}else if(values.length > 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时删除多行数据，请选择一条数据！"});
                	}else{
                		if(confirm("是否确认删除！")){
		                	$httpService.post(config.UpdateScoreLevelURL,{"LEVELID":values[0]}).success(function(data) {
		                    	if(data.code != '0000'){
		                    		loggingService.info(data.msg);
		                    	}else{
		                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除成功！"});
		                    		$scope.find();
		                    	}
		                     }).error(function(data) {
//		                    	 alert("获取初始化数据出错");
		                         loggingService.info('获取初始化数据出错');
		                     });
		              	}
                	}
            	}
	            
	          //接收关闭按钮事件
               	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                     	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                   });
	            
	            $scope.find = function() { 
            		$scope.form.page = JSON.stringify($scope.page);
            		$scope.form.FK_SCORESUM = scoreSumPk;
            		$httpService.post(config.findURL,$scope.form).success(function(data) {
                		$scope.dataList = data.data;
                        PAGE.buildPage($scope,data);
    	            });
	            };
 	            PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
