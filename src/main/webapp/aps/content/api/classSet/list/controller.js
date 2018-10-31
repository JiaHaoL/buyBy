(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	$scope.paramsList = [];
            	var key = null;
            	
            	var init = function(){
            		$(".addparams").hide();
            		//查询这个模块的所有接口	
                	$httpService.post(config.findURL,{"MODULE_CODE":'5'}).success(function(data) {
                    		$scope.interfaceList=data.data;
                    		$scope.$apply();
                    		$scope.form.INTERFACE_PK = data.data[0].INTERFACE_PK;
                    		$scope.change();
        	            });
                	
            	}
            	init();
            	
            	//查询接口跳转的地址
            	$scope.change=function(){
            		if($scope.form.INTERFACE_PK!=null){
            			$httpService.post(config.findByIdURL,{"INTERFACE_PK":$scope.form.INTERFACE_PK}).success(function(data) {
                    		$scope.form.INTERFACE_PATH=data.data.INTERFACE_PATH;
                    		if(data.data.INTERFACE_TYPE != "1"){
                    			$(".addparams").show();
                    		}else{
                    			$(".addparams").hide();
                    		}
                    		$scope.$apply();
                    		interParamsList();
        	            });
        			}
            	}
            	
            	//查询指定接口的所有参数
            	var interParamsList=function(){
            		$httpService.post(config.findParamsListURL,{"INTERFACE_PK":$scope.form.INTERFACE_PK}).success(function(data) {
            			$scope.paramsList=data.data;
            			$scope.$apply();
            			
            			var list = data.data;
            			var value = "";
            			for(var i=0;i<list.length;i++){
            				if(list[i].PARAMS_TYPE == "3"){
            					key = list[i].PARAMS;
            				}
            				if(list[i].PARAMS_TYPE == "2"){
            					value = '"'+list[i].PARAMS+'":"",'+value;
            				}
            			}
            			value = "[{"+value.substring(0,value.length-1)+"}]";
            			var res = jsonFormat(JSON.stringify(eval("(" + value + ")")));
        				$("#content_text").val(res);
    	            });
            	 }
            	
            	$scope.form.assignURL="";
            	//点击检查按钮触发事件
            	$scope.check=function(){
            		var list = $scope.paramsList;
            		var valuesList=new Array();
            		for(var i=0;i<list.length;i++){
            			if(list[i].PARAMS != key && list[i].PARAMS_TYPE != 2){
            				var value = $("."+list[i].PARAMS).val();
                			var values = {"VALUES":value};
                			values.PK = list[i].PARAMS;
                			valuesList.push(values);
            			}
            		}
            		$scope.form.key = key;
            		if($(".content_text") != "" || $(".content_text") != undefined){
            			$scope.form.content = $(".content_text").val();
            		}
            		$scope.form.valuesList = JSON.stringify(valuesList);
            		$httpService.post(config.getResultURL,$scope.form).success(function(data) {
            			if(data.code != '0000'){
            				loggingService.info(data.data);
            			}else{
            				var res = jsonFormat(JSON.stringify(eval("(" + data.data + ")")));
            				$("#jsonContent").html(res);
            			}
            		}).error(function(data) {
            			loggingService.info("查询接口出错");
            	});
            	}
            	
            	var jsonFormat = function(jsonStr){
            	      var res="";
            	      for(var i=0,j=0,k=0,ii,ele;i<jsonStr.length;i++)
            	      {//k:缩进，j:""个数
            	          ele=jsonStr.charAt(i);
            	          if(j%2==0&&ele=="}")
            	          {
            	              k--;                
            	              for(ii=0;ii<k;ii++) ele="    "+ele;
            	              ele="\n"+ele;
            	          }
            	          else if(j%2==0&&ele=="{")
            	          {
            	              ele+="\n";
            	              k++;            
            	              for(ii=0;ii<k;ii++) ele+="    ";
            	          }
            	          else if(j%2==0&&ele==",")
            	          {
            	              ele+="\n";
            	              for(ii=0;ii<k;ii++) ele+="    ";
            	          }
            	          else if(ele=="\"") j++;
            	          res+=ele;               
            	      }
            	      return res;
            	  }
            	
            }
        ];
    });
}).call(this);
