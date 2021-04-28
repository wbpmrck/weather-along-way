import { findCity } from "../../libs/baidu-map/adcode";
import {callBaiduMapAPI,apis} from "../../libs/baidu-map/webapi-sdk"
import moment from "../../libs/moment/moment-wrapper"
Page({
  data: {
      markerIdSeed:+new Date(),
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
    observers: {
        // 'distance': function(distance,distance2) {
        //     let distanceDesc = this.parseDistance(distance);
        //     this.setData({
        //         distanceDesc
        //     })
        // },
        // 'duration': function(duration,duration2) {
        //     let durationDesc = this.parseDuration(duration);
        //     this.setData({
        //         durationDesc
        //     })
        // },
        // 'startTime': function(startTime,startTime2) {
        //     let startTimeDesc = this.parseTime(startTime);
        //     this.setData({
        //         startTimeDesc
        //     })
        // },
        // 'endTime': function(endTime,endTime2) {
        //     let endTimeDesc = this.parseTime(endTime);
        //     this.setData({
        //         endTimeDesc
        //     })
        // },
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
        console.log(cachedData);
        console.log('切换路线:',idx);
        console.log('中心点:');
        console.log(cachedData.mapCenter);
        //设置当前选择的下标
        this.setData(cachedData);
        wx.showToast({ title: '切换路线成功' })
    },
    chooseRoute:function(evt){
        let idx = evt.currentTarget.dataset.idx;
        console.log('切换路线:',idx);
        this.showRoute(idx);
    },

    //根据传入的导航路径数据，绘制地图信息
    genRouteData:function(routeData,routeName){
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
                }
                if(!beginCity){
                    beginCity=passedAdcodes[adcode];
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
            routeName,
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

    async queryRoute(type){
        try{
            let resp = await callBaiduMapAPI(apis.DRIVING_ROUTE,{
                tactics:type,
                origin:"31.8512,117.26061", //出发坐标 lat,lng
                destination:"32.8512,119.26061" //到达坐标 lat,lng
            })
            
            console.log('百度地图返回结果：');
            console.log(resp);
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
            let res1 = await this.queryRoute("4");
            let res2 = await this.queryRoute("6");
            let res3 = await this.queryRoute("7");

            let r1 = this.genRouteData(res1,"时间少");
            let r2 = this.genRouteData(res2,"收费多");
            let r3 = this.genRouteData(res3,"收费少 时间多");

            //TODO:把路径按照时间快慢排序
            let ar = [r1,r2,r3];
            ar.sort((a,b)=>{
                return a.distance - b.distance >0
            })

            ar.forEach((a,idx)=>{a.currentSelect = idx})
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
  onLoad: async function () {
      // 监听页面加载的生命周期函数
      try{
          this.setData({
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
