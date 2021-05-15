// index.js
import {format} from '../../utils/time-util'
import {cityData,findCityInfo} from '../city/city-data'
import {callBaiduMapAPI,apis} from '../../libs/baidu-map/webapi-sdk';
import moment from "../../libs/moment/moment-wrapper"
import {
  addHistory,
  getHistoryData,
} from "../../data/query-history"
// 获取应用实例
const app = getApp()

Page({
    data: {

      range: [[], [], []],
      multiIndex: [0, 0, 0],

      range2: [[], [], []],
      multiIndex2: [0, 0, 0],

        markers:[],
        history:[],
        key:"XLJBZ-ZDTK3-PZQ3V-3AKCJ-4VWGQ-VQF3L",
        scale:7,
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

          // 设置地图当前位置的marker:
          let theMarker =  {
            id: this.data.markerIdSeed++,
            latitude: this.data.latitude,
            longitude:this.data.longitude,
            zIndex: 100,
            width:16,
            height:16,
            anchor:{
                x:0.5,
                y:1,
            },
            iconPath: '../../resource/image/marker.png',
            callout: {
                display: 'ALWAYS',
                content: `您在这里！`,
                color: '#fff',
                fontSize: '16',
                borderRadius: 10,
                bgColor: '#ff221a',
                padding: 2,
                textAlign: 'center'
            }
        };
        this.data.markers.push(theMarker);
        this.setData({
          markers:this.data.markers
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

      //设置默认出发时间为当前
      let date = moment().format("YYYY-MM-DD");
      let time = moment().format("HH:mm");
      this.setData({
        date,
        time,
      });

      // 获取历史查询数据
      let history = getHistoryData();
      if(history){
        this.setData({
          history,
        })
      }

    },
    onLoad() {

      this.setProvinceList();
      this.setProvinceList2();
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
    onShow() {
      // 获取历史查询数据
      let history = getHistoryData();
      if(history){
        this.setData({
          history,
        })
      }
    },

    queryHistory(evt) {
      // 从点击的历史信息中获取查询参数
      console.log(evt);
      let param = this.data.history[evt.target.dataset.idx];
      wx.navigateTo({
          url: `../detail-two/detail-two?from=${param.from}&fromCode=${param.fromCode}&fromLat=${param.fromLat}&fromLnt=${param.fromLnt}&to=${param.to}&toCode=${param.toCode}&toLat=${param.toLat}&toLnt=${param.toLnt}&date=${param.date}&time=${param.time}`,
      })
    },
    
    navigateToDetailTwo() {

        //检查参数：
        if(!this.data.startingPlace.code || !this.data.destination.code || !this.data.date || !this.data.time){
          
          wx.showToast({ title: '请选择参数',icon:'error',duration:500 })
          return;
        }

        let param = {
          from:this.stringifyPlace(this.data.startingPlace),
          fromCode:this.data.startingPlace.code,
          fromLat:this.data.startingPlace.latitude||"",
          fromLnt:this.data.startingPlace.longitude||"",
          to:this.stringifyPlace(this.data.destination),
          toCode:this.data.destination.code,
          toLat:this.data.destination.latitude||"",
          toLnt:this.data.destination.longitude||"",
          date:this.data.date,
          time:this.data.time
        }
        
        addHistory(param);

        wx.navigateTo({
            url: `../detail-two/detail-two?from=${param.from}&fromCode=${param.fromCode}&fromLat=${param.fromLat}&fromLnt=${param.fromLnt}&to=${param.to}&toCode=${param.toCode}&toLat=${param.toLat}&toLnt=${param.toLnt}&date=${param.date}&time=${param.time}`,
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


    setProvinceList() {
      console.log('setProvinceList')
        const provinceList = Object.keys(cityData);
        this.setData({
          "range[0]": provinceList,
        });
        // this.data.currentSelect.province = provinceList[0];
        this.setCityList();
    },
    setProvinceList2() {
      console.log('setProvinceList2')
        const provinceList = Object.keys(cityData);
        this.setData({
          "range2[0]": provinceList,
        });
        // this.data.currentSelect2.province = provinceList[0];
        this.setCityList2();
    },
    // setCityList(provinceName){
    setCityList(){
      let provinceName = this.data.range[0][this.data.multiIndex[0]];
      console.log(`setCityList:${provinceName}`)
      const cityList = Object.keys(cityData[provinceName]);
      this.setData({
        "range[1]": cityList,
      });
      // this.data.currentSelect.city = cityList[0];
      this.setRegionList();
    },
    setCityList2(){
      let provinceName = this.data.range2[0][this.data.multiIndex2[0]];
      console.log(`setCityList2:${provinceName}`)
      const cityList = Object.keys(cityData[provinceName]);
      this.setData({
        "range2[1]": cityList,
        // "multiIndex2[1]": 0,
      });
      // this.data.currentSelect2.city = cityList[0];
      this.setRegionList2();
    },
    // setRegionList(provinceName,cityName){
    setRegionList(){
      let provinceName = this.data.range[0][this.data.multiIndex[0]];
      let cityName = this.data.range[1][this.data.multiIndex[1]];
      console.log(`setRegionList:${provinceName},${cityName}`)
      const regionList = Object.keys(cityData[provinceName][cityName]);
      // this.data.currentSelect.district = regionList[0];
      this.setData({
        "range[2]": regionList,
      });
    },

    setRegionList2(){
      let provinceName = this.data.range2[0][this.data.multiIndex2[0]];
      let cityName = this.data.range2[1][this.data.multiIndex2[1]];
      console.log(`setRegionList2:${provinceName},${cityName}`)
      const regionList = Object.keys(cityData[provinceName][cityName]);
      // this.data.currentSelect2.district = regionList[0];
      this.setData({
        "range2[2]": regionList,
        // "multiIndex2[2]": 0,
      });
    },


    setChosenDestination:function(){
      console.log('setChosenDestination')
      let [provinceIndex,cityIndex,regionIndex] = this.data.multiIndex;
      let province = this.data.range[0][provinceIndex];
      let city = this.data.range[1][cityIndex];
      let district = this.data.range[2][regionIndex];
      console.log(province)
      console.log(city)
      console.log(district)
      // console.log(district)
      let code = cityData[province][city][district].AREAID;
  
      this.setData({
        destination:{
          province: province,
          city: city,
          district: district,
          code: code,
        }
      })
    },
    setChosenStartingPlace:function(){
    console.log('setChosenStartingPlace')
    let [provinceIndex,cityIndex,regionIndex] = this.data.multiIndex2;
    let province = this.data.range2[0][provinceIndex];
    let city = this.data.range2[1][cityIndex];
    let district = this.data.range2[2][regionIndex];
    console.log(province)
    console.log(city)
    console.log(district)
    // console.log(district)
    let code = cityData[province][city][district].AREAID;

    this.setData({
      startingPlace:{
        province: province,
        city: city,
        district: district,
        code: code,
      }
    })
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({multiIndex:e.detail.value});
    //根据确定的选项刷新选择的值
    // let t = e.target.dataset.t;
    // if(t === 'destination'){
      this.setChosenDestination();
    // }else{
      // this.setChosenStartingPlace();
    // }
    
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let k = `multiIndex[${e.detail.column}]`;
    this.setData({
        [k]: e.detail.value,
    })
    if(e.detail.column === 0){
      //更新城市列表
      console.log('更新城市列表')
      // const province = this.data.range[0][e.detail.value]
      // this.data.currentSelect.province = province;
      this.setCityList();
      // this.setCityList(province);
    }else if(e.detail.column === 1){
      //更新地区列表
      console.log('更新地区列表')
      const city = this.data.range[1][e.detail.value]
      // this.data.currentSelect.city = city;
      this.setRegionList();
      // this.setRegionList(this.data.currentSelect.province,city);
    }else if(e.detail.column === 2){
    }
  },
  bindMultiPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({multiIndex2:e.detail.value});
  
    this.setChosenStartingPlace();
  },

  bindMultiPickerColumnChange2: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let k = `multiIndex2[${e.detail.column}]`;
    this.setData({
        [k]: e.detail.value,
    })
    if(e.detail.column === 0){
      //更新城市列表
      console.log('更新城市列表')
      this.setCityList2();
    }else if(e.detail.column === 1){
      //更新地区列表
      console.log('更新地区列表')
      this.setRegionList2();
    }else if(e.detail.column === 2){
    }
  },

  // bindMultiPickerColumnChange2: function (e) {
  //   console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  //   if(e.detail.column === 0){
  //     //更新城市列表
  //     console.log('更新城市列表')
  //     const province = this.data.range2[0][e.detail.value]
  //     this.data.currentSelect2.province = province;
  //     this.setCityList2(province);
  //   }else if(e.detail.column === 1){
  //     //更新地区列表
  //     console.log('更新地区列表')
  //     const city = this.data.range2[1][e.detail.value]
  //     this.data.currentSelect2.city = city;
  //     this.setRegionList2(this.data.currentSelect2.province,city);
  //   }else if(e.detail.column === 2){
  //     // const province = this.data.destination.province
  //     // const city = this.data.destination.city
  //     // const districtObj = cityData[province][city]

  //     // console.log(province)
  //     // console.log(city)
  //     // console.log(districtObj)

  //     // const districtList = Object.keys(districtObj)
  //     // const district = districtList[e.detail.value]
  //     // this.data.destination.district = district
  //     // this.data.destination.code = districtObj[district]['AREAID']
  //   }
  // },

})
