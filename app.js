//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // this.denglu();
  },

  denglu: function () {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getUserInfo({
          success: result => {
            // 获取用户信息
            wx.request({
              url: 'https://localhost/user/start',
              method: 'GET',
              data: {
                code: res.code,
                encryptedData: result.encryptedData,
                iv: result.iv
              },
              success: function (e) {
                //console.log(e.data.data);
                that.globalData.userInfo = e.data.data;
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(e.data.data);
                }
              }
            })
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null
  }
})