(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	
            	//初始化表单
            	$scope.form= {};
            	var pk = params.pk;
            	var LEVELID={"LEVELID":pk};
            	var SCORESUMID=params.scoreSumPk;
            	var totalScore=0;
            	   //保存按钮事件
            	   eventBusService.subscribe(controllerName, controllerName+'.save', function(event, arg) {
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}
               		$httpService.post(config.updateScoreLevelURL,$scope.form).success(function(data) {
               			$scope.form.LEVELID=pk;
                       	if(data.code != '0000'){
                       		loggingService.info(data.msg);
                       	}else{
                       	 goBack();
                       	 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改成功！"});
                         eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件
                       	}
                       }).error(function(data) {
                           loggingService.info('保存失败！');
                       });
   	            });
            	
            	 //接收关闭按钮事件
               	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
               		goBack();
                   });
               	
              //返回上一级页面
            	var goBack = function() {
	        		var m2 = {
	        				url:"aps/content/exam/ScoreSumManage/cog/config.json?pk="+SCORESUMID,
	        				contentName:"modal",
	        				size:"modal-lg",
	        				text:"设置指标"
	        		}
	        		eventBusService.publish(controllerName, 'appPart.load.modal', m2);
            	}
            	
            	//查询数据
            	$httpService.post(config.findLevelByIdURL,LEVELID).success(function(data) {
        			$scope.form = data.data;
        			totalScore=data.data.SUMSCORE;
        			$scope.$apply();
	            });
               	
            	$scope.change=function(){
            		var score=$scope.form.LEVELRETE;
            		var levelScore=score/100*totalScore;
            		$scope.form.LEVELSCORE=levelScore;
            	}
              //初始化表单校验
            	VALIDATE.iniValidate($scope);
            	
            }
        ];
    });
}).call(this);
