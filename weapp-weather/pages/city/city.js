import {cityData,findCityInfo} from './city-data.js'
import hotCity from './hot-city.js'
import {callBaiduMapAPI,apis} from '../../libs/baidu-map/webapi-sdk';

Page({
    data: {
        hotCity:hotCity,
        range: [[], [], []],
        multiIndex: [0, 0, 0],
        chosenCity: {
            province: '',
            city: '',
            district: '',
            code: '',
            longitude: '', //可空
            latitude: '', //可空
        },
        currentLocation: '',
        type: '',
    },
    onLoad: function (options) {
      // console.log(hotCity);
        this.setData({type:options.type})
        this.setProvinceList()
        this.setChosenData();
        //TODO:判断缓存是否有当前位置，如果有，则直接获取并展示

        //如果没有，则调用定位接口：
        this.getLocation();
    },
    
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({multiIndex:e.detail.value});
    //根据确定的选项刷新选择的值
    this.setChosenData();
    
  },
  setChosenData:function(){
    console.log('setChosenData')
    let [provinceIndex,cityIndex,regionIndex] = this.data.multiIndex;
    let province = this.data.range[0][provinceIndex];
    let city = this.data.range[1][cityIndex];
    let district = this.data.range[2][regionIndex];
    console.log(cityData)
    console.log(province)
    console.log(city)
    console.log(district)
    // console.log(district)
    let code = cityData[province][city][district].AREAID;

    this.setData({
      chosenCity:{
        province: province,
        city: city,
        district: district,
        code: code,
      }
    })

  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if(e.detail.column === 0){
      //更新城市列表
      console.log('更新城市列表')
      const province = this.data.range[0][e.detail.value]
      this.data.chosenCity.province = province;
      this.setCityList(province);
    }else if(e.detail.column === 1){
      //更新地区列表
      console.log('更新地区列表')
      const city = this.data.range[1][e.detail.value]
      this.data.chosenCity.city = city;
      this.setRegionList(this.data.chosenCity.province,city);
    }else if(e.detail.column === 2){
      const province = this.data.chosenCity.province
      const city = this.data.chosenCity.city
      const districtObj = cityData[province][city]

      console.log(province)
      console.log(city)
      console.log(districtObj)

      const districtList = Object.keys(districtObj)
      const district = districtList[e.detail.value]
      this.data.chosenCity.district = district
      this.data.chosenCity.code = districtObj[district]['AREAID']
    }
    // console.log(this.data.chosenCity);
   
  },

    setProvinceList() {
      console.log('setProvinceList')
        const provinceList = Object.keys(cityData);
        this.setData({"range[0]": provinceList});
        this.data.chosenCity.province = provinceList[0];

        this.setCityList(provinceList[0]);
    },
    setCityList(provinceName){
      console.log(`setCityList:${provinceName}`)
      const cityList = Object.keys(cityData[provinceName]);
      this.setData({"range[1]": cityList});
      this.data.chosenCity.city = cityList[0];
      this.setRegionList(provinceName,cityList[0]);
    },
    setRegionList(provinceName,cityName){
      console.log(`setRegionList:${provinceName},${cityName}`)
      const regionList = Object.keys(cityData[provinceName][cityName]);
      this.setData({"range[2]": regionList});
      this.data.chosenCity.district = regionList[0];
    },
    async getLocation() {

        wx.getLocation({
            type: 'gcj02',
            altitude: true,
            success: async res => {
              console.log('获取定位：');
              console.log(res);

              //调用百度地图服务进行地理位置逆解析，得到当前城市名称
              try{
                let resp = await callBaiduMapAPI(apis.REVERSE_GEOCODING,{location:`${res.latitude},${res.longitude}`})
                
                console.log('百度地图返回结果：');
                console.log(resp);

                if(resp && resp.statusCode === 200 && resp.data.status === 0){
                  this.setData({currentLocation: resp.data.result.addressComponent.city})

                  let foundCity = findCityInfo(resp.data.result.addressComponent.district);
                  if(foundCity === undefined){
                    foundCity = findCityInfo(resp.data.result.addressComponent.city);
                  }
                  foundCity.longitude = res.longitude;
                  foundCity.latitude = res.latitude;
                  this.setData({
                    chosenCity:foundCity
                  })
                  //TODO:更新本地缓存的位置信息

                  wx.showToast({ title: '已经根据当前位置刷新您所在的城市！' })
                }else{
                  wx.showToast({ title: '获取失败' })
                }
              }catch(e){
                // this.setData('currentLocation', '定位失败')
                // wx.showToast({ title: '获取失败' })
                console.error(e);
              }


                // const currentLocation = `${res.province} ${res.city} ${res.district}`
                // this.setData('currentLocation', currentLocation)
            },
            fail: err => {
                this.setData('currentLocation', '定位失败')
                wx.showToast({ title: '获取失败' })
                console.error(err);
            },
        })
    },
    // change(event) {
    //     const value = event.detail.value
    //     if (value.length === 1) {
    //         const province = this.data.range[0][value[0]].NAMECN
    //         this.data.chosenCity.province = province
    //         const cityList = Object.keys(cityData[province]).map(key => ({
    //             NAMECN: key,
    //         }))
    //         this.setData('range[1]', cityList)
    //     } else if (value.length === 2) {
    //         const province = this.data.range[0][value[0]].NAMECN
    //         const city = this.data.range[1][value[1]].NAMECN
    //         this.data.chosenCity.city = city
    //         const countyList = Object.keys(
    //             cityData[province][city]
    //         ).map(key => ({ NAMECN: key }))
    //         this.setData('range[2]', countyList)
    //     } else {
    //         const province = this.data.chosenCity.province
    //         const city = this.data.chosenCity.city
    //         const districtObj = cityData[province][city]
    //         const districtList = Object.keys(districtObj)
    //         const district = districtList[value[2]]
    //         this.data.chosenCity.district = district
    //         this.data.chosenCity.code = districtObj[district]['AREAID']
    //     }
    // },
    finishChoosing() {
        const CurrentPages = getCurrentPages()
        const lastPage = CurrentPages[CurrentPages.length - 2]
        if (this.data.type === 'd') {
            lastPage.setData({'destination': this.data.chosenCity})
        } else if (this.data.type === 's') {
            lastPage.setData({'startingPlace': this.data.chosenCity})
        }
        wx.navigateBack()
    },
    chooseCity(e) {
        const CurrentPages = getCurrentPages()
        const lastPage = CurrentPages[CurrentPages.length - 2]
        const tartgetData = e.target.dataset
        if (this.data.type === 'd') {
            lastPage.setData(
              {
                destination: {
                province: '',
                city: tartgetData.name,
                district: '',
                code: tartgetData.code,
                }
              }
            )
        } else if (this.data.type === 's') {
            lastPage.setData({
              startingPlace:{
                province: '',
                city: tartgetData.name,
                district: '',
                code: tartgetData.code,
            }
          })
        }
        wx.navigateBack()
    },
})
