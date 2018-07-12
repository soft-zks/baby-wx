var util = require('../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: [
      "https://localhost/image/obaby/haibao-1.png",
      "https://localhost/image/obaby/haibao-2.png",
      "https://localhost/image/obaby/haibao-3.png",
      "https://localhost/image/obaby/haibao-4.png",
      "https://localhost/image/obaby/haibao-5.png",
      "https://localhost/image/obaby/haibao-6.png"
    ],
    advices: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommend();
  },

  //跳转到孕期护理
  prenatalCare:function(){
    wx.navigateTo({
      url: './prenatalCare/prenatalCare',
    })
  },

  //跳转到故事天地
  novelWorld:function(e){
    wx.navigateTo({
      url: './novel/novel',
    })
  },

  //成长历程
  growProcess:function(){
    wx.navigateTo({
      url: './grow/grow',
    })
  },

  //精品推荐
  storeAdvice:function(){
    wx.switchTab({ 
      url: '../store/store',
    })
  },

  //随机推荐
  getRecommend:function(){
    var that = this;
    wx.request({
      url: 'https://localhost/knowledge/getRecommend/10',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data;
       // console.log(subjects);
        var advices = new Array();
        var len = subjects.length;
        for (var i = 0; i < len; i++) {
          var subject = subjects[i];
          var advice = new Object();
          advice.id = subject.knowledgeContentId;
          advice.content = subject.content;
          advice.picture = subject.picture;
          advice.secondCategoryId = subject.secondCategoryId;
          advice.title = subject.title;
          advice.created = util.timestampToTime(subject.created);
          advices.push(advice);
        }
        that.setData({ advices: advices });
      }
    })
  },

  //获取知识详细内容
  getInfo: function (e) {
    //console.log(e);
    var that = this;
    var id = e.currentTarget.id;
    var secondId = e.currentTarget.dataset.secondid;
    wx.navigateTo({
      url: '/pages/know/categoryDetail/categoryDetail?id=' + id + "&secondId=" + secondId
    })
  },

  getMore:function(){
    wx.switchTab({
      url: '../know/know',
    })
  }
})