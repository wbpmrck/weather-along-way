!function(){var e={},n={},a={wa_fev:"2019-4-1_14-41-12",id:"1",dm:['weather.com.cn'],etrk:[],ctrk:!0,heats:['weather.com.cn','http://news.weather.com.cn/','http://www.weather.com.cn/life/'],align:1,nv:0,vdur:18e5,age:31536e6,med:0,cvcf:['test'],abid:"",sd:"",sds:[".xyn-cont-time a", ".articleInfo span"]};n.browser={},n.browser.isie=/msie (\d+\.\d+)/i.test(navigator.userAgent),n.browser.isVer=/msie (\d+\.\d+)/i.test(navigator.userAgent)?document.documentMode||+RegExp.$1:void 0,n.browser.cookieEnabled=navigator.cookieEnabled,n.browser.javaEnabled=navigator.javaEnabled(),n.browser.language=navigator.language||navigator.browserLanguage||navigator.systemLanguage||navigator.userLanguage||"",n.browser.density=(window.screen.width||0)+"x"+(window.screen.height||0),n.browser.colorDepth=window.screen.colorDepth||0,n.cookie={set:function(t,e,n){var a;n.age&&(a=new Date,a.setTime(a.getTime()+n.age)),document.cookie=t+"="+e+(n.domain?"; domain="+n.domain:"")+(n.path?"; path="+n.path:"")+(a?"; expires="+a.toGMTString():"")+(n.secure?"; secure":"")},get:function(t){return(t=RegExp("(^| )"+t+"=([^;]*)(;|$)").exec(document.cookie))?t[2]:null}},n.dom={getElementById:function(t){return document.getElementById(t)},parentLink:function(t){var e;for(e="A";(t=t.parentNode)&&1==t.nodeType;)if(t.tagName==e)return t;return null},path:function(t,e){var n=[],a=[];if(!t)return a;for(;t.parentNode!=u;){for(var o=0,i=0,r=t.parentNode.childNodes.length,d=0;d<r;d++){var s=t.parentNode.childNodes[d];if(s.nodeName===t.nodeName&&(o++,s===t&&(i=o),0<i&&1<o))break}if((r=""!==t.id)&&e){n.unshift("#"+encodeURIComponent(t.id));break}r&&(r="#"+encodeURIComponent(t.id),r=0<n.length?r+">"+n.join(">"):r,a.push(r)),n.unshift(encodeURIComponent(String(t.nodeName).toLowerCase())+(1<o?"["+i+"]":"")),t=t.parentNode}return a.push(n.join(">")),a},getPath:function(e){return(e=n.dom.path(e,t))&&e.length?String(e[0]):""}},(n.dom.ready=function(){function t(){if(!t.isReady){t.isReady=!0;for(var e=0,n=o.length;e<n;e++)o[e]()}}function e(){try{document.documentElement.doScroll("left")}catch(t){return void setTimeout(e,1)}t()}var n,a=!1,o=[];return document.addEventListener?n=function(){document.removeEventListener("DOMContentLoaded",n,!1),t()}:document.attachEvent&&(n=function(){"complete"===document.readyState&&(document.detachEvent("onreadystatechange",n),t())}),function(){if(!a)if(a=!0,"complete"===document.readyState)t.isReady=!0;else if(document.addEventListener)document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",t,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",n),window.attachEvent("onload",t);var o=!1;try{o=null==window.frameElement}catch(t){}document.documentElement.doScroll&&o&&e()}}(),function(e){t.isReady?e():o.push(e)}}()).isReady=!1,n.eventUtil={addHandler:function(t,e,n){t.attachEvent?t.attachEvent("on"+e,function(e){n.call(t,e)}):t.addEventListener&&t.addEventListener(e,n,!1)},preventDefault:function(t){t.preventDefault?t.preventDefault():t.returnValue=!1}},n.util={is:function(t,e){return"[object "+e+"]"==={}.toString.call(t)},isNumber:function(t){return this.is(t,"Number")&&isFinite(t)},isString:function(t){return this.is(t,"String")},checkUrl:function(t){for(var e=!1,n=a.heats,o=0,i=n.length;o<i;o++)if(n[o].replace(/\/$/,"")==t.replace(/\/$/,"")){e=!0;break}return e}},n.util.stringify=function(){function t(t){return/["\\\x00-\x1f]/.test(t)&&(t=t.replace(/["\\\x00-\x1f]/g,function(t){var e=a[t];return e?e:(e=t.charCodeAt(),"\\u00"+Math.floor(e/16).toString(16)+(e%16).toString(16))})),'"'+t+'"'}function e(t){return 10>t?"0"+t:t}var a={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};return function(a){switch(typeof a){case"undefined":return"undefined";case"number":return isFinite(a)?String(a):"null";case"string":return t(a);case"boolean":return String(a);default:if(null===a)return"null";var o,i,r=!0;if(a instanceof Array){for(var i,o=["["],r=!0,d=0,s=a.length;d<s;d++)switch(i=a[d],typeof i){case"undefined":case"function":case"unknown":break;default:r||o.push(","),r=!1}return o.push("]"),o.join("")}if(a instanceof Date)return'"'+a.getFullYear()+"-"+e(a.getMonth()+1)+"-"+e(a.getDate())+"T"+e(a.getHours())+":"+e(a.getMinutes())+":"+e(a.getSeconds())+'"';o=["{"],r=!0;for(key in a)if(Object.prototype.hasOwnProperty.call(a,key))switch(i=a[key],typeof i){case"undefined":case"unknown":case"function":break;default:r||o.push(","),r=!1,o.push(n.util.stringify(key)+":"+n.util.stringify(i))}return o.push("}"),o.join("")}}}(),n.localStorage={init:function(){if(!n.localStorage.input)try{n.localStorage.input=document.createElement("input"),n.localStorage.input.type="hidden",n.localStorage.input.style.display="none",n.localStorage.input.addBehavior("#default#userData"),document.getElementsByTagName("head")[0].appendChild(n.localStorage.input)}catch(t){return!1}return!0},set:function(t,e,a){var o=new Date;o.setTime(o.getTime()+a||31536e6);try{window.localStorage?(e=o.getTime()+"|"+e,window.localStorage.setItem(t,e)):n.localStorage.init()&&(n.localStorage.input.expires=o.toUTCString(),n.localStorage.input.load(document.location.hostname),n.localStorage.input.setAttribute(t,e),n.localStorage.input.save(document.location.hostname))}catch(t){}},get:function(t){if(window.localStorage){if(t=window.localStorage.getItem(t)){var e=t.indexOf("|"),a=t.substring(0,e)-0;if(a&&a>(new Date).getTime())return t.substring(e+1)}}else if(n.localStorage.init())try{return n.localStorage.input.load(document.location.hostname),n.localStorage.input.getAttribute(t)}catch(t){}return null},remove:function(t){if(window.localStorage)window.localStorage.removeItem(t);else if(n.localStorage.init())try{n.localStorage.input.load(document.location.hostname),n.localStorage.input.removeAttribute(t),n.localStorage.input.save(document.location.hostname)}catch(t){}}},n.sessionStorage={set:function(t,e){if(window.sessionStorage)try{window.sessionStorage.setItem(t,e)}catch(t){}},get:function(t){return window.sessionStorage?window.sessionStorage.getItem(t):null},remove:function(t){window.sessionStorage&&window.sessionStorage.removeItem(t)}},n.ca={log:function(t,e){var n=new Image,a="mini_tangram_log_"+Math.floor(2147483648*Math.random()).toString(36);window[a]=n,n.onload=n.onerror=n.onabort=function(){n.onload=n.onerror=n.onabort=null,n=window[a]=null,e&&e(t)},n.src=t}},n.flashPlugin={getFlashVersion:function(){var t="";if(navigator.plugins&&navigator.mimeTypes.length){var e=navigator.plugins["Shockwave Flash"];e&&e.description&&(t=e.description.replace(/^.*\s+(\S+)\s+\S+$/,"$1"))}else if(window.ActiveXObject)try{(e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))&&(t=e.GetVariable("$version"))&&(t=t.replace(/^.*\s+(\d+),(\d+).*$/,"$1.$2"))}catch(t){}return t},getFlashObject:function(t,e,n,a,o){return'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="'+t+'" width="'+n+'" height="'+a+'"><param name="movie" value="'+e+'" /><param name="flashvars" value="'+(o||"")+'" /><param name="allowscriptaccess" value="always" /><embed type="application/x-shockwave-flash" name="'+t+'" width="'+n+'" height="'+a+'" src="'+e+'" flashvars="'+(o||"")+'" allowscriptaccess="always" /></object>'}},n.urlUtil={getParam:function(t,e){var n=t.match(RegExp("(^|&|\\?|#)("+e+")=([^&#]*)(&|$|#)",""));return n?n[3]:null},$a:function(t){return(t=t.match(/^(https?:)\/\//))?t[1]:null},_getHostName:function(t){return(t=t.match(/^(https?:\/\/)?([^\/\?#]*)/))?t[2].replace(/.*@/,""):null},getHostName:function(t){return(t=this._getHostName(t))?t.replace(/:\d+$/,""):t},Za:function(t){return(t=t.match(/^(https?:\/\/)?[^\/]*(.*)/))?t[2].replace(/[\?#].*/,"").replace(/^$/,"/"):null}},e.getProtocol=function(){for(var t=!1,e=document.getElementsByTagName("script"),n=e.length,n=100<n?100:n,a=0;a<n;a++){var o=e[a].src;if(o&&(0===o.indexOf("https://analyse.weather.com.cn:80/js/v1/wa")||0===o.indexOf("https://analyse.weather.com.cn/js/v1/wa"))){t="https:";break}}return t},e.options={host:"analyse.weather.com.cn",imgApi:function(){return this.imgApiUrl?this.imgApiUrl:this.imgApiUrl=this.protocol_embed+"//"+this.host+"/ma.gif"},timeStart:0,timeEnd:Math.round(+new Date/1e3),sn:Math.round(+new Date/1e3)%65535,protocol:"https:"===document.location.protocol?"https:":"http:",protocol_embed:e.getProtocol()||"https:"===document.location.protocol?"https:":"http:",hotClickTrackInterval:6e5,eventCacheSize:5,maxLength:1024,embedEnabled:1,r:2147483647,eventParams:"abid cc cf ci ck cl ds ep et fl ja ln lo lt nv rnd si st su v cv lv api sn u tt sd".split(" ")},function(){return e.Events={listeners:{},on:function(t,e){this.listeners[t]=this.listeners[t]||[],this.listeners[t].push(e)},trigger:function(t,e){this.listeners[t]=this.listeners[t]||[];for(var n=this.listeners[t].length,a=0;a<n;a++)this.listeners[t][a](e)}}}(),function(){function t(t,e){var a=document.createElement("script");a.charset="utf-8",n.util.is(e,"Function")&&(a.readyState?a.onreadystatechange=function(){"loaded"!==a.readyState&&"complete"!==a.readyState||(a.onreadystatechange=null,func())}:a.onload=function(){e()}),a.src=t;var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(a,o)}return e.load=t}(),function(){var t={init:function(){n.eventUtil.addHandler(document,"click",t.docClickHandler());for(var e=a.etrk.length,o=0;o<e;o++){var i=a.etrk[o],r=n.dom.getElementById(decodeURIComponent(i.id));r&&n.eventUtil.addHandler(r,i.eventType,this.btnHandler())}},btnHandler:function(){return function(t){(t.target||t.srcElement).setAttribute("HM_fix",t.clientX+":"+t.clientY),e.wa.data.et=1,e.wa.data.ep=JSON.stringify({id:this.id,eventType:t.type,sd:a.sd}),e.wa.data.sd=a.sd,e.wa.track()}},docClickHandler:function(){return function(t){var n=t.target||t.srcElement;if(n&&n.getAttribute){var o=n.getAttribute("HM_fix"),r=t.clientX+":"+t.clientY;if(o&&o==r)n.removeAttribute("HM_fix");else if(o=a.etrk.length,0<o){for(r={};n&&n!=document.body;)n.id&&(r[n.id]=""),n=n.parentNode;for(i=0;i<o;i++){var d=decodeURIComponent(a.etrk[i].id);r.hasOwnProperty(d)&&(e.wa.data.et=1,e.wa.data.ep=JSON.stringify({id:d,eventType:t.type,sd:a.sd}),e.wa.data.sd=a.sd,e.wa.track())}}}}}};return e.Events.on("pv-b",t.init),t}(),function(){var t=document.location.href;t=t.split("?")[0];var o=[],i={init:function(){a.ctrk&&a.heats&&a.heats.length>0&&n.util.checkUrl(t)&&(n.eventUtil.addHandler(document,"mouseup",function(t){var n=i.genEventDatas(t);if(""!==n){var a=(e.options.imgApi()+"?"+e.wa.genParams().replace(/ep=[^&]*/,"ep="+encodeURIComponent("["+n+"]"))).length,r=o.join(",")+(o.length?",":""),d=a+encodeURIComponent(r).length+(e.options.r+"").length;d>e.options.maxLength&&i.track(),o.push(n),(o.length>=e.options.eventCacheSize||/\"t\":\"a\"/.test(n))&&i.track()}}),n.eventUtil.addHandler(window,"unload",function(){i.track()}),setInterval(function(){i.track()},e.options.hotClickTrackInterval))},getPageXY:function(t){if(null==t.pageX&&null!=t.clientX){var e=document.documentElement,n=document.body;t.pageX=t.clientX+(e&&e.scrollLeft||n&&n.scrollLeft||0)-(e&&e.clientLeft||n&&n.clientLeft||0),t.pageY=t.clientY+(e&&e.scrollTop||n&&n.scrollTop||0)-(e&&e.clientTop||n&&n.clientTop||0)}return{pageX:t.pageX,pageY:t.pageY}},genEventDatas:function(t){if(0===e.options.embedEnabled){var o=t.target||t.srcElement,r=o.tagName.toLowerCase();if("embed"==k||"object"==r)return""}var d,s,c=i.getPageXY(t);d=c.pageY,s=c.pageX;var l=window.innerWidth||document.documentElement.clientWidth||document.body.offsetWidth;switch(a.align){case 1:s-=l/2;break;case 2:s-=l}return s='{"x":'+s+',"y":'+d+",",o=t.target||t.srcElement,o="a"==o.tagName.toLowerCase()?o:n.dom.parentLink(o),s+=o?'"t":"a","u":"'+encodeURIComponent(o.href)+'"}':'"t":"b"}'},track:function(){0!==o.length&&(e.wa.data.et=2,o=JSON.parse("["+o.join(",")+"]"),e.wa.data.ep=JSON.stringify(o),e.wa.data.sd=a.sd,e.wa.track(),o=[])}};return e.Events.on("pv-b",i.init),i}(),function(){function t(){return function(){e.wa.data.st=4,e.wa.data.et=3,e.wa.data.ep=JSON.stringify({st:e.unload.stayTime(),vt:e.unload.viewTime()}),e.wa.data.sd=a.sd,e.wa.track()}}function o(){clearTimeout(d);var t;v&&(t="visible"==document[v]),w&&(t=!document[w]),l="undefined"==typeof t||t,c&&u||!l||!f?!c||!u||l&&f||(p=!1,g+=+new Date-m):(p=!0,m=+new Date),c=l,u=f,d=setTimeout(o,100)}function i(t){var e=document,n="";if(t in e)n=t;else for(var a=["webkit","ms","moz","o"],o=0;o<a.length;o++){var i=a[o]+t.charAt(0).toUpperCase()+t.slice(1);if(i in e){n=i;break}}return n}function r(t){("focus"!=t.type&&"blur"!=t.type||!t.target||t.target==window)&&(f="focus"==t.type||"focusin"==t.type,o())}var d,s=n.eventUtil,c=!0,l=!0,u=!0,f=!0,h=+new Date,m=h,g=0,p=!0,v=i("visibilityState"),w=i("hidden");return o(),function(){var t=v.replace(/[vV]isibilityState/,"visibilitychange");s.addHandler(document,t,o),s.addHandler(window,"pageshow",o),s.addHandler(window,"pagehide",o),"object"==typeof document.onfocusin?(s.addHandler(document,"focusin",r),s.addHandler(document,"focusout",r)):(s.addHandler(window,"focus",r),s.addHandler(window,"blur",r))}(),e.unload={stayTime:function(){return+new Date-h},viewTime:function(){return p?+new Date-m+g:g}},e.Events.on("pv-b",function(){s.addHandler(window,"unload",t())}),e.unload}(),function(){function t(t){return t.replace?t.replace(/'/g,"'0").replace(/\*/g,"'1").replace(/!/g,"'2"):t}var o={cmdList:[],F:0,$:!1,init:function(){o.e=0,e.Events.on("pv-b",function(){o._create(),o._init()}),e.Events.on("pv-d",o._pageDone),e.Events.on("stag-b",function(){e.wa.data.api=o.e||(o.F?o.e+"_"+o.F:"")}),e.Events.on("stag-d",function(){e.wa.data.api=0,o.e=0,o.F=0})},_create:function(){var t=window._wat||[];t&&!n.util.is(t,"Array")||(window._wat={id:a.id,cmd:{},push:function(){for(var t=window._wat,e=0;e<arguments.length;e++){var a=arguments[e];n.util.is(a,"Array")&&(t.cmd[t.id].push(a),"_setAccount"===a[0]&&1<a.length&&/^[0-9a-f]{32}$/.test(a[1])&&(a=a[1],t.id=a,t.cmd[a]=t.cmd[a]||[]))}}},window._wat.cmd[a.id]=[],window._wat.push.apply(window._wat,t))},_init:function(){var t=window._wat;if(t&&t.cmd&&t.cmd[a.id])for(var e=t.cmd[a.id],n=/^_track(Event|MobConv|Order|RTEvent)$/,i=0,r=e.length;i<r;i++){var d=e[i];n.test(d[0])?o.cmdList.push(d):o.handle(d)}t.cmd[a.id]={push:o.handle}},_pageDone:function(){if(o.cmdList.length>0)for(var t=0,e=o.cmdList.length;t<e;t++)o.handle(o.cmdList[t]);o.cmdList=null},handle:function(t){var e=t[0];o.hasOwnProperty(e)&&n.util.is(o[e],"Function")&&o[e](t)},_setAccount:function(t){1<t.length&&/^[0-9a-f]{32}$/.test(t[1])&&(o.e|=1)},_setAutoPageview:function(t){1<t.length&&(t=t[1],!1===t||!0===t)&&(o.e|=2,e.wa.autoPv=t)},_trackPageview:function(t){o.e|=4,e.wa.data.et=0,e.wa.data.ep="",e.wa.data.sd=a.sd,e.wa.N?(e.wa.data.nv=0,e.wa.data.st=4):e.wa.N=!0;var n=e.wa.data.u,i=e.wa.data.su;1<t.length&&t[1].charAt&&"/"===t[1].charAt(0)?e.wa.data.u=e.options.protocol+"//"+document.location.host+t[1]:e.wa.data.u=document.location.href,o.$||(e.wa.data.su=document.location.href),e.wa.track(),e.wa.data.u=n,e.wa.data.su=i},_trackEvent:function(n){if(!(n.length<=2)){var i=n[1],r=n[2],d=n[3],s=n[4];o.e|=8,e.wa.data.nv=0,e.wa.data.st=4,e.wa.data.et=4,e.wa.data.ep=JSON.stringify({category:t(i),action:t(r),label:d?t(d):"",value:s?t(s):""}),e.wa.data.sd=a.sd,e.wa.track()}},_setCustomVar:function(n){if(n.length>=4){var i=n[1],r=n[2],d=n[3],s=n[4]||3;if(0<i&&6>i&&0<s&&4>s){o.F++;for(var c=(e.wa.data.cv||"*").split("!"),l=c.length;l<i-1;l++)c.push("*");c[i-1]=s+"*"+t(r)+"*"+t(d),e.wa.data.cv=c.join("!"),n=e.wa.data.cv.replace(/[^1](\*[^!]*){2}/g,"*").replace(/((^|!)\*)+$/g,""),""!==n?e.wa.setCache("Wa_cv_"+a.id,encodeURIComponent(n),a.age):e.wa.clearCache("Wa_cv_"+a.id)}}}};return o.init(),e.ka=o,e.ka}(),function(){function t(){"undefined"==typeof window["_wwa_loaded_"+a.id]&&(window["_wwa_loaded_"+a.id]=!0,this.data={},this.autoPv=!0,this.N=!1,this.init())}var o=n.urlUtil,r=n.cookie,d=n.browser;if(t.prototype={equal:function(t,e){t="."+t.replace(/:\d+/,""),e="."+e.replace(/:\d+/,"");var n=t.indexOf(e);return-1<n&&n+e.length===t.length},_equal:function(t,e){return t=t.replace(/^https?:\/\//,""),0===t.indexOf(e)},isSafeDomain:function(t){for(var e=0,n=a.dm.length;e<n;e++)if(-1<a.dm[e].indexOf("/")){if(this._equal(t,a.dm[e]))return!0}else{var i=o.getHostName(t);if(i&&this.equal(i,a.dm[e]))return!0}return!1},_getHostName:function(){for(var t=document.location.hostname,e=0,n=a.dm.length;e<n;e++)if(this.equal(t,a.dm[e]))return a.dm[e].replace(/(:\d+)?[\/\?#].*/,"");return t},_getPath:function(){for(var t=0,e=a.dm.length;t<e;t++){var n=a.dm[t];if(-1<n.indexOf("/")&&this._equal(document.location.href,n))return n.replace(/^[^\/]+(\/.*)/,"$1")+"/"}return"/"},getStayType:function(){if(!document.referrer)return e.options.timeEnd-e.options.timeStart>a.vdur?1:4;var t=!1;if(this.isSafeDomain(document.referrer)&&this.isSafeDomain(document.location.href))t=!0;else{var n=o.getHostName(document.referrer);t=this.equal(n||"",document.location.hostname)}return t?e.options.timeEnd-e.options.timeStart>a.vdur?1:4:3},getCache:function(t){try{return r.get(t)||n.sessionStorage.get(t)||n.localStorage.get(t)}catch(t){}},setCache:function(t,e,a){try{r.set(t,e,{domain:this._getHostName(),path:this._getPath(),age:a}),a?n.localStorage.set(t,e,a):n.sessionStorage.set(t,e)}catch(t){}},clearCache:function(t){try{r.set(t,"",{domain:this._getHostName(),path:this._getPath(),age:-1}),n.sessionStorage.remove(t),n.localStorage.remove(t)}catch(t){}},_create:function(){var t,n,o,r,d="Wa_lpvt_"+a.id,s="Wa_lvt_"+a.id;if(e.options.timeStart=this.getCache(d)||0,13===e.options.timeStart.length&&(e.options.timeStart=Math.round(e.options.timeStart/1e3)),n=this.getStayType(),t=4!==n?1:0,lvtData=this.getCache(s),lvtData){for(o=lvtData.split(","),i=o.length-1;0<=i;i--)13===o[i].length&&(o[i]=""+Math.round(o[i]/1e3));for(;2592e3<e.options.timeEnd-o[0];)o.shift();for(r=4>o.length?2:3,1===t&&o.push(e.options.timeEnd);4<o.length;)o.shift();lvtData=o.join(","),o=o[o.length-1]}else lvtData=e.options.timeEnd,o="",r=1;this.setCache(s,lvtData,a.age),this.setCache(d,e.options.timeEnd);var c=e.options.timeEnd===this.getCache(d)?"1":"0";0===a.nv&&this.isSafeDomain(document.location.href)&&(""===document.referrer||this.isSafeDomain(document.referrer))&&(t=0,n=4),this.data.nv=t,this.data.st=n,this.data.cc=c,this.data.lt=o,this.data.lv=r},genParams:function(){for(var t=[],n=0,a=e.options.eventParams.length;n<a;n++){var o=e.options.eventParams[n],i=this.data[o];"undefined"!=typeof i&&""!==i&&("tt"!==o||"tt"===o&&0===this.data.et)&&t.push(o+"="+encodeURIComponent(i))}switch(this.data.et){case 0:t.push("sn="+e.options.sn),this.data.rt&&t.push("rt="+encodeURIComponent(this.data.rt));break;case 3:t.push("sn="+e.options.sn);break;case 90:this.data.rt&&t.push("rt="+this.data.rt)}return t.push("_st="+(new Date).getTime()),t.join("&")},_init:function(){this._create(),this.data.abid=a.abid,this.data.si=a.id,this.data.su=document.referrer,this.data.ds=d.density,this.data.cl=d.colorDepth+"-bit",this.data.ln=String(d.language).toLowerCase(),this.data.ja=d.javaEnabled?1:0,this.data.ck=d.cookieEnabled?1:0,this.data.lo="number"==typeof _wwa_top?1:0,this.data.fl=n.flashPlugin.getFlashVersion(),this.data.v="1.0.0",this.data.cv=decodeURIComponent(this.getCache("Wa_cv_"+a.id)||""),this.data.tt=document.title||""},init:function(){try{this._init(),0===this.data.nv?this._trackUnsent():this._removeUnsent(".*"),e.wa=this,e.Events.trigger("pv-b"),this._trackPvd()}catch(o){var t=[];t.push("si="+a.id),t.push("n="+encodeURIComponent(o.name)),t.push("m="+encodeURIComponent(o.message)),t.push("r="+encodeURIComponent(document.referrer)),t.push("_st="+(new Date).getTime()),n.ca.log(e.options.imgApi()+"?"+t.join("&"))}},_trackPvd:function(){function t(){e.Events.trigger("pv-d")}this.autoPv?(this.N=!0,this.data.et=0,this.data.ep="",this.data.sd=a.sd,this.track(t)):t()},track:function(t){var a=this;a.data.rnd=Math.round(Math.random()*e.options.r),e.Events.trigger("stag-b");var o=e.options.imgApi()+"?"+a.genParams();e.Events.trigger("stag-d"),a._addUnsent(o),n.ca.log(o,function(e){a._removeUnsent(e),n.util.is(t,"Function")&&t.call(e)})},_addUnsent:function(t){var e=n.sessionStorage.get("Wa_unsent_"+a.id)||"",o=this.data.u?"":"&u="+encodeURIComponent(document.location.href),e=encodeURIComponent(t.replace(/^https?:\/\//,"")+o)+(e?","+e:"");n.sessionStorage.set("Wa_unsent_"+a.id,e)},_removeUnsent:function(t){var e=n.sessionStorage.get("Wa_unsent_"+a.id)||"";e&&(t=encodeURIComponent(t.replace(/^https?:\/\//,"")),t=RegExp(t.replace(/([\*\(\)])/g,"\\$1")+"(%26u%3D[^,]*)?,?","g"),(e=e.replace(t,"").replace(/,$/,""))?n.sessionStorage.set("Wa_unsent_"+a.id,e):n.sessionStorage.remove("Wa_unsent_"+a.id))},_trackUnsent:function(){var t=this,o=n.sessionStorage.get("Wa_unsent_"+a.id);if(o)for(var o=o.split(","),i=function(a){n.ca.log(e.options.protocol_embed+"//"+decodeURIComponent(a),function(e){t._removeUnsent(e)})},r=0,d=o.length;r<d;r++)i(o[r])}},e.WaClass=t,!a.sds||!a.sds.length)return e.wa=new t}(),function(){try{if(window.performance&&performance.timing&&"undefined"!=typeof e.wa){var t=(+new Date,function(t){var e=performance.timing,n=e[t+"Start"]?e[t+"Start"]:0,a=e[t+"End"]?e[t+"End"]:0;return{start:n,end:a,value:0<a-n?a-n:0}}),o=null;n.dom.ready(function(){o=+new Date});var i=function(){var n,o,i;i=t("navigation"),o=t("request"),i={netAll:o.start-i.start,netDns:t("domainLookup").value,netTcp:t("connect").value,srv:t("response").start-o.start,dom:performance.timing.domInteractive-performance.timing.fetchStart,loadEvent:t("loadEvent").end-i.start},n=document.referrer,n.match(/^(http[s]?:\/\/)?([^\/]+)(.*)/)||[],o=null,e.wa.data.et=87,e.wa.data.ep=JSON.stringify(i),e.wa.data.sd=a.sd,e.wa.track()};n.eventUtil.addHandler(window,"load",function(){setTimeout(i,500)})}}catch(t){}}(),function(){if("undefined"!=typeof e.wa&&n.util.is(a.cvcf,"Array")&&0<a.cvcf.length){var t={ga:function(){for(var t,e=a.cvcf.length,o=0;o<e;o++)t=n.dom.getElementById(decodeURIComponent(a.cvcf[o])),t&&n.eventUtil.addHandler(t,"click",this.handler())},handler:function(){return function(){e.wa.data.et=86;var t={n:"form",t:"clk"};t.id=this.id,e.wa.data.ep=JSON.stringify(t),e.wa.data.sd=a.sd,e.wa.track()}}};n.dom.ready(function(){t.ga()})}}(),function(){if(a.med&&"undefined"!=typeof e.wa){var t=+new Date,o={n:"anti",sb:0,kb:0,clk:0},i=function(){e.wa.data.et=86,e.wa.data.ep=JSON.stringify(o),e.wa.data.sd=a.sd,e.wa.track()};n.eventUtil.addHandler(document,"click",function(){o.clk++}),n.eventUtil.addHandler(document,"keyup",function(){o.kb=1}),n.eventUtil.addHandler(window,"scroll",function(){o.sb++}),n.eventUtil.addHandler(window,"unload",function(){o.t=+new Date-t,i()}),n.eventUtil.addHandler(window,"load",function(){setTimeout(i,5e3)})}}(),function(){function t(t){var e=Math.max(t.body.clientHeight,t.documentElement.clientHeight),n=Math.max(t.body.scrollHeight,t.documentElement.scrollHeight),a=Math.max(e,n);return a}var o=function(){var n=t(document),a=document.getElementById("wa_aoiframe"),o="//"+e.options.host+"/api/wa_ao.html?_st"+ +new Date+"&height="+n;a?a.src=o:(a=document.createElement("iframe"),a.style.width="0px",a.style.height="0px",a.style.display="none",a.id="wa_aoiframe",a.tabIndex=-1,a.title="统计采集用，勿删",a.src=o,document.body.appendChild(a))},i=document.location.href;i=i.split("?")[0],n.dom.ready(function(){a.ctrk&&a.heats&&a.heats.length>0&&n.util.checkUrl(i)&&o()})}(),function(){var t,o="function"==typeof $;t=o?$:function(e){if(/\b /.test(e)){var n=[];n=e.split(" ");for(var a=t(n[0]),o=1;o<n.length;o++){var i=[],r={};for(var d in a)switch(n[o].charAt(0)){case"#":u=n[o].replace(/^#/,""),0===i.length&&(i.push(document.getElementById(u)),r[i[0]]=1);for(var s in i)r[i[s]]||(i.push(document.getElementById(u)),r[i[s]]=1);break;case".":u=n[o].replace(/^\./,"");for(var c,l=document.createNodeIterator(a[d],NodeFilter.SHOW_ELEMENT,function(t){return new RegExp("^"+u+"$").test(t.className)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT},!1);c=l.nextNode();)i.push(c);break;default:if("string"==typeof a[d])break;for(var c,l=document.createNodeIterator(a[d],NodeFilter.SHOW_ELEMENT,function(t){return t.tagName.toLocaleLowerCase()===n[o]?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT},!1);c=l.nextNode();)i.push(c)}a=i}return a}var u;switch(e.charAt(0)){case"#":return u=e.replace(/^#/,""),document.getElementById(u);case".":u=e.replace(/^\./,"");for(var c,l=document.createNodeIterator(document,NodeFilter.SHOW_ELEMENT,function(t){return new RegExp("^"+u+"$").test(t.className)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT},!1),f=[];c=l.nextNode();)f.push(c);return f;default:return document.getElementsByTagName(e)}};var i=function(e){for(var n=t(e),a="",o=0,i=n.length;o<i;o++){var r=n[o].innerText;if(r&&(r.indexOf("来源：")>=0||r.indexOf("来源:")>=0)){a=r.replace("来源：","").replace("来源:","").trim();break}var d=n[o].parentNode?n[o].parentNode.innerText:"";if(d&&(d.indexOf("来源：")>=0||d.indexOf("来源:")>=0)){a=r;break}}return a};a.sds&&a.sds.length>0&&n.dom.ready(function(){var t=!1;if(a.sds.length)for(var n=0,o=a.sds.length;n<o;n++){var r=i(a.sds[n]);if(r){a.sd=r,e.wa=new e.WaClass,t=!0;break}}t||(e.wa=new e.WaClass)})}()}();