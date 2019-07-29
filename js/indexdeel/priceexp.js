new Vue({
	el:'#wrap',
	data:{
		content:'',//价格说明
		beian:"",//公司备案
		company:"",//公司名称
		companyadd:"",//公司地址
		gzhcode:"",//二维码地址
		version:"9.99",
		fwtel:"",
	},
	created:function(){
		this.getdocx();
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		getdocx:function(){
			var _this=this;
		    globalfunc.get("document/getDocument",{id:14},function (res) {
		    	if(res.errno==0)
		    	{
		    		var temp = document.createElement("div"); 
					temp.innerHTML = res.data.content; 
					var output = temp.innerText || temp.textContent; 
					temp = null;
		    		_this.content=output;
		    	}
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
		    		_this.gzhcode=res.data.path;
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