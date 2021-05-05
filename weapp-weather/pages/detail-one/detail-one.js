
import {callWeatherAPi,apis as weatherAPI,responseParser,weatherCodes} from "../../libs/china-weather/sdk"

import moment from "../../libs/moment/moment-wrapper"
Page({
  data: {
    currentProvince:"xx省",
    currentCity:"邯郸市",
    currentDistrict:"雁塔区",

    currentAlarms:[
      {title:"邯郸市发布结冰橙色预警"},
      {title:"邯郸市发布结冰橙色预警"},
    ],

    startTimeDesc:"今天08:23",
    arriveTimeDesc:"今天20:33",
    arriveTimeWeatherCode:"00",
    arriveTimeDayOrNight:"d",
    arriveTimeMinTemp:"23",
    arriveTimeMaxTemp:"30",
    notGoodLastTime:"5小时",

    todayWeather:"小雨转大雨",
    todayMinTemp:"6",
    todayMaxTemp:"18",

    currentRouteData:undefined
  },

  // 根据markerId找到对应的城市信息，进行相关计算，并设置data进行展示
  grabMarkerData(markerId,currentRouteData){
    let markers = currentRouteData.markers.filter(m => m.id == markerId);

    if(markers && markers.length >0){
      let marker = markers[0]; 

      // 根据1小时天气数据，计算“当天”的天气情况
      // 温度范围按照小时预报落在当前范围内的上下限取值
      // 天气情况，统计当天出现最多的天气编码，进行翻译获取
      let oneHourData = marker.weather["1h"];
      let minTemp = 999;
      let maxTemp = -99;
      let weatherCount = {};
      let weatherCode = undefined;

      oneHourData.forEach( (hourData,idx)=>{
        let {temp,time,weather} = hourData;
        temp = parseInt(temp);

        if(temp < minTemp)
          minTemp = temp;

        if(temp > maxTemp)
          maxTemp = temp;

        if(weatherCount.hasOwnProperty(weather)){
          weatherCount[weather] ++;
        }else{
          weatherCount[weather] = 1;
        }
      });

      let max = 0;
      for(let k in weatherCount){
        if(weatherCount[k] > max){
          weatherCode = k;
          max = weatherCount[k];
        }
      }

      console.log(`weatherCode = ${weatherCode}`)
      weatherCode = weatherCodes.weather[weatherCode];
      console.log(`weatherCodeDesc = ${weatherCode}`)

      // 到达时间设置
      let arriveTime = marker.arriveTime;
      let startTime = currentRouteData.startTime;
      let startTimeDesc = moment(startTime).calendar();
      let arriveTimeDesc = moment(arriveTime).calendar();

      // 到达时天气设置
      let weatherWhenArrive = marker.weatherWhenArrive;
      let arriveTimeMinTemp = weatherWhenArrive.minTemp;
      let arriveTimeMaxTemp = weatherWhenArrive.maxTemp;
      let arriveTimeWeatherCode = weatherWhenArrive.weather;

      let hour = arriveTime.getHours();
      let arriveTimeDayOrNight = (hour<18 && hour >4)?"d":"n";
      // 计算不利天气持续时间

      // 处理当前城市预警信息
      let alarms = [];
      
      this.setData({
        currentProvince:marker.province,
        currentCity:marker.city == marker.currentDistrict?"":marker.city , //如果只精确到了市区，那么市区不显示，县区的位置显示市信息
        currentDistrict:marker.district,
    
        currentAlarms:alarms,
    
        startTimeDesc,
        arriveTimeDesc,
        arriveTimeWeatherCode,
        arriveTimeDayOrNight,
        arriveTimeMinTemp,
        arriveTimeMaxTemp,
        notGoodLastTime:"5小时",
    
        todayWeather:weatherCode,
        todayMinTemp:minTemp,
        todayMaxTemp:maxTemp,
    
      });
    }else{
      console.error(`marker :${markerId} not exist!`)
    }
  },

  /**
   * 详情页面是页面栈最后一个页面
   * @param {*} params 
   */
  onLoad(params){
    console.log(params);
    // 从全局数据区获取当前选定的路线详细数据
    const appInstance = getApp();
    let currentRouteData = appInstance.globalData.currentRouteData;

    // 获取当前显示的marker
    let markerId = parseInt(params.markerId);
    this.grabMarkerData(markerId,currentRouteData);

    // 显示路线信息
    this.setData({
      currentRouteData
    })
  },

  onMarkertap(args){
    console.log(args);
    let markerId = args.detail.markerId;
    
    // 从全局数据区获取当前选定的路线详细数据
    const appInstance = getApp();
    let currentRouteData = appInstance.globalData.currentRouteData;
    //切换显示该marker信息
    this.grabMarkerData(markerId,currentRouteData);
  },  
  onCallouttap(args){
      console.log(args);
      let markerId = args.detail.markerId;
      
    // 从全局数据区获取当前选定的路线详细数据
    const appInstance = getApp();
    let currentRouteData = appInstance.globalData.currentRouteData;
      //切换显示该marker信息
    this.grabMarkerData(markerId,currentRouteData);
  },

})