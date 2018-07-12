//获取应用实例
var app = getApp()

Page({
  data: {
    motto: "欢迎",
    userInfo: {},
    user: {}
  },
  onLoad: function (e) {
    //console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },
  onShow: function () {
    if (app.globalData.userInfo){
      this.setData({
        hasUserInfo: true
      })
    }else{
      this.setData({
        hasUserInfo: false
      })
    }
    
  },
  getUserInfo: function (e) {
    var that = this;
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
                console.log(e.data.data);
                app.globalData.userInfo = e.data.data;
                that.setData({
                  userInfo: e.data.data,
                  hasUserInfo: true
                })
              }
            })
          }
        })
      }
    })
  },

  meDetail:function(e){
    var name = e.currentTarget.dataset.nickname;
    var photo = e.currentTarget.dataset.avatarurl;
    var openid = e.currentTarget.dataset.openid;
    var userId = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: 'meDetail/meDetail?name=' + name + '&photo=' + photo + "&openid=" + openid + "&userId=" + userId + "&hight=" + app.globalData.userInfo.hight + "&weight=" + app.globalData.userInfo.weight + "&birthday=" + app.globalData.userInfo.birthday
    })
  },

  //关于我们
  toAboutUs:function(){
    wx.navigateTo({
      url: 'aboutUs/aboutUs'
    })
  },

  //用户反馈
  toUserFeedback:function(){
    wx.navigateTo({
      url: 'feedback/feedback',
    })
  },

  //我的帖子
  toMyArticle:function(){
    wx.navigateTo({
      url: 'article/article',
    })
  },

  //退出登录
  logout:function(){
    var that = this;
    wx.showModal({
      title: '退出登录',
      content: '您是否要退出登录？',
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确定",
      confirmColor: "#45f80",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://localhost/user/logout/ovqE95YyBfM81KkwF7WnkPfEfuCI',
            method: 'GET',
            success: function(res){
              console.log(res);
              app.globalData.userInfo = null;
              that.setData({
                userInfo: null,
                hasUserInfo: false
              })
            }
          })
        }
      }
    }); 
  }
})