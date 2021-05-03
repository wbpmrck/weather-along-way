
var qs = require('querystring');
var md5 = require('md5');


// 百度地图的webapi对应的sdk
const AK = "4gG4dWPdybn88j7yn2ezHwAE5pZgCtCq"; //申请的应用AK
const SK = "XmNOeoFQZrs2Bgk09OUTFMW3Wb4X7DOb"; //这里填写你申请的百度地图应用的sk号码

const apiPrefix = "https://api.map.baidu.com";

/* 下面的接口配置，url配置到官方文档的 ?之前的字符接口，也就是queryString部分不需要配置到url里，而是放到param里 */
//逆向地理解析 接口配置 参考：https://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding-abroad
const REVERSE_GEOCODING = {
  url:`/reverse_geocoding/v3/`,
  method:"GET",
  params:{
    output:"json",
    coordtype:"gcj02",
    location:"31.225696563611,121.49884033194" //lat,lng
  }
};

//驾车路径规划 接口配置 ：参考：http://lbsyun.baidu.com/index.php?title=webapi/direction-api-v2#service-page-anchor-1-3
const DRIVING_ROUTE = {
  url:`/direction/v2/driving`,
  method:"GET",
  params:{
    coord_type:"gcj02",
    ret_coordtype:"gcj02",
    tactics:"7",// 6:少收费（最便宜）   7: 躲避拥堵 & 高速优先（最快）  4：高速优先（收费多）
    origin:"40.01116,116.339303", //出发坐标 lat,lng
    destination:"40.01116,116.339303",//到达坐标 lat,lng
    // callback:"func1",//回调函数（目测是使用jsonp的时候可以用，未测试）
    // ext_departure_time:"示例： ext_departure_time=1526527619"// [出发时间] 注意：该功能为高级付费服务，需通过反馈平台联系工作人员开通
  }
};
//地理信息编码 接口配置 ：参考：http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
const GEO_CODING = {
  url:`/geocoding/v3/`,
  method:"GET",
  params:{
    address:"",//合肥市三里庵xx网吧
    city:"", //合肥市
    ret_coordtype:"gcj02",
    output:"json",
    // callback:"func1",//回调函数（目测是使用jsonp的时候可以用，未测试）
  }
};

function fixedEncodeURIComponent(str) {
  //console.log(`fixedEncodeURIComponent:\n${str}`);
  // return encodeURIComponent(str)
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

function generateSn(url, data, sk) {
  //console.log('generateSn:');
  const keys = qs.stringify(data, null, null, {
    encodeURIComponent: fixedEncodeURIComponent
  });
  // const keys = qs.stringify(data);
  // const keys ="output=json&coordtype=wgs84ll&location=31.8512,117.26061&ak=4gG4dWPdybn88j7yn2ezHwAE5pZgCtCq";
  let newUrl = url + '?' + keys + sk;
  // return md5(newUrl);
  return md5(fixedEncodeURIComponent(newUrl));
  // return md5(fixedEncodeURIComponent(url + '?' + keys + sk));
}

// https://api.map.baidu.com/reverse_geocoding/v3/?output=json&coordtype=wgs84ll&location=31.82057%2C117.22901&ak=4gG4dWPdybn88j7yn2ezHwAE5pZgCtCq&sn=1a630155ee93ae7a9f5d0b33953d22e5
// https://api.map.baidu.com/reverse_geocoding/v3/?output=json&coordtype=wgs84ll&location=31.82057%2C117.22901&ak=4gG4dWPdybn88j7yn2ezHwAE5pZgCtCqXmNOeoFQZrs2Bgk09OUTFMW3Wb4X7DOb
// http://api.map.baidu.com/reverse_geocoding/v3/?output=json&coordtype=wgs84ll&location=31.82057%2C117.22901&ak=4gG4dWPdybn88j7yn2ezHwAE5pZgCtCq&sn=765eb19fbfd39fb511787e7ac7099315

function callBaiduMapAPI(apiOption,inputData){
  let targetUrl = `${apiPrefix}${apiOption.url}`;
  let data = Object.assign(JSON.parse(JSON.stringify(apiOption.params)),inputData);
  data.ak = AK;
  // data.timestamp=Date.now();

  console.log(`callBaiduMapAPI:${targetUrl}`)
  console.log('data=')
  console.log(data)

  if(apiOption.method === "GET"){

    //针对get请求，生成sn
    data.sn = generateSn(apiOption.url, data, SK);

    //http://api.map.baidu.com/reverse_geocoding/v3/?
    // console.log('针对get请求，生成sn:')
    // console.log(`http://api.map.baidu.com/reverse_geocoding/v3/?output=json&coordtype=wgs84ll&location=31.82057%2C117.22901&ak=4gG4dWPdybn88j7yn2ezHwAE5pZgCtCq&sn=${data.sn}`)
    return new Promise((resolve, reject) => {
      wx.request({
        url: targetUrl,
        data,
        method:apiOption.method,
        success(res) {
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

  }else{
    return new Promise((resolve, reject) => {
      wx.request({
        url: targetUrl,
        data:data,
        method:apiOption.method,
        success(res) {
          resolve(res);
        },
        fail() {
          reject({
            msg: '请求失败',
            url: targetUrl,
            method:apiOption.method,
            data
          });
        }
      });
    });
  }
}
module.exports = {
  callBaiduMapAPI,
  apis:{
    GEO_CODING,
    REVERSE_GEOCODING,
    DRIVING_ROUTE
  }
}