var util = require('../../util/util.js')
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    releaseFocus: false,
    questionDetail:null,
    replys:[],
    isEmpty:true,
    userInfo: {},
    hasUser:false,
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(app.globalData.userInfo);
    //获取用户登录信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUser:true
      })
    }
    var id = options.id;
    this.setData({id:id});
    //根据id查询论坛详情
    this.getQuestionDetailById(id);
    //获取问题回复
    this.getReplayById(id);
  },

  //根据id查询论坛详情
  getQuestionDetailById:function(id){
    var that = this;
    wx.request({
      url: "https://localhost/baby/question/getQuestionById?questionId="+id,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data;
        //console.log(subjects);
        var questionDetail = new Object();
        questionDetail.created = util.timestampToTime(subjects.created);
        questionDetail.picture = subjects.picture;
        questionDetail.questionCategoryId = subjects.questionCategoryId;
        questionDetail.questionCategoryName = subjects.questionCategoryName;
        questionDetail.questionContent = subjects.questionContent;
        questionDetail.questionId = subjects.questionId;
        questionDetail.questionTitle = subjects.questionTitle;
        questionDetail.userId = subjects.userId;
        that.setData({ questionDetail: questionDetail});
      }
    })
  },

  //获取问题回复
  getReplayById:function(id){
    var that = this;
    wx.request({
      url: "https://localhost/baby/question/getReply?questionId="+id+"&page=1&size=10",
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data;
        //console.log(subjects);
        if (res.data.length>0){
            var replys  = new Array();
            for(var i =0 ;i<subjects.length;i++){
              var subject = subjects[i];
              var replay = new Object();
              var parentReply = new Object();
              parentReply.created = util.timestampToTime(subject.parentReply.created);
              parentReply.parentId = subject.parentReply.parentId;
              parentReply.picture = subject.parentReply.picture;
              parentReply.questionId = subject.parentReply.questionId;
              parentReply.replyContent = subject.parentReply.replyContent;
              parentReply.replyId = subject.parentReply.replyId;
              parentReply.userId = subject.parentReply.userId;
              replay.parentReply = parentReply;

              var subReplyList = new Array();
              for (var j = 0; j < subject.subReplyList.length;j++){
                var subReply = new Object;
                var temp = subject.subReplyList[j];
                subReply.created = util.timestampToTime(temp.created);
                subReply.parentId = temp.parentId;
                subReply.questionId = temp.questionId;
                subReply.replyContent = temp.replyContent;
                subReply.replyId = temp.replyId;
                subReply.replyId = temp.replyId;
                subReplyList.push(subReply);
              }
              replay.subReplyList = subReplyList;
              replys.push(replay);
            }
            that.setData({ 
              replys: replys,
              isEmpty: false
              });
        }else{
          that.setData({isEmpty:true});
        }
      }
    })
  },

  /* 点击回复*/
  bindReply: function (e) {
    this.setData({
      releaseFocus: true
    })
  },

  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    //console.log(formData);
    wx.request({
      url: 'https://localhost/baby/question/addReply',
      data: {      
        questionId: formData.questionId,
        userId: formData.userId,
        replyContent: formData.replyContent
      },
      success: function (res) {       
        that.getReplayById(that.data.id);
        wx.showToast({
          title: '评论成功！',
          icon:"success"
        })
      }
    });
  },

  pinglun:function(){
    wx.navigateTo({
      url: '../commit/commit',
    })
  }
})