new Vue({
	el:'#wrap',
	data:{
		discounttikects: [],
		company:"成都团团赚赚科技有限公司",

		beian:"",

		companyadd:"",

		gzhqrcode:"",
		version:"9.99",
		fwtel:"",
	},
	created:function(){
		var accesstoken=globalfunc.getsessionStorage("token");
		if(!accesstoken){
			$("#loginmodel").fadeIn("fast");
			return false;
		}
		this.getdetaillist();
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		getdetaillist:function(){
			var accesstoken=globalfunc.getsessionStorage("token");
			var _this = this;
		    if(accesstoken)
		    {
		    	var load=layer.load();
		    	globalfunc.Tget("coupons/couponsList","", accesstoken, function (res) {
					if(res.errno==0)
					{
						layer.close(load);
						var tdata=res.data;
						for(var i=0;i<tdata.length;i++)
						{
							tdata[i].start_time=globalfunc.timetostrnohm(tdata[i].start_time);
							tdata[i].end_time=globalfunc.timetostrnohm(tdata[i].end_time);
						}
						_this.discounttikects=tdata;
					}else{
						layer.close(load);
					}
				})
		    }
		},
		logout:function(){
			layer.confirm('您确定要退出吗？', {icon: 3, title:'提示'}, function(index){
				layer.close(index);
				globalfunc.clearsessionStorage("token");
				globalfunc.clearsessionStorage("userinfo");
				layer.msg("您已退出登录");
				setTimeout(function(){
					window.location.href="./index.html";
				},1000)
			})
		},
		getcompanyinfo:function(){
			var _this=this;
		    globalfunc.get("public/getCompany","",function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.company=res.data;
		    	}
		    }) 
		},
		getbeian:function(){
			var _this=this;
		    globalfunc.get("public/getIcp","",function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.beian=res.data;
		    	}
		    }) 
		},
		getCompanyadd:function(){
			var _this=this;
		    globalfunc.get("public/getCompanyAddress","",function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.companyadd=res.data;
		    	}
		    }) 
		},
		getpageimg:function(){
			var _this=this;
		    globalfunc.get("public/getPic",{key:"gzhcode"},function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.gzhqrcode=res.data.path;
		    	}
		    }) 
		},
		getfwtel:function(){
			var _this=this;
			globalfunc.get("login/fwTel","",function (res) {
				if(res.errno==0)
				{
					_this.fwtel=res.data;
				}
		    }) 
		}
	}
})