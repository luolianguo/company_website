new Vue({
	el:'#wrap',
	data:{
		invoiceorderlist:[],
		allselect:false,
		money:"0.00",
		ids:[],
		leastmoney:0,
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
		this.getdetaillist();
		this.getinvoicebalance();
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		getdetaillist:function(){
			var accesstoken=globalfunc.getsessionStorage("token");
			var _this = this;
		    var invoiceorderlist = [];
		    if(accesstoken)
		    {
		    	var load=layer.load();
		    	globalfunc.Tget("user/billMoneyList","", accesstoken, function (res) {
					if(res.errno==0)
					{
						layer.close(load);
						var orderdata=res.data;
						for(var i=0;i<orderdata.length;i++)
						{
							var servicetype = orderdata[i].service_type ==2 ? "买：" : "寄：";
							var order = {
				              id: orderdata[i].id,
				              ordergoodstype: orderdata[i].title,
				              fromaddress: servicetype + orderdata[i].start_address,
				              toaddress: "收：" + orderdata[i].end_address,
				              message: orderdata[i].remark,
				              cost: orderdata[i].total_pay_price,
				              ridername:orderdata[i].name,
				              mobile:orderdata[i].mobile,
				              select:false,
				              ordernum: orderdata[i].order_number
				            };
							invoiceorderlist.push(order);
						}
						_this.invoiceorderlist=invoiceorderlist;
					}else{
						layer.close(load);
						layer.msg(res.errmsg);
					}
				})
		    }
		},
		invoicapplynow:function(){
			if(this.ids.length!=0&&this.leastmoney!=0)
			{
				if(this.money>this.leastmoney)
				{
					globalfunc.setsessionStorage("invoiceids",JSON.stringify(this.ids));
					globalfunc.setsessionStorage("invoicemoney",this.money);
					window.location.href="./invoiceapply.html?v="+this.version;
				}else{
					layer.tips("可开发票的金额不得少于"+this.leastmoney,'#invoicemoney');
					layer.msg("可开发票的金额不得少于"+this.leastmoney);
				}
			}else{
				layer.msg("请选择要开发票的订单");
			}
		},
		itemselect:function(id)
		{
			var data=this.invoiceorderlist;
			var money=parseFloat(this.money);
			var ids=[];
			var money=0;
			for(var i=0;i<data.length;i++)
			{
				if(data[i].id==id)
				{
					data[i].select=!data[i].select;
					break;
				}
			}
			for(var i=0;i<data.length;i++)
			{
				if(data[i].select==true)
				{
					money+=data[i].cost;
					ids.push(data[i].ordernum);
				}
			}
			if(ids.length==data.length)
			{
				this.allselect=true;
			}else{
				this.allselect=false;
			}
			this.invoiceorderlist=data;
			this.money=money.toFixed(2);
			this.ids=ids;
		},
		selectall:function(){
			var data=this.invoiceorderlist;
			this.allselect=!this.allselect;
			var money=0;
			var ids=[];
			for(var i=0;i<data.length;i++)
			{
				data[i].select=this.allselect;
				if(this.allselect==true)
				{
					money+=data[i].cost;
					ids.push(data[i].ordernum);
				}
			}
			this.money=money.toFixed(2);
			this.invoiceorderlist=data;
			this.ids=ids;
		},
		getinvoicebalance:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
		    var _this = this;
		    if (accesstoken) {
		    	var load=layer.load();
		      globalfunc.Tget("user/getBillMinMoney", "", accesstoken, function (res) {
		        if (res.errno == 0) {
		        	_this.leastmoney=res.data.billMinMoney;
		        	layer.close(load);
		        }else{
		        	layer.close(load);
		        	layer.msg(res.errmsg);
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