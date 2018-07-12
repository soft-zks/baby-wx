var util = require('../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    knowDetail:null,
    secondId:1,
    collected:'',
    advices:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getCategoryDetail(options);

    var postId = options.id;
    this.data.currentPostId = postId;
    //获取所属二级分类的id和名称
    this.data.secondId = options.secondId;
    //读取收藏的缓存状态
    var postsCollected = wx.getStorageSync("posts_collected");//获取的是所有文章的缓存状态

    if (postsCollected) {
      var postCollected = postsCollected[postId];
      that.setData({
        collected: postCollected
      });
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected);
    } 

    //获取相关推荐信息
    this.adviceKnow();
  },

  //相关推荐
  adviceKnow:function(){
    var that = this;
    //console.log(this.data.secondId);
    wx.request({
      url: 'https://localhost/knowledge/getRandomContent/' + that.data.secondId,
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data;
        //console.log(subjects);
        var advices = new Array();
        var len = subjects.length;
        for (var i = 0; i < len; i++) {
          var subject = subjects[i];
          var advice = new Object();
          advice.id = subject.knowledgeContentId;
          advice.content = subject.content;
          advice.picture = subject.picture;
          advice.secondCategoryId = subject.secondCategoryId;
          advice.title = subject.title;
          advice.created = util.timestampToTime(subject.created);
          advices.push(advice);
        }
        that.setData({ advices: advices });
      }
    })
  },

  //获取知识详细内容
  getInfo: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/know/categoryDetail/categoryDetail?id=' + id + "&secondId=" + that.data.secondId
    })
  },

  onColletionTap: function (event) {
    //this.getPostsCollectedAsy();
    this.getPostsCollectedAsy();
  },

  //同步方式
  getPostsCollectedSyc: function () {
    var postsCollected = wx.getStorageSync('posts_collected');//获取的是所有文章的缓存状态
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  showToast: function (postsCollected, postCollected) {
    //更新文章是否收藏的缓存值
    wx.setStorageSync("posts_collected", postsCollected);
    //更新数据绑定
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: "success"//loading
    });
  },

  onShareTap: function (event) {
    var itemList = [
      "分享到微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        //res.cancel 用户是不是点击了取消按钮
        //res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户选择是否取消？ 现在无法实现分享功能！！！',
        })
      }
    })
  },

  //获取知识详情
  getCategoryDetail: function (e) {
    //显示等待效果
    wx.showNavigationBarLoading();
    var id = e.id;
    var that = this;
    wx.request({
      url: 'https://localhost/knowledge/getContent/' + id,
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subject = res.data.data;
        var knowDetail = new Object();
        //console.log(subject);
        //id
        knowDetail.id = subject.knowledgeContentId;
        //title
        knowDetail.title = subject.title;
        //content
        knowDetail.content = subject.content;
        //created
        knowDetail.created = util.timestampToTime(subject.created);
        //picture
        knowDetail.picture = subject.picture;
        that.setData({ knowDetail: knowDetail });
      }
    })
    //关闭等待效果
    wx.hideNavigationBarLoading();
  },

  onColletionTap: function (event) {
    //this.getPostsCollectedAsy();
    this.getPostsCollectedSyc();
  }
})