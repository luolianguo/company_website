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
		order:[],//订单列表
		nowpage:1,//当前页
		status:0,//当前状态
		totalpage:1,//总页数
		tabs: [{title:"全部订单",status:0,active:true}, {title:"预约中",status:2}, {title:"服务中",status:3},{title:"待评价",status:4},{title:"已完成",status:5}],
		orderstate:[0, 2, 3, 4, 5],
		count:0,//总数据条数
	    pagesize:0,//每页数据条数
	    tousuconetent:"",//投诉内容
	    tousucontact:"",//投诉标题
	    commenthide:false,//隐藏评价框
	    commentcontent:"",//评价内容
	    selectstar:5,//五星
	    commentorderid:null,//选中的评价订单
	    firstrend:true,//第一次获取
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
		this.getorderlist();
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		getorderlist:function(){
			var accesstoken=globalfunc.getsessionStorage("token");
			var data={};
			if(this.status!=0)//为0时不传值，后台默认返回所有订单
		    {
		      data.type=this.status
		    }
		    var orderlist = [];
		    var _this=this;
		    if(accesstoken)
		    {
		    	var load = layer.load();
		    	globalfunc.Cpost("order/orderList?page="+this.nowpage, data, accesstoken, function (res) {
					if(res.errno==0)
					{
						layer.close(load);
						var orderdata=res.data.data;
						nowpage=_this.nowpage,
						totalpage=res.data.totalPages;
						_this.count=res.data.count;
						_this.pagesize=res.data.pageSize;
						_this.totalpage=res.data.totalPages;
						pageNav.go(nowpage,totalpage);
						_this.firstrend=false;
						for(var i=0;i<orderdata.length;i++)
						{
							var servicetype = orderdata[i].service_type ==2 ? "买：" : "寄：";
							var status="";
							if (orderdata[i].status == 0) {
				              status = "已取消";
				            }
				            if (orderdata[i].status == 1) {
				              continue;
				              status = "待付款";
				            }
				            if (orderdata[i].status == 2) {
				              status = "待接单";
				            }
				            if (orderdata[i].status == 3) {
				              status = "进行中";
				            }
				            if (orderdata[i].status == 4) {
				              status = "待评价";
				            }
				            if (orderdata[i].status == 5) {
				              status = "已完成";
				            }
				            if (orderdata[i].status == 6) {
				              status = "已取消";
				            }
				            var deletlbtn=false;
				            if(orderdata[i].status==0||orderdata[i].status==4||orderdata[i].status==5||orderdata[i].status==6)
				            {
				            	deletlbtn=true;
				            }
				            var cancelbtn=false;
				            if(orderdata[i].status==2)
				            {
				            	cancelbtn=true;
				            }
				            var confirm=false;
				            var comment=false;
				            if(orderdata[i].status==4)
				            {
				            	comment=true;
				            }
				            var createtime=globalfunc.timetostr(orderdata[i].create_time);
				            var order = {
				              id: orderdata[i].id,
				              ordergoodstype: orderdata[i].title,
				              status: orderdata[i].status,
				              fromaddress: servicetype + orderdata[i].start_address,
				              toaddress: "收：" + orderdata[i].end_address,
				              message: orderdata[i].remark,
				              cost: orderdata[i].total_pay_price,
				              orderstate: status,
				              createtime:createtime,
				              ridername:orderdata[i].name,
				              mobile:orderdata[i].mobile,
				              ordernum: orderdata[i].order_number,
				              deletlbtn:deletlbtn,
				              cancelbtn:cancelbtn,
				              confirm:confirm,
				              comment:comment
				            };
				            orderlist.push(order);
						}
						_this.order=orderlist;
					}else{
						layer.close(load);
						layer.msg("获取订单信息失败",{icon:5})
					}
				})
		    }
		},
		statuschange:function(status){
			this.status=status;
			this.order=[];
			this.firstrend=true;
			this.getorderlist();
		},
		deletorder:function(ordernum){
			var _this=this;
			layer.confirm('您确认要删除订单吗？', {icon: 3, title:'提示'}, function(index){
			  layer.close(index);
			  var accesstoken = globalfunc.getsessionStorage("token");
				if (accesstoken){
					var load = layer.load();
					globalfunc.Tget("order/deleteOrder", { order_number: ordernum},accesstoken,function(orderres){
					  if(orderres.errno==0)
					  {
					  	layer.msg("订单已删除");
					  	layer.close(load);
					  	_this.statuschange(_this.status);
					  }else{
					  	layer.close(load);
					  	layer.msg("删除订单失败",{icon:5});
					  }
					})
				}
			});
		},
		cancelorder:function(ordernum){
			var _this=this;
			layer.confirm('您确认要取消订单吗？', {icon: 3, title:'提示'}, function(index){
			  layer.close(index);
			  var accesstoken = globalfunc.getsessionStorage("token");
				if (accesstoken){
					var load = layer.load();
					globalfunc.Tget("order/cancelOrder", { order_number: ordernum},accesstoken,function(orderres){
					  if(orderres.errno==0)
					  {
					  	layer.msg("订单已取消");
					  	layer.close(load);
					  	_this.statuschange(_this.status);
					  }else{
					  	layer.close(load);
					  	layer.msg("取消订单失败",{icon:5});
					  }
					})
				}
			});
		},
		confirmorder:function(ordernum){
			var _this=this;
			layer.confirm('您确认订单已完成了吗？', {icon: 3, title:'提示'}, function(index){
			  layer.close(index);
			  var accesstoken = globalfunc.getsessionStorage("token");
				if (accesstoken){
					var load = layer.load();
					globalfunc.Tget("order/finishOrder", { order_number: ordernum},accesstoken,function(orderres){
					  if(orderres.errno==0)
					  {
					  	layer.msg("订单已确认完成");
					  	layer.close(load);
					  	_this.statuschange(_this.status);
					  }else{
					  	layer.close(load);
					  	layer.msg("确认订单失败",{icon:5});
					  }
					})
				}
			});
		},
		cancelcomment:function(){
			this.commenthide=false;
		},
		commentorder:function(id){
			this.commentorderid=id;
			this.commenthide=true;
		},
		starselect:function(num){
			this.selectstar=num;
		},
		commentsub:function(){
			if(this.commentcontent=="")
			{
				layer.msg("请输入评价的内容");
				return false;
			}
			if(this.commentorderid==null)
			{
				layer.msg("请选择要评价的订单");
				return false;
			}
			var _this=this;
			var accesstoken = globalfunc.getsessionStorage("token");
			var data = {star: this.selectstar, content: this.commentcontent, order_number: this.commentorderid};
			if(accesstoken)
			{
				var load = layer.load();
				globalfunc.Tpost("order/addComment", data,accesstoken,function(res){
				  if(res.errno==0)
				  {
				  	layer.msg("您的评价已提交");
				  	layer.close(load);
				  	_this.statuschange(_this.status);
				  	_this.commenthide=false;
				  }else{
				  	layer.close(load);
				  	layer.msg("评价订单失败",{icon:5});
				  }
				})
			}
		},
		subtousu:function(){
			if(this.tousutitle=="")
			{
				layer.msg("请输入投诉的标题");
				return false;
			}
			if(this.tousuconetent=="")
			{
				layer.msg("请输入投诉的内容");
				return false;
			}
			var accesstoken = globalfunc.getsessionStorage("token");
			if (accesstoken){
				var load = layer.load();
				globalfunc.Tpost("user/opinion", {contact:this.tousucontact,content:this.tousuconetent},accesstoken,function(res){
				  if(res.errno==0)
				  {
				  	layer.msg("您的投诉已提交");
				  	layer.close(load);
				  	$("#dialoglayer").css("display","none");
				  }else{
				  	layer.close(load);
				  	layer.msg("投诉失败",{icon:5});
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
	if(bv.firstrend==true)
	{	
		return false;
	}
	var accesstoken=globalfunc.getsessionStorage("token");
	var data={};
	if(bv.status!=0)//为0时不传值，后台默认返回所有订单
    {
      data.type=bv.status
    }
    if(!accesstoken)
    {
    	return false;
    }
    var load = layer.load();
	globalfunc.Cpost("order/orderList?page="+p, data, accesstoken, function (res) {
		if(res.errno==0)
		{
			layer.close(load);
			totalpage=res.data.totalPages;
			nowpage=p,
			bv.count=res.data.count;
			bv.pagesize=res.data.pageSize;
			var orderdata=res.data.data;
			var orderlist = [];
			for(var i=0;i<orderdata.length;i++)
			{
				var servicetype = orderdata[i].service_type_id > 10 ? "买：" : "寄：";
				var status="";
				if (orderdata[i].status == 0) {
	              status = "已取消";
	            }
	            if (orderdata[i].status == 1) {
	              continue;
	              status = "待付款";
	            }
	            if (orderdata[i].status == 2) {
	              status = "待接单";
	            }
	            if (orderdata[i].status == 3) {
	              status = "进行中";
	            }
	            if (orderdata[i].status == 4) {
	              status = "待完成";
	            }
	            if (orderdata[i].status == 5) {
	              status = "待评价";
	            }
	            if (orderdata[i].status == 6) {
	              status = "已评价";
	            }
	            var deletlbtn=false;
	            if(orderdata[i].status==0||orderdata[i].status==5||orderdata[i].status==6)
	            {
	            	deletlbtn=true;
	            }
	            var cancelbtn=false;
	            if(orderdata[i].status==2)
	            {
	            	cancelbtn=true;
	            }
	            var confirm=false;
	            if(orderdata[i].status==4)
	            {
	            	confirm=true;
	            }
	            var comment=false;
	            if(orderdata[i].status==5)
	            {
	            	comment=true;
	            }
	            var createtime=globalfunc.timetostr(orderdata[i].create_time);
	            var order = {
	              id: orderdata[i].id,
	              ordergoodstype: orderdata[i].title,
	              goodsdistance: status,
	              fromaddress: servicetype + orderdata[i].start_address,
	              toaddress: "收：" + orderdata[i].end_address,
	              message: orderdata[i].remark,
	              cost: orderdata[i].total_price,
	              orderstate: status,
	              createtime:createtime,
	              ridername:orderdata[i].name,
	              mobile:orderdata[i].mobile,
	              ordernum: orderdata[i].order_number,
	              deletlbtn:deletlbtn,
	              cancelbtn:cancelbtn,
	              confirm:confirm,
	              comment:comment
	            };
	            orderlist.push(order);
			}
			bv.order=orderlist;
		}else{
			layer.close(load);
		}
	})
};