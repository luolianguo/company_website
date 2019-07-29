$(function(){
	if(globalfunc.getsessionStorage("token"))
	{
		$(".logreg").css("display","none");
	}
	var login=function(){
		var account=$("#account").val();
		var pwd=$("#pwd").val();
		if(account=="")
		{
			layer.tips("手机号不能为空",'#account');
			return false;
		}
		if(validatemobile(account)==false)
		{
			return false;
		}
		if(pwd=="")
		{
			layer.tips("密码不能为空",'#pwd');
			return false;
		}
		globalfunc.post("login/login",{mobile:account,password:pwd},function(res){
			if(res.errno==0)
			{
				globalfunc.setsessionStorage("userinfo",JSON.stringify(res.data.userinfo));
				globalfunc.setsessionStorage("token",res.data.token);
				layer.msg('登录成功'); 
				$("#loginmodel").fadeOut("fast");
				window.location.href=window.location.href;
			}else if(res.errno==1){
				layer.msg(res.errmsg,{icon:5});
			}else if(res.errno==2)
			{
				layer.msg("您尚未设置密码，请设置密码",{icon:6});
				$(".forget").css("display","block");
				$(".switchnav").css("display","none");
				$(".logandreg").css("display","none");
				$("#findpwd").css("display","block");
			}
		})
	};
	var getcodemessage=function(telnumber,tp){
		var tel=telnumber;
		var tp=tp;
		if(tel=="")
		{
			if(tp==0)
			{
				layer.tips("请输入手机号",'#tel');
			}else{
				layer.tips("请输入手机号",'#fdtel');
			}
		    return false;
		}
		else {
			globalfunc.post("login/sendSms", { mobile: tel }, function (res) {
			  	if(res.errno==0)
			    {
			    	layer.msg("验证码发送成功");
			    	resetgetcode(tp);
			    }
			})
		}
	};
	var resetgetcode=function(tp){
		var time = 60;
		var _this=this;
		var times = setInterval(function () {
		  if (time <= 0) {
		    clearInterval(times);
		    if(tp==0)
		    {
		    	$("#getcode").text("发送验证码");
		    }else{
		    	$("#getfdcode").text("发送验证码");
		    }
		  } else {
		    time = time - 1;
		    var code_msg = '还剩' + time + '秒';
		    if(tp==0)
		    {
		    	$("#getcode").text(code_msg);
		    }else{
		    	$("#getfdcode").text(code_msg);
		    }
		  }
		}, 1000)
	};//获取验证码后倒计时60s重新获取
	var regist=function(){
		var tel=$("#tel").val();
		var code=$("#code").val();
		var repwd=$("#repwd").val();
		var rptpwd=$("#rptpwd").val();
		if(tel=="")
		{	
			layer.tips("请输入您的手机号",'#tel');
			return false;
		}
		if(validatemobile(tel)==false)
		{
			return false;
		}
		if(code=="")
		{
			layer.tips("请输入您的验证码",'#code');	
			return false;
		}
		if(repwd=="")
		{
			layer.tips("请输入密码",'#repwd');	
			return false;

		}
		if(repwd.length<6)
		{
			layer.tips("密码长度不得小于6位",'#repwd');	
			return false;
		}
		if(rptpwd=="")
		{
			layer.tips("请重复您的密码",'#rptpwd');	
			return false;
		}
		if(repwd!=rptpwd)
		{
			layer.msg("两次输入的密码不一致",{icon:5});	 
			return false;
		}
		var data={code:code,mobile:tel,password:repwd};
		globalfunc.post("login/reg", data, function (res) {
		  	if(res.errno==0)
		    {
		    	layer.msg("注册成功");	 
		    	$("#account").val(tel);
		    	$(".logreg .switchnav .log").addClass("active");
		    	$(".logreg .switchnav .reg").removeClass("active");
				$(".logreg .content ul").css("transform","translateX(0)");
		    }else{
		    	layer.msg("注册失败, "+res.errmsg,{icon:5});	 
		    }
		})
	};
	var findpwd=function(){
		var tel=$("#fdtel").val();
		var code=$("#fdcode").val();
		var repwd=$("#fdpwd").val();
		var rptpwd=$("#rptfdpwd").val();
		if(tel=="")
		{
			layer.tips("请输入您的手机号",'#fdtel');	
			return false;
		}
		if(validatemobile(tel)==false)
		{
			return false;
		}
		if(code=="")
		{
			layer.tips("请输入您收到的验证码",'#fdcode');		
			return false;
		}
		if(repwd=="")
		{
			layer.tips("请输入密码",'#fdpwd');		
			return false;
		}
		if(repwd.length<6)
		{
			layer.tips("密码长度不得小于6位",'#fdpwd');	
			return false;
		}
		if(rptpwd=="")
		{
			layer.tips("请重复您的密码",'#rptfdpwd');
			return false;
		}
		if(repwd!=rptpwd)
		{
			layer.msg("两次输入的密码不一致",{icon:5});	 
			return false;
		}
		var data={code:code,mobile:tel,password1:repwd,password2:rptpwd};
		globalfunc.post("login/revisePassword", data, function (res) {
		  	if(res.errno==0)
		    {
		    	layer.msg("密码重置成功");	
		    	$("#account").val(tel);
		    	$(".logreg .switchnav .log").addClass("active");
		    	$(".logreg .switchnav .reg").removeClass("active");
				$(".logreg .content ul").css("transform","translateX(0)");
				$(".forget").css("display","none");
				$(".switchnav").css("display","block");
				$(".logandreg").css("display","block");
				$("#findpwd").css("display","none");
		    }else{
		    	layer.msg(res.errmsg,{icon:5});	 
		    }
		})
	}
	var validatemobile=function (mobile) {
		mobile+="";
		if (mobile.length == 0) {
			layer.msg("手机号长度有误");
		  	return false;
		}
		if (mobile.length != 11) {
			layer.msg("手机号长度有误");
		  	return false;
		}
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (!myreg.test(mobile)) {
			layer.msg("请输入正确的手机号");
		  	return false;
		}
		return true;
	}
	$("#regsubmit").click(function(){
		regist();
	})
	$("#fdsubmit").click(function(){
		findpwd();
	})
	$("#getcode").click(function(){
		var telnum=$("#tel").val();
		getcodemessage(telnum,0);
	})
	$("#getfdcode").click(function(){
		var telnum=$("#fdtel").val();
		getcodemessage(telnum,1);
	})
	$("#submit").click(function(){
		login();
	})
	$("#forgetpwd").click(function(){
		$(".forget").css("display","block");
		$(".switchnav").css("display","none");
		$(".logandreg").css("display","none");
		$("#findpwd").css("display","block");
	})
	$("#pwd").keydown(function(e){
		if (e.which == 13)
		{
			login();
		}
	})
	$("#rptpwd").keydown(function(e){
		if (e.which == 13)
		{
			regist();
		}
	})
	$("#rptfdpwd").keydown(function(e){
		if (e.which == 13)
		{
			findpwd();			
		}
	})
})
