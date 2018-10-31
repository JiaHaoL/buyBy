(function() {
    define(['pageController','jqueryUiZh'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	
            	$scope.form = {};
            	$httpService.css("http://cdn.sjedu.cn/js/jqueryUi/css/custom-theme/jquery-ui-1.9.2.custom.css");
            	
            	//查询数据
            	$scope.find = function() { 
            		$scope.page.number=50;
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findURL, $scope.form).success(function(data) {
                		$scope.dataList = data.data;
                		console.log(data);
                        PAGE.buildPage($scope,data);	//处理分页
    	            });
	            };
	            
	            //查询按钮点击事件
	            $scope.select = function(){
	            	$scope.page.current = 1;
	            	if($scope.form.F_BEGIN_TIME!=null && $scope.form.F_BEGIN_TIME !="" && $scope.form.F_BEGIN_TIME !=undefined){
	            		$scope.form.BEGIN_TIME = $scope.form.F_BEGIN_TIME+" 00:00:00";
	            	}
	            	if($scope.form.F_END_TIME!=null && $scope.form.F_END_TIME !="" && $scope.form.F_END_TIME !=undefined){
	            		$scope.form.END_TIME = $scope.form.F_END_TIME+" 00:00:00";
	            	}
	            	$scope.find();
	            }
	            //初始化分布
	            PAGE.iniPage($scope);
            	
	            
	            $('#'+controllerName+' .datepicker').datepicker(
            			{	onSelect: function(dateText, inst) 
            				{
            					eval("$scope." + $(this).attr('ng-model') + "='"+$(this).val()+"'");
                            }
            			}
            	);
            	$('#'+controllerName+' .datepicker').datepicker('option', 'dateFormat','yy-mm-dd');
            	
            }
        ];
    });
}).call(this);
