(function() {
    define([], function() {
        return [
                '$scope','httpService','config','params','eventBusService','controllerName','$location','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,$location,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	
            	$httpService.css("assets/css/zTreeStyle/zTreeStyle.css?v=6");
            	$scope.form = {};
                var type=1;
                var treeid ='ff8080811c9875e7011c9892deca000c';
            	var leval = 1;
                var uploadapp = "xueke";
                var contentlist;
                $scope.text = "学科教育"; 
                var contenttype = '1,2,3,4,5';
                var contenttypetitle = null;
                var parentid=null;
                
                $scope.he = function(obj){
                	var str = obj.IDENTIFIER.split("/");
                	var path="/";
                	str[1] = str[1] + "/data";
                	for(var i = 0;i<str.length;i++){
                		path = path+str[i]+"/";
                	}
                	path = path.replace("//","/");
                	path = "http://rescenter.sjedu.cn"+path.substring(0,path.length-1);
                	console.log(path);
                	//window.android.downloadFile(path,obj.FILE_ID,obj.ORI_FILENAME);
                	window.android.downloadFile(path,obj.FILE_ID,obj.ORI_FILENAME);
                }
                /**
                 * 根据名称查询
                 */
               $scope.searcher = function(){
            	   $scope.find();
               }
                
                /**
                 * 修改资源
                 */
                eventBusService.subscribe(controllerName, controllerName+'.update', function(event, btn) {
                	var ids="";
                	$('input[name="res_checkbox"]:checked').each(function(){
                        var id=$(this).val();
                        id=id.split("_");
                        ids = ids+id[0]+",";
                    });
                	ids = ids.substring(0,ids.length-1);
                	var str = ids.split(",");
                	if(str.length>1){
                		alert("只能选择一个进行修改");
                		return;
                	}
                	if(ids ==null || ids==""){
                		alert("请先选择要修改的资源！");
                		return;
                	}
            		var changeControllerData = {
      	                  url:"aps/content/jxzy/update/config.json",
      	                  contentName:"content",
      	                  resid:ids,
      	                contentlist:contentlist,
      	                  uploadapp:uploadapp,
      	                treeid:treeid,
      	                leval:leval
      	                }
      	                eventBusService.publish(controllerName,'apppart.load.content.resattr.update', changeControllerData);
              	    $('#myModal_update').modal('show');
                	
	            });
                /**
                 * 删除
                 */
                eventBusService.subscribe(controllerName, controllerName+'.delete', function(event, btn) {
            		var ids="";
            		var title = "";
            		var resattrpk="";
                	$('input[name="res_checkbox"]:checked').each(function(){
                        var id=$(this).val();
                        id=id.split("_");
                        resattrpk = resattrpk+id[0]+",";
                        ids = ids+"'"+id[1]+"',";
                        title = title+id[2]+",";
                    });
                	ids = ids.substring(0,ids.length-1);
                	title = title.substring(0,title.length-1);
                	resattrpk = resattrpk.substring(0,resattrpk.length-1);
                	$httpService.post(config.delurl, {
                		"ids":ids,
                		"title":title,
                		"resattrpk":resattrpk
                	}).success(function(data) {
                		$scope.find();
    	            });
	            });
                
                /**
                 * 分享
                 */
                $scope.shareclick = function(){
                	var m2 = {
		                    "url":"aps/content/jxzy/resattrshare/config.json?uploadapp="+uploadapp+"&treeid="+treeid+"&leval="+leval,
		                    size:"modal-lg",
		                    text:"分享资源",
	  	                    size:"modal-lg",
	  	                    icon:"file",
      	                  	"contentName":"modal"
      	            }   
	                eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	
                } 
                
                /**
                 * 查看
                 */
                $scope.viewclick = function(obj){
                	var m2 = {
		                    "url":"aps/content/jxzy/view/config.json?resid="+obj.RES_ATTR_PK+"&uploadapp="+uploadapp,
		                    size:"modal-lg",
		                    text:obj.TITLE,
	  	                    size:"modal-lg",
	  	                    icon:"file",
      	                  	"contentName":"modal"
      	            }   
	                eventBusService.publish(controllerName,'appPart.load.modal', m2);
                }
                
                /**
                 * 上传
                 */
                $scope.uploadclick = function(){
                	var m2 = {
		                    "url":"aps/content/upload/config.json?uploadapp="+uploadapp+"&treeid="+treeid+"&leval="+leval+"&contenttype="+contenttype,
		                    size:"modal-lg",
		                    text:"上传资源",
	  	                    size:"modal-lg",
	  	                    icon:"file",
      	                  	"contentName":"modal"
      	            }   
	                eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	
                	
                
                }
                
                
                
                //获取按钮数据列表
                $scope.CheckControllerName = controllerName;
            	$httpService.post(config.menuButtonListData, {}).success(function(data) {
            		$scope.buttonData = data.data;
            		$scope.$apply();
	            });
            	//权限按钮点击事件
	            $scope.clickButton = function(btn) {
	                eventBusService.publish(controllerName,btn.BUTTON_LINK, btn);
	            };
                
                var nodec1 = null;
	            var nodec2 = null;
	            var nodec3 = null;

	            $scope.shaixuanclick1= function (node) {
	            	if(null != nodec1){
	            		nodec1.isSelect = null;
	            	}
	            	if(null != nodec2){
	            		nodec2.isSelect = null;
	            		nodec2=null;
	            	}
	            	if(null != nodec3){
	            		nodec3.isSelect = null;
	            		nodec3=null;
	            	}
	            	node.isSelect = "seled";
	            	nodec1 = node;
	            	treeid=node.G_ID;
	            	
            		leval=2;
            		$scope.find();
            		getSubject();
	            	getsubjectforztree();
	            	$("#all3").attr("class", "seled");
	            	$("#all2").attr("class","seled");
	            	
	            }
	            
	            
	            $scope.shaixuanclick2= function (node) {
	            	if(node==2){//点击全部
	            		$("#all2").attr("class","seled");
	            		nodec2.isSelect="";
	            		nodec2=null;
	            		treeid = nodec1.G_ID;
	            		$scope.find(treeid,null);
	            		getsubjectforztree();
	            		return;
	            	}
	            	$("#all2").attr("class","");
	            	if(null != nodec2){
	            		nodec2.isSelect = null;
	            		
	            	}
	            	node.isSelect = "seled";
	            	nodec2 = node;
	            	treeid = node.G_ID;
	            	$scope.find(treeid,null);
	            	getsubjectforztree();
	            }
	            $scope.shaixuanclick3= function (node) { 
	            	if(node==3){
	            		$("#all3").attr("class","seled");
	            		nodec3.isSelect="";
	            		nodec3=null;
	            		treeid = nodec1.G_ID;
	            		$scope.find(treeid,null);
	            		getsubjectforztree();
	            		return;
	            	}
	            	$("#all3").attr("class","");
	            	if(null != nodec3){
	            		nodec3.isSelect = null;
	            	}
	            	node.isSelect = "seled";
	            	nodec3 = node;
	            	treeid = node.G_ID;
            		$scope.find(treeid,null);
            		getsubjectforztree();
	            }
                
                /**
	             * 得到内容类型
	             */
	            var getContenttype=function(){
	            	$httpService.post(config.findContentTypeurl, {
                            "ids":contenttype,
                            "type":1,
                            "treeid":treeid
                    }).success(function(data) {
                    	contentlist = data.data;
        	            $scope.contentlist = data.data;
        	            $scope.$apply();
                    }).error(function(data) {
                        loggingService.info('获取内容类型出错');
                    });
	            }
	            /**
	             * 点击选项卡事件
	             */
	            var tab=null;
	            $scope.tabClick= function(obj){
	            	$scope.page.current = 1;
	            	if(obj==1){
	                    $("#content_all").attr("class","active");
	                    if(tab !=null){
	            			tab.isSelect=null;
	            		}
	            	}else{
	            		if(tab !=null){
	            			tab.isSelect=null;
	            		}
	            		$("#content_all").attr("class","");
	            		tab = obj;
	            		obj.isSelect = "active";
	            	}
	            	contenttypetitle = obj.TITLE;
            		$scope.find();
	                
	            }
                
	            /**
                 * 重新加载
                 */
                eventBusService.subscribe(controllerName, 'appPart.load.resattr.reload', function(event, m2) {
                	$scope.find();
                });
	            
	            
	            
                /**
                 * 得到资源列表
                 */
                $scope.find = function() {
                	    $scope.form.treeid = treeid;
                	    $scope.form.type = 1;
                	    $scope.page.number = 8;
                	    $scope.form.page = JSON.stringify($scope.page);
                	    $scope.form.contenttype = contenttypetitle;
	            		$httpService.post(config.findbysubjecturl, $scope.form).success(function(data) {
	                    	if(data.code != '0000'){
	                    		loggingService.info(data.msg);
	                    	}else{
	                    		
	                    		var resattrList = data.data;
	                    		for(i=0;i<resattrList.length;i++){
	                    			var bgurl=data.data[i].IDENTIFIER;
	                    			var extname = data.data[i].EXTNAME;
	                    			if(data.data[i].TITLE.length>8){
	                    				data.data[i].TITLE = data.data[i].TITLE.substring(0,8)+"...";
	                            	}
	                    			if(bgurl !=undefined){
	                    				if(extname=='doc' || extname == 'pdf'|| extname=='docx' || extname=='ppt' || extname=='pptx' || extname=='xls' || extname=='xlsx'){
	                    					if(data.data[i].FILE_STATUS==100){
	    	                					bgurl = bgurl.replace("/ResCenter/ResourceData", "/Thumbnail/L_Thumbs");
	    	                    				var str = bgurl.split("/");
	    	                    				var extname =data.data[i].EXTNAME;
	    	                    				bgurl = bgurl.replace("/"+str[3], "");
	    	                    				bgurl = bgurl.replace("."+extname, ".jpg"); 
	    	        	                		bgurl = "data"+bgurl;
	    	                				}else{
	    	                					bgurl = "assets/img/doc_default.jpg";
	    	                				}
	                    				}else if(extname=='mp4'){
	                    					bgurl = bgurl.replace("/ResCenter/ResourceData/MP4", "/ConvertJPG");
	                    					bgurl = bgurl.replace("mp4", "jpg");
	                    					bgurl = "data"+bgurl;
	                    				}else{
	                    					bgurl = "assets/img/default.jpg";
	                    				}
	                    			}
	    	                		data.data[i].bgurl = bgurl;
	                    		}
	                    		
	                            $scope.resattrlist = data.data;
	                            for(var i=0;i<$scope.resattrlist.length;i++){
	                            	var obj = $scope.resattrlist[i];
	                            	if(obj.TITLE.length>8){
	                            		$scope.resattrlist[i].TITLE = obj.TITLE.substring(0,8)+"...";
	                            	}
	                            }
	                            $scope.$apply();
	                            PAGE.buildPage($scope,data);
	                            
	                    	}
	                    }).error(function(data) {
	                        loggingService.info('查询失败！');
	                    });
                
	            };
                
	            /**
	             * 多条件筛选
	             */
	            var getSubject=function(){
	            		$httpService.post(config.findxkmoreurl, {
                            "treeid":treeid,
                            "leval":1
	                    }).success(function(data) {
	        	            $scope.firstList = data.data.firstList;
	        	            $scope.secondList = data.data.secondList;
	    	            	var second = data.data.secondList;
	        	            if(second.length>0){
	        	            	nodec2 = data.data.firstList[0];
	        	            }	   
	        	            if(uploadapp=="xueke" && data.data.secondList.length<=1){
	        	            	$("#version").hide();
	        	            }
	        	           
	        	            $("#sxcontent").hide();
	        	            $scope.thirdList = data.data.thirdList;
	        	            var firstList = data.data.firstList;
	        	            var secondList = data.data.secondList;
	        	            var thirdList = data.data.secondList;
	        	            if(firstList.length>0 && (secondList.length>0 || thirdList.length>0)){
	        	            	$("#btn_upload").hide();
	        	            }else{
	        	            	$("#btn_upload").show();
	        	            }
	        	            if(leval==2 && thirdList.length<=0){
	        	            	$("#btn_upload").show();
	        	            }
	        	            if(leval!=3){
	        	            	var subject = data.data.firstList;
		        	            for(var i=0;i<subject.length;i++){
			            			if(subject[i].G_ID==treeid){
			            			  parentid = subject[i].G_PID;
			  	            		  nodec1 = data.data.firstList[i];
				            		  subject[i].isSelect = "seled";
			            			} 
		    	            		 	
		        	            }
	        	            	$("#all2").attr("class", "seled");
	        	            }else{
	        	            	var subject = data.data.secondList;
		        	            for(var i=0;i<subject.length;i++){
			            			if(subject[i].G_ID==treeid){
			            			  parentid = subject[i].G_PID;
			            			  var subjectparent = data.data.firstList;
			            			  for(var j=0;j<subjectparent.length;j++){
					            			if(subjectparent[j].G_ID==parentid){
					  	            		  nodec1 = data.data.firstList[j];
					  	            		  subjectparent[j].isSelect = "seled";
					            			} 
				    	            		 	
				        	            }
			  	            		  nodec2 = data.data.secondList[i];
				            		  subject[i].isSelect = "seled";
			            			} 
		    	            		 	
		        	            }
	        	            }
	        	            
	        	            $scope.$apply();
	                    }).error(function(data) {
	                        loggingService.info('获取资源出错');
	                    });
	            		
//	            	}
	            	
	            	
	            	
	            }
	            
	            /**
	             * 得到树节点数据
	             */
	            var zNodes;
	            var getsubjectforztree = function(){
	            	$httpService.post(config.getSubjectSortbypidURL, {
	               	     "G_PID":treeid
	                }).success(function(data) {
	                	if(data.code == '0000'){
	                		zNodes = data.data;
	                		
	                		for(i=0;i<zNodes.length;i++){
	                			if(i==0){
	                				zNodes[i].open=true;
	                			}
	                			if(zNodes[i].G_ISLEAF==1){
	                				zNodes[i].isParent=true;
	                			}else{
	                				zNodes[i].isParent=false;
	                			}
	                			zNodes[i].name = zNodes[i].G_NODE_TEXT;
	                			zNodes[i].id= zNodes[i].G_ID;
	                			zNodes[i].pid=zNodes[i].G_PID;
	                			
	                		}
	                		if(zNodes!=undefined && zNodes.length > 0){
	                			$("#"+controllerName+" .leftMenu").show();
	                			var t = $("#subtree");
		                		t = $.fn.zTree.init(t, setting, zNodes);
		    	        		var zTree = $.fn.zTree.getZTreeObj("subtree");
	                		}else{
	                			$("#"+controllerName+" .leftMenu").hide();
	                		}
	                		
	                	}else{
	                		console.log("数据请求失败，"+data.msg);
	                	}
	                }).error(function(data) {
	                	console.log("加载数据异常，请求异常");
	                });  
			           
		            } 
	            
	            
	            var init = function(){
	            	getsubjectforztree();
		            getSubject();
		            getContenttype();
		            if(uploadapp=="xueke"){
//		            	$scope.text1 = "科目";
//		            	$scope.text2 = "版本";
//		            	$scope.text3 = "年级";
		            	$scope.text1 = "学段";
		            	$scope.text2 = "科目";
		            	$scope.text3 = "年级";
		            }else{
		            	$scope.text1 = "学段";
		            	$scope.text2 = "内容";
		            	$scope.text3 = "内容";
		            }
		            
		            //
//		            $httpService.post(config.UserGetRolesURL,{
//                	}).success(function(data) {
//                    	if(data.code == '0000'){
//                    	    var roles = data.data;
//                    	    var url =  config.teacherAppPartSrc;
//                    	    for(var i=0;i<roles.length;i++){
//                    	    	if(roles[i].ROLE_PK =="b170ead8bbe64817a1e2b54dc0ca7be5"){
//                    	    		$("#"+controllerName+" .subject_button").show();
//                    	    		break;
//                    	    	}
//                    	    }
//                    	    $scope.$apply();
//                    	}else{
//                    		console.log("请求查找角色失败,"+data.msg);
//                    	}
//                    }).error(function(data) {
//                    	console.log("请求查找角色异常,"+data);
//                    });
		            
		            
		           
	            }
	            init(); 
	            
	            PAGE.iniPage($scope);
	            
	            var flag;
	            var zTree;
	        	var setting = {
	        			async: {
	        				enable: true,
	        				url:"json/Open_queryForList_getSubjectSortbypid.json",
	        				otherParam: { "token":$location.search()["token"]},
	        				autoParam:["id=G_PID"],
	        				dataFilter: filter
	        			},
	        			view: {
	        				dblClickExpand:true,
	        				showLine: true,
	        				selectedMulti: false
	        			},
	        			data: {
	        				simpleData: {
	        					enable:true,
	        					idKey: "id",
	        					pIdKey: "pid",
	        					rootPId: ""
	        				}
	        			},
	        			callback: {
	        				onClick: function(event,treeId, treeNode) {
	        					treeid= treeNode.id;
	        					$scope.find(treeNode.id,1);
	        					   if(treeNode.isParent==false){
	        						  $("#btn_upload").show();
	        					   }else{
	        						  $("#btn_upload").hide();
	        					   }
	        					   zTreeOnClick(event, treeId, treeNode);
	        					 return true;
	        				}
	        			}
	        		};
	        	function zTreeOnClick(event, treeId, treeNode) {
	        		var treeObj = $.fn.zTree.getZTreeObj("subtree");
	        		var nodes = treeObj.getSelectedNodes();
	        		if (treeNode.open == false) {
	        			treeObj.expandNode(nodes[0], true, false, true);
	        		}else if(treeNode.open){
	        			treeObj.expandNode(nodes[0], false, true, true);
	        		}
	        		
	        	}
	        	
	        	function filter(treeId, parentNode, childNodes) {
	        		childNodes = childNodes.data;
	        		for(i=0;i<childNodes.length;i++){
	        			if(childNodes[i].G_ISLEAF==1){
	        				childNodes[i].isParent=true;
	        			}else{
	        				childNodes[i].isParent=false;
	        			}
	        			childNodes[i].name = childNodes[i].G_NODE_TEXT;
	        			childNodes[i].id= childNodes[i].G_ID;
	        			childNodes[i].pid=childNodes[i].G_PID;
            		}
	    			return childNodes;
	    		}
	            
	            
            	
            }
        ];
    });
}).call(this);
