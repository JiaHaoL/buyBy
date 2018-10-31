(function() {
    define([], function() {
        return [
            '$scope','$location','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$location,$httpService,config, eventBusService,controllerName,loggingService) {
            	
            	$httpService.post(config.getUserInfoURL, {}).success(function(data) {
            		$scope.userInfo = data.data;
        			$scope.$apply();
	            });
            	
            	//获取菜单数据列表
            	$httpService.post(config.menuListData, {"MENU_CODE":"000078"}).success(function(data) {
            		console.log(data);
            		$scope.menuData = data.data;
            		$scope.$apply();
	            });
            	
            	$scope.searchMenuUp = function() {
            		if(null != $scope.searchMenu || "" != $scope.searchMenu){
            			$("#"+controllerName+" .searchMenuList").show();
            		}
            	}
            	
            	var currentMenu;	//当前菜单
            	/*$scope.clickMenu = function(menu) {
            		$("#"+controllerName+" .searchMenuList").hide();
            		console.log(menu);
            		$scope.currentMenu = menu;
            		
            		//给当前菜单设置样式
            		$("#sidebar a").removeClass("active");
                	$("#"+controllerName+" .menuPk-"+menu.MENU_PK).addClass("active");
                	
                	if(currentMenu != null && currentMenu.MENU_PK != menu.MENU_PK){
                    	$("#"+controllerName+" .menuPk-"+currentMenu.MENU_PK).removeClass("active");
                	}
            		currentMenu = menu;
            		
            		//根据导航节点判断加载模块
            		var changeControllerData = {
            			url:menu.MENU_LINK,
  	                  	contentName:"content",
  	                  	hasButton:"right",
  	                  	data:menu
  	                }
          	        return eventBusService.publish(controllerName,'appPart.load.content', changeControllerData);
	            };*/
	            
            	$scope.clickMenu = function(menu) {
            		var data = {};
            		data.MENU_PK = "none";
            		if(menu == "1"){
            			var m2 = {
        						"url" : "aps/content/statistics/config.json",
        						text:"应用统计",
        						size:"modal-lg",
        						"contentName" : "content"
        					}
        					eventBusService.publish(controllerName,'appPart.load.content', m2);
            		}else if(menu == "2"){
            			var m2 = {
        						"url" : "aps/content/scanning/config.json",
        						text:"流量攻击扫描",
        						size:"modal-lg",
        						"contentName" : "content"
        					}
        					eventBusService.publish(controllerName,'appPart.load.content', m2);
            		}
            		
            		
	            };
            	
	            //收藏夹
	            $scope.myFavorite = function() {
	            	var m2 = {
						"url" : "aps/content/testQuestionManage/favorite/config.json",
						"contentName" : "content"
					}
					eventBusService.publish(controllerName,'appPart.load.content', m2);
	            }
	            
            	$scope.logout = function(){
            		window.location.href = "logout.jsp?rand="+Math.random();
            	}
            	
            	
            	
            }
        ];
    });
}).call(this);
