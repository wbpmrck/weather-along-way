var xlsx  = require("node-xlsx")
const fs = require('fs')
process.on('uncaughtException', err => {
  console.error('有一个未捕获的错误', err)
  process.exit(1) //强制性的（根据 Node.js 文档）
})

let citys = {};
const workSheetsFromFile = xlsx.parse(`${__dirname}/city-file/国内城市站号.xls`);

let data = workSheetsFromFile[0].data;
data.splice(0,1);//去掉表格行首

//遍历表格，生成省市区数据（对应天气网的）
data.forEach((row,idx) =>{
  let [districtCode,districtEName,districtCName,cityEName,cityCName,provinceEName,provinceCName,china,chinaEName] = row;

  //创建省
  if(!citys[provinceCName]){
    citys[provinceCName]={};
  }
  let provinceObj = citys[provinceCName];

  //处理直辖市
  if(provinceCName == "北京" ||provinceCName == "上海" ||provinceCName == "重庆" ||provinceCName == "天津"  ){
    cityCName = provinceCName;
  }
  if(!provinceObj[cityCName]){
    provinceObj[cityCName]={};
  }
  let cityObj = provinceObj[cityCName];

  if(!cityObj[districtCName]){
    cityObj[districtCName]={
      AREAID:districtCode,
      NAMECN:districtCName,
    };
  }else{
    console.error(`${provinceCName},${cityCName},${districtCName},index;${idx} 已经出现过！`)
  }
})

const content = 'let cityData = ' + JSON.stringify(citys);

fs.writeFile(`${__dirname}/city-file/city-data.js`, content, err => {
  if (err) {
    console.error(err)
    return
  }else{
    console.log("文件写入成功。")
  }
})