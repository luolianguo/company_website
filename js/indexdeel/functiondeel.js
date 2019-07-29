const banners=[
{path:"images/518/u1.png"},
{path:"images/518/u2.png"},
{path:"images/518/u5.jpg"},
];
new Vue({
	el:'#wrap',
	data:{
		bannerlist:[],//首页banner
		beian:"",//公司备案
		company:"",//公司名称
		companyadd:"",//公司地址
		appqrcode:"",//快运二维码地址
		riderqrcode:"",//游侠二维码地址
		gzhqrcode:"",//公众号二维码地址
		ridercodeurl:"",
		appcodeurl:"",
		version:"9.99",
		fwtel:"",
	},
	created:function(){
		this.getbanner();
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		getbanner:function(){
			var _this=this;
			$(".logo").css("display","none");
		    globalfunc.CgetNT("public/indexBaner","",function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.bannerlist=res.data;
		    		setTimeout(function(){
			    		_this.bannerrender();
			    		$("#loader").delay(500).fadeOut("slow");
			    		$(".logo").delay(500).fadeIn("slow");
		    		},500)
		    	}else{
		    		_this.bannerlist=banners;
		    		setTimeout(function(){
			    		_this.bannerrender();
			    		$("#loader").delay(500).fadeOut("slow");
			    		$(".logo").delay(500).fadeIn("slow");
		    		},500)
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
		},
		bannerrender:function(){
			$('.bxslider').bxSlider({
			  auto: true,
		      pager:false,
		      controls:true,
		      mode: 'fade',
		      autoHover:true,
		      easing:"easeInQuart"
		    });
		},
		jumpto:function(url){//banner图点击后的事件
			// window.location.href=window.location.href;
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
window.onload=function(){
	var s = document.createElement('script');
	s.src = 'https://map.qq.com/api/js?v=2.exp&libraries=drawing,geometry,autocomplete,convertor&key=DHJBZ-ZQACV-NHQPF-UFOJK-WITU3-GJFFV&callback=initialize';
	document.body.appendChild(s);  
}
function initialize(){
	var geocoder = new qq.maps.Geocoder({
		  complete : function(result){
	  		var province = result.detail.addressComponents.province;
            var city = result.detail.addressComponents.city;
            var country = result.detail.addressComponents.district;
            var accesstoken = globalfunc.getsessionStorage("token");
            if(accesstoken)
            {
            	var data={ localcity: city, localprovice: province, localcounty: country };
            	globalfunc.Tpost("user/saveLocal", data, accesstoken, function (rinfo) {
	            })
            }
	  },
	  error:function(res){

	  }
	});
	var citylocation = new qq.maps.CityService({
	  complete : function(result){
	      if(geocoder)
	      {
	        geocoder.getAddress(result.detail.latLng);
	      }
	  }
	});

	citylocation.searchLocalCity();
}