var util = require('../../util/util.js')
var app = getApp()
 Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    photo: "",
    headUrl: '',
    birth: '2016-12-20',
    height: [],
    indexHeight: "",
    weight: [],
    indexWeight: "",
    openid:"",
    userId:"",
    /* 图片上传 */
    userImg:"",
    actionSheetHidden: true, // 是否显示底部可选菜单  
    actionSheetItems: [
      { bindtap: 'changeImage', txt: '修改头像' },
      { bindtap: 'viewImage', txt: '查看头像' }
    ] // 底部可选菜单  
    /* 图片上传 */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var name = options.name;
    var photo = options.photo;
    var openid = options.openid;
    var userId = options.userId;
    var high = options.hight;
    var wig = options.weight;
    var temp = options.birthday;
    var bir = util.timestampToTime(parseInt(temp));
   
    var highIdx = high-150;
    var wigIdx = wig - 35;

    this.setData({
      indexHeight: highIdx,
      indexWeight: wigIdx,
      userId: userId,
      name: name,
      photo: photo,
      openid: openid,
      birth: bir
    });

    //初始化height
    var temp = [];
    var temp2 = [];
    for (var i = 0; i < 50; i++) {
      temp[i] = 150 + i + "cm";
      temp2[i] = 35 + i + "kg";
    }
    this.setData({
      height: temp,
      weight: temp2
    })

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });  
  },
 
  //提交
  formSubmit: function (e) {
    var that = this;
    e.detail.value.height = parseInt(e.detail.value.height);
    e.detail.value.weight = parseInt(e.detail.value.weight);
    var formData = e.detail.value;
    wx.request({
      url: 'https://localhost/user/updateInfo',
      method:'GET',
      //data: formData,
      data: {
        userId : formData.userId,
        nickname : formData.nickname,
        birthdayStr: formData.birthday,
        hight : formData.height,
        openid : formData.openid,
        weight : formData.weight,
        picture : formData.picture,
      },
      success: function (res) {
        wx.showToast({
          title: '修改成功',
          icon:'success'
        })
       var subject = res.data.data;
       app.globalData.userInfo = subject;
      }
    });
  },

  //日期选择
  bindDateChange: function (e) {
    this.setData({
      birth: e.detail.value
    })
  },

  //身高
  bindPickerChange: function (e) {
    this.setData({
      indexHeight: e.detail.value
    })
  },

  //体重
  bindPickerChangeWeight: function (e) {
    this.setData({
      indexWeight: e.detail.value
    })
  }
})