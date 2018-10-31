(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.form = {};
            	$scope.form.STATE = 0;
            	
            	//查询数据
            	$scope.find = function() { 
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findURL, $scope.form).success(function(data) {
                		$scope.dataList = data.data;
                        PAGE.buildPage($scope,data);	//处理分页
    	            });
	            };
	            
	            eventBusService.subscribe(controllerName, controllerName+'.review', function(event, ojb) {
	            	var values = [];
                	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});
                	
                	if(values.length < 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
                	}else if(values.length > 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时操作多行数据，请选择一条数据。"});
                	}else{
                		var m2 = {
            	                  url:"aps/content/page/bjyd/review/config.json?pk="+values[0],
            	                  contentName:"modal",
            	                  size:"modal-lg",
          	                  text:"审核",
          	                  icon:"zoom-in"
            	                }
                      		eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	}
	            	
	            	
	            });

            	$scope.findBjydInfo = function(bjyd){
	            	var m2 = {
    	                  url:config.infoURL+"?pk="+bjyd.PK_CLASSPLOT,
    	                  contentName:"modal",
    	                  size:"modal-lg",
	  	                  text:bjyd.TITLE,
	  	                  icon:"file"
    	                }
              		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            }
            	
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
