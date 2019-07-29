new Vue({
	el:'#wrap',
	data:{
		typeselected: true,//发票类型，true为电子发票，false为纸质发票
	    titletype: true,//发票抬头类型，true为个人，false为企业
	    invoicemoney:0,
	    selectinvoicecontent:0,//选中的发票内容，默认为服务费
	    invoicecontent:["服务费","派送费"],
	    invoiceorderids:null,//申请开发票的订单id，逗号隔开
	    address:null,//邮寄地址
	    taxnum:null,//税号
	    email:null,//邮箱
	    title:null,//发票抬头
	    readed:false,//阅读了开票说明
	    content:"",//开票说明
	    billpostmoney:500,
	    company:"成都团团赚赚科技有限公司",

		beian:"",

		companyadd:"",

		gzhqrcode:"",

		uname:null,

		umobile:null,
		version:"9.99",
		fwtel:"",
	},
	created:function(){
		var accesstoken=globalfunc.getsessionStorage("token");
		var uinfo=globalfunc.getsessionStorage("userinfo");
		if(!accesstoken){
			$("#loginmodel").fadeIn("fast");
			return false;
		}
		uinfo=JSON.parse(uinfo);
		this.umobile=uinfo.mobile;
		this.uname=uinfo.username;
		this.getinvoiceids();
		this.getinvoicecontent();
		this.getdocx();
		this.getinvoicebalance();
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		getinvoiceids:function(){
			var ids=globalfunc.getsessionStorage("invoiceids");
			var invoicemoney=globalfunc.getsessionStorage("invoicemoney");
			if(ids!=null)
			{
				ids=JSON.parse(ids);
				this.invoiceorderids=ids.join(',');
			}else{
				layer.msg("未选择要开发票的订单");
				setTimeout(function(){
					window.location.href="./invoicelist.html";
				},1500)
			}
			if(invoicemoney!=null)
			{
				this.invoicemoney=invoicemoney;
			}else{
				layer.msg("未选择要开发票的订单");
				setTimeout(function(){
					window.location.href="./invoicelist.html";
				},1500)
			}
		},
		getinvoicebalance:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
		    var _this = this;
		    if (accesstoken) {
		    	var load=layer.load();
		      globalfunc.Tget("user/getBillMinMoney", "", accesstoken, function (res) {
		        if (res.errno == 0) {
		        	layer.close(load);
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
		    globalfunc.get("document/getDocument",{id:15},function (res) {
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
		getinvoicecontent:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
			var _this = this;
			if (accesstoken) {
				var load=layer.load();
			  globalfunc.Tget("user/getBillContent", "", accesstoken, function (res) {
			    if (res.errno == 0) {
			    	layer.close(load);
			      var content=[];
			      for (let i in res.data) {
			        content.push(res.data[i]);
			      }
			      _this.invoicecontent=content;
			    }else{
			    	layer.close(load);
			    }
			  })
			}
		},
		typeselect:function(type){
			this.typeselected=type==0?true:false;
		},
		titletypeselect:function(type){
			this.titletype=type==0?true:false;
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
		applyconfirm:function(){
			if(this.readed==false)
			{
				layer.tips("请同意开票说明",'#kpsmselect');
				return false;
			}
			var accesstoken = globalfunc.getsessionStorage("token");
		    var _this = this;
		    if (accesstoken) {
		    	var orderid = this.invoiceorderids;
				var address = this.address;
				var invoicetype = this.typeselected==true?1:2;
				var headtype = this.titletype == true ? 2 : 1;
				var taxnum = this.taxnum;
				var content = this.invoicecontent[this.selectinvoicecontent];
				var email = this.email;
				var title=this.title;
				if (headtype == 2) {
					if (title == null||title=="") {
					  layer.tips("请填写发票抬头",'#invoicetitle');
					  return false;
					}
				}
				if (headtype == 1) {
					if (title==null||title=="")
					{
					  layer.tips("请填写公司/单位名称",'#companyname');
					  return false;
					}
					if(taxnum==null||taxnum=="")
					{
					  layer.tips("请填写税号",'#taxnum');
					  return false;
					}
				}
				if (invoicetype==2)
				{
					if(address==null||address=="")
					{
					  layer.tips("请选择收票地址",'#invoiceaddress');
					  return false;
					}
				}
				if(invoicetype==1)
				{
					if (email == null||email=="") {
					  layer.tips("请填写收票人邮箱",'#invoicemail');
					  return false;
					}
					if(this.emailcheck(email)==false)
					{
						layer.tips("请填写正确的邮箱格式",'#invoicemail');
						return false;
					}
				}
				var passdata={
					order_number: orderid,
					type: invoicetype,
					head_type: headtype,
					content:content,
					title: title,
					name:_this.uname,
					mobile:_this.umobile
				};
				if(address!=null)
				{
					passdata.address=address;
				}
				if(taxnum!=null)
				{
					passdata.tax_num=taxnum;
				}
				if (email!=null){
					passdata.email = email;
				}
				globalfunc.Tpost("user/bill", passdata, accesstoken, function (res) {
			        if(res.errno==0)
			        {
			          layer.msg("您已提交了您的申请");
			          setTimeout(function(){
			            window.location.href="./usercenter_invoice.html";
			          },2000)
			        }else{
			        	layer.msg(res.errmsg);
			        }
				})
		    }
		},
		emailcheck:function(obj){
			var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
			if (!reg.test(obj)) { //正则验证不通过，格式不对
			  return false;
			} else {
			  return true;
			}
		},//邮箱验证
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