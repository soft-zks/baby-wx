var util = require('../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    flag: 0,
    chats:{},
    page: 1,
    size: 10,
    updatedQuestions: [],
    requestUrl: "",
    isEmpty: true
  },

  onLoad:function(options){
    this.setData({
      requestUrl: 'https://localhost/baby/question/getLastQuestion'
    });
    //获取最新推荐
    var url = this.data.requestUrl+'?page=1&size=10';
    this.getUpdatedQuestion(url);
    //获取论坛推荐
    this.getRecommendChat();
  },

  /* 切换推荐*/
  switchNav: function (e) {
    //console.log(e);
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id
      })
    }
    page.setData({
      flag: id
    })
  },

  //查看详情
  seeDetail:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: './questionDetail/questionDetail?id=' + id,
    })
  },

  //获取最新的推荐
  getUpdatedQuestion:function(url){
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
        if (subjects.length == 0){
          //关闭等待效果
          wx.hideNavigationBarLoading();
          //停止下拉刷新
          wx.stopPullDownRefresh();
          return;
        }
        var updatedQuestions = new Array();
        for (var i = 0; i < subjects.length; i++){
          var subject = subjects[i];
          var question = new Object();
          question.created = util.timestampToTime(subject.created);
          question.picture = subject.picture;
          question.questionCategoryId = subject.questionCategoryId;
          question.questionCategoryName = subject.questionCategoryName;
          question.questionContent = subject.questionContent;
          question.questionId = subject.questionId;
          question.questionTitle = subject.questionTitle;
          question.userId = subject.userId;
          updatedQuestions.push(question);
        }
        var totalQuestions = {};
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!that.data.isEmpty) {
          totalQuestions = that.data.updatedQuestions.concat(updatedQuestions);
        }
        else {
          totalQuestions = updatedQuestions;
          that.data.isEmpty = false;
        }
        that.setData({
          updatedQuestions: totalQuestions
        });
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
    //console.log("下滑加载数据");
    var nextUrl = this.data.requestUrl + "?page=" + this.data.page + "&size=10";
    this.getUpdatedQuestion(nextUrl);
    //显示等待
    setTimeout(function () {
      wx.showNavigationBarLoading();
    }, 1000)
  },

  //下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?page=1&size=10";
    //清空数据，会走else后的部分，不然上滑加载的就不止20条数据了
    this.data.updatedQuestions = [];
    this.data.isEmpty = true;
    this.data.page = 1;
    getUpdatedQuestion(refreshUrl);
    wx.showNavigationBarLoading();
  },

  //获取论坛分类推荐
    getRecommendChat:function () {
    var page = this;
    wx.request({
      url: 'https://localhost/baby/question/getQuestionGroupByCategory?size=10',
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data;
        //console.log(subjects);
        var chats = new Array();
        for (var i = 0; i < subjects.length;i++){
          var subject = subjects[i];
          var chat = new Object();
          chat.category = subject.category;//类别
          var list = new Array();
          for (var j = 0; j < subject.questionList.length; j++){
            var temp = subject.questionList[j];
            var question = new Object();
            question.created = util.timestampToTime(temp.created);
            question.picture = temp.picture;
            question.questionCategoryId = temp.questionCategoryId;
            question.questionCategoryName = temp.questionCategoryName;
            question.questionContent = temp.questionContent.length <= 100 ? temp.questionContent : temp.questionContent.substring(0,100)+"...";
            question.questionId = temp.questionId;
            question.questionTitle = temp.questionTitle;
            list.push(question);
          }
          chat.questionList = list;
          chats.push(chat);
        }
        page.setData({ chats: chats });
      }
    })
  },

  //写文章
  writeChat:function(){
    wx.navigateTo({
      url: './writeChat/writeChat',
    })
  }
})