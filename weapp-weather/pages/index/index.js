// index.js
import {format} from '../../utils/time-util'
// 获取应用实例
const app = getApp()

Page({
    data: {
        list: [],
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
    onLoad() {
        // 监听页面加载的生命周期函数
        // wx.request({
        //     url: 'https://api.weatherdt.com/common/',
        //     data: {
        //         area: 101010100,
        //         type: 'forecast',
        //         key: 'dc56d448cb406e502dfaeec4db50c340',
        //     },
        //     header: {
        //         'Content-Type': 'application/json',
        //     },
        //     method: 'POST',
        //     dataType: 'json',
        //     responseType: 'text',
        //     success: res => {
        //         console.log('request success', res.data)
        //     },
        // })
    },
    onShow() {},
    navigateToDetailTwo() {
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
