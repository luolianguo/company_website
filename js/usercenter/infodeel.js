new Vue({
	el:'#wrap',
	data:{

		ifreadonly:true,

		useravatar:'images/518/logo.png',//

		username:"518快运",

		usertel:'',//用户电话

		avatardata:null,

		editmsg:"修改昵称",

		company:"成都团团赚赚科技有限公司",

		beian:"",

		companyadd:"",

		gzhqrcode:"",
		version:"9.99",
		fwtel:"",
	},
	created:function(){
		var accesstoken=globalfunc.getsessionStorage("token");
		var userinfo=globalfunc.getsessionStorage("userinfo");
		if(!accesstoken){
			$("#loginmodel").fadeIn("fast");
			return false;
		}
		userinfo=JSON.parse(userinfo);
		this.usertel=userinfo.mobile;
		this.useravatar=userinfo.headimg;
		this.username=userinfo.username;
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.refreshuerinfo();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		edituname:function(){
			if(this.ifreadonly==true)
			{
				this.ifreadonly=false;
				this.editmsg="确认修改";
				$("#uname").focus();
			}else{
				var accesstoken = globalfunc.getsessionStorage("token");
				var _this = this;
				var load=layer.load();
				globalfunc.Tpost("user/upName", { username: _this.username }, accesstoken,function(res){
					layer.close(load);
			        if (res.errno==0)
			        {
			          var userinfo=globalfunc.getsessionStorage("userinfo");
			          userinfo.username='';
			          layer.msg("修改成功");
			          _this.ifreadonly=true;
			          _this.editmsg="修改昵称";
			          _this.refreshuerinfo();
			        }else{
			          layer.msg("修改失败",{icon:5});
			        }
			    })
			}
		},
		saveavatar:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
			var _this = this;
			globalfunc.Tuploadpost("qiniu/upload",_this.avatardata,accesstoken, function (upres){
        		if(upres.errno==0)
        		{
        			var url=upres.data.url;
        			globalfunc.Tpost("user/upHeadImg", {headimg:url}, accesstoken, function (res){
        				if(res.errno==0)
        				{
        					layer.msg("修改头像成功");
        					_this.refreshuerinfo();
        				}else{
        					layer.msg("修改头像失败",{icon:5});
        				}
        			})
        		}else{
        			layer.msg("图片上传失败请重试");
        		}
        	})
			$(".saveavatarwrap").css("display","none");
		},
		avatarhandle:function(){
			$(".saveavatarwrap").css("display","block");
	        var file = $('#thefile')[0].files[0];
	        var formfile=new FormData();
	        formfile.append('file', file);
	        this.avatardata=formfile;
	        var reader = new FileReader();
	        var _this=this;
      		reader.onload = (data) => {
	        	var res = data.target || data.srcElement
	        	_this.useravatar = res.result;
      		}
      		reader.readAsDataURL(file);
		},
		refreshuerinfo:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
			var _this = this;
			globalfunc.Tget("user/info", "", accesstoken, function (uinfo) {
		        if(uinfo.errno==0)
		        {
		          var userinfo=uinfo.data;
		          globalfunc.setsessionStorage("userinfo",JSON.stringify(userinfo));
		        }else{
		          
		        }
		    })
		},
		getcodemessage:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
			var _this = this;
			var tel = this.usertel;
			if(tel==null||tel=="")
			{
				layer.tips("请输入手机号",'#tel');
			    return false;
			}
			if(this.codemessage!="发送验证码")
			{
				return false;
			}
			if (accesstoken) {
				var userleavetel = globalfunc.getsessionStorage("userinfo").mobile;
				if (userleavetel != null && userleavetel!="")
				{
				    if (userleavetel != tel) {
				        layer.tips("请输入您注册时的手机号",'#tel');
					    return false;
				    }//确保用户输入的手机号码是注册时所用的手机号码
				    globalfunc.post("login/sendSms", { mobile: tel }, function (res) {
				        if(res.errno==0)
				        {
				        	layer.msg("验证码发送成功");
				        }
				        _this.resetgetcode();
				    })

				} else {//可能微信登录的用户没有手机号
					globalfunc.post("login/sendSms", { mobile: tel }, function (res) {
					  	if(res.errno==0)
				        {
				        	layer.msg("验证码发送成功");
				        }
					  	_this.resetgetcode();
					})
				}
			}
		},
		resetgetcode:function(){
			var time = 60;
			var _this=this;
			var times = setInterval(function () {
			  if (time <= 0) {
			    clearInterval(times);
			    _this.codemessage="发送验证码";
			  } else {
			    time = time - 1;
			    var code_msg = '还剩' + time + '秒';
			    _this.codemessage=code_msg;
			  }
			}, 1000)
		},//获取验证码后倒计时60s重新获取
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