const thegratuities = [2,5,10,15,20,50];
const theweightlist = ['小于5公斤','6-8公斤','9-12公斤','13-20公斤','大于20公斤'];
var bv=new Vue({
	el:'#wrap',
	data:{
		version:"9.99",

		rechargetype:[{id:0,title:"微信支付",select:false},{id:1,title:"支付宝支付",select:false},{id:2,title:"余额支付",select:true}],//支付类型

		selectservicetypeid:null,//物品类型id

		selectservicetypename:null,//物品类型名称

		servicetypelist:[],//服务类型列表

		sendaddress: "",//发货地址

		remarksendaddress:"",//详细发货地址

		sendlat:null,

		sendlgt:null,

		receiver:"",//收货人

		receiveaddress:"",//收货地址

		remarkreceivaddress:"",//详细收货地址

		receivetel:"",//收货人手机

		receivelat:null,

		receivelgt:null,

		message:"",//购买需求

		remarkeinfo:"",//备注

		sendtime:null,//发货时间

		ticketprice:0,//选中的优惠券价格

		ticketid:null,//优惠券id

		ticketlist:[],//可用优惠券列表

		gratuity:0,//选中的小费

		inputgratuity:"",//输入的小费

		selectweight:null,//选中的重量

		selectweightkey:1,//选中的重量下标

		gratuities:thegratuities,//小费列表

		weightlist:theweightlist,//重量列表

		runprice:0,//跑腿费

		disntance:0,//距离

		buycost:0,//商品价格

		totalmoney:0,//总金额

		selecttoaddress:0,//0为选中的地址给发货地址信息

		usertel:null,//验证码手机号

		codemessage:"发送验证码",

		yzm:"",//验证码

		ordernum:null,//下单后得到的订单id

		placedate:null,

		ticketinfo:"请选择优惠券",

		submiting:false,

		company:"成都团团赚赚科技有限公司",

		beian:"",

		fwtel:"",

		companyadd:"",

		gzhqrcode:"",

		smallmap:null,

		startcity:null,

		start_province: null,

        start_city: null,

        start_county: null,

        end_province: null,

        end_city: null,

        end_county: null,

        searchregion:"",

        searchplace:"",//搜索的位置

        searchService:null,//位置搜索类

        citylocation:null,//城市检索类

        citylist:null,

        citylistshow:false,//控制城市列表显示隐藏

        searchresultcount:1,//搜索结果总页数

        searchactivepage:1,//搜索结果的当前页

        cityactive:true,

        receiveifcall:1,

        customgratuityshow:false,

        searchlist:[],

        searchlistshow:false,

	},
	created:function(){
		this.getdetailservicetype();
		this.getgratuityandweight();
		var accesstoken=globalfunc.getsessionStorage("token");
		if(!accesstoken){
			$("#loginmodel").fadeIn("fast");
			return false;
		}
		this.getcompanyinfo();
		this.getbeian();
		this.getCompanyadd();
		this.getpageimg();
		this.getcitylist();
		this.getfwtel();
		this.version=globalfunc.version;
	},
	methods:{
		getrunprice:function(){
			if(this.sendlat==null)
			{
				return false;
			}
			if(this.receivelat==null)
			{
				return false;
			}
			if(this.selectweight==null)
			{
				return false;
			}
			var start=new qq.maps.LatLng(this.sendlat,this.sendlgt);
			var end=new qq.maps.LatLng(this.receivelat,this.receivelgt);
			var distance=qq.maps.geometry.spherical.computeDistanceBetween(start, end);
			this.addmappoint(distance,start,end);
			distance=parseFloat((distance/1000).toFixed(2));
			this.disntance=distance;
			var data = { start_lat: this.sendlat, start_lon: this.sendlgt,end_lat:this.receivelat, end_lon:this.receivelgt,start_city:this.startcity,is_change:1,weight_key:this.selectweightkey};
			if(this.sendtime!=null)
			{
				var date = new Date();
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				data.datetype=sendtime.date-d+1;
				data.hour=sendtime.hours;
				data.minute=sendtime.minutes;
			}
			var accesstoken=globalfunc.getsessionStorage("token");
			var _this = this;
		    if(accesstoken)
		    {
		    	globalfunc.Tpost("order/customerGetRunPrice",data,accesstoken,function (res) {
			        if (res.errno == 0) {
			        	_this.runprice=res.data.runPrice;
			        	_this.totalmoney=_this.runprice;
			        	if(_this.buycost!=0&&_this.buycost!=""&&_this.buycost!="NaN")
			        	{
							var money=(parseFloat(_this.totalmoney)+parseFloat(_this.buycost)).toFixed(2);
							_this.totalmoney=parseFloat(money);
			        	}
			        	if(_this.gratuity!=0&&_this.gratuity!=""&&_this.gratuity!="NaN")
			        	{
							var money=(parseFloat(_this.totalmoney)+parseFloat(_this.gratuity)).toFixed(2);
							_this.totalmoney=parseFloat(money);
			        	}
			        	$("#yhq").css("display","flex");
						$("#zyh").css("display","flex");
			        }else{
			        	layer.msg("获取跑腿费用信息失败,请重新选择地址");
			        }
				})
		    }
		},
		setreceiveifcall:function(){
			if(this.receiveifcall==1)
			{
				this.receiveifcall=0;
			}else{
				this.receiveifcall=1;
			}
		},
		getdetailservicetype:function(){
			var _this=this;
			globalfunc.Cgetnot("login/serviseTypeSon", { id:2},function (res) {
				if(res.errno==0)
				{
					var servicetype = res.data;
			        for (var i = 0; i < servicetype.length; i++) {
			          servicetype[i].select = false;
			        }
			        servicetype[0].select = true;
			        _this.selectservicetypeid=servicetype[0].id;
			        _this.selectservicetypename=servicetype[0].title;
			        _this.servicetypelist=servicetype;
				}
		  	})
		},
		typeselect:function(id){
			this.selectservicetypeid=id;
			var types=this.servicetypelist;
			for(var i=0;i<types.length;i++)
			{
				types[i].select=false;
			}
			for(var i=0;i<types.length;i++)
			{
				if(types[i].id==id)
				{
					types[i].select=true;
					this.selectservicetypename=types[i].title;
					break;
				}
			}
			this.servicetypelist=types;
		},
		getcitylist:function(){
			var _this=this;
			globalfunc.CgetNT("login/getCityList",'',function (res) {
		    	if(res.errno==0)
		    	{
		    		_this.citylist=res.data.citydata;
		    	}
		    })
		},
		setcitylistshow:function(){
			this.citylistshow=!this.citylistshow;
		},
		cityselect:function(name){
			this.searchactivepage=1;
			this.searchresultcount=1;
			this.searchplace="";
			this.searchregion=name;
			this.citylistshow=false;
			this.citylocation.searchCityByName(name);
		},
		getResult:function(pageindex) {
		    //设置searchRequest
		    this.searchactivepage=pageindex;
		    pageindex=pageindex-1;
		    var _this=this;
		    var poiText = this.searchplace;
		    var regionText = this.searchregion;
		    this.searchService.setLocation(regionText);
		    this.searchService.setPageCapacity(10);
		    this.searchService.setPageIndex(pageindex);
		    this.searchService.search(poiText);
		    this.searchService.setComplete(function(res){
		    	_this.nearaddressrender(res.detail.pois);
		    	var a=res.detail.totalNum/10;
		    	var b=res.detail.totalNum%10;
		    	b=b==0?0:1;
		    	var count=parseInt(a)+parseInt(b);
		    	if(count>20)
		    	{
		    		count=20;
		    	}
		    	_this.searchresultcount=count;
		    })
		},
		mapinit:function() {
			var center=new qq.maps.LatLng(39.916527,116.397128);
			var _this=this;
			var map = new qq.maps.Map(document.getElementById("iframemapcontainer"), {
			  // 地图的中心地理坐标。
			  disableDefaultUI: true,
			  center: center,
			  zoom: 16,
			  mapTypeId: qq.maps.MapTypeId.ROADMAP
			});

			_this.searchService = new qq.maps.SearchService({
		        map : map
		    });

			var geocoder = new qq.maps.Geocoder({
			  complete : function(result){
			  	_this.searchregion=result.detail.addressComponents.city;
			  	if(_this.selecttoaddress==0)
			  	{
			  		_this.start_province=result.detail.addressComponents.province;
            		_this.start_city=result.detail.addressComponents.city;
            		_this.start_county=result.detail.addressComponents.district;
				  	_this.startcity=result.detail.addressComponents.city;
			  	}else{
			  		_this.end_province=result.detail.addressComponents.province;
            		_this.end_city=result.detail.addressComponents.city;
            		_this.end_county=result.detail.addressComponents.district;
			  	}
			    _this.nearaddressrender(result.detail.nearPois);
			  },
			  error:function(res){
			  	layer.msg("获取该定位点信息失败，请稍后重试",{icon:5});
			  }
			});
			_this.citylocation = new qq.maps.CityService({
			  complete : function(result){
			      lgt=result.detail.latLng.lng;
			      lat=result.detail.latLng.lat;
			      var name=result.detail.name;
			      map.setCenter(result.detail.latLng);
			      _this.judgecityactive(lgt,lat,name,function(rinfo){
			      	if(rinfo.errno==1)
					{
						$("#nearaddress ul").empty();
						_this.cityactive=false;
						layer.msg(rinfo.errmsg);
					}else{
						_this.cityactive=true;
						if(geocoder)
						{
							geocoder.getAddress(result.detail.latLng);
						}
					}
			      });
			  }
			});


			qq.maps.event.addListener(map, 'click', function() {
		        _this.citylistshow=false;
		    });
			_this.citylocation.searchLocalCity();

			qq.maps.event.addListener(map, 'center_changed', function() {
			  lgt = parseFloat(map.getCenter().lng);
			  lat = parseFloat(map.getCenter().lat);
			})

			//当地图中心属性更改时触发事件
			$("#iframemapcontainer").mouseup(function(){
				if(geocoder)
				{
				  var latLng = new qq.maps.LatLng(lat, lgt);
				  geocoder.getAddress(latLng);
				}
			})
		},
		getsearchresult:function(id){
			this.selecttoaddress=id;
			this.searchlistshow=true;
			this.mapinit();
		},
		judgecityactive:function(lgt,lat,cityname,cb){
			var _this=this;
			globalfunc.post("login/isRanger", { lon: lgt, lat: lat, is_change: 1, city: cityname}, function (rinfo) {
			  typeof cb == "function" && cb(rinfo);
		    })
		},
		nearaddressrender:function(list){
			$("#nearaddress ul").empty();
			var _this=this;
			for(var i=0;i<list.length;i++)
			{
				var li='<li class="infoitem"'+ 
					  'data-address="'+list[i].address+'" data-lgt="'+list[i].latLng.lng+'" data-lat="'+list[i].latLng.lat+'">'+
			          '<p class="name">'+list[i].name+'</p>'+
			          '<p class="address">'+list[i].address+'</p>'+
			        '</li>';
				li=$(li);
				var thedata=list[i];
				(function(thedata){
					li.on("click",function(){
						if(_this.cityactive==false)
						{
							layer.msg("暂未开通业务");
							return false;
						}
						if(_this.selecttoaddress==0)
						{
							_this.sendaddress=thedata.name;
							_this.sendlgt=thedata.latLng.lng;
							_this.sendlat=thedata.latLng.lat;
						}else{
							_this.receiveaddress=thedata.name;
							_this.receivelgt=thedata.latLng.lng;
							_this.receivelat=thedata.latLng.lat;
						}
						$("#maplayer").fadeOut("slow");
						$("#backcover").css("display","none");
						_this.searchresultcount=1;
						_this.searchplace="";
					})
				})(thedata)
				$("#nearaddress ul").append(li);
			}
		},
		addmappoint:function(distance,start,end){
			var zoom=this.getZoom(distance);
			this.smallmap.zoomTo(zoom);
			this.smallmap.setCenter(start);
	        // var size = new qq.maps.Size(34, 40);
			// var icon1 = new qq.maps.MarkerImage('images/518/mai.png', size);
			var marker1 = new qq.maps.Marker({
		        position: start,
		        map: this.smallmap
		    });
		    // marker1.setIcon(icon1);
			// var icon2 = new qq.maps.MarkerImage('images/518/shou.png', size);
		    var marker2 = new qq.maps.Marker({
		        position: end,
		        map: this.smallmap
		    });
		    // marker2.setIcon(icon2);
		},
		getlocation:function(id){
			this.selecttoaddress=id;
			$("#maplayer").fadeIn("slow");
			$("#backcover").css("display","block");
			this.mapinit();
		},
		getcodemessage:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
			var _this = this;
			var tel = this.usertel;
			if(tel==null)
			{
				layer.msg("请输入接收验证码的手机号");
			    return false;
			}
			if(_this.codemessage!="发送验证码")
			{
				return false;
			}
			if (accesstoken) {
				var userinfo=globalfunc.getsessionStorage("userinfo");
				userinfo=JSON.parse(userinfo);
				var userleavetel = userinfo.mobile;
				if (userleavetel != null && userleavetel!="")
				{
				    if (userleavetel != tel) {
				        layer.msg("请输入您注册时的手机号");
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
		confirmorder:function(){
			var requirement_info = this.message;
			var receiver_name = this.receiver;
			var receiver_mobile = this.receivetel;
			var start_address = this.sendaddress;
			var start_address_son=this.remarksendaddress;
			var end_address = this.receiveaddress;
			var end_address_son=this.remarkreceivaddress;
			var start_lon = this.sendlgt;
			var start_lat = this.sendlat;
			var cou_id = this.ticketid;
			var end_lon = this.receivelgt;
			var end_lat = this.receivelat;
			var sendtime=this.sendtime;
			var yzm=this.yzm;
			var usertel=this.usertel;
			var buycost=this.buycost;
			var remark=this.remarkeinfo;
			var goods_weight=this.selectweight;
			var selectweightkey=this.selectweightkey;
			var gratuity=this.gratuity;
			var start_province = this.start_province;
			var start_city = this.start_city;
			var start_county = this.start_county;
			var end_province = this.end_province;
			var end_city = this.end_city;
			var end_county = this.end_county;
			if(end_lon==null)
			{
				layer.msg("请选择收货地址");
				return false;
			}
			if(this.remarkreceivaddress==""||this.remarkreceivaddress==null)
			{
				layer.msg("请填写收货地址详情");
				return false;
			}
			if(receiver_name==""||receiver_name==null)
			{
				layer.msg("请输入收货人姓名");
				return false;
			}

			if(receiver_mobile==""||receiver_mobile==null)
			{
				layer.msg("请输入收货人电话");
				return false;
			}
			if(this.validatemobile(receiver_mobile,1)==false)
			{
				return false;
			}
			if(start_lon==null)
			{
				layer.msg("请选择购买地址");
				return false;
			}
			if(this.remarksendaddress==""||this.remarksendaddress==null)
			{
				layer.msg("请填写购买地址详情");
				return false;
			}
			if(requirement_info==""||requirement_info==null)
			{
				layer.msg("请填写购买需求");
				return false;
			}
			if(buycost==""){
				layer.msg("请输入垫付费用");
				return false;
			}
			buycost=parseFloat(buycost);
			if(buycost=="NaN")
			{
				layer.msg("请输入正确的垫付费用");
				return false;
			}
			if(buycost==0)
			{
				layer.msg("请输入垫付费用");
				return false;
			}
			if(goods_weight==""||goods_weight==null)
			{
				layer.msg("请选择物品重量");
				return false;
			}
			if(usertel==""||usertel==null)
			{
				layer.msg("请填写接收验证码的手机号");
				return false;
			}
			if(this.validatemobile(usertel,2)==false)
			{
				return false;
			}
			if(yzm=="")
			{
				layer.msg("请进行短信验证");
				return false;
			}
			var accesstoken = globalfunc.getsessionStorage("token");
			var orderdata = {
				service_type_id: this.selectservicetypeid,
				requirement_info:requirement_info,
				receiver_name: receiver_name,
				receiver_mobile: receiver_mobile,
				start_address: start_address,
				end_address: end_address,
				start_province: start_province,
	            start_city: start_city,
	            start_county: start_county,
	            end_province: end_province,
	            end_city: end_city,
	            end_county: end_county,
				goods_price:buycost,
				start_address_son:start_address_son,
				end_address_son: end_address_son,
				start_lon: start_lon,
				start_lat: start_lat,
				end_lon: end_lon,
				end_lat: end_lat,
				goods_weight:goods_weight,
				is_validate:1,
				vatel:usertel,
				vacode:yzm,
				is_change:1,
				service_type:2,
				start_city:this.startcity,
				start_call: this.receiveifcall,
	            end_call: this.receiveifcall,
	            weight_key:selectweightkey
			};
			if (cou_id != null) {
				orderdata.cou_id = cou_id;
			}
			if(remark!="")
			{
				orderdata.remark=remark;
			}
			if(remark!="")
			{
				orderdata.remark=remark;
			}
			if(gratuity!=0&&gratuity!='')
			{
				orderdata.first_price=gratuity;
			}
			if(sendtime!=null)
			{
				var date = new Date();
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				orderdata.datetype=sendtime.date-d+1;
				orderdata.hour=sendtime.hours;
				orderdata.minute=sendtime.minutes;
			}
			this.placedate=orderdata;
			var accesstoken = globalfunc.getsessionStorage("token");
			var _this=this;
			if(accesstoken)
			{
				var load=layer.load();
				globalfunc.Tpost("order/addOrder", orderdata, accesstoken, function (res) {
		          if (res.errno == 0) {
		          	layer.close(load);
		            _this.ordernum=res.data;
		            layer.msg("订单已确认,请支付",{icon:6});
		            $("#yzmtel").css("display","none");
					$("#yzmget").css("display","none");
					$("#zffs").css("display","flex");
					$("#payorder").css("display","block");
					$("#confirmorder").css("display","none");
		          }else{
		          	layer.close(load);
		          	_this.submiting=false;
					layer.msg("下单失败"+res.errmsg,{icon:5});
		          }
		        })
			}else{
				layer.msg("请登录后再下单");
			}
		},
		paynow:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
			var _this=this;
			if(accesstoken)
			{
				var rechargetype=this.rechargetype;
				for(var i=0;i<rechargetype.length;i++)
				{
					if(rechargetype[i].select==true)
					{
						if(rechargetype[i].id==0)
						{
							var load=layer.load();
							globalfunc.Tpost("order/wxpcpay",{orderId:_this.ordernum,type:1},accesstoken,function(tres){
								layer.close(load);
								if(tres.errno==0)
								{
									var img=tres.data;
									var timer;
									var sth=img;
									sth=$(sth);
									var imgurl=sth.attr("src");
									var html='<img src="images/518/wepaylogo.png" style="width: 50%;margin-left:25%;height: auto;margin-top:20px;" />'+
			                    	'<img src="'+imgurl+'" style="width: 60%;margin-left:20%;height: auto;">'+
				                    '<p style="color: #666;font-size: 16px;text-align: center;line-height: 30px;">扫码支付 <span style="color: #fe8b03;">￥'+_this.totalmoney+'</span> 元</p>'+
				                    '<img src="images/518/wepaydesc.png" style="width: 50%;margin-left:25%;height: auto;">';
									layer.open({
									  type: 1,
									  title:"微信支付",
									  skin: 'layui-layer-rim', //加上边框
									  area: ['420px', '500px'], //宽高
									  content: html,
									  success:function(layerdom,index){
									  	timer=setInterval(function(){
									  		globalfunc.Tpost("order/wxpcpaystatus",{orderId:_this.ordernum,type:1},accesstoken,function(jres){
									  			if(jres.errno==0)
									  			{
									  				clearInterval(timer);
									  				layer.close(index);
									  				layer.msg("支付成功",{icon:6,time: 1500},function(){
									  					window.location.href="./usercenter_order.html";
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
											window.location.href="./usercenter_order.html";
										}, function(){
										  	layer.msg("请刷新页面重新下单",{icon:6})
										});
									  }
									});
									_this.recharging=false;
								}else{
									layer.msg("发起支付异常,请刷新页面重新下单");
									_this.recharging=false;
								}
							})
						}else if(rechargetype[i].id==1)
						{
							var load=layer.load();
							var newWindow = window.open();
							var url=window.location.href;
							var urlindex=url.indexOf("placeorder");
							var backurl=url.slice(0,urlindex)+"usercenter_order.html"
							globalfunc.Tpost("order/alipay",{orderId:_this.ordernum,type:1,is_pc:1,goods_name:_this.selectservicetypename,return_url:backurl},accesstoken,function (res) {
								layer.close(load);
						    	if(res.errno==0)
						    	{
						    		var alidata=res.data;
						        	var alipayUrl = 'https://openapi.alipay.com/gateway.do?'+ alidata;
						        	layer.confirm('支付是否完成？', {
									  btn: ['支付成功','支付遇到问题'] //按钮
									}, function(){
										window.location.href="./usercenter_order.html";
									}, function(){
									  layer.msg("请刷新页面重新下单",{icon:6})
									});
						        	newWindow.location.href=alipayUrl;
						    	}else{
					        		layer.msg("发起支付异常");
					        		newWindow.close();
					        	}
						    })
						}else{
							layer.confirm('您确认使用余额来付款吗?', {icon: 6, title:'提示'}, function(index){
								if(_this.submiting==false)
								{
									_this.submiting=true;
								}else{
									return false;
								}
								var load=layer.load();
								globalfunc.Tpost("order/balancePay", { order_son_id: _this.ordernum }, accesstoken, function (result) {
				                	if(result.errno==0)
				                	{
				                		layer.msg("支付成功");
				                		setTimeout(function(){
						                	window.location.href="./usercenter_order.html";
						                },1500)
						                layer.close(load);
				                	}else{
				                		layer.close(load);
				                		_this.submiting=false;
				                		layer.msg("支付失败"+result.errmsg,{icon:5});
				                	}
				                })
							    layer.close(index);
							});
						}
					}
				}
			}else{
				layer.msg("请登录后再下单");
			}
		},
		getavaticket:function(){
			var accesstoken = globalfunc.getsessionStorage("token");
		    var _this = this;
		    if(this.sendlat==null)
		    {
		    	return false;
		    }
		    if(this.receivelat==null)
		    {
		    	return false;
		    }
		    if(this.selectweight==null)
		    {
		    	return false;
		    }
		    var availablelocatinfo= { start_lat: this.sendlat, start_lon: this.sendlgt,end_lat:this.receivelat, end_lon:this.receivelgt,start_city:this.startcity,is_change:1 };
		    availablelocatinfo.weight_key=this.selectweightkey;
		    if(this.sendtime!=null)
			{
				var date = new Date();
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				availablelocatinfo.datetype=sendtime.date-d+1;
				availablelocatinfo.hour=sendtime.hours;
				availablelocatinfo.minute=sendtime.minutes;
			}
		    if (accesstoken) {
		      globalfunc.ticketget("order/orderCoupons", availablelocatinfo, accesstoken, function (res) {
		        if (res.errno == 0) {
		        	var ticketlist=res.data;
		          	_this.ticketlist=ticketlist;
		          	_this.ticketid=null;
					_this.ticketprice=0;
					_this.ticketinfo="请选择优惠券";
					$("#noticket").css("display","block");
					$("#ticketlist.active").removeClass("active");
		        }else{
		        	_this.ticketlist=[];
		        	_this.ticketid=null;
					_this.ticketprice=0;
		        	_this.ticketinfo="暂无优惠券";
		        	$("#noticket").css("display","none");
		        	$("#ticketlist.active").removeClass("active");
		        }
		      })
		    }
		},
		getgratuityandweight:function(){
		    var _this = this;
		    globalfunc.CgetNT("login/freeList",'', function (res) {
		        if (res.errno == 0) {
		        	var gdata=res.data.free;
			        var wdata=res.data.weight;
			        var arrdata=[];
			        var weightlist=[];
			        for (let i in gdata) {
			          arrdata.push(gdata[i]);
			        }
			        for (let j in wdata) {
			          var wt={index:j,name:wdata[j]};
			          weightlist.push(wt);
			        }
			        _this.gratuities=arrdata;
			        _this.weightlist=weightlist;
		        }
	        })
		},
		showcustomgratuity:function(){
			this.customgratuityshow=true;
		},
		ticketselect:function(id,price){
			this.ticketid=id;
			var oldprice=parseFloat(this.totalmoney)+parseFloat(this.ticketprice);
			this.ticketprice=price;
			this.ticketinfo="减免"+price+"元";
			this.totalmoney=parseFloat(parseFloat(oldprice)-parseFloat(price)).toFixed(2);
		},
		weightselect:function(index,value){
			this.selectweight=value;
			this.selectweightkey=index;
		},
		gratuityselect:function(value){
			this.totalmoney=(parseFloat(this.totalmoney)-parseFloat(this.gratuity)).toFixed(2);
			this.gratuity=value;
			this.totalmoney=parseFloat((parseFloat(this.totalmoney)+parseFloat(value)).toFixed(2));
			this.customgratuityshow=false;
		},
		confirmgratuity:function(){
			this.totalmoney=(parseFloat(this.totalmoney)-parseFloat(this.gratuity)).toFixed(2);
			var value=this.inputgratuity;
			if(value.toString()=="NaN"||value.toString()==""||value==null)
			{
				value=0;
			}
			this.gratuity=value;
			this.totalmoney=parseFloat((parseFloat(this.totalmoney)+parseFloat(value)).toFixed(2));
			this.customgratuityshow=false;
		},
		nogratuity:function(){
			this.totalmoney=(parseFloat(this.totalmoney)-parseFloat(this.gratuity)).toFixed(2);
			this.gratuity=0;
			this.inputgratuity="";
			this.customgratuityshow=false;
		},
		noticket:function(){
			var oldprice=parseFloat(this.totalmoney)-parseFloat(this.ticketprice);
			this.totalmoney=parseFloat(oldprice.toFixed(2));
			this.ticketid=null;
			this.ticketprice=0;
			this.ticketinfo="请选择优惠券";
			$("#ticketlist.active").removeClass("active");
		},
		searchaddselect:function(info){
			this.searchlistshow=false;
			if(this.selecttoaddress==0)
			{
				this.sendaddress=info.name;
				this.sendlgt=info.latLng.lng;
				this.sendlat=info.latLng.lat;
			}else{
				this.receiveaddress=info.name;
				this.receivelgt=info.latLng.lng;
				this.receivelat=info.latLng.lat;
			}
			this.searchlist=[];
		},
		rechargetypeselect:function(id){
			var types=this.rechargetype;
			for(var i=0;i<types.length;i++)
			{
				types[i].select=false;
			}
			for(var i=0;i<types.length;i++)
			{
				if(types[i].id==id)
				{
					types[i].select=true;
					break;
				}
			}
			this.rechargetype=types;
		},
		validatemobile: function (mobile,tt) {
			mobile+="";
			if (mobile.length == 0) {
				if(tt==0)
				{
					layer.msg("寄件人手机号长度有误");
				}else if(tt==1)
				{
					layer.msg("收货人手机号长度有误");
				}else if(tt==2)
				{
					layer.msg("验证手机号长度有误");
				}else{
					layer.msg("手机号长度有误");
				}
			  	return false;
			}
			if (mobile.length != 11) {
				if(tt==0)
				{
					layer.msg("寄件人手机号长度有误");
				}else if(tt==1)
				{
					layer.msg("收货人手机号长度有误");
				}else if(tt==2)
				{
					layer.msg("验证手机号长度有误");
				}else{
					layer.msg("手机号长度有误");
				}
			  	return false;
			}
			var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
			if (!myreg.test(mobile)) {
				if(tt==0)
				{
					layer.msg("请输入正确的寄件人手机号");
				}else if(tt==1)
				{
					layer.msg("请输入正确的收货人手机号");
				}else if(tt==2)
				{
					layer.msg("请输入正确的验证手机号");
				}else{
					layer.msg("请输入正确的手机号");
				}
			  return false;
			}
			return true;
		},
		getZoom:function(distance) {
			var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。
			var distance = distance.toFixed(2);  //获取两点距离,保留小数点后两位
			for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {
				if(zoom[i] - distance > 0){
					return 18-i;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
				}
			};
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
		selectweight:function(){
			this.getrunprice();
			this.getavaticket();
		},
		buycost:function(newv,oldv){
			if(newv.toString()=="NaN"||newv.toString()==""||newv==null)
			{
				newv=0;
			}
			if(newv.toString()=="NaN"||oldv.toString()==""||oldv==null)
			{
				oldv=0;
			}
			var oldv=parseFloat(oldv);
			this.totalmoney=(parseFloat(this.totalmoney)-oldv).toFixed(2);
			this.totalmoney=parseFloat((parseFloat(this.totalmoney)+parseFloat(newv)).toFixed(2));
		},
		totalmoney:function(newv){
			if(newv.toString()=="NaN")
			{
				this.totalmoney=parseFloat(this.runprice)+parseFloat(this.gratuity);
				this.buycost=0;
			}
		},
		inputgratuity:function(newv){
			var value=0;
			if(newv.toString()=="NaN"||newv.toString()==""||newv==null)
			{
				newv=0;
			}
			value=parseInt(newv);
			this.inputgratuity=value;
		},
		receiveaddress:function(newv){
			if(this.searchlistshow==true)
			{
				var _this=this;
				this.searchService.setLocation(this.searchregion);
			    this.searchService.setPageCapacity(10);
				this.searchService.search(newv);
			    this.searchService.setComplete(function(res){
			    	if(res.detail.pois!=null)
			    	{
			    		_this.searchlist=res.detail.pois;
			    	}else{
			    		_this.searchlist=[];
			    	}
			    })
			}
		},
		sendaddress:function(newv)
		{
			if(this.searchlistshow==true)
			{
				var _this=this;
				this.searchService.setLocation(this.searchregion);
			    this.searchService.setPageCapacity(10);
				this.searchService.search(newv);
			    this.searchService.setComplete(function(res){
			    	if(res.detail.pois!=null)
			    	{
			    		_this.searchlist=res.detail.pois;
			    	}else{
			    		_this.searchlist=[];
			    	}
			    })
			}
		}
	}
});

function datepickrender(){
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var mt = date.getMinutes();
	mt = mt < 10 ? ('0' + mt) : mt;
	var minute = date.getMinutes();
	var mad=parseInt(d)+2;
	laydate.render({
	elem: '#datepicker', //指定元素
	type: 'datetime',
	min: y+"-"+m+"-"+d+" "+h+":"+mt+":00",
	max: y+"-"+m+"-"+mad+" 23:59:59",
	format: 'MM月dd日HH点m分', //可任意组合
	done: function(value, date, endDate){
          bv.sendtime=date;
        }
	});
}
datepickrender();
var smallmapinit=function(){
	var map = new qq.maps.Map(document.getElementById("mapcontainer"), {
	  // 地图的中心地理坐标。
	  center: new qq.maps.LatLng(39.90469,116.40717),  
	  zoom: 12,
	  mapTypeId: qq.maps.MapTypeId.ROADMAP
	});
	var citylocation = new qq.maps.CityService({
	  complete : function(result){
	      map.setCenter(result.detail.latLng);
	  }
	});
	citylocation.searchLocalCity();
	bv.smallmap=map;
}
smallmapinit();
$("#cancelmap").on("click",function(){
	$("#maplayer").fadeOut("slow");
	$("#backcover").css("display","none");
	bv.searchresultcount=1;
	bv.searchplace="";
})
$("#backcover").on("click",function(){
	$("#maplayer").fadeOut("slow");
	$("#backcover").css("display","none");
})
$(document).click(function(e){
	if(e.target.id!="receiveaddress"&&e.target.id!="buyaddress")
	{
		bv.searchlistshow=false;
		bv.searchlist=[];
	}
})