(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	$scope.replyForm = {};
            	$scope.replyForm.PK_CLASSPLOT = params.pk;
            	
            	$httpService.post(config.findByIdURL, {"PK_CLASSPLOT":params.pk}).success(function(data) {
            		$scope.form = data.data;
        			$scope.$apply();
        			findReply();
	            });
            	
            	var findReply = function(){
            		$httpService.post(config.findReplyByIdURL, {"PK_CLASSPLOT":params.pk}).success(function(data) {
                		$scope.replys = data.data;
            			$scope.$apply();
    	            });
            	}
            	
            	$scope.replyBtn = function(reply){
            		$('#'+controllerName+' .REPLYP'+reply.PK_CLASSPLOTREPLY).toggle();
            	}
            	
            	$scope.replySubmitBtn = function(reply){
            		var contentr = $('#'+controllerName+' .REPLYTEXT'+reply.PK_CLASSPLOTREPLY).val();
            		if(contentr!=null && contentr != ''){
            			var replyMeVo = {};
            			replyMeVo.PK_CLASSPLOT = reply.PK_CLASSPLOT;
            			replyMeVo.FATHER_CLASSPLOTREPLY = reply.PK_CLASSPLOTREPLY;
            			replyMeVo.CONTENT = contentr;
            			$httpService.post(config.addReplyURL, replyMeVo).success(function(data) {
                			if(data.code=="0000"){
    	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发表评论成功"});
    	                		findReply();
                			}
        	            }).error(function(data) {
        	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发表评论出错"});
                        });
            		}
            	}
            	
            	
            	$httpService.css("http://portal.sjedu.cn/ewebeditor/_example/example.css");
               
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {

                	$scope.replyForm.FATHER_CLASSPLOTREPLY = 0;
            		$httpService.post(config.addReplyURL, $scope.replyForm).success(function(data) {
            			if(data.code=="0000"){
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发表评论成功"});
	                		$scope.replyForm.CONTENT = "";
	                		findReply();
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发表评论出错"});
                    });
            		
	            });
            	
            	
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            	
            	var init = function(){
            		$httpService.post(config.MsgUserInsertURL, {
            			"MESSAGE_PK":params.pk,
            			"MESSAGE_TYPE":"BJYD",
            			"READ_CLIENT":"1",
            			"READ_SYSTEM":"JXHD"
            		 }).success(function(data) {
    	             });
            	}
            	init();	
            	//VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
