// pages/me/feedback/feedback.js
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
  
  },

  submitForm:function(){
    wx.showToast({
      title: '提交成功',
      icon:'success'
    })

    wx.navigateTo({
      url: 'pages/me/me',
    })
  }
})