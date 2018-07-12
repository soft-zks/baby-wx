var util = require('../../util/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    page: 1,
    requestUrl:"",
    allArticles:{},
    isEmpty: true,
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }

    this.setData({
      requestUrl: 'https://localhost/baby/question/getQuestionByUserId?userId=' + this.data.userInfo.userId
    })
    var url = this.data.requestUrl +'&page=1&size=10';
    this.getArticleByUserId(url);
  },
  
  //根据id获取帖子
  getArticleByUserId: function (url){
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data;
        var allArticles = new Array();
        for (var i = 0; i < subjects.length; i++) {
          var subject = subjects[i];
          var article = new Object();
          article.created = util.timestampToTime(subject.created);
          article.picture = subject.picture;
          article.questionCategoryId = subject.questionCategoryId;
          article.questionCategoryName = subject.questionCategoryName;
          article.questionContent = subject.questionContent.length <= 70 ? subject.questionContent : subject.questionContent.substring(0,70)+"...";
          article.questionId = subject.questionId;
          article.questionTitle = subject.questionTitle;
          article.userId = subject.userId;
          allArticles.push(article);
        }

        var totalArticles = {};
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!that.data.isEmpty) {
          totalArticles = that.data.allArticles.concat(allArticles);
        }
        else {
          totalArticles = allArticles;
          that.data.isEmpty = false;
        }

        that.setData({
          allArticles: totalArticles
        });

        console.log(that.data.allArticles);
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
    console.log(nextUrl);
    this.getArticleByUserId(nextUrl);
    //显示等待
    setTimeout(function () {
      wx.showNavigationBarLoading();
    }, 1000)
  },

  //下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "&page=1&size=10";
    //清空数据，会走else后的部分，不然上滑加载的就不止20条数据了
    this.data.allArticles = [];
    this.data.isEmpty = true;
    this.data.page = 1;
    getListByCategory(refreshUrl);
    wx.showNavigationBarLoading();
  },

  //查看详情
  seeDetail: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/chat/questionDetail/questionDetail?id=' + id,
    })
  }
})