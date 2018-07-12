Page({

  /**
   * 页面的初始数据
   */
  data: {
    beiyuns: {},
    taijiaos:{},
    xindes:{},
    childStorys: {},
    educates: {},
    chengzhangs:{},
    searchResult: {},
    containerShow: true,
    searchPannelShow: false,
    searchResult:{},
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var beiyunsUrl = "https://localhost/v2/book/search?q=" + "备孕";
    var taijiaosUrl = "https://localhost/v2/book/search?q=" + "胎教";
    var childStorysUrl = "https://localhost/v2/book/search?q=" + "童话";
    var educatesUrl = "https://localhost/v2/book/search?q=" + "早期教育";
    var xindesUrl = "https://localhost/v2/book/search?q=" + "早期教育";
    var chengzhangsUrl = "https://localhost/v2/book/search?q=" + "成长故事";

    this.getDouBanStory(beiyunsUrl, "beiyuns", "备孕知识",6);
    this.getDouBanStory(taijiaosUrl, "taijiaos", "胎教读物",6);
    this.getDouBanStory(childStorysUrl, "childStorys", "童话天地",6);
    this.getDouBanStory(educatesUrl, "educates", "学前教育",6);
    this.getDouBanStory(chengzhangsUrl, "chengzhangs", "成长故事",6);
    this.getDouBanStory(xindesUrl, "xindes", "育儿心得",6);
  },

  //根据条件查询豆瓣图书信息
  getDouBanStory: function (url, settedKey, categoryTitle,size) {
    var that = this;
    //向服务器发起一个请求
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        if (res.data.books.length < 1) {
          that.setData({
            isEmpty: true
          })
          return;
        } else{
          that.setData({
            isEmpty: false
          })
        }
        that.processDoubanData(res.data.books, settedKey, categoryTitle,size);
      },
      fail: function (error) {
        //console.log(error)
      }
    })
  },

  processDoubanData: function (storysDouban, settedKey, categoryTitle,size) {
    var storys = [];
    var len = size;
    for (var idx in storysDouban) {
      if(len > 0){
        var subject = storysDouban[idx];
        var title = subject.title;
        if (title.length >= 6) {
          title = title.substring(0, 6) + "...";
        }
        var temp = {
          title: title,
          average: subject.rating.average,
          coverageUrl: subject.images.large,
          id: subject.id
        }
        storys.push(temp);
        len--;
      }
    }
    var readyData = {};
    readyData[settedKey] = {
      storysArray: storys,
      categoryTitle: categoryTitle
    }
    this.setData(readyData);
   // console.log(this.data.beiyuns);
  },

  //更多
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'moreNovel/moreNovel?category=' + category
    })
  },

  //查看电影详情
  onStoryTap:function(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: 'novelDetail/novelDetail?id='+id
    })
  },

  //搜索显示
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },

  //取消搜索
  onCancelImgTap: function () {
    this.setData({
      containerShow: true,
      searchPannelShow: false
    })
  },

  onBindBlur: function (event) {
    var text = event.detail.value;
    var searchUrl = "https://localhost/v2/book/search?q=" + text;
    this.getDouBanStory(searchUrl, "searchResult", "备孕知识",20);
  }
})


