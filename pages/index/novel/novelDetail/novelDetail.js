// pages/index/novel/novelDatail/novelDatail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    novelDetail:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStoryDetailById(options.id);
  },

  //根据id查询图书信息
  getStoryDetailById(id){
      var that = this;
      //向服务器发起一个请求
      wx.request({
        url: 'https://localhost/v2/book/'+id,
        method: 'GET',
        header: {
          "Content-Type": "json"
        },
        success: function (res) {
          var subject = res.data;
          console.log(res);
          var temp = new Object();
          temp.id = subject.id;
          temp.author = subject.author[0];
          temp.author_intro = subject.author_intro.substring(0,70);
          temp.summary = subject.summary;
          temp.images = subject.images.large;
          temp.pubdate = subject.pubdate;//出版时间
          temp.publisher = subject.publisher;//出版社
          temp.rating = subject.rating.average;
          temp.numRaters = subject.rating.numRaters;
          temp.origin_title = subject.origin_title;
          temp.title = subject.title;
          that.setData({ novelDetail: temp});
        }
      })
     
  },
  //查看图片
  viewImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,//当前显示图片的http链接
      urls: [src]//需要预览的图片http的链接列表
    })
  }
})