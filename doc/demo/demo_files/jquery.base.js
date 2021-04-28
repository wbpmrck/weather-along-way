/**
 * @author  Lyca,qmzmxfy@vip.qq.com
**/
var base = {
  cookie:function(n,v,opt){//cookie操作:键,值,其他参数(e:1有效期1天;e:-1删除cookie;e:0会话cookie)
    if(typeof v!='undefined'){
      opt = $.extend({e:0,p:'/',d:location.hostname,date:new Date()},opt);
      opt.date.setTime(opt.date.getTime()+opt.e*24*60*60*1000);
      opt.date = opt.e!=0?opt.date.toGMTString():'';
      document.cookie = n+"="+escape(v)+";expires="+opt.date+";path="+opt.p+";domain="+opt.d;
    }else{
      var v = document.cookie.match(new RegExp('(^| )'+n+'=([^;]*)(;|$)'));
      return v!=null?unescape(v[2]):v;
    };
  },
  linkPar:function(key,v){//url取值:键名,字符串
    v = v?v:location.href;
    return (v.match(new RegExp("(?:\\?|&)"+key+"=(.*?)(?=&|$)"))||['',null])[1];  
  },
  cutStr:function(s,l,nodot){//字符串截取:字符串,长度,省略号
    var temp = '',sc = '',
        m = nodot?l:l-3,n = 0,
        reg=/[^\x00-\xff]/g,
        sl = s.replace(reg,'**').length;
    if(!l){return sl};
    if(l>=sl){return s};
    for(var i=0;i<s.length;i++){ 
      sc = s.charAt(i);
      n = reg.exec(sc)?n+2:n+1;
      if(n>=m){break};
      temp+=sc;
    };
    if(!nodot){temp = temp.concat('...')};
    return temp;
  },
  randomNumber:function(x,y){//生成包含x-y之间的随机数
    return Math.floor(Math.random()*(y-x+1)+x);
  },
  thousandFormat:function(s){//千位分隔符:数值
    var decimal;
    if(/[^0-9\.]/.test(s)){
      return s;
    }else{
      s = s.toString().split('.');
      decimal = s[1];
      s = s[0]+',';
    };
    var reg = /(\d)(\d{3},)/;
    while(reg.test(s)){
      s = s.replace(reg,"$1,$2");
      s = s.replace(/,(\d\d)$/,".$1");
    };
    return s.replace(/\,$/,'')+(decimal?'.'+decimal:'');
  },
  date:function(format,stamp){//类型,时间戳
    var D = stamp||new Date(),
      dd,
      format = format||'Y-M-D H:I:S',
      week = [['Sun','Mon','Tues','Wed','Thur','Fri','Sat'],['\u65e5','\u4e00','\u4e8c','\u4e09','\u56db','\u4e94','\u516d']],
      double = function(v){
        return v = v>9?v:'0'+v;
      };
    if(/^\d+$/.test(D)){D = D.toString().length==10?new Date(D*1000):new Date(D)};
    dd = {
      'year':D.getYear(),
      'month':D.getMonth()+1,
      'date':D.getDate(),
      'day':week[0][D.getDay()],
      'Day':week[1][D.getDay()],
      'hours':D.getHours(),
      'minutes':D.getMinutes(),
      'seconds':D.getSeconds()
    };
    dd.G = dd.hours>12?'PM'+double(dd.hours-12):'AM'+double(dd.hours);
    dd.g = dd.hours>12?'PM'+(dd.hours-12):'AM'+dd.hours;
    var oType = {
      'Y':D.getFullYear(),//2015年
      'y':dd.year,//115年(-1900)
      'M':double(dd.month),//08月
      'm':dd.month,//8月
      'D':double(dd.date),//04日
      'd':dd.date,//4日
      'W':dd.Day,//周日
      'w':dd.day,//Sun
      'H':double(dd.hours),//15点
      'h':dd.hours,//15点
      'G':dd.G,//PM03点
      'g':dd.g,//PM3点
      'I':double(dd.minutes),//08分
      'i':dd.minutes,//8分
      'S':double(dd.seconds),//09秒
      's':dd.seconds//9秒
    };
    for(var i in oType){
      format = format.replace(i,oType[i]);
    };
    return format;
  },
  countdown:function(t,process,handler,andDay){//倒计时:总秒数,过程,结束,是否包含日(默认包含)
    var ctInterval,
      double = function(n){
        $.each(n,function(i,v){
          n[i] = v>9?v:'0'+v;
        })
        return n;
      },
      takeCount = function(){
        t--;
        if(t>=0){
          var d = parseInt(t/24/3600),
            h = parseInt((t-d*24*3600)/3600),
            m = parseInt((t-d*24*3600-h*3600)/60),
            s = t-d*24*3600-h*3600-m*60,
            H = !andDay?h:(h+d*24),
            arr = double([d,H,m,s]);
          process&&process(arr);
        };
        if(t==0){
          clearInterval(ctInterval);
          handler&&handler();  
        };
      };
    takeCount();
    ctInterval = setInterval(takeCount,1000);
  },
  msecCountdown:function(t,msecProcess,process,handler,andDay){//毫秒倒计时:总秒数,毫秒过程,过程,结束,是否包含日(默认包含)
    var msecInterval;
    base.countdown(t,function(arr){
      clearInterval(msecInterval);
      var ms = 100,
        double = function(v){
          return v = v>9?v:'0'+v;
        };
      msecInterval = setInterval(function(){
        ms--;
        msecProcess&&msecProcess(double(ms));
      },10);
      process&&process(arr);
    },function(){
      clearInterval(msecInterval);
      handler&&handler();
    },andDay);
  },
  clipboard:function(v,handler){//复制到剪切板:值,回调函数
    if(window.clipboardData){
      window.clipboardData.setData("Text",v);
      handler&&handler(v);
    }else{
      alert('\u5f53\u524d\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6b64\u590d\u5236\u529f\u80fd\uff0c\u8bf7\u4f7f\u7528ctrl+c\u6216\u9f20\u6807\u53f3\u952e\u3002');
    };  
  },
  addBookmark:function(o,u,t){//加入到收藏夹:DOM,链接,标题
    var  $o = $(o),
      ua = navigator.userAgent.toLowerCase(),
      ctrl = ua.indexOf('mac')!=-1?'Command/Cmd':'CTRL',
      url = u?u:location.href,
      title = t?t:document.title,
      allno = '\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301,\u8bf7\u5c1d\u8bd5 '+ctrl+'+D \u624b\u52a8\u6536\u85cf\uff01';
    $o.attr({'rel':'sidebar','href':url,'title':title});  
    $o.click(function(){
      if(ua.indexOf("360se")>-1){
        alert(allno);
      }else if(ua.indexOf("msie 8")>-1){
        window.external.AddToFavoritesBar(url,title);
      }else if(document.all){
        try{
          window.external.addFavorite(url,title);
        }catch(e){
          alert(allno);
        };
      }else if(window.sidebar){
        if(window.sidebar.addPanel){
          window.sidebar.addPanel(title,url,'');
        }else{
          return true;
        };
      }else{
        alert(allno);
      };
      return false;
    });
  },
  lockClick:function(obj,handler,t,bind){//解锁:base.lockClick(obj);ajaxPrefilter亦可;
    var $obj = $(obj),t = t?t:'click',d = 'data-disabled',
      f = function(){
        if($(this).attr(d)!=='false'){
          $(this).attr(d,false);
          handler(this);
        };
      };
    if(handler==='lock'){
      $obj.attr(d,false);
    }else if(typeof(handler)!=='function'){
      $obj.attr(d,true);
    }else if($obj[0]&&!bind){
      $obj.on(t,f);
    }else{
      $(document).on(t,obj,f);
    };
  },
  seamless:function(o,t,h){//无缝滚动:DOM,时间,高度
    var $o = $(o),
      t = t?t:40;
    h&&$o.height(h);
    $o.css(overflow,'hidden').children().clone().appendTo($o);
    var $a = $o.children().eq(0),
      $b = $o.children().eq(1),
      aH = $a.outerHeight(),
      myMar = setInterval(marquee,t),
      marquee = function(){
        var aT = $a.offset().top,
          bT = $b.offset().top,
          oS = $o.scrollTop();
        if(bT-aT<=oS){
          $o.scrollTop(oS-aH);
        }else{
          $o.scrollTop(oS+1);
        };  
      };
    $o.hover(function(){
      clearInterval(myMar);
    },function(){
      myMar = setInterval(marquee,t);
    });
  },
  focusMode:function(o,v,focusC){//input焦点提示:DOM,值,颜色
    var $o = $(o),
      blurC = $o.css("color");
    if('placeholder' in document.createElement('input')){
      $o.attr('placeholder',v);
    }else{
      $o.val(v).focus(function(){
        if($(this).val()==v){
          $(this).val("");
          if(focusC){$(this).css("color",focusC)};
        };
      }).blur(function(){
        if($(this).val()==""){
          $(this).val(v).css("color",blurC);
        };
      });
    };
  },
  hoverSwitch:function(way,hoverThis,hoverClass,switchObject,n,speed,interval){
    var canSwitch = true;
    function switchNow($this,canSwitch){
      var switchObjectLen = switchObject.length,
          NowIndex = $this.index(),
          css_z = "z-index";
      $this.addClass(hoverClass).siblings().removeClass(hoverClass);
      for(var i=0;i<switchObjectLen;i++){
        var $nowLi = $(switchObject[i]+":eq("+NowIndex+")"),
            $nowLi_s = $nowLi.siblings(),
            $visible = $(switchObject[i]+":visible"),
            visible_z = parseInt($visible.css(css_z));
        visible_z = visible_z?visible_z:1;
        if(speed){
          if(interval){canSwitch = false};
          $nowLi_s.css(css_z,visible_z-1).stop();
          $nowLi.css(css_z,visible_z).fadeTo(speed,1,function(){
            $nowLi_s.hide();
            if(interval){canSwitch = true};
          });
        }else{
          $nowLi.show();
          $nowLi_s.hide();  
        };
      };
    };
    function autoSwitch(){
      var autoLen = $(hoverThis).length;
      if(canSwitch){
        var i = $(hoverThis).filter(function(index){
          if($(this).hasClass(hoverClass)){
            return $(this);  
          };
        }).index();
        i++;
        if(i>=autoLen){i=0};
        switchNow($(hoverThis+":eq("+i+")"),canSwitch);
      };
    };
    if(way){
      $(hoverThis).on(way,function(){
        var $this = $(this);
        switchNow($this);
      });
      $(hoverThis+":eq("+n+")").trigger(way);
    }else{
      $(hoverThis).mouseenter(function(){
        switchNow($(this));
      });
      $(hoverThis+":eq("+n+")").mouseenter();
    };
    if(interval){
      setInterval(autoSwitch,interval);
      $(hoverThis+","+switchObject[0]).hover(function(){
        canSwitch = false;
      },function(){
        canSwitch = true;
      });
    };
  },
  page:function(m,n){//页码生成:当前页码,总页码;
    var pageShow = 10,
      prevClass = m==1?' page_prev_none':'',
      prevHtml = '<span class="page_prev'+prevClass+'" data-page="'+(m-1)+'">&lt;</span>',
      nextClass = m==n?' page_next_none':'',
      nextHtml = '<span class="page_next'+nextClass+'" data-page="'+(m+1)+'">&gt;</span>',
      moreHtml = '<span class="page_more">...</span>',
      currClass = '',
      pageHtml = '',
      middleHtml = '',
      firstPageHtml = '<span data-page="1">1</span>',
      lastPageHtml = '<span data-page="'+n+'">'+n+'</span>',
      loopPage = function(x,y){
        for(var i=x;i<=y;i++){
          currClass = i==m?'curr':'';
          pageHtml+='<span data-page="'+i+'" class="'+currClass+'">'+i+'</span>';
        };
        return pageHtml;
      };
    if(n>pageShow){
      if(m<pageShow-1){
        middleHtml = loopPage(1,pageShow-2)+moreHtml+lastPageHtml;  
      }else if(m>n-3){
        middleHtml = firstPageHtml+moreHtml+loopPage(n-7,n);
      }else{
        middleHtml = loopPage(m-7,m)+moreHtml+lastPageHtml;  
      };
    }else{
      middleHtml = loopPage(1,n);
    };
    return prevHtml+middleHtml+nextHtml;
  },
  snsShare:function(txt,img,url){
    window._bd_share_config={
      "common":{
        "bdSnsKey":{},
        "bdText":txt,
        "bdUrl":url,
        "bdMini":"2",
        "bdMiniList":false,
        "bdPic":img,
        "bdStyle":"1",
        "bdSize":"32"
      },
      "share":{}
    };
    with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];  
  },
  backToTop:function($o,w,a){
    base.plugin.alert(function(){
      $o.XYalert({width:-1000,height:100,top:"bottom",Mask:false});
    });
    backShow($(window));
    $(window).scroll(function(){
      backShow($(this));  
    });
    function backShow($w){
      var sH = $w.scrollTop();
      if(sH>500){
        $o.find(w).css("display","block");
      }else{
        $o.find(w).hide();
      };  
    };
    $o.find(a).click(function(){
      $("html,body").animate({"scrollTop":0});  
    });
  },
  ajax:function(url,handler,type){
		if(!url){
			handler();	
		}else{
			$.ajax({
        //type:type?type:'GET',
        type:'POST',
				url:url,
        dataType:'script',
        contentType:'application/x-www-form-urlencoded;charset=UTF-8',
				async:false,
        cache:false,
				success:function(json){handler&&handler(json)}
			});
		};
  }
};
