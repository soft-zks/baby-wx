// pages/index/novel/moreNovel/moreNovel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      moreStorys:{},
      requestUrl: "",
      totalCount: 0,
      isEmpty: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    wx.setNavigationBarTitle({
      title: category,
    })
    var dataUrl = "";
    switch (category) {
      case "备孕知识":
        dataUrl = "https://localhost/v2/book/search?q=" + "备孕";
        break;
      case "胎教读物":
        dataUrl = "https://localhost/v2/book/search?q=" + "胎教";
        break;
      case "童话天地":
        dataUrl = "https://localhost/v2/book/search?q=" + "童话";
      case "学前教育":
        dataUrl = "https://localhost/v2/book/search?q=" + "早期教育";
        break;
      case "成长故事":
        dataUrl = "https://localhost/v2/book/search?q=" + "早期教育";
        break;
      case "育儿心得":
        dataUrl = "https://localhost/v2/book/search?q=" + "成长故事";
        break;
    }
    this.setData({ requestUrl: dataUrl});
    this.getDouBanStory(dataUrl);
  },

  //查看电影详情
  onStoryTap: function (event) {
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../novelDetail/novelDetail?id=' + id
    })
  },

  getDouBanStory: function (url) {
    var that = this;
    //向服务器发起一个请求
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        //console.log(res.data.books);
        that.processDoubanData(res.data.books);
      },
      fail: function (error) {
        //console.log(error)
      }
    })
  },

  processDoubanData: function (storysDouban) {
    var storys = [];
      for (var idx = 0; idx < storysDouban.length; idx++) {
      var subject = storysDouban[idx];
      var story = new Object();
        var title = subject.title;
        if (title.length >= 6) {
          title = title.substring(0, 6) + "...";
        }
        story.id = subject.id;
        story.title = title;
        story.average = subject.rating.average;
        story.coverageUrl = subject.images.large;
        storys.push(story);
    }
    var totalStorys = {};
    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalStorys = this.data.moreStorys.concat(storys);
    }
    else {
      totalStorys = storys;
      this.data.isEmpty = false;
    }

    //console.log(totalStorys);
    this.setData({
      moreStorys: totalStorys
    });

    //console.log(this.data.moreStorys);

    //关闭等待效果
    wx.hideNavigationBarLoading();
    //停止下拉刷新
    wx.stopPullDownRefresh();
    this.data.totalCount += 20 ;//成功绑定后，已显示的数据数量+20
  },

  //下滑加载数据
  onScrollLower: function (event) {
    //console.log("下滑加载数据");
    var nextUrl = this.data.requestUrl + "&start=" + this.data.totalCount + "&count=20";
    //console.log(nextUrl);
    this.getDouBanStory(nextUrl);

    //显示等待
    wx.showNavigationBarLoading();
  },

  //下拉刷新
  onPullDownRefresh: function (event) {
    //console.log("下拉刷新");
    var refreshUrl = this.data.requestUrl + "?star=0&count=20";
    //清空数据，会走else后的部分，不然上滑加载的就不止20条数据了
    this.data.moreStorys = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    this.getDouBanStory(refreshUrl);
    wx.showNavigationBarLoading();
  },
})