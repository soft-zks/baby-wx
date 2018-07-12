var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    category:[],
    userId: {},
    hasUser:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(app.globalData.userInfo);
    //获取用户登录信息
    if (app.globalData.userInfo) {
      this.setData({
        userId: app.globalData.userInfo.userId,
        hasUser: true
      })
    }

    this.getCategory();
  },
  
  //获取类别
  getCategory: function () {
    var page = this;
    wx.request({
      url: 'https://localhost/baby/question/getCategoryList',
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data;
        var category = new Array();
        for(var i = 0;i<subjects.length;i++){
          var subject = subjects[i];
          var temp = subject.questionCategoryName;
          category.push(temp);
        }
        page.setData({ category: category});
      }
    })
  },

  //提交
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    //console.log(formData);
    wx.request({
      url: 'https://localhost/baby/question/addQuestion',
      method: 'GET',
      data: {
        questionTitle: formData.questionTitle,
        questionContent: formData.questionContent,
        questionCategoryName: formData.questionCategoryName,
        userId: formData.userId
      },
      success: function (res) {
        wx.showToast({
          title: '发布成功',
          icon:"success"
        })

        wx.navigateTo({
          url: '/pages/chat/chat',
        })
      }
    })
  },

  //类别
  bindPickerChangeWeight: function (e) {
    this.setData({
      index: e.detail.value
    })
  }
})