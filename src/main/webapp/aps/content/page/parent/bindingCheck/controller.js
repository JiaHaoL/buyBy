(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	$scope.check = function(obj){
	            	var m2 = {
    	                  url:"aps/content/page/parent/bindingCheck/check/config.json?FK_STUDENT="+obj.FK_STUDENT+"&SP_PK="+obj.SP_PK,
    	                  contentName:"modal",
	  	                  text:"家长申请绑定学生审核",
	  	                  size:"modal-lg",
	  	                  icon:"file"
    	                }
              		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            }
            	
	            
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
