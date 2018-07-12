Page({
  data: {
    flag: 0,
    currentTab: 0,
    containerShow: true,
    searchPannelShow: false,
    leftNavs: [],
    rightNavs: [],
    searchKnowledgeList: [],
    myEmpty:false,
    isEmpty: true,
    requestUrl:""
  },
  onLoad: function (options) {
    this.getAllFirstCategory();
    this.getSecondCategory(1);
  },

  switchNav: function (e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({ currentTab: id });
    }
    page.setData({ flag: id });
    //加载二级信息
    var selId = ++id;
    //console.log(selId);
    page.setData({ rightNavs: [] });
    page.getSecondCategory(selId);
  },

  //获取一级分类信息
  getAllFirstCategory: function () {
    var page = this;
    wx.request({
      url: 'https://localhost/knowledge/getAllFirstCategory',
      //url: 'https://localhost/v2/movie/in_theaters',
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data;
        //console.log(subjects);
        var leftNavs = new Array();
        var len = subjects.length >= 10 ? 10 : subjects.length;
        for (var i = 0; i < len; i++) {
          var subject = subjects[i];
          var leftNav = new Object();
          //id
          leftNav.id = subject.firstCategoryId;
          //名称
          leftNav.name = subject.firstName;
          //图片
          leftNav.img = subject.picture;

          leftNavs.push(leftNav);
        }
        page.setData({ leftNavs: leftNavs });
      }
    })
  },

  //根据一级分类获取二级分类信息
  getSecondCategory: function (id) {
    //onsole.log(id);
    var page = this;
    wx.request({
      url: 'https://localhost/knowledge/getSecondCategory/' + id,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subjects = res.data.data;
        //console.log(subjects);
        var rightNavs = new Array();
        var len = subjects.length >= 10 ? 10 : subjects.length;
        for (var i = 0; i < len; i++) {
          var subject = subjects[i];
          var rightNav = new Object();
          //id
          rightNav.id = subject.secondCategoryId;
          //name
          rightNav.name = subject.secondName;
          rightNavs.push(rightNav);
        }
        page.setData({ rightNavs: rightNavs });
      }
    })
  },

  //显示三级内容
  loadeCategory: function (e) {
    var id = e.currentTarget.id;
    var tit = e.currentTarget.dataset.tit;
    //console.log(tit);
    wx.navigateTo({
      url: 'knowCategory/knowCategory?id=' + id + "&tit=" + tit,
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
      that.setData({ requestUrl: 'https://localhost/search/query/' + event.detail.value});
      var url = that.data.requestUrl + "?page=1&rows=10";
      this.getKnowByKey(url);
    } else {
      return;
    }
  },

  //根据关键字查询记录
  getKnowByKey: function (url) {
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

        var totalKnows = {};
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!that.data.isEmpty) {
          totalKnows = that.data.searchKnowledgeList.concat(searchKnowledge);
        }
        else {
          totalKnows = searchKnowledge;
          that.data.isEmpty = false;
        }2

        that.setData({
          searchKnowledgeList: totalKnows
        });

        //关闭等待效果
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
        that.data.page += 1;//成功绑定后，page++

        that.setData({
          searchKnowledgeList: searchKnowledgeList,
          myEmpty: false
        });
      }
    })
  },
  //下滑加载数据
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "&page=" + this.data.page + "&rows=10";
    this.getKnowByKey(nextUrl);
    //显示等待
    setTimeout(function () {
      wx.showNavigationBarLoading();
    }, 1000) 
  },

  //下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?page=1&rows=10";
    //清空数据，会走else后的部分，不然上滑加载的就不止20条数据了
    this.data.searchKnowledgeList = [];
    this.data.isEmpty = true;
    this.data.page = 1;
    this.getKnowByKey(refreshUrl);
    wx.showNavigationBarLoading();
  },

})