/*------------------------------------------------------------------
    Main Style Stylesheet
    Project:        page event deel
    Version:        1.0
    Author:         llg
    Last change:    7/03/2018
-------------------------------------------------------------------*/
$(function(){
	$(".logreg .switchnav .log").click(function(){
		$(this).addClass("active");
		$(".logreg .switchnav .reg").removeClass("active");
		$(".logreg .content ul").css("transform","translateX(0)");
	})
	$(".logreg .switchnav .reg").click(function(){
		$(".logreg .switchnav .log").removeClass("active");
		$(this).addClass("active");
		$(".logreg .content ul").css("transform","translateX(-50%)");
	})
	$(".servicemenu ul li .cover").each(function(index){
		var listindex=index+1;
		$(this).hover(function(){
			$(this).css("backgroundColor","transparent");
			$(this).prev().css("transform","scale(1.1)");
			$(this).children("p").css({
				backgroundColor:"#000",
				color:"#FF8B03"
			});
			$(".menudetail .levelitem").removeClass("visible");
			var animatedname=["fadeInLeft","fadeInDown","fadeInUp"];
			$(".menudetail .level1 .left .levelitem"+listindex).addClass("animated "+animatedname[0]);
			$(".menudetail .level1 .right .levelitem"+listindex).addClass("animated "+animatedname[1]);
			$(".menudetail .level2 .levelitem"+listindex).addClass("animated "+animatedname[0]);
			$(".menudetail .level3 .levelitem"+listindex).addClass("animated "+animatedname[2]);
			$(".menudetail .level4 .levelitem"+listindex).addClass("animated "+animatedname[2]);
		},function(){
			$(this).css("backgroundColor","rgba(10,10,10,.6)");
			$(this).prev().css("transform","scale(1)");
			$(this).children("p").css({
				backgroundColor:"transparent",
				color:"#fff"
			});
			$(".menudetail .levelitem"+listindex).addClass("visible");
			var animatedname=["fadeInLeft","fadeInDown","fadeInUp"];
			$(".menudetail .level1 .left .levelitem"+listindex).removeClass("animated "+animatedname[0]);
			$(".menudetail .level1 .right .levelitem"+listindex).removeClass("animated "+animatedname[1]);
			$(".menudetail .level2 .levelitem"+listindex).removeClass("animated "+animatedname[0]);
			$(".menudetail .level3 .levelitem"+listindex).removeClass("animated "+animatedname[2]);
			$(".menudetail .level4 .levelitem"+listindex).removeClass("animated "+animatedname[2]);
		})
	})
	$(".placeorder .formwrap .content .valuecontent").click(function(){
		$(".placeorder .formwrap .content .valuecontent .selected.active").removeClass("active");
		if(!$(this).hasClass("active"))
		{
			$(this).children(".selected").addClass("active");
		}
	})
	$(".placeorder .formwrap .content .itemvalue .input").focus(function(){
		$(this).parent().addClass("active")
		$(this).parents(".itemvalue").next().children(".vip").removeClass("active");
	}).blur(function(){
		$(this).parent().removeClass("active")
	})
	$(".placeorder .formwrap .content .itemvalue .textareawrap .textarea").focus(function(){
		$(this).parent().addClass("active")
	}).blur(function(){
		$(this).parent().removeClass("active")
	})
	$(".necessary").blur(function(){
		if($(this).val()=="")
		{
			$(this).parents(".itemvalue").next().children(".vip").addClass("active");
		}
	})
	$(".selectedcontent").click(function(){
		$(".selectitem.active").removeClass("active");
		var list=$(this).next();
		if(!list.hasClass("active"))
		{
			list.addClass("active")
		}
	})
	$(".placeorder .formwrap .content .timeselectitem ul li").click(function(){
		var list=$(this).parents(".selectitem");
		var value=$(this).data("value");
		if(value=="预约时间")
		{
			$("#senddate").css("visibility","visible");
			var date=$("#datepicker");
			if(date.val()=="")
			{
				$(this).parents(".itemvalue").next().next().children(".vip").addClass("active");
			}
		}else{
			$("#senddate").css("visibility","hidden");
			$(this).parents(".itemvalue").next().next().children(".vip").removeClass("active");
		}
		list.prev().children(".selectedvalue").addClass("active").text(value);
		list.removeClass("active");
	})
	$(".usercenterwrap .ordermenu .menuitem").click(function(){
		if(!$(this).hasClass("active"))
		{
			$(".usercenterwrap .ordermenu .menuitem").removeClass("active");
			$(this).addClass("active");
		}
	})
	$(".usercenterwrap .ordermenu .menuitem").click(function(){
		if(!$(this).hasClass("active"))
		{
			$(".usercenterwrap .ordermenu .menuitem").removeClass("active");
			$(this).addClass("active");
		}
	})
	$("#dialoglayer .title .cancel").click(function(){
		$("#dialoglayer").css("display","none");
	})
	$("#tousu").click(function(){
		$("#dialoglayer").css("display","block");
	})
	$("#ticketlist ul").on("click","li",function(){
		$("#ticketlist").removeClass("active");
	})
	$("#weightlist ul").on("click","li",function(){
		$("#weightlist").removeClass("active");
	})
	$("#gratuitylist ul").on("click","li",function(){
		$("#gratuitylist").removeClass("active");
	})
	$("#kpsm .title .cancel").click(function(){//开票说明点击
		$(this).parents("#kpsm").fadeOut("fast");
	})
	$("#invoicetipdetail").click(function(){//开票说明点击
		$("#kpsm").fadeIn("fast");
	})
	$(document).click(function(e){
		if(e.target.className!="ticketitem"&&e.target.id!="ticketvalue"&&e.target.id!="dropicon"&&e.target.id!="rightnow"&&e.target.id!="weighttitem"&&e.target.id!="weightvalue"&&e.target.id!="gratuityitem"&&e.target.id!="gratuityvalue"&&e.target.className!="dateselecticon")
		{
			$("#ticketlist.active").removeClass("active");
			$("#weightlist.active").removeClass("active");
			$("#gratuitylist.active").removeClass("active");
			$(".placeorder .formwrap .content .timeselectitem.active").removeClass("active");
		}
	})
})