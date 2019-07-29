new Vue({
	el:'#wrap',
	data:{
		content:'',//价格说明
		beian:"",//公司备案
		company:"",//公司名称
		companyadd:"",//公司地址
		gzhqrcode:'',//二维码图片
		riderqrcode:"",//游侠端二维码
		picimg:"",//单页banner位置图片
		version:"9.99",
		fwtel:"",
	},
	created:function(){
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getcodeimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
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
		    globalfunc.get("public/getPic",{key:"rangerindex"},function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.picimg=res.data.path;
		    	}
		    }) 
		},
		getcodeimg:function(){
			var _this=this;
		    globalfunc.get("public/getPic",{key:"rangercode"},function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.riderqrcode=res.data.path;
		    	}
		    }) 
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
	},
	watch:{
		sendlat:function(){
			this.getrunprice();
			this.getavaticket();
		},
		receivelat:function(){
			this.getrunprice();
			this.getavaticket();
		},
		bannerlist:function(tnew,told){
		}
	}
});