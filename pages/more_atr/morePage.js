// morePage.js

var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page_current: 1,
    newlist: [],
    desc: {
      isbiaoshi: 1,
      titleText: '',
      pic: '',
      is_collect: null
    },
    isnomore: false,
    iscollect: null,     // 是否有收藏的值   1,收藏 0,未收藏
    windowheight: null
  },

  scrollLoadNews: function () {
    var that = this;
    if (that.data.isnomore) {
      return false;
    }
    wx.request({
      url: app.globalData.host,
      data: {
        action_name: "get_dynamic_list",
        data: {
          user_id: app.globalData.user.user_id,
          type: 2,
          page_no: that.data.page_current + 1,
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
          if (data.data.length != 0) {
            for (var i = 0; i < data.data.length; i++) {
              data.data[i].create_at = that.formate(Number.parseInt(data.data[i].create_at));
              data.data[i].comment_count = Number.parseInt(data.data[i].comment_count);
              data.data[i].count = Number.parseInt(data.data[i].count);
              data.data[i].dynamic_id = Number.parseInt(data.data[i].dynamic_id);
            }
            for (var j = 0; j < data.data.length; j++) {
              that.data.newlist.push(data.data[j])
            }
            that.setData({
              newlist: that.data.newlist,
              page_current: that.data.page_current + 1
            })
          } else {
            console.log(111111);
            that.data.isnomore = true;
            return false;
          }
        }
      }
    })
  },
  // 格式化时间戳
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

  // 跳转到详情页面
  todetailBylist: function (e) {
    this.data.desc = e.currentTarget.dataset;
    console.log(this.data.desc);
    this.setData({
      "desc.isbiaoshi": this.data.desc.dynamic_id,
      "desc.titleText": this.data.desc.title,
      "Cirpic": this.data.desc.pic,
      "iscollect": this.data.desc.is_collect
    })
    // console.log(this.data.desc.titleText)
    wx.navigateTo({
      url: '../article_detail/art_detail?dynamic_id=' + this.data.desc.isbiaoshi + '&is_collect=' + this.data.desc.is_collect,
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
          page_no: that.data.page_current,
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

          that.setData({
            newlist: data.data
          })
        }
      }
    }),
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowheight: res.windowHeight
          })
        },
      })
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
          page_no: that.data.page_current,
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

          that.setData({
            newlist: data.data
          })
        }
      }
    })
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