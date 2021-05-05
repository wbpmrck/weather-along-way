
import {callWeatherAPi,apis as weatherAPI,responseParser,weatherCodes} from "../../libs/china-weather/sdk"
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
  }
})