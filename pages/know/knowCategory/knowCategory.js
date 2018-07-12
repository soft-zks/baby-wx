var util = require('../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 15,
    id:1,
    knowledgeContents: [],
    isEmpty:true,
    requestUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    wx.setNavigationBarTitle({
      title: options.tit
    })
    this.setData({
      requestUrl: 'https://localhost/knowledge/getContentList/' + this.data.id 
    })
    var url = this.data.requestUrl+ '?page=' + this.data.page + '&size=' + this.data.size;
    this.loadeThreeCategory(url);
  },

  //获取三级内容
  loadeThreeCategory: function (url) {
    var that = this;
    wx.request({
      url: url,
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data.list;
        //console.log(subjects);
        var knowledgeContents = new Array();
        for (var i = 0; i < subjects.length; i++) {
          var subject = subjects[i];
          var knowledgeContent = new Object();
          //id
          knowledgeContent.id = subject.knowledgeContentId;
          //picture
          knowledgeContent.picture = subject.picture;
          //标题
          knowledgeContent.title = subject.title.length <= 15 ? subject.title: subject.title.substring(0,15)+"...";
          //详细内容
          knowledgeContent.content = subject.content;
          //时间
          knowledgeContent.created = util.timestampToTime(subject.created);
          knowledgeContents.push(knowledgeContent);
        }

        var totalknowledgeContents = {};
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!that.data.isEmpty) {
          totalknowledgeContents = that.data.knowledgeContents.concat(knowledgeContents);
        }
        else {
          totalknowledgeContents = knowledgeContents;
          that.data.isEmpty = false;
        }
        that.setData({ knowledgeContents: totalknowledgeContents });
      }
    })
    //关闭等待效果
    wx.hideNavigationBarLoading();
    //停止下拉刷新
    wx.stopPullDownRefresh();
    that.data.page += 1;//成功绑定后，已显示的数据数量+20
  },

  //下滑加载数据
  onScrollLower: function (event) {
    //console.log("begin");
    var refUrl =  this.data.requestUrl + '?page=' + this.data.page + '&size=' + this.data.size;
    this.loadeThreeCategory(refUrl);
    //显示等待
   wx.showToast({
     title: '加载中',
     icon:"loading"
   })
  },

  //下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl+ '?page=1&size=15';
    //清空数据，会走else后的部分，不然上滑加载的就不止20条数据了
    this.data.knowledgeContents = [];
    this.data.isEmpty = true;
    this.data.page = 1;
    this.loadeThreeCategory(refreshUrl);
   // wx.showNavigationBarLoading();
  },
  
  //获取知识详细内容
  getCategoryDetail: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../categoryDetail/categoryDetail?id=' + id + "&secondId=" + that.data.id
    })
  }
})