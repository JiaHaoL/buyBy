(function() {
    define(['swfobject','uploadify','uploadauto'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {     	
            	//初始化表单
            	$scope.form= {};
            	var uploadfiletype ='.png,jpg';
            	var uploadapp="jky";
            	var UserID= "";
            	var url=config.uploadurl;
            	
            	//附件上传（回调函数）
            	var callonComplete = function(event, queueID, fileObj, response, dataObj) {
              	    //转换为json对象
                	console.log(response);
                	var data = eval("("+response+")");
                	if(data.code == "4444"){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不支持此类型文件的上传!"});
                		return;
                	}
                   if(data.code == "0000"){
                	   $scope.form.FILE_PATH = data.data.FILE_PATH;
                	   $scope.form.FILE_LINK_PK=data.data.RES_FILE_LINK_PK
                	   $scope.form.FILE_ID=data.data.FILE_ID;
                	   $scope.form.EXTNAME=data.data.EXTNAME;
                	   $('#'+controllerName+' .uploadfile').show();
                       $('#'+controllerName+' .uploadresult').show();
                       $('#'+controllerName+' .uploadfile').html(data.data.ORI_FILENAME+"."+data.data.EXTNAME);
                   }
                    
                };
            	//初始化数据
            	var init = function(){
            		UPLOADAUTO.iniUploadauto($('#uploadifyfile'),uploadfiletype,uploadapp,"0",UserID,url,callonComplete);		
            	}
            	init();
            	
            	   //保存按钮事件
            	   eventBusService.subscribe(controllerName, controllerName+'.save', function(event, arg) {
            		 //校验表单
               		if(!$scope.validateForm()){
               			return;
               		}
               		$httpService.post(config.addURL,$scope.form).success(function(data) {
                       	if(data.code != '0000'){
                       		loggingService.info(data.msg);
                       	}else{
                         eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});//发送更新事件
                   		 eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
                       	}
                       }).error(function(data) {
                           loggingService.info('保存失败！');
                       });
   	            });
            	
            	 //接收关闭按钮事件
               	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                     eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
                });
               	
              //初始化表单校验
            	VALIDATE.iniValidate($scope);
            	
            }
        ];
    });
}).call(this);
