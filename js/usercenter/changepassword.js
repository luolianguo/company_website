new Vue({
	el:'#wrap',
	data:{
		usertel:null,//用户手机号

		code: null,//验证码

		password: null,//密码

		confirmpwd: null,//再次输入的密码

		codemessage:"发送验证码",
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
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		changepassword:function(){
			var tel=this.usertel;
			var code=this.code;
			var pwd=this.password;
			var cpwd=this.confirmpwd;
			if (pwd == null||pwd=="") {
		      layer.tips("请输入您的新密码",'#chpwd');
		       return false;
		    }
		    if (pwd.length<6) {
		      	layer.tips("密码长度不小于6位",'#chpwd');
		       return false;
		    }
		    if (cpwd == null||cpwd=="") {
		      	layer.tips("请确认您的密码",'#chcompwd');
		       return false;
		    }
		    if(pwd!=cpwd)
		    {
		      layer.msg("两次输入的密码不一致");
		      return false;
		    }
			if (tel==null||tel=="") {
		      layer.tips("请输入手机号",'#chtel');
		      return false;
		    }
		    if (code == null||code=="") {
		      layer.tips("请输入验证码",'#chcode');
		      return false;
		    }
			var data = { mobile: tel, code: code, password1: pwd, password2: cpwd };
			var accesstoken=globalfunc.getsessionStorage("token");
			var _this = this;
		    if(accesstoken)
		    {
		    	var load=layer.load();
		    	globalfunc.post("login/revisePassword",data, function (res) {
			        if (res.errno == 0) {
			        	layer.close(load);
			        	layer.msg("密码修改成功,请重新登录");
			        	setTimeout(function(){
			        		globalfunc.clearsessionStorage("token");
							globalfunc.clearsessionStorage("userinfo");
							window.location.href="./index.html";
			        	},2000)
			        }else{
			        	layer.close(load);
			        	layer.msg(res.errmsg);
			        }
				})
		    }
		},
		getcodemessage:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
			var _this = this;
			var tel = this.usertel;
			if(tel==null||tel=="")
			{
				layer.tips("请输入手机号",'#chtel');
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
				        layer.tips("请输入您注册时的手机号",'#chtel');
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