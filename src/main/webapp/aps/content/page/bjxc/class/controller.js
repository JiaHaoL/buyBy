(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	$scope.page = {};
            	$scope.page.number = 12;
            	//查询数据
            	$scope.find = function() { 
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findURL, $scope.form).success(function(data) {
                		$scope.dataList = data.data;
                        PAGE.buildPage($scope,data);	//处理分页
    	            });
	            };
	            

	            $httpService.post(config.findResTypeURL, {"FK_RULE":"SJAAAAA10233"}).success(function(data) {
        			$scope.typesData = data.data;
        			$scope.$apply();
	            });
	            
	            
	            $scope.findByType = function(typePk){
	            	$scope.page.current = 1;
	            	$scope.form.PK_PHOTOTYPE = typePk;
	            	$scope.find();
	            }
	            
	            
	            $scope.openPic = function(row) { 
	            	$scope.openBigTitle = row.FILENAME;
	            	$scope.openBigSrc = "http://rescenter.sjedu.cn/ResCenter/upload/Download_downloadForApp_download.json?uploadapp=jzp&filelinkid="+row.PHONE_PATH;
	            	$scope.$apply();
	            	$('#'+controllerName+" .bs-example-modal-lg").modal('show')
	            }
	            

            	$scope.findBjydInfo = function(bjyd){
	            	var m2 = {
    	                  url:config.infoURL+"?pk="+bjyd.PK_CLASSPHOTO,
    	                  contentName:"modal",
    	                  size:"modal-lg",
	  	                  text:bjyd.TITLE,
	  	                  icon:"file"
    	                }
              		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            }
            	
            	eventBusService.subscribe(controllerName, controllerName+'.delete', function(event, ojb) {
                	if(confirm("是否确认删除！")){
                		var values = [];
                    	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                    		values.push($(this).val());
                    	});
                    	
                    	if(values.length < 1){
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
                    	}else if(values.length > 1){
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时删除多行数据，请选择一条数据。"});
                    	}else{
                    		$httpService.post(config.deleteURL, {"PK_CLASSPHOTO":values[0]}).success(function(data) {
                    			if(data.code=="0000"){
                    				$scope.find();
                        			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
                            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除成功"});
                            		
                    			}
            	            }).error(function(data) {
            	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除出错"});
                            });
                    	}
                		
                	}
	            });
            	
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
