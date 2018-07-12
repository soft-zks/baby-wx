var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getInfo();
  },

  getInfo: function () {
    var that = this;
    app.denglu();
    setTimeout(function () {
      wx.switchTab({
        url: "../index/index"
      });
      wx.showToast({
        title: "",
        duration: 500,
        icon: "loading"//loading
      });
    }, 3000)
  }
})