var util = require('../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    size:10,
    storeDetails:[],
    requestUrl:"",
    isEmpty: true,
    category:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    var category = options.category;
    this.setData({ 
      category:category,
      requestUrl: 'https://localhost/baby/storeContent/getListByCategory?category=' + category
      });
    wx.setNavigationBarTitle({
      title: category
    })
    var url = this.data.requestUrl + '&page=' + this.data.page + '&size=' + this.data.size;
    this.getListByCategory(url);
  },

  //下滑加载数据
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "&page=" + this.data.page + "&size=10";
    //console.log(nextUrl);
    this.getListByCategory(nextUrl);
    //显示等待
    setTimeout(function () {
      wx.showNavigationBarLoading();
    }, 1000) 
  },

  //下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "&page=1&size=10";
    //清空数据，会走else后的部分，不然上滑加载的就不止20条数据了
    this.data.storeDetails = [];
    this.data.isEmpty = true;
    this.data.page = 1;
    getListByCategory(refreshUrl);
    wx.showNavigationBarLoading();
  },

  //根据类别获取相应的商品信息
  //获取商品详情信息
  getListByCategory: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data;
        //console.log(subjects);
        var storeDetails = new Array();
        for (var i = 0; i < subjects.length; i++) {
          var subject = subjects[i];
          var storeDetail = new Object();
          //id
          storeDetail.id = subject.storeContentId;
          //类别名称
          storeDetail.category = that.data.category;
          //类别id
          storeDetail.storeCategoryId = subject.storeCategoryId;
          //名称
          storeDetail.title = subject.title.substring(0,8)+"...";
          //价格
          storeDetail.price = subject.price;
          //图片
          storeDetail.picture = subject.picture;
          //详情
          storeDetail.description = subject.description.substring(0, 25) + "...";
          //时间
          storeDetail.created = util.timestampToTime(subject.created);
          storeDetails.push(storeDetail);
        }

        var totalStorys = {};
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!that.data.isEmpty) {
          totalStorys = that.data.storeDetails.concat(storeDetails);
        }
        else {
          totalStorys = storeDetails;
          that.data.isEmpty = false;
        }

        that.setData({
          storeDetails: totalStorys
        });

        //关闭等待效果
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
        that.data.page += 1;//成功绑定后，page++
      }
    })
  },

  //根据id获取商品
  getStoreDetailById:function(e){
    wx.navigateTo({
      url: '../storeDetail/storeDetail',
    })
  },

  loadstoreDetail: function (event) {
    // console.log(event);
    var category = event.currentTarget.dataset.category;
    var categoryId = event.currentTarget.dataset.categoryid;
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../storeDetail/storeDetail?id=' + id + '&category=' + category + "&categoryId=" + categoryId
    })
  }
})