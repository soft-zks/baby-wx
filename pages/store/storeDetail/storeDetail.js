var util = require('../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:null,
    advices:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStoreDetailById(options);
    wx.setNavigationBarTitle({
      title: "商品详情"
    })

    //获取推荐的商品信息
    this.adviseStore(options);
  },

  getStoreDetailById:function(event){
    console.log(event);
    //所属类别
    var category = event.category;
    //所属类别id
    var categoryId = event.categoryId;
    var id = event.id;
    var that = this;
    wx.request({
      url: 'https://localhost/baby/storeContent/getStoreById?id=' + id,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subject = res.data
        //console.log(subject);
        var temp = new Object();
        temp.id = subject.storeContentId;
        temp.created = util.timestampToTime(subject.created);
        temp.description = subject.description;
        temp.picture = subject.picture;
        temp.price = subject.price;
        temp.title = subject.title;
        temp.storeCategoryName = subject.storeCategoryName;
        temp.category = category;
        temp.categoryId = categoryId;
        that.setData({ detail: temp}); 
      }
    })
  },

  //查看图片
  viewImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,//当前显示图片的http链接
      urls: [src]//需要预览的图片http的链接列表
    })
  },

  //相关推荐
  adviseStore:function(event){
    //所属类别
    var category = event.category;
    //所属类别id
    var categoryId = event.categoryId;
    var that = this;
    wx.request({
      url: 'https://localhost/baby/storeContent/getRandomSuggest?categoryId=' + categoryId,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data;
        //console.log(subjects);
        var advices = new Array();
        for (var i = 0; i < subjects.length; i++) {
          var subject = subjects[i];
          var advice = new Object();        
          advice.storeCategoryId = subject.storeCategoryId;
          advice.id = subject.storeContentId;
          advice.price = subject.price;
          advice.picture = subject.picture;
          advice.description = subject.description;
          advice.title = subject.title.substring(0,5)+"...";
          advice.created = subject.created;
          advice.category = subject.storeCategoryName;
          advices.push(advice);
        }
        that.setData({ advices: advices });
      }
      
    })
  },

  loadstoreDetail: function (event){
    //console.log(event);
    var category = event.currentTarget.dataset.category;
    var categoryId = event.currentTarget.dataset.categoryid;
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '/pages/store/storeDetail/storeDetail?id=' + id + '&category=' + category + "&categoryId=" + categoryId
    })
  }
})