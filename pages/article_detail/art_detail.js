// pages/article_detail/art_detail.js
var app=getApp();
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');

// 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dynamic_id: 1,
    pic: '',
    content: '',
    titles: '',
    palytimes: 0,
    createtime: 0,
    hidden: true,
    iscollect: true,
    com_isempty: false,    // 是否有留言
    commentlist: [],
    comm_content:'',
    islogin: true,
    current_page: 1,
    windowheight: null,
    newcomment: {
      comment_id: "10000",
      comments: [],
      content: '',
      create_at: '',
      nick_name: '',
      pic: ''
    }
  },
  cancel: function () {
    this.setData({
      hidden: true
    })
  },
  confirm: function () {
    var that = this;
    wx.request({
      url: app.globalData.host,
      data: {
        action_name: 'add_comment',
        data: {
          dynamic_id: that.data.dynamic_id,
          user_id: app.globalData.user.user_id,
          content: that.data.comm_content,
          type: 1
        }
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        if(data.code == 0) {
          wx.showToast({                 // 消息提示框
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            "newcomment.content": that.data.comm_content,
            "newcomment.create_at": util.formatTime(new Date),
            "newcomment.nick_name": app.globalData.user.nick_name,
            "newcomment.pic": app.globalData.user.pic
          })

          if (that.data.commentlist == []) {
            that.setData({
              commentlist: that.data.newcomment
            })
          } else {
            that.data.commentlist.push(that.data.newcomment);
            console.log(that.data.commentlist)
            that.setData({
              commentlist: that.data.commentlist
            })
          }
        }
      }
    })
    this.setData({
      hidden: true
    })
  },
  showcombox: function () {
    this.setData({
      hidden: false
    })
  },
  formate: function (t) {
    var d = new Date(t * 1000);
    var year = d.getFullYear();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var hour = d.getHours();
    var minute = d.getMinutes();
    var f = year + "-" + this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
    return f;
  },
  init: function (d) {
    return d > 9 ? d : "0" + d;
  },
  Changecollect: function () {    // 是否收藏
    this.setData({
      iscollect: !this.data.iscollect
    })
    if (!this.data.iscollect) {
      wx.request({
        url: app.globalData.host,
        data: {
          action_name: 'add_collect',
          data: {
            dynamic_id: Number.parseInt(this.data.dynamic_id),
            user_id: app.globalData.user.user_id
          }
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var data = res.data;
          if (data.code == 0) {
            wx.showToast({                 // 消息提示框
              title: data.data,
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.host,
        data: {
          action_name: 'del_collect',
          data: {
            dynamic_id: Number.parseInt(this.data.dynamic_id),
            user_id: app.globalData.user.user_id
          }
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var data = res.data;
          if (data.code == 0) {
            wx.showToast({                 // 消息提示框
              title: '取消收藏',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    }

  },
  comment_content: function (e) {     // 获取输入的留言的内容
    this.setData({
      comm_content: e.detail.value
    })
    console.log(this.data.comm_content);
  },

  getcomment: function () {
    var that = this;
    wx.request({                            // 获取留言列表
      url: app.globalData.host,
      data: {
        action_name: 'get_comment_list',
        data: {
          dynamic_id: Number.parseInt(this.data.dynamic_id),
          page_no: that.data.current_page,
          page_size: 10
        }
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        var data = res.data;
        console.log(data.data);
        if (data.data.length == 0) {
          console.log(1111);
          that.setData({
            com_isempty: true
          })
        } else {
          for( var x in data.data){
            data.data[x].create_at = that.formate(data.data[x].create_at);
            console.log(data.data[x].create_at);
          }
          for(var x in data.data) {
            that.data.commentlist.push(data.data[x])
          }
          // console.log(that.data.commentlist);
          that.setData({
            commentlist: that.data.commentlist
          })
        }
      },
    })
  },

  scrollLoadNews: function (e) {
    this.setData({
      current_page: this.data.current_page+1
    })
    this.getcomment();
    // console.log(11111);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    if (Number.parseInt(options.is_collect) == 1) {
      this.setData({
        iscollect: false
      })
    } 

    wx.request({                             // 获取单个文章内容信息
      url: app.globalData.host,                 // 请求路径
      data: {
        action_name: 'get_dynamic',
        data: {
          dynamic_id: Number.parseInt(options.dynamic_id),
          type: 1                                // 1 小程序
        }
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',                                    // post方法
      success: function (res) {
        var data = res.data;
        console.log(data);
        if(data.code == 0) {
          that.setData({
            dynamic_id: data.data.dynamic_id,
            title: data.data.title,
            pic: data.data.pic,
            content: WxParse.wxParse('content', 'html', data.data.content, that, 5),
            palytimes: data.data.count,
            createtime: that.formate(data.data.create_at),
            titles: data.data.title
          });
          wx.setNavigationBarTitle({
            title: data.data.title,
          })
          // setTimeout(() => {
          //   wx.hideLoading();
          // }, 1000);
        }
      },
    })


    this.setData({
      dynamic_id: Number.parseInt(options.dynamic_id),
      islogin: app.globalData.isauthorize
    })


    this.getcomment();
    wx.getSystemInfo({
      success: function(res) {
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
    // this.getcomment();
             setTimeout(() => {
            wx.hideLoading();
          }, 1000);
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