class Cache {
  data = undefined;
  expire = undefined;
  setTime = undefined; //缓存设置时间
  constructor(expireSeconds){
    this.expire = expireSeconds|| 60;
  }
  // 判断缓存是否过期
  isExpire(){
    return  (+new Date())- (+this.setTime) > this.expire * 1000
  }
  // 重新设置新值
  setVal(data){
    this.data = data;
    this.setTime = new Date();
  }
}


// 业务层需要缓存的数据
let cachedData = {};

function getCachedData(key){
  let d = cachedData[key];
  if(d && !d.isExpire()){
    return d.data;
  }else{
    return undefined;
  }
}
function setCacheData(key,val,expireSeconds){
  let d = cachedData[key];
  if(!d){
    d = new Cache(expireSeconds);
  }
  d.setVal(val);
  cachedData[key] = d;
  return true;
}

module.exports = {
  Cache,
  getCachedData,
  setCacheData
}