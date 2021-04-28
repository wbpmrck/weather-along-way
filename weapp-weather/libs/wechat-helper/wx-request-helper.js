
function request(url,method,data){
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method,
      success(res) {
        resolve(res);
      },
      fail() {
        reject({
          msg: '请求失败',
          url,
          method,
          data
        });
      }
    });
  });
}

module.exports = {
  request
}