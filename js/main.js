/*-----------------------------------------------------------------------------------*/
/* 		Mian Js Start 
/*-----------------------------------------------------------------------------------*/
$(document).ready(function($) {
"use strict"
/*-----------------------------------------------------------------------------------*/
/* 	LOADER
/*-----------------------------------------------------------------------------------*/
// $("#loader").delay(500).fadeOut("slow");
/*-----------------------------------------------------------------------------------*/
/* 		WORK FILTER
/*-----------------------------------------------------------------------------------*/
var $container = $('.portfolio-wrapper .items');
   $container.imagesLoaded(function () {
   $container.isotope({
   itemSelector: '.item',
   layoutMode: 'fitRows'
  });
});
$('.filter li a').on('click', function () {
   $('.filter li a').removeClass('active');
   $(this).addClass('active');
   var selector = $(this).attr('data-filter');
   $container.isotope({
   filter: selector
   });
   return false;
});
/*-----------------------------------------------------------------------------------*/
/* 	GALLERY SLIDER
/*-----------------------------------------------------------------------------------*/
$('.gallery-slider').owlCarousel({
    loop:true,
    margin:30,
    nav:true,
	navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:4
        }
}});
/*-----------------------------------------------------------------------------------*/
/* 	SLIDER REVOLUTION
/*-----------------------------------------------------------------------------------*/
// jQuery('.tp-banner').show().revolution({
//   dottedOverlay:"none",
//   delay:6000,
//   startwidth:1170,
//   startheight:650,
//   navigationType:"bullet",
//   navigationArrows:"solo",
//   navigationStyle:"preview4",
//   parallax:"mouse",
//   parallaxBgFreeze:"on",
//   parallaxLevels:[7,4,3,2,5,4,3,2,1,0],                       
//   keyboardNavigation:"on",            
//   shadow:0,
//   fullWidth:"on",
//   fullScreen:"off",
//   shuffle:"off",            
//   autoHeight:"off",           
//   forceFullWidth:"off", 
//   fullScreenOffsetContainer:""  
// });//转移到indexdeel/fuctiondeel.js内控制了
/*-----------------------------------------------------------------------------------*/
/* Pretty Photo
/*-----------------------------------------------------------------------------------*/
jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({
    theme: "light_square"
});
/*-----------------------------------------------------------------------------------*/
/* 	TESTIMONIAL SLIDER
/*-----------------------------------------------------------------------------------*/
$(".single-slide").owlCarousel({ 
    items : 1,
	autoplay:true,
	loop:true,
	autoplayTimeout:5000,
	autoplayHoverPause:true,
	singleItem	: true,
    navigation : true,
	navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
	pagination : true,
	animateOut: 'fadeOut'	
});
$('.testi-two').owlCarousel({
    loop:true,
    margin:30,
    nav:true,
	navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
    responsive:{
        0:{
            items:1
        },
        800:{
            items:2
        },
        1000:{
            items:2
        }
    }
});
/*-----------------------------------------------------------------------------------*/
/* 		Active Menu Item on Page Scroll
/*-----------------------------------------------------------------------------------*/
$(window).scroll(function(event) {
		Scroll();
});	
$('.scroll a').click(function() {  
	$('html, body').animate({scrollTop: $(this.hash).offset().top -0}, 1000);
		return false;
});
// User define function
function Scroll() {
var contentTop      =   [];
var contentBottom   =   [];
var winTop      =   $(window).scrollTop();
var rangeTop    =   0;
var rangeBottom =   1000;
$('nav').find('.scroll a').each(function(){
	contentTop.push( $( $(this).attr('href') ).offset().top);
		contentBottom.push( $( $(this).attr('href') ).offset().top + $( $(this).attr('href') ).height() );
})
$.each( contentTop, function(i){
if ( winTop > contentTop[i] - rangeTop ){
	$('nav li.scroll')
	  .removeClass('active')
		.eq(i).addClass('active');			
}}  )};
});
/*-----------------------------------------------------------------------------------*/
/*    CONTACT FORM
/*-----------------------------------------------------------------------------------*/
function checkmail(input){
  var pattern1=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  	if(pattern1.test(input)){ return true; }else{ return false; }}     
    function proceed(){
    	var name = document.getElementById("name");
		var email = document.getElementById("email");
		var company = document.getElementById("company");
		var web = document.getElementById("website");
		var msg = document.getElementById("message");
		var errors = "";
	if(name.value == ""){ 
		name.className = 'error';
	  	  return false;}    
		  else if(email.value == ""){
		  email.className = 'error';
		  return false;}
		    else if(checkmail(email.value)==false){
		        alert('Please provide a valid email address.');
		        return false;}
		    else if(company.value == ""){
		        company.className = 'error';
		        return false;}
		   else if(web.value == ""){
		        web.className = 'error';
		        return false;}
		   else if(msg.value == ""){
		        msg.className = 'error';
		        return false;}
		   else 
		  {
$.ajax({
	type: "POST",
	url: "php/submit.php",
	data: $("#contact_form").serialize(),
	success: function(msg){
	//alert(msg);
    if(msg){
		$('#contact_form').fadeOut(1000);
        $('#contact_message').fadeIn(1000);
        	document.getElementById("contact_message");
         return true;
        }}});
}};


var globalfunc={};

globalfunc.apiurl="https://api.cdpaotui.com/api/";

globalfunc.version="1.18";

globalfunc.post=function(method,data,callback){
	$.ajax({
        type:"POST",
        cache:false,
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
    			callback(res);
        },
        error:function(res){
            layer.msg("网络异常");
        }
    });
}
globalfunc.get=function(method,data,callback){
	$.ajax({
        type:"GET",
        cache:false,
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
    			callback(res);
        },
        error:function(res){
            layer.msg("网络异常");
        }
    });
}

globalfunc.CgetNT=function(method,data,callback){
  $.ajax({
        type:"GET",
        cache:true,
        timeout:5000,
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
          callback(res);
        },
        error:function(res){
            callback({errno:1});
            layer.msg("网络异常");
        }
    });
}
globalfunc.Cget=function(method,data,token,callback){
	$.ajax({
        type:"GET",
        cache:true,
        beforeSend: function(request) {                
           request.setRequestHeader("token", token);
	    },
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
    			callback(res);
        },
        error:function(res){
            layer.msg("网络异常");
        }
    });
}
globalfunc.Cgetnot=function(method,data,callback){
  $.ajax({
        type:"GET",
        cache:true,
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
          callback(res);
        },
        error:function(res){
            layer.msg("网络异常");
        }
    });
}
globalfunc.Cpost=function(method,data,token,callback){
	$.ajax({
        type:"POST",
        cache:true,
        beforeSend: function(request) {                
           request.setRequestHeader("token", token);
	    },
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
    			callback(res);
        },
        error:function(res){
            layer.msg("网络异常");
        }
    });
}
globalfunc.Tpost=function(method,data,token,callback){
	$.ajax({
        type:"POST",
        cache:false,
        beforeSend: function(request) {                
           request.setRequestHeader("token", token);
	    },
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
  			callback(res);
      },
      error:function(res){
          layer.msg("网络异常");
      }
    });
}
globalfunc.ticketget=function(method,data,token,callback){
  $.ajax({
        type:"POST",
        cache:false,
        beforeSend: function(request) {                
           request.setRequestHeader("token", token);
      },
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
      callback(res);
      },
      error:function(res){
          layer.msg("网络异常");
      }
    });
}
globalfunc.Tget=function(method,data,token,callback){
	$.ajax({
        type:"get",
        cache:false,
        beforeSend: function(request) {                
           request.setRequestHeader("token", token);
	    },
        url:globalfunc.apiurl+method,
        data:data,
        success:function(res){
			callback(res);
        },
        error:function(res){
            layer.msg("网络异常");
        }
    });
}
globalfunc.Tuploadpost=function(method,data,token,callback){
  $.ajax({
        url:globalfunc.apiurl+method,
        type:"POST",
        data: data,
        cache:false,
        contentType: false,
        processData: false,
        beforeSend: function(request) {                
           request.setRequestHeader("token", token);
        },
        success:function(res){
          callback(res);
        },
        error:function(res){
            layer.msg("网络异常");
        }
    });
}
globalfunc.timetostr=function(timestamp) {
  var date = new Date(parseInt(timestamp) * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;// ':' + second;
}
globalfunc.timetostrnohm=function(timestamp) {
  var date = new Date(parseInt(timestamp) * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d// ':' + second;
}
if(!window.localStorage){ 
layer.msg('您的浏览器不支持本地储存,请更换浏览器以做到更好的体验',{icon:5}); 
}
globalfunc.setsessionStorage=function(key,value){
  localStorage.setItem(key,value);
}
globalfunc.getsessionStorage=function(key){
  return localStorage.getItem(key);
}
globalfunc.clearsessionStorage=function(key){
  localStorage.removeItem(key);
}


// globalfunc.setlocalStorage=function(key,value){
// 	localStorage.setItem(key,value);
// }
// globalfunc.getlocalStorage=function(key){
// 	return localStorage.getItem(key);
// }
// globalfunc.clearlocalStorage=function(key){
// 	localStorage.removeItem(key);
// }

