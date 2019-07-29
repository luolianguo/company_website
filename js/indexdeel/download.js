new Vue({
	el:'#wrap',
	data:{
		content:'',//价格说明
		beian:"",//公司备案
		company:"",//公司名称
		companyadd:"",//公司地址
		appqrcode:"",//快运二维码地址
		riderqrcode:"",//游侠二维码地址
		gzhqrcode:"",//公众号二维码地址
		ridercodeurl:"",
		appcodeurl:"",
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
		    globalfunc.get("public/getPic",{key:"downloadindex"},function (res) {
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
		    		_this.ridercodeurl=res.data.url;
		    	}
		    }) 
		    globalfunc.get("public/getPic",{key:"clientcode"},function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.appqrcode=res.data.path;
		    		_this.appcodeurl=res.data.url;
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