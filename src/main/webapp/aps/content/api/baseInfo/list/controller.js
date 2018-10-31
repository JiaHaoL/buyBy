(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	//查询这个模块的所有接口	
            	$httpService.post(config.findURL,{"MODULE_CODE":'1'}).success(function(data) {
                		console.log(data.data);
                		$scope.interfaceList=data.data;
                		$scope.$apply();
                		$scope.form.INTERFACE_PK = data.data[0].INTERFACE_PK;
                		$scope.change();
    	            });
            	//查询接口跳转的地址
            	$scope.change=function(){
            		if($scope.form.INTERFACE_PK!=null){
            			$httpService.post(config.findByIdURL,{"INTERFACE_PK":$scope.form.INTERFACE_PK}).success(function(data) {
                    		$scope.form.INTERFACE_PATH=data.data.INTERFACE_PATH;
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
    	            });
            	 }
            	
            	
            	//点击检查按钮触发事件
            	$scope.check=function(){
            		var list = $scope.paramsList;
            		var valuesList=new Array();
            		for(var i=0;i<list.length;i++){
            			var value = $("."+list[i].PARAMS).val();
            			var values = {"VALUES":value};
            			values.PK = list[i].PARAMS;
            			valuesList.push(values);
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
