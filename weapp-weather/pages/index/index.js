// index.js
import {format} from '../../utils/time-util'
import {cityData,findCityInfo} from '../city/city-data'
import {callBaiduMapAPI,apis} from '../../libs/baidu-map/webapi-sdk';
import moment from "../../libs/moment/moment-wrapper"
// 获取应用实例
const app = getApp()

Page({
    data: {
        list: [],
        longitude:0,
        latitude:0,
        startingPlace: {}, // {province: '',city: '', district: '', code: '',longitude: '',latitude: ''}
        destination: {},// {province: '',city: '', district: '', code: '',longitude: '',latitude: ''}
        date: '',
        startDate:format(new Date(),'yyyy-MM-dd'),
        endDate:format(new Date((+new Date()) + 1000*3600*24*7),'yyyy-MM-dd'), //只允许选7天内的日期（主要考虑天气接口）
        time:'',
        startTime:format(new Date(),'hh:mm'),
        // endDate:format(new Date((+new Date()) + 1000*3600*24* 2000),'yyyy-MM-dd') //给一个很大的日期选择范围
    },
    stringifyPlace(place){
        // return `${place.province?(place.province+"省"):""}${place.city}市${place.distinct?place.distinct+"区":""}`
        return `${place.province?(place.province+"省"):""}${place.city}市${place.distinct?place.distinct+"区":""}`
    },
    async initData(){
      //根据当前坐标，查询默认出发地点
      //调用百度地图服务进行地理位置逆解析，得到当前城市名称
      try{
        let resp = await callBaiduMapAPI(apis.REVERSE_GEOCODING,{location:`${this.data.latitude},${this.data.longitude}`})
        
        console.log('百度地图返回结果：');
        console.log(resp);

        if(resp && resp.statusCode === 200 && resp.data.status === 0){
          this.setData({currentLocation: resp.data.result.addressComponent.city})

          let foundCity = findCityInfo(resp.data.result.addressComponent.district);
          if(foundCity === undefined){
            foundCity = findCityInfo(resp.data.result.addressComponent.city);
          }
          foundCity.longitude = this.data.longitude;
          foundCity.latitude = this.data.latitude;
          this.setData({
            startingPlace:foundCity
          })

          wx.showToast({ title: '请选择目的地',duration:900 })
        }else{
          wx.showToast({ title: '获取定位失败' ,duration:900})
        }
      }catch(e){
        // this.setData('currentLocation', '定位失败')
        // wx.showToast({ title: '获取失败' })
        console.error(e);
      }

      //TODO:设置默认出发时间为当前
      let date = moment().format("YYYY-MM-DD");
      let time = moment().format("HH:mm");
      this.setData({
        date,
        time,
      })

    },
    onLoad() {
        wx.getLocation({
            type: 'gcj02',
            altitude: true,
            success: async res => {
              console.log('获取定位：');
              console.log(res);

              this.data.latitude = res.latitude;
              this.data.longitude = res.longitude;
              this.setData({
                latitude:res.latitude,
                longitude:res.longitude,
              });
              await this.initData();
            },
            fail: err => {
                wx.showToast({ title: '获取定位失败' })
                console.error(err);
            },
        })
    },
    onShow() {},
    navigateToDetailTwo() {

        //检查参数：
        if(!this.data.startingPlace.code || !this.data.destination.code || !this.data.date || !this.data.time){
          
          wx.showToast({ title: '请选择参数',icon:'error',duration:500 })
          return;
        }

        wx.navigateTo({
            url: `../detail-two/detail-two?from=${this.stringifyPlace(this.data.startingPlace)}&fromCode=${this.data.startingPlace.code}&fromLat=${this.data.startingPlace.latitude||""}&fromLnt=${this.data.startingPlace.longitude||""}&to=${this.stringifyPlace(this.data.destination)}&toCode=${this.data.destination.code}&toLat=${this.data.destination.latitude||""}&toLnt=${this.data.destination.longitude||""}&date=${this.data.date}&time=${this.data.time}`,
        })
    },
    chooseStartingPlace(e) {
        const type = e.currentTarget.dataset.type
        wx.navigateTo({
            url: `../city/city?type=${type}`,
        })
    },
    bindDateChange: function(e) {
      this.setData({
        date: e.detail.value
      })
    },
    bindTimeChange: function(e) {
      this.setData({
        time: e.detail.value
      })
    },
    chooseDate() {
        // wx.navigateTo({
        //     url: '../calendar/calendar',
        // })
    },
})
