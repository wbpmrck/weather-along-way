import {Cache,setCacheData,getCachedData} from "./cache"
import {weather,isNotGood} from "./code-dic";
const enableCache = true; //是否开启请求缓存
const cacheTime = 3600 * 2; //2个小时的缓存（天气信息没有必要频繁刷新）

const key = "dc56d448cb406e502dfaeec4db50c340"; //这里填写你申请的百度地图应用的sk号码
const apiPrefix = "https://api.weatherdt.com/";

/* 下面的接口配置，url配置到官方文档的 ?之前的字符接口，也就是queryString部分不需要配置到url里，而是放到param里 */
//逆向地理解析 接口配置 参考：https://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding-abroad
const EVERY_HOUR = {
  url:`common/?`,
  method:"GET",
  params:{
    area:"",
    type:"forecast|observe|alarm"
  }
};

function callWeatherAPi(apiOption,inputData){
  let targetUrl = `${apiPrefix}${apiOption.url}`;

  let data = Object.assign(JSON.parse(JSON.stringify(apiOption.params)),inputData);
  data.key = key;

  // console.log(`callWeatherAPi:${targetUrl}`)
  // console.log('data=')
  // console.log(data);

  let cacheKey = "";
  return new Promise((resolve, reject) => {
    //如果开启缓存，则检查缓存
    if(enableCache){
      cacheKey = JSON.stringify(data)+targetUrl;
      // console.log(`cacheKey = ${cacheKey}`)
      let d = getCachedData(cacheKey);
      if(d !== undefined){
        // console.log('return cache from memory: '+cacheKey)
        return resolve(d);
      }
    }
    
    wx.request({
      url: targetUrl,
      data,
      method:apiOption.method,
      success(res) {
        // 如果开启缓存，则缓存结果
        if(enableCache){
          // console.log('set cache for '+cacheKey)
          setCacheData(cacheKey,res,cacheTime);
        }
        resolve(res);
      },
      fail() {
        reject({
          msg: '请求失败',
          url: targetUrl,
          method:apiOption.method
        });
      }
    });
  });
}

let responseParser = {
  //TODO:用于解析《数据接口使用说明文档》中的接口响应字段
  parseCityInterface:function(data){
    let ret ={};
    try{
      let keys = Object.keys(data.forecast["12h"]);
      ret.adcode = keys[0];
      ret["12h"] = data.forecast["12h"][keys[0]]["1001001"].map((item,index)=>{
        let tm = item["000"].split("~");
        return {
          timeBegin:tm[0],
          timeEnd:tm[1],
          weather:item["001"],
          maxTemp:item["002"],
          minTemp:item["003"],
          windPower:item["004"],
          windDirection:item["005"]
        }
      });

      ret["1h"] = data.forecast["1h"][keys[0]]["1001001"].map((item,index)=>{
        return {
          time:item["000"],
          weather:item["001"],
          temp:item["002"],
          windPower:item["003"],
          windDirection:item["004"]
        }
      });

      ret.alarm = data.alarm[keys[0]]["1001003"].map((item,index)=>{
        return {
          province:item["001"],
          city:item["002"],
          district:item["003"],
          alarmTypeCode:item["004"],
          alarmTypeName:item["005"],
          alarmLevel:item["006"],
          alarmLevelName:item["007"],
          alarmTime:item["008"],
          content:item["009"],
          title:item["010"],
          linkAddress:item["011"],
        }
      }); // 空数组代表无警报信息

    }catch(e){
      console.error(`获取城市天气失败！`);
      console.log(data);
      console.error(e);
      ret = undefined;
    }

    return ret;
  },

}
module.exports = {
  callWeatherAPi,
  responseParser,
  apis:{
    EVERY_HOUR
  },
  isNotGood,
  weatherCodes:{
    weather
  }
}