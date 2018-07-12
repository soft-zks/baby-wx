// pages/index/prenatalCare/prenatalCare.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKnowledgeList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKnowByKey();
  },

  getKnowByKey: function () {
    var that = this;
    wx.request({
      url: 'https://localhost/search/query/怀孕?page=1&rows=40',
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
       // console.log(res.data.data.knowledgeList);
        var subjects = res.data.data.knowledgeList;
        var searchKnowledgeList = new Array();
        for (var i = 0; i < subjects.length; i++) {
          var subject = subjects[i];
          var searchKnowledge = new Object();
          searchKnowledge.id = subject.id;
          searchKnowledge.content = subject.know_content;
          searchKnowledge.picture = subject.know_picture;
          searchKnowledge.title = subject.know_title;
          searchKnowledgeList.push(searchKnowledge);
        }
        that.setData({ searchKnowledgeList: searchKnowledgeList});
      }
      })
    },

  getMore: function () {
    wx.switchTab({
      url: '../../know/know',
    })
  }
})