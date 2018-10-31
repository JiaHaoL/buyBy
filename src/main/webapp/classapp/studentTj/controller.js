(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService','$interval', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService,$interval) {
            	$scope.form = {};
            	$scope.form = {};
	            $scope.form.CLASSID = $routeParams.CLASSID;
	            $scope.form.FK_COURSE = $routeParams.COURSEID;
	            var s = 0;
	            var stopEvent = "";
	            var url = "";
	            
	            if($routeParams.COURSEID == "0"){
	            	url = config.findClassStuInfoAllNromURL;
	            }else{
	            	//url = config.findClassStuInfoNormURL;
	            }
	            
	            
	            stopEvent=$interval(function(){
	               s=s+1;
	               var div1 = document.getElementById('progressbar1');  
	               div1.style.width=s*10+"%";
	               console.log("1");
	            },2000);   //间隔2秒定时执行
	            

	            
            	var getTongJi = function(){
            		$httpService.post(url,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.msg);
            			}else{
            				$(".table").show();
            				$('.progress1').hide();
            				$scope.$on('destroy',function(){
            					$interval.cancel(stopEvent);  
                                stopEvent = undefined;
            					})
            				$scope.columnList = data.data.getClassTag;
            				var he = {};
            				he.TAG_NAME = "名字/标签";
            				$scope.columnList.unshift(he);
            				$scope.rowList = data.data.stuList;
            				
            				
            				$scope.$apply();
            			}
            		}).error(function(data) {
            			loggingService.info('获取信息出错');
            	});
            	}
            	
            	var init = function(){
            		$(".table").hide();
            		getTongJi();
            	}
            	init();
            	
            }
        ];
    });
}).call(this);
