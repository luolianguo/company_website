const rlist=[
{money:500,select:false,id:0},
{money:1000,select:false,id:1},
{money:2000,select:false,id:2},
{money:5000,select:false,id:3},
{money:10000,select:false,id:4},
];
const rtype=[
{url:'images/518/alipay.jpg',select:false,id:0},
{url:'images/518/wechat.jpg',select:false,id:1},
]
new Vue({
	el:'#wrap',
	data:{
		money:"0.00",
		rechargelist:rlist,
		rechargetype:rtype,
		company:"成都团团赚赚科技有限公司",

		beian:"",

		companyadd:"",

		gzhqrcode:"",

		rechargeamount:0,//充值金额

		selectrechartype:-1,//选中的充值方式

		recharging:false,//防止用户连续点击充值

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
		this.getrechargenumberlist();
		this.version=globalfunc.version;
	},
	methods:{
		getdetaillist:function(){
			var accesstoken=globalfunc.getsessionStorage("token");
			var _this = this;
		    if(accesstoken)
		    {
		    	var load=layer.load();
		    	globalfunc.Tget("wallet/getBalance","", accesstoken, function (res) {
			        if (res.errno == 0) {
			        	_this.money=res.data.balance;
			        	layer.close(load);
			        }else{
			        	layer.close(load);
			        	layer.msg("获取余额数据失败",{icon:5});
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
		moneyselect:function(id){
			var list=this.rechargelist;
			var rechargeamount=0;
			for(var i=0;i<list.length;i++)
			{
				list[i].select=false;
			}
			for(var i=0;i<list.length;i++)
			{
				if(list[i].id==id)
				{
					list[i].select=true;
					rechargeamount=list[i].money;
				}
			}
			this.rechargelist=list;
			this.rechargeamount=rechargeamount;
		},
		typeselect:function(id){
			var list=this.rechargetype;
			for(var i=0;i<list.length;i++)
			{
				list[i].select=false;
			}
			for(var i=0;i<list.length;i++)
			{
				if(list[i].id==id)
				{
					list[i].select=true;
				}
			}
			this.rechargetype=list;
			this.selectrechartype=id;
		},
		getrechargenumberlist: function () {
			var _this = this;
			globalfunc.CgetNT("login/rechargeList", "", function (res) {
			  if (res.errno == 0) {
			    var gdata = res.data;
			    var arrdata = [];
			    var index = 0;
			    for (let i in gdata) {
			      var arr = { id: index, money: gdata[i],select:false};
			      index++;
			      arrdata.push(arr);
			    }
			    _this.rechargelist=arrdata;
			  }
			})
		},//获取充值列表
		torecharge:function(){
			var rechargetype=this.selectrechartype;
			var rechargeamount=this.rechargeamount;
			if(rechargeamount==0)
			{
				layer.msg("请选择充值金额",{icon:6});
				return false;
			}
			if(rechargetype==-1)
			{
				layer.msg("请选择支付方式",{icon:6});
				return false;
			}
			if(this.recharging==false)
			{
				this.recharging=true;
			}else{
				return false;
			}
			var _this=this;
			var accesstoken=globalfunc.getsessionStorage("token");
			if(accesstoken)
			{
				if(rechargetype==0)
				{
					var load=layer.load();
					var newWindow = window.open();
					globalfunc.Tpost("wallet/recharge", { price: rechargeamount}, accesstoken, function (res) {
						if (res.errno == 0) {
							var oid=res.data;
							globalfunc.Tpost("order/alipay",{orderId:oid,type:2,is_pc:1,goods_name:"在线充值",return_url:window.location.href},accesstoken,function (tres) {
								layer.close(load);
								_this.recharging=false;
						    	if(tres.errno==0)
						    	{
						    		var alidata=tres.data;
						        	var alipayUrl = 'https://openapi.alipay.com/gateway.do?'+ alidata;
						        	layer.confirm('支付是否完成？', {
									  btn: ['支付成功','支付遇到问题'], //按钮
									  icon:3
									}, function(){
										window.location.href=window.location.href;
									}, function(){
									  layer.msg("请刷新页面重新充值",{icon:6})
									});
						        	newWindow.location.href=alipayUrl;
						    	}else{
					        		layer.msg("发起支付异常");
					        		newWindow.close();
					        	}
						    })
						}else{
						  layer.msg("发起支付异常",{icon:5});
						}
					})
				}else if(rechargetype==1){
					var load=layer.load();
					globalfunc.Tpost("wallet/recharge", { price:rechargeamount}, accesstoken, function (res) {
						if(res.errno==0)
						{
							var oid=res.data;
							globalfunc.Tpost("order/wxpcpay",{orderId:oid,type:2},accesstoken,function(tres){
								layer.close(load);
								if(tres.errno==0)
								{
									var timer;
									var img=tres.data;
									var sth=img;
									sth=$(sth);
									var imgurl=sth.attr("src");
									var html='<img src="images/518/wepaylogo.png" style="width: 50%;margin-left:25%;height: auto;margin-top:20px;" />'+
			                    	'<img src="'+imgurl+'" style="width: 60%;margin-left:20%;height: auto;">'+
				                    '<p style="color: #666;font-size: 16px;text-align: center;line-height: 30px;">扫码支付 <span style="color: #fe8b03;">￥'+rechargeamount+'</span> 元</p>'+
				                    '<img src="images/518/wepaydesc.png" style="width: 50%;margin-left:25%;height: auto;">';
									layer.open({
									  type: 1,
									  title:"余额充值",
									  skin: 'layui-layer-rim', //加上边框
									  area: ['420px', '500px'], //宽高
									  content: html,
									  success:function(layerdom,index){
									  	timer=setInterval(function(){
									  		globalfunc.Tpost("order/wxpcpaystatus",{orderId:oid,type:2},accesstoken,function(jres){
									  			if(jres.errno==0)
									  			{
									  				clearInterval(timer);
									  				layer.close(index);
									  				layer.msg("支付成功",{icon:6,time:1500},function(){
									  					window.location.reload();
									  				})
									  			}
									  		})
									  	},1000)
									  },
									  cancel:function(){
									  	clearInterval(timer);
									  	layer.confirm('支付是否完成？', {
										  btn: ['支付成功','支付遇到问题'], //按钮
										  icon:3
										}, function(){
											window.location.reload();
										}, function(){
										  layer.msg("请刷新页面重新充值",{icon:6})
										});
									  }
									});
									_this.recharging=false;
								}else{
									layer.msg("发起支付异常,请刷新页面重新充值");
									_this.recharging=false;
								}
							})
						}else{
							layer.msg("发起支付异常,请刷新页面重新充值");
							_this.recharging=false;
						}

					})
				}
			}
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