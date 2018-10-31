(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form={};
            	
            	$scope.initParams =function(){
            		if (params.EXAMID != null & params.EXAMID != "undefined") {
            			$scope.form.EXAMID = params.EXAMID;
					}
            	}
            	
				//初始化考试列表数据
            	$httpService.post(config.findExamListURL).success(function(data) {
   	             	if(data.code != '0000'){
   	             		loggingService.info(data.msg);
   	             	}else{
   	             		$scope.ExamList = data.data;
   	             		$scope.form.EXAMID = $scope.ExamList[0].EXAMID;
   	             		$scope.initParams();
   	             		$scope.examListChange();
   	             	}
            	}).error(function(data) {
                    loggingService.info('获取初始化数据出错');
                });
			            
			            	
            	//获取考试ID下的课程
            	$scope.examListChange =function(){
		        	  var examId={"EXAMID":$scope.form.EXAMID};
		        	  //获取科目
		        	  $httpService.post(config.findStuCourseListURL,examId).success(function(data) {
		                	if(data.code != '0000'){
		                		loggingService.info(data.msg);
		                	}else{
		                		$scope.CourseList = data.data;
		                		if ($scope.CourseList.length>0) {
		                			$scope.form.FK_COURSE = $scope.CourseList[0].FK_COURSE;
								}
		                		$scope.$apply();
		                		PAGE.iniPage($scope);
		                	}
		
		                 }).error(function(data) {
		                     loggingService.info('获取科目出错');
		                 });
		        	  
		        	  var examId={"ExamId":$scope.form.EXAMID};
		        	  //获取班级
		        	  $httpService.post(config.findExamClassListURL,examId).success(function(data) {
		                	if(data.code != '0000'){
		                		loggingService.info(data.msg);
		                	}else{
		                		$scope.classList = data.data;
		                		$scope.$apply();
		                	}
		
		                 }).error(function(data) {
		                     loggingService.info('获取科目出错');
		                 });
	         	  } 

				$scope.select = function() {
					$scope.page.current = 1;
					$scope.find();
				};

	
				$scope.intFindScoreSum = function() {
					$httpService.post(config.findScoreSumListURL,
							{EXAMID:$scope.form.EXAMID,FK_COURSE:$scope.form.FK_COURSE}).success(function(data) {
						if (data.code != '0000') {
							loggingService.info(data.msg);
						} else {
							$scope.scoreSums = data.data;
							$scope.$apply();
						}
					});
				};

				//导出
				eventBusService.subscribe(controllerName, controllerName+'.export', function(event, ojb) {
					$httpService.post(config.findPrimaryExamstuSumScoreURL,$scope.form).success(function(data) {
						if(data.code != '0000'){
							loggingService.info(data.msg);
						}else{
							var m2 = {
								"url" : "aps/content/exam/ScoreSumAnalysis/exportSumScoreExcel/config.json?fileName="+data.data,
								text : "Excel导出",
								"contentName" : "modal"
							}
							eventBusService.publish(controllerName,'appPart.load.modal',m2);
						}
					}).error(function(data) {
						loggingService.info('导出分项成绩出错');
					});
				})
					

				$scope.find = function() {
					$scope.intFindScoreSum();
					$scope.form.page = JSON.stringify($scope.page);
					 $httpService.post(config.findSubmitExaminfoURL,$scope.form).success(function(data) {
		                	if(data.code != '0000'){
		                		loggingService.info(data.msg);
		                	}else{
		                		for (var int = 0; int < data.data.length; int++) {
									data.data[int].scores = [];
									var scoreList = [];
									var scoreDeailList = [];
									var nameList = [];
									
									if (data.data[int].SCORESUMNAME != undefined && data.data[int].SUMSCORE >= 0) {
										nameList = data.data[int].SCORESUMNAME.split(",");
										scoreList = data.data[int].SCORE.split(",");
										scoreDeailList = data.data[int].SCOREDETAIL.split(",");
									}
									
									for (var j = 0; j < $scope.scoreSums.length; j++) {
										data.data[int].scores[j] = {};
										for (var k = 0; k < nameList.length; k++) {
											if ($scope.scoreSums[j].SCORESUMNAME === nameList[k]) {
												data.data[int].scores[j].key = nameList[k];
												data.data[int].scores[j].value = scoreList[k];
												data.data[int].scores[j].number = scoreDeailList[k];
											}
										}
									}

								}
								$scope.dataList = data.data;
								PAGE.buildPage($scope,data);
		                	}
		
		                 }).error(function(data) {
		                     loggingService.info('获取分项成绩出错');
		                 });
				};

							
            }];
    });
}).call(this);
