(function() {
	require.config({
		baseUrl : './',
		urlArgs: "v=6",
		paths : {
			jquery : 'https://cdn.sjedu.cn/js/jquery/1.11.3/jquery.min',
			jqueryUi : 'https://cdn.sjedu.cn/js/jqueryUi/js/jquery-ui-1.9.2.custom.min',
			jqueryUiZh : 'https://cdn.sjedu.cn/js/jqueryUi/jqueryUi_ZH',
			jqueryForm : 'https://cdn.sjedu.cn/js/jqueryForm/jquery.form',
			
			bootstrap : 'https://cdn.sjedu.cn/js/bootstrap/3.3.4/js/bootstrap.min',
			
			jztree : 'https://cdn.sjedu.cn/js/zTree/js/jquery.ztree.all-3.5.min',
			smartMenu : 'https://cdn.sjedu.cn/js/jquerySmartMenu/js/jquery-smartMenu-min',
			jqueryUpload : 'https://cdn.sjedu.cn/js/jqueryUpload/jquery.upload',
			
			umeditorConfig : 'https://cdn.sjedu.cn/js/umeditor/umeditor.config',
			umeditorMin : 'https://cdn.sjedu.cn/js/umeditor/umeditor',
			umeditorLang : 'https://cdn.sjedu.cn/js/umeditor/lang/zh-cn/zh-cn',
			
			jwplayer2:"see_live/jwplayer/jwplayer",
			jwplayer:"jwplayer/jwplayer",
			videourl:"https://cdn.sjedu.cn/js/util-video/video.util",
	        flexpaper:"js/FlexPaper/flexpaper_flash",
	        
			highcharts: 'https://cdn.sjedu.cn/js/highcharts/highcharts',
			highchartsMore: 'https://cdn.sjedu.cn/js/highcharts/highcharts-more',
			highcharts3D: 'https://cdn.sjedu.cn/js/highcharts/highcharts-3d',
			
			date: 'https://cdn.sjedu.cn/js/bootstrap-daterangepicker/date',
			daterangepicker: 'https://cdn.sjedu.cn/js/bootstrap-daterangepicker/daterangepicker',
			bootstrapDatetimepicker : 'https://cdn.sjedu.cn/js/bootstrap-datetimepicker/js/bootstrap-datetimepicker',
			bootstrapDatetimepickerZhCn : 'https://cdn.sjedu.cn/js/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',
			
			pageController: 'https://cdn.sjedu.cn/js/page',
			validateController: 'https://cdn.sjedu.cn/js/validate',
			
			swfObject: 'https://cdn.sjedu.cn/js/jquery.uploadify-v2.1.0/swfobject',
			jqueryUploadify: 'https://cdn.sjedu.cn/js/jquery.uploadify-v2.1.0/jquery.uploadify.v2.1.0.min',
			uploadConntrolle: 'https://cdn.sjedu.cn/js/upload',
			
			datetimepicker: 'assets/js/bootstrap-datetimepicker',
			datetimepickerFr: 'assets/js/bootstrap-datetimepicker.fr',	
				
			upload:'assets/js/upload',
			uploadauto:'js/uploadauto',
			uploadify:'js/jquery.uploadify-v2.1.4/jquery.uploadify.v2.1.4.min',
			swfobject:'js/jquery.uploadify-v2.1.4/swfobject',
			uploadauto:"js/uploadauto",
			uploadautoMore:"js/uploadautoMore"

		},
		shim : {
			highchartsMore : {
				deps : [ 'highcharts' ],
				exports : 'highchartsMore'
			},
			bootstrap : {
				deps : [ 'jqueryForm' ],
				exports : 'bootstrap'
			},
			daterangepicker : {
				deps : [ 'date' ],
				exports : 'daterangepicker'
			},
			umeditorMin : {
				deps : [ 'umeditorConfig' ],
				exports : 'umeditorMin'
			},
			jqueryUiZh : {
				deps : [ 'jqueryUi'],
				exports : 'jqueryUiZh'
			},
			bootstrapDatetimepicker : {
				deps : [ 'jqueryUi'],
				exports : 'bootstrapDatetimepicker'
			},
			bootstrapDatetimepickerZhCn: {
				deps : [ 'bootstrapDatetimepicker'],
				exports : 'bootstrapDatetimepickerZhCn'
			},
			umeditorLang : {
				deps : [ 'umeditorMin' ],
				exports : 'umeditorLang'
			}
		}
		
	});
	

	require(['bootstrap','pageController','validateController'], function() {
		if(!window.console){
			console = (function(){
				var instance = null;
				function Constructor(){
					this.div = document.createElement("console");
					this.div.id = "console";
					this.div.style.cssText = "filter:alpha(opacity=80);position:absolute;top:100px;right:0px;width:30%;border:1px solid #ccc;background:#eee;display:none";
					document.body.appendChild(this.div);
					//this.div = document.getElementById("console");
				}
				Constructor.prototype = {
					log : function(str){
						var p = document.createElement("p");
						p.innerHTML = "LOG: "+str;
						this.div.appendChild(p);
					},
					debug : function(str){
						var p = document.createElement("p");
						p.innerHTML = "DEBUG: "+str;
						p.style.color = "blue";
						this.div.appendChild(p);
					},
					error : function(str){
						var p = document.createElement("p");
						p.innerHTML = "ERROR: "+str;
						p.style.color = "red";
						this.div.appendChild(p);
					}
				}
				function getInstance(){
					if(instance == null){
						instance =  new Constructor();
					}
					return instance;
				}
				return getInstance();
			})()
		}
	});
	
})(this);