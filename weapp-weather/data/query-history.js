/*
  小程序本地缓存最近查询的n条查询记录
*/
const historyCount = 3; //保存最近三条

let historyData = undefined;
let seed = 1000;

function addHistory(his){
  his.id = (+new Date()) + (seed++);
  historyData.push(his);
  if(historyData.length >3){
    historyData.shift();
  }
  wx.setStorage({
    key:"historyData",
    data:JSON.stringify(historyData),
    success:()=>{
      console.log(`保存查询历史成功，目前有${historyData.length}条数据`);
    },
    fail:(e)=>{
      console.error(`保存查询历史失败:`)
      console.error(e)
    }

  })
}

function getHistoryData(){
  if(historyData === undefined){
    try {
      historyData = [];
      var value = wx.getStorageSync('historyData')
      if (value) {
        // Do something with return value
        historyData = JSON.parse(value);
      }
    } catch (e) {
      // Do something when catch error
      console.error(`getHistoryData error:`)
      console.log(e);
    }
  }
  return historyData;
}


module.exports = {
  addHistory,
  getHistoryData,
}