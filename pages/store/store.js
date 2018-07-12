var util = require('../util/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stores: [],
    storeDetails: [],
    containerShow: true,
    searchPannelShow: false,
    requestUrl:"",
    page: 1,
    size: 10,
    isEmpty:true,
    myEmpty:false,
    searchStoreList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategory();
  },

  //获取商品分类及详细信息
  getCategory: function () {
    var page = this;
    wx.request({
    url:'https://localhost/baby/storeContent/getStoreContentGroupByCategory?page=1&size=6',
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data.list;
        //console.log(subjects);
        var stores = new Array();
        for (var i = 0; i < subjects.length; i++) {
          var subject = subjects[i];
          var store = new Object();       
          //类别名称
          store.name = subject.name;
          //内部对象
          var details = new Array();
          for (var j = 0; j < subject.contentList.length;j++){
            var detail = new Object();   
            var temp = subject.contentList[j];
            detail.id = temp.storeContentId;
            detail.picture = temp.picture;
            detail.storeCategoryId = temp.storeCategoryId;
            detail.title = temp.title.length <= 11 ? temp.title : temp.title.substring(0,10)+"...";
            detail.description = temp.description;
            detail.price = temp.price;
            detail.created = util.timestampToTime(temp.created);
            //console.log(detail);
            details.push(detail);
          }
          store.contentList = details;
          stores.push(store);
        }
        page.setData({ stores: stores });
        //console.log(page.data.stores);
      }
    })
  },

  //根据类别获取更多
  getMoreStores: function (event) {
    var category = event.currentTarget.id;
    wx.navigateTo({
      url: './moreStore/moreStore?category=' + category
    })
  },

  loadstoreDetail:function(event){
    //console.log(event);
    var category = event.currentTarget.dataset.category;
    var categoryId = event.currentTarget.dataset.categoryid;
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: './storeDetail/storeDetail?id=' + id + '&category=' + category + "&categoryId=" + categoryId
    })
  },
  //搜索显示
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPannelShow: true,
      showSearch: false
    })
  },

  //取消搜索
  onCancelImgTap: function (event) {
    this.setData({ searchinput: '' });
    this.setData({
      containerShow: true,
      searchPannelShow: false
    })
  },

  onBindBlur: function (event) {
    var that = this;
    if (event.detail.value) {
      that.setData({ requestUrl: 'https://localhost/baby/storeContent/search?query=' + event.detail.value});
      var url = that.data.requestUrl + "&page=1&size=10";
      this.getKnowByKey(url);
    } else {
      return;
    }
  },

  //根据关键字查询商品信息
  getKnowByKey:function(url){
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        if (res.data.data.knowledgeList.length < 1) {
          that.setData({
            myEmpty: true
          })
          return;
        }
        var subjects = res.data.data.knowledgeList;
       // console.log(subjects);
        var searchKnowledgeList = new Array();
        for (var i = 0; i < subjects.length; i++) {
          var subject = subjects[i];
          var searchKnowledge = new Object();
          searchKnowledge.created = subject.created;
          searchKnowledge.picture = subject.picture;
          searchKnowledge.price = subject.price;
          searchKnowledge.storeCategoryId = subject.storeCategoryId;
          searchKnowledge.id = subject.id;
          searchKnowledge.title = subject.title.substring(0,8)+"...";
          searchKnowledge.description = subject.description;
          searchKnowledge.storeCategoryName = subject.storeCategoryName;
          searchKnowledgeList.push(searchKnowledge);
        }
        var totalKnows = {};
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!that.data.isEmpty) {
          totalKnows = that.data.searchStoreList.concat(searchKnowledgeList);
        }
        else {
          totalKnows = searchKnowledgeList;
          that.data.isEmpty = false;
        } 

        that.setData({
          searchStoreList: totalKnows,
          myEmpty: false
        });

        //console.log(that.data.searchStoreList);
        //关闭等待效果
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
        that.data.page += 1;//成功绑定后，page++
      }
    })
  },

  //下滑加载数据
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "&page=" + this.data.page + "&size=10";
    this.getKnowByKey(nextUrl);
    //显示等待
    setTimeout(function () {
      wx.showNavigationBarLoading();
    }, 1000)
  },

  //下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "&page=1&size=10";
    //清空数据，会走else后的部分，不然上滑加载的就不止20条数据了
    this.data.searchStoreList = [];
    this.data.isEmpty = true;
    this.data.page = 1;
    this.getKnowByKey(refreshUrl);
    wx.showNavigationBarLoading();
  }
})