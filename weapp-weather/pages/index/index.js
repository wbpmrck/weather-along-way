// index.js
import {format} from '../../utils/time-util'
// 获取应用实例
const app = getApp()

Page({
    data: {
        list: [],
        startingPlace: {},
        destination: {},
        date: '',
        startDate:format(new Date(),'yyyy-MM-dd'),
        endDate:format(new Date((+new Date()) + 1000*3600*24*7),'yyyy-MM-dd') //只允许选7天内的日期（主要考虑天气接口）
        // endDate:format(new Date((+new Date()) + 1000*3600*24* 2000),'yyyy-MM-dd') //给一个很大的日期选择范围
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
            url: '../detail-two/detail-two',
        })
    },
    chooseStartingPlace(e) {
        const type = e.currentTarget.dataset.type
        wx.navigateTo({
            url: `../city/city?type=${type}`,
        })
    },
    bindDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        date: e.detail.value
      })
    },
    chooseDate() {
        // wx.navigateTo({
        //     url: '../calendar/calendar',
        // })
    },
})
