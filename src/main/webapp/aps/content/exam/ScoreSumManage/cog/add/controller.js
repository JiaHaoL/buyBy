(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	
            	//初始化表单
            	$scope.form= {};
            	var ScoreSum=params.pk;	
            	var SCORESUMID={"SCORESUMID":ScoreSum}
            	var totalScore=0;
            	//查询数据
            	$httpService.post(config.findScoreSumByIdURL,SCORESUMID).success(function(data) {
            		totalScore = data.data.SUMSCORE;
        			$scope.$apply();
	            });
            	
            	$scope.change=function(){
            		var score=$scope.form.LEVELRETE;
            		var levelScore=score/100*totalScore;
            		$scope.form.LEVELSCORE=levelScore;
            	}
            	
            	   //保存按钮事件
            	   eventBusService.subscribe(controllerName, controllerName+'.save', function(event, arg) {
            		$scope.form.FK_SCORESUM=ScoreSum;
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}
               		$httpService.post(config.saveScoreLevelURL,$scope.form).success(function(data) {
                       	if(data.code != '0000'){
                       		loggingService.info(data.msg);
                       	}else{
                       	 goBack();
                      // 	 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增成功！"});
                         eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件
//                   	 eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口

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
	        				url:"aps/content/exam/ScoreSumManage/cog/config.json?pk="+params.pk,
	        				contentName:"modal",
	        				size:"modal-lg",
	        				text:"设置指标"
	        		}
	        		eventBusService.publish(controllerName, 'appPart.load.modal', m2);
            	}
               	
              //初始化表单校验
            	VALIDATE.iniValidate($scope);
            	
            }
        ];
    });
}).call(this);
