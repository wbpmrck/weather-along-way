import { findCity } from "../../libs/baidu-map/adcode";
import {callBaiduMapAPI,apis} from "../../libs/baidu-map/webapi-sdk"
import moment from "../../libs/moment/moment-wrapper"
Page({
  data: {
      //起始和结束地点信息
      from:"",
      fromCode:"",
      fromLat:"",
      fromLnt:"",
      to:"",
      toCode:"",
      toLat:"",
      toLnt:"",

      markerIdSeed:+new Date(), //生成自定义marker的种子
      startTime:"", //前面传入出发时间
      startTimeDesc:"", //出发时间描述

      endTime:new Date(), //地图导航的到达时间
      endTimeDesc:"", //到达时间描述

      weatherDesc:"",
      distance:0,//距离（米）
      distanceDesc:"",
      duration:0,//时长（秒）
      durationDesc:"",
      scale:16,
      polyline:[],
      //地图中心点经纬度
      mapCenter:{
        latitude: 31.8512,
        longitude: 117.26061,
      },
      markers: [],
      allRoutes:[],
      currentSelect:0,
  },
    parseTime(time){
        let timeDesc = moment(time).calendar();
        return timeDesc;
    },
    parseDuration(duration){
        let durationDesc = moment.duration(duration, "seconds").format('H小时m分钟');
        return durationDesc;
    },
    parseDistance(distance){
        let distanceDesc = `${ (distance/1000).toFixed(2)}公里`;
        return distanceDesc;
    },
    showRoute(idx){
        //从缓存的路线数据中获取要展示的数据信息
        let cachedData = this.data.allRoutes[idx];
        //console.log(cachedData);
        console.log('切换路线:',idx);
        console.log('中心点:');
        console.log(cachedData.mapCenter);
        //设置当前选择的下标
        this.setData(cachedData);
        wx.showToast({ title: '切换路线成功' })
    },
    chooseRoute:function(evt){
        let idx = evt.currentTarget.dataset.idx;
        //console.log('切换路线:',idx);
        this.showRoute(idx);
    },

    // TODO:完善路径的城市信息
    fullfillRouteInfo:async function(){
        //首先，每个路径的起始、终止点的城市信息，可以直接赋值为查询条件
        //针对其他check点，调用接口进行逆地理位置编码，获取所属城市信息
        //对城市进行去重复，按照起点--->终点 方向，保留第一次出现的城市的check point
    },

    /**
     * 根据传入的路径信息，得到地图的绘制相关信息
     * 1、本方法不采用百度地图返回的城市编码，而是采用总里程按照N公里等分法
     * @param {*} routeData 
     * @param {*} gutterDistance : 间隔多少公里进行城市采点
     */
    genRouteData2: function(routeData,gutterDistance){
        const { distance, duration, steps,origin, destination, routes } = routeData;

        console.log(`获取到路程时长:${duration}秒`)
        console.log(`获取到路程:${distance}米`)

        let newPath = []; //存放所有要绘制的图形信息
        let markers =[]; // 存放所有的路过标记物
        let passedAdcodes ={}; //保存经过的城市编码:城市名称
        let cityMakers ={};//name:true 记录哪些城市已经标记过了

        let distanceLeft = 0; //保存当前未参与checkPoint的里程数
        const gutter = gutterDistance || 50; //默认50公里做一个城市check点

        let beginCity =""; //保存起始城市

        console.log(`step.length:${steps.length}`);
        steps && steps.forEach((step, index) => {
           let {path,start_location,distance} = step;

           let points = path.split(";");
           console.log(`points.length:${points.length}`);
           let pointsCount = points.length;
           let avgPointGutter = distance/pointsCount;

           //逐个Path点积累里程数
           points.forEach( (p,idx)=>{
                distanceLeft += avgPointGutter;
                //如果是第一个点，又或者当前总路径积累到的要check的程度,又或当前是最后一个路径点(最后的点固定加入marker)
                if( markers.length===0 || (distanceLeft >= gutter * 1000) || (index === steps.length-1 && idx === points.length-1) ){
                    // 开始新增marker
                    // 将路径起始点加入marker
                    let coord = p.split(',');
                    let p_latitude = coord[1];
                    let p_longitude = coord[0];
                    let theMarker =  {
                        markerId: this.data.markerIdSeed++,
                        latitude: p_latitude,
                        longitude:p_longitude,
                        zIndex: 100,
                        width:16,
                        height:16,
                        iconPath: '../../resource/image/marker.png',
                        callout: {
                            display: 'ALWAYS',
                            content: `marker:${markers.length}`,
                            color: '#000',
                            fontSize: '14',
                            borderRadius: 2,
                            bgColor: '#5B9FFF',
                            // padding: 1,
                            textAlign: 'center'
                        }
                    };

                    markers.push(theMarker);
                    //由于新增的标记，更新剩余未使用的里程
                    distanceLeft -= gutter * 1000; 
                }
            
           });
           
           

            
            //如果该城市之前没有标识过，就标识一下
            // if(!cityMakers[beginCity]){
            //     markers.push(startMarker);
            //     cityMakers[beginCity] = true;
            // }


           //处理path
           let segmentPath = {
               points:[],
               width:3,
               arrowLine:true,
               color:"#2facff",
           };
           path.split(";").forEach(points =>{
                points = points.split(",");
                segmentPath.points.push({
                    latitude: points[1], 
                    longitude: points[0]
                });
           });

           newPath.push(segmentPath);
            
        });




        markers[0].callout.content+='(出发)';
        markers[0].callout.color='#F00';
        markers[0].callout.fontSize= '16';
        markers[0].callout.borderRadius= 10;
        markers[0].callout.bgColor= '#0F0';
        markers[0].callout.padding= 2;
        markers[0].callout.zIndex= 9999;

        //最后一个终止点，样式修改
        markers[markers.length-1].callout.content+='(到达)';
        markers[markers.length-1].callout.color='#F00';
        markers[markers.length-1].callout.fontSize= '16';
        markers[markers.length-1].callout.borderRadius= 10;
        markers[markers.length-1].callout.bgColor= '#0F0';
        markers[markers.length-1].callout.padding= 2;
        markers[markers.length-1].callout.zIndex= 9999;

        //根据开始结束点，重设地图的中心点和缩放
        let mapCenter = {
            latitude: (parseFloat(markers[0].latitude) + parseFloat(markers[markers.length-1].latitude))/2,
            longitude: (parseFloat(markers[0].longitude) + parseFloat(markers[markers.length-1].longitude))/2,
          };

        let scale = 8;//TODO:动态计算
        let endTime = new Date(+this.data.startTime + (duration*1000));
        
        let routeMetaData = {
            routeName:"",
            weatherDesc:"天气不错/有预警天气/有不利天气",
            distance,//距离（米）
            distanceDesc:this.parseDistance(distance),
            duration,//时长（秒）
            durationDesc:this.parseDuration(duration),
            endTime,
            endTimeDesc:this.parseTime(endTime),
            scale,
            markers,
            mapCenter,
            polyline:newPath
        }
        return routeMetaData;
    },

    //根据传入的导航路径数据，绘制地图信息
    genRouteData:function(routeData){
        const { distance, duration, steps,origin, destination, routes } = routeData;

        console.log(`获取到路程时长:${duration}秒`)
        console.log(`获取到路程:${distance}米`)

        let newPath = [];
        let markers =[];
        let passedAdcodes ={}; //保存经过的城市编码:城市名称
        let cityMakers ={};//name:true

        /*
            1.step.adcodes:路径步骤经过的行政区划，这个用来确定途径的城市（需要去重复）
            2.step.path:详细路径点阵，这个用来绘制路线
        */
        steps && steps.forEach((step, index) => {
           let {adcodes,path,start_location} = step;
           let beginCity ="";
           //处理adcodes
           adcodes.split(";").forEach(adcode =>{
                adcode = adcode.substr(0,4);
                if(!passedAdcodes.hasOwnProperty(adcode)){
                    passedAdcodes[adcode] = findCity(adcode);
                    //console.log(`1 city name:${passedAdcodes[adcode]},adcode:${adcode}`)
                }
                if(!beginCity){
                    beginCity=passedAdcodes[adcode];
                    //console.log(`2 city name:${beginCity},adcode:${adcode}`)
                }
           });

           //将路径起始点加入marker
           let startMarker =  {
                markerId: this.data.markerIdSeed++,
                // anchor:{
                //     x:0.5,
                //     y:0.5,
                // },
                latitude: start_location.lat,
                longitude:start_location.lng,
                // title: 'markerId: 1',
                zIndex: 100,
                iconPath: '../../resource/image/marker.png',
                // rotate: 90,
                callout: {
                    display: 'ALWAYS',
                    content: beginCity,
                    color: '#000',
                    fontSize: '14',
                    borderRadius: 2,
                    bgColor: '#5B9FFF',
                    // padding: 1,
                    textAlign: 'center'
                }
            };
            
            //如果该城市之前没有标识过，就标识一下
            if(!cityMakers[beginCity]){
                markers.push(startMarker);
                cityMakers[beginCity] = true;
            }


           //处理path
           let segmentPath = {
               points:[],
               width:3,
               arrowLine:true,
               color:"#2facff",
           };
           path.split(";").forEach(points =>{
                points = points.split(",");
                segmentPath.points.push({
                    latitude: points[1], 
                    longitude: points[0]
                });
           });

           newPath.push(segmentPath);
            
        });

        markers[0].callout.content+='(出发)';
        markers[0].callout.color='#F00';
        markers[0].callout.fontSize= '16';
        markers[0].callout.borderRadius= 10;
        markers[0].callout.bgColor= '#0F0';
        markers[0].callout.padding= 2;
        markers[0].callout.zIndex= 9999;

        //调整最后一个marker：位置改为最后一个终止点，样式修改
        let lastPath = newPath[newPath.length-1].points;
        markers[markers.length-1].callout.content+='(到达)';
        markers[markers.length-1].latitude = parseFloat(lastPath[lastPath.length-1].latitude);
        markers[markers.length-1].longitude = parseFloat(lastPath[lastPath.length-1].longitude);
        markers[markers.length-1].callout.color='#F00';
        markers[markers.length-1].callout.fontSize= '16';
        markers[markers.length-1].callout.borderRadius= 10;
        markers[markers.length-1].callout.bgColor= '#0F0';
        markers[markers.length-1].callout.padding= 2;
        markers[markers.length-1].callout.zIndex= 9999;

        //根据开始结束点，重设地图的中心点和缩放
        let mapCenter = {
            latitude: (markers[0].latitude + markers[markers.length-1].latitude)/2,
            longitude: (markers[0].longitude + markers[markers.length-1].longitude)/2,
          };

        let scale = 8;//TODO:动态计算
        let endTime = new Date(+this.data.startTime + (duration*1000));
        
        let routeMetaData = {
            routeName:"",
            weatherDesc:"天气不错/有预警天气/有不利天气",
            distance,//距离（米）
            distanceDesc:this.parseDistance(distance),
            duration,//时长（秒）
            durationDesc:this.parseDuration(duration),
            endTime,
            endTimeDesc:this.parseTime(endTime),
            scale,
            markers,
            mapCenter,
            polyline:newPath
        }
        return routeMetaData;
    },
    /**
     * 根据传入的地址描述获取对应的位置信息
     * @param {String} address 
     */
    async getAdressLocation(address){
        try{
            let resp = await callBaiduMapAPI(apis.GEO_CODING,{
                address
            })
            console.log(resp);
            let data = resp.data;
            if (data["status"] === 0) {
                const res = data.result.location;
                return {
                    lat:res.lat,
                    lnt:res.lng,
                }
            }else{
                return {};
            }
          }catch(e){
            return {};
          }
    },

    async queryRoute(type){
        try{
            let resp = await callBaiduMapAPI(apis.DRIVING_ROUTE,{
                tactics:type,
                origin:`${this.data.fromLat},${this.data.fromLnt}`, //出发坐标 lat,lng
                destination:`${this.data.toLat},${this.data.toLnt}` //到达坐标 lat,lng
            })
            
            //console.log('百度地图返回结果：');
            //console.log(resp);
            let data = resp.data;
            if (data["status"] === 0) {
                const res = data["result"];
                return res.routes[0];
            }else{
                return undefined;
            }
          }catch(e){
            return undefined;
          }
    },

    async initAllRoutes(){
        // 查所有路线
        try{
            // let res1 = await this.queryRoute("4");
            // let res2 = await this.queryRoute("6");
            // let res3 = await this.queryRoute("7");

            let [res1,res2,res3] = await Promise.all([this.queryRoute("4"),this.queryRoute("3"),this.queryRoute("6")]);

            let r1 = this.genRouteData2(res1,100);
            let r2 = this.genRouteData2(res2,100);
            let r3 = this.genRouteData2(res3,100);

            //TODO:把路径按照时间快慢排序
            let ar = [r1,r2,r3];
            ar.sort((a,b)=>{
                return a.duration - b.duration
            })

            ar.forEach((a,idx)=>{a.currentSelect = idx})

            ar[0].routeName = "时间少";
            ar[1].routeName = "收费多";
            ar[2].routeName = "收费少 时间多";
            console.log(ar[0]);
            console.log(ar[1]);
            console.log(ar[2]);

            this.data.allRoutes.push(ar[0]);
            this.data.allRoutes.push(ar[1]);
            this.data.allRoutes.push(ar[2]);

            this.setData({
                allRoutes:this.data.allRoutes
            })

            this.showRoute(0); //默认展示第一条路线
        }catch(e){
            // this.setData('currentLocation', '定位失败')
            // wx.showToast({ title: '获取失败' })
            wx.showToast({ title: '路径规划失败' })
            console.error(e);
        }
    },
    async initAllWeather(){

    },
  onLoad: async function (params) {
      //console.log('detail two load:');
      console.log(params);
      // 监听页面加载的生命周期函数
      try{

        //先看传入参数是否有坐标信息（来自定位），如果没有，则根据地址查询坐标
        if(!params.fromLat){
            let fromPos = await this.getAdressLocation(params.from);
            params.fromLat = fromPos.lat;
            params.fromLnt = fromPos.lnt;
        }
        if(!params.toLat){
            let toPos = await this.getAdressLocation(params.to);
            params.toLat = toPos.lat;
            params.toLnt = toPos.lnt;
        }

          this.setData({
              from:params.from,
              fromCode:params.fromCode,
              fromLat:params.fromLat,
              fromLnt:params.fromLnt,
              to:params.to,
              toCode:params.toCode,
              toLat:params.toLat,
              toLnt:params.toLnt,

              startTime:new Date(),
              startTimeDesc:this.parseTime(new Date()),
          });

          //初始化路线信息
          await this.initAllRoutes();
        // TODO:根据返回的路线获取其中城市节点信息，去重
        // TODO:根据经过的城市信息，查下天气网城市码点，查天气情况
        await this.initAllWeather();
      }catch(e){
        wx.showToast({ title: '路径规划失败' })
        console.error(e);
      }

  },
  onMarkertap(args){
      console.log(args)
  },  
  onCallouttap(args){
      console.log(args)
  },
  navigateToDetailOne() {
      wx.navigateTo({
          url: '../detail-one/detail-one',
      })
  },
})
