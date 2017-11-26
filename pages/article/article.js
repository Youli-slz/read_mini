// article.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isemptypic:false,
    car: {
      linkurl: null,
      description: null,
    },
    pic: [{
      pic_url: '',
      url: null
    }],
    newlist: [],
    desc: {
      isbiaoshi: 1,
      titleText: '',
      dynamic_id: 1
    },
    iscollect: null     // 是否有收藏的值   1,收藏 0,未收藏
  },
  formate: function (t) {
    var d = new Date(t * 1000);
    var year = d.getFullYear();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var hour = d.getHours();
    var minute = d.getMinutes();
    var f = this.init(month) + "月" + this.init(day) + "日";
    return f;
  },
  init: function (d) {
    return d > 9 ? d : "0" + d;
  },
  pictopage: function (e) {
    this.data.car = e.currentTarget.dataset;

    console.log(this.data.car);
    if (Number.parseInt(this.data.car.description) == 1) {
      wx.navigateTo({
        url: '../play/play_page?dynamic_id=' + Number.parseInt(this.data.car.url) + '&is_collect=0',
      })
    } else {
      wx.navigateTo({
        url: '../article_detail/art_detail?dynamic_id=' + Number.parseInt(this.data.car.url) + '&is_collect=0',
      })
    }

  },
  todetailBylist: function (e) {
    this.data.desc = e.currentTarget.dataset;
    console.log(this.data.desc);
    this.setData({
      "desc.isbiaoshi": this.data.desc.dynamic_id,
      "desc.titleText": this.data.desc.title,
      "desc.dynamic_id": this.data.desc.dynamic_id,
      "iscollect": this.data.desc.is_collect
    })
    console.log(this.data.desc.titleText)
    wx.navigateTo({
      url: '../article_detail/art_detail?dynamic_id=' + this.data.desc.dynamic_id + '&is_collect=' + this.data.desc.is_collect,
    })
  },
  toMorePage: function () {
    wx.navigateTo({                  // 保存当前页面跳转
      url: '../more_atr/morePage',
    })
  },

  getcarouse: function () {
    var that = this;
    wx.request({
      url: app.globalData.host,
      data: {
        action_name: 'get_book_carousels',
        data: 'get_book_carousels'
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        console.log(res.data)
        if (data.code == 0) {
          console.log(data.data);
          if (data.data.length == 0) {
            that.setData({
              isemptypic: true
            })
          } else {
            that.data.pic = [];
            for (var i = 0; i < data.data.length; i++) {
              that.data.pic.push(data.data[i]);
            }
            that.setData({
              pic: that.data.pic
            })
            console.log(that.data.pic);
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.host,
      data: {
        action_name: "get_dynamic_list",
        data: {
          user_id: app.globalData.user.user_id,
          type: 2,
          page_no: 1,
          page_size: 10
        }
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.info(res.data.data);
        var data = res.data;
        if (data.code == 0) {
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].create_at = that.formate(Number.parseInt(data.data[i].create_at));
            data.data[i].comment_count = Number.parseInt(data.data[i].comment_count);
            data.data[i].count = Number.parseInt(data.data[i].count);
            data.data[i].dynamic_id = Number.parseInt(data.data[i].dynamic_id);
          }
          // console.log(data.data);
          that.setData({
            newlist: data.data
          })
        }
      }
    })

    this.getcarouse();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.host,
      data: {
        action_name: "get_dynamic_list",
        data: {
          user_id: app.globalData.user.user_id,
          type: 2,
          page_no: 1,
          page_size: 10
        }
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.info(res.data.data);
        var data = res.data;
        if (data.code == 0) {
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].create_at = that.formate(Number.parseInt(data.data[i].create_at));
            if (Number.parseInt(data.data[i].comment_count) >= 10000) {
              data.data[i].comment_count = (Number.parseInt(data.data[i].comment_count) / 10000).toFixed(2) + 'w';
            } else {
              data.data[i].comment_count = Number.parseInt(data.data[i].comment_count);
            }
            if (Number.parseInt(data.data[i].count) >= 10000) {
              data.data[i].count = (Number.parseInt(data.data[i].count) / 10000).toFixed(2) + 'w';
            } else {
              data.data[i].count = Number.parseInt(data.data[i].count);
            }
            data.data[i].dynamic_id = Number.parseInt(data.data[i].dynamic_id);
          }
          // console.log(data.data);
          that.setData({
            newlist: data.data
          })
        }
      }
    })
    this.getcarouse();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})