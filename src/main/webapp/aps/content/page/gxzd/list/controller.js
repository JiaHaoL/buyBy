(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	$scope.findBjydInfo = function(bjyd){
	            	var m2 = {
    	                  url:config.infoURL+"?pk="+bjyd.PK_CLASSNEWS,
    	                  contentName:"modal",
    	                  size:"modal-lg",
	  	                  text:bjyd.TITLE,
	  	                  icon:"file"
    	                }
              		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            }
            	
            	
	            
	            eventBusService.subscribe(controllerName, controllerName+'.add', function(event, ojb) {
	            	var m2 = {
	    	                  url:"aps/content/page/gxzd/add/config.json",
	    	                  contentName:"modal",
	    	                  size:"modal-lg",
	    	                  text:"添加",
	    	                  icon:"plug"
	    	                }
	              	eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            });
	            
            	
            	//查询数据
            	$scope.find = function() { 
            		$scope.form.page = JSON.stringify($scope.page);
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
