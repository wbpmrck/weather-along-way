const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

exports.newDate = function (year, month, day, hour, minute, seconds, ms) {
  var d =new Date();
  d.setYear(year);
  d.setMonth(month);
  d.setDate(day);
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(seconds);
  d.setMilliseconds(ms);

  return d;
}

function format(date,fmt) { //author: meizz
  var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
  };
  //将毫秒补位成3位
  var less = 3 - (""+ o["f+"]).length;
  while( less > 0){
      o["f+"] = "0" + o["f+"];
      less--;
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
exports.format = format;

/**
 * 获取这个日期当天剩余秒数
 * @param {*} date 
 * @returns 
 */
function getTodayLeftSeconds(date){
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  let hourLeft = 24 - hour;
  if( !(minute === 0 && second === 0) ){
    hourLeft -= 1;
  }
  let minuteLeft = 60-minute;

  if( second !== 0){
    minuteLeft -= 1;
  }

  let secondLeft = 60-second;

  let totalSecondsLeft = hourLeft * 3600 + minuteLeft * 60 + secondLeft;
  return totalSecondsLeft;
}
/**
 * 根据传入时间，获取这个时间相对于现在的“天”的描述，范围在2天内：
 * 今天、明天、后天
 * @param {*} dateTime 
 */
function getDayPrefix(dateTime,dayFormat){


  let now = new Date();

  let targetYear = dateTime.getFullYear();
  let targetMonth = dateTime.getMonth();
  let targetDate = dateTime.getDate();

  let nowYear = now.getFullYear();
  let nowMonth = now.getMonth();
  let nowDate = now.getDate();

  let toDayLeftSeconds = getTodayLeftSeconds(now);
  let distanceSeconds = Math.floor((dateTime - now)/1000); //间隔时间
  let distanceStartWithTomorrow = distanceSeconds - toDayLeftSeconds; //从明天开始算的间隔时间

  if(distanceStartWithTomorrow <= 0){
    return "今天"
  }else if(distanceStartWithTomorrow < 24 * 3600){
    return "明天"
  }else if(distanceStartWithTomorrow < 48 * 3600){
    return "后天"
  }else{
    return format(dateTime,dayFormat)
  }
}
exports.getDayPrefix = getDayPrefix;
