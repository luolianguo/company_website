var nowpage=1,totalpage=1;
var pageNav = pageNav || {};
//p为当前页码,pn为总页数
pageNav.nav = function (p, pn) {
	//只有一页,直接显示1
	if (pn <= 1) {
		this.p = 1;
		this.pn = 1;
		return this.pHtml2(1);
	}
	if (pn < p) {
		p = pn;
	};
	var re = "";
	//第一页
	if (p <= 1) {
		p = 1;
	} else {
		//非第一页
		re += this.pHtml(p - 1, pn, "上一页");
		//总是显示第一页页码
		re += this.pHtml(1, pn, "1");
	}
	//校正页码
	this.p = p;
	this.pn = pn;
 
	//开始页码
	var start = 2;
	var end = (pn < 9) ? pn : 9;
	//是否显示前置省略号,即大于10的开始页码
	if (p >= 7) {
		re += "...";
		start = p - 4;
		var e = p + 4;
		end = (pn < e) ? pn : e;
	}
	for (var i = start; i < p; i++) {
		re += this.pHtml(i, pn);
	};
	re += this.pHtml2(p);
	for (var i = p + 1; i <= end; i++) {
		re += this.pHtml(i, pn);
	};
	if (end < pn) {
		re += "...";
		//显示最后一页页码,如不需要则去掉下面这一句
		re += this.pHtml(pn, pn);
	};
	if (p < pn) {
		re += this.pHtml(p + 1, pn, "下一页");
	};
	return re;
};
//显示非当前页
pageNav.pHtml = function (pageNo, pn, showPageNo) {
	showPageNo = showPageNo || pageNo;
	var H = " <li><a href='javascript:pageNav.go(" + pageNo + "," + pn + ");' class='pageNum'>" + showPageNo + "</a></li>";
	return H;
 
};
//显示当前页
pageNav.pHtml2 = function (pageNo) {
	var H = " <li class='active'><a href='#'>" + pageNo + "</a></li>";
	return H;
};
//输出页码,可根据需要重写此方法
pageNav.go = function (p, pn) {
	$("#pageNav").html(this.nav(p,pn)); //如果使用jQuery可用此句
	// document.getElementById("pageNav").innerHTML = this.nav(p, pn);
	if (this.fn != null) {
		this.fn(this.p, this.pn);
	};
};
var bv=new Vue({
	el:'#wrap',
	data:{
		money:"0.00",
		billpostmoney:500,//申请费用小于500就自己出邮费
		invoicelist:[],
	    nowpage: 1,//数据传给后台响应的页面，默认为1，第一页
	    totalpage: 1,//总页数
	    count:0,//总数据条数
	    pagesize:0,//每页数据条数
	    content:"",//开票说明

	    invoicedesc:[],

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
		this.getinvoicebalance();
		this.getdetaillist();
		this.getdocx();
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		getinvoicebalance:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
		    var _this = this;
		    if (accesstoken) {
		    	var load=layer.load();
		      globalfunc.Tget("user/getBillMinMoney", "", accesstoken, function (res) {
		        if (res.errno == 0) {
		        	layer.close(load);
		        	_this.money=res.data.billMinMoney;
		        	_this.billpostmoney=res.data.billPostMoney;
		        }else{
		        	layer.close(load);
		        	layer.msg("获取数据失败",{icon:5});
		        }
		      })
		    }
		},
		getdocx:function(){
			var _this=this;
			var load=layer.load();
		    globalfunc.get("document/getDocument",{id:15},function (res) {
		    	if(res.errno==0)
		    	{
		    		layer.close(load);
		    		var temp = document.createElement("div"); 
					temp.innerHTML = res.data.content; 
					var output = temp.innerText || temp.textContent; 
					temp = null; 
		    		_this.content=output;
		    		$(output).each(function(){
		    			console.log($(this).text());
		    		})

		    	}else{
					layer.close(load);
					layer.msg("获取数据失败",{icon:5});
		    	}
		    })   
		    globalfunc.get("document/getDocument",{id:22},function (res) {
		    	if(res.errno==0)
		    	{
		    		layer.close(load);
		    		var temp = document.createElement("div"); 
					temp.innerHTML = res.data.content; 
					var output = temp.innerText || temp.textContent; 
					temp = null; 
		    		_this.content=output;
		    		$(output).each(function(){
		    			_this.invoicedesc.push($(this).text());
		    		})
		    	}else{
					layer.close(load);
					layer.msg("获取数据失败",{icon:5});
		    	}
		    })   
		},
		getdetaillist:function(){
			var accesstoken=globalfunc.getsessionStorage("token");
			var data={};
			var _this = this;
		    var invoicelist = [];
		    if(accesstoken)
		    {
		    	var load=layer.load();
		    	globalfunc.Tget("user/billList?page="+this.nowpage, data, accesstoken, function (res) {
					if(res.errno==0)
					{
						layer.close(load);
						_this.totalpage=res.data.totalPages;
						nowpage=_this.nowpage;
						totalpage=res.data.totalPages;
						_this.count=res.data.count;
						_this.pagesize=res.data.pageSize;
						var orderdata=res.data.data;
						pageNav.go(_this.nowpage,_this.totalpage);
						for(var i=0;i<orderdata.length;i++)
						{
							orderdata[i].create_time=globalfunc.timetostr(orderdata[i].create_time);
							invoicelist.push(orderdata[i]);
						}
						_this.invoicelist=invoicelist;
					}else{
						layer.close(load);
						layer.msg("获取数据失败",{icon:5});
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
		    globalfunc.Cgetnot("public/getCompany","",function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.company=res.data;
		    	}
		    }) 
		},
		getbeian:function(){
			var _this=this;
		    globalfunc.Cgetnot("public/getIcp","",function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.beian=res.data;
		    	}
		    }) 
		},
		getCompanyadd:function(){
			var _this=this;
		    globalfunc.Cgetnot("public/getCompanyAddress","",function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.companyadd=res.data;
		    	}
		    }) 
		},
		getpageimg:function(){
			var _this=this;
		    globalfunc.Cgetnot("public/getPic",{key:"gzhcode"},function (res) {
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
pageNav.fn = function(p,pn){
	var accesstoken=globalfunc.getsessionStorage("token");
	var data={};
	var _this = this;
    var invoicelist = [];
    if(!accesstoken){
    	return false;
    }
    var load=layer.load();
	globalfunc.Tget("user/billList?page="+p, data, accesstoken, function (res) {
		if(res.errno==0)
		{
			layer.close(load);
			totalpage=res.data.totalPages;
			nowpage=p;
			bv.count=res.data.count;
			bv.pagesize=res.data.pageSize;
			var orderdata=res.data.data;
			for(var i=0;i<orderdata.length;i++)
			{
				orderdata[i].create_time=globalfunc.timetostr(orderdata[i].create_time);
				invoicelist.push(orderdata[i]);
			}
			bv.invoicelist=invoicelist;
		}else{
			layer.close(load);
			layer.msg("获取数据失败");
		}
	})
};
