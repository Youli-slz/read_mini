// pages/play/play_page.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alltime:'00:00',
    dynamic_id: 1,
    islogin: true,
    titles: '',
    palytimes: 0,
    createtime: '',
    comm_content: '',
    audio: {
      poster: '',
      src: '',
      name: 'hshs',
      author: 'slz'
    },
    guodu: [

    ],
    hidden: true,
    isplay: true,
    iscollect: true,
    com_isempty: true,    // 是否有留言
    haveuserid: true,
    commentlist: [],
    windowheight: null,
    current_page: 1,
    starttime: '00:00',
    newcomment: {
      comment_id: "10000",
      comments: [],
      content: '',
      create_at: '',
      nick_name: '',
      pic: ''
    },
    playTime: null,
    currentposition: null,
    isdownload: false,
  },
  cancel: function () {
    this.setData({          // 取消留言
      hidden: true
    })
  },
  confirm: function () {      // 确认提交留言
    var that = this;
    // console.log(this.data.comm_content);
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
        if (data.code == 0) {
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
          if (that.data.commentlist== []) {
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
  Changestatus: function () {      /// 播放按钮图片变换
    this.setData({
      isplay: !this.data.isplay
    })
    if (!this.data.isplay) {
      this.audioPlay();
    } else {
      this.audioPause();
    }
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
  audioPlay: function () {
    var that = this;
    that.setData({
      isdownload: true
    })
    wx.playBackgroundAudio({
      dataUrl: that.data.audio.src,
    });
    setTimeout(function () { wx.pauseBackgroundAudio() }, 500)
    this.setData({
      action: {
        method: 'play'
      }
    })
    // this.audioCtx.play();
  },
  audioPause: function () {
    this.setData({
      action: {
        method: 'pause'
      }
    })
    // this.audioCtx.pause();
  },
  funerror: function (u) {
    console.log(u.detail.errMsg);
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
          return false;
        } else {

          for (var x in data.data) {
            data.data[x].create_at = that.formate(data.data[x].create_at);
            console.log(data.data[x].create_at);
          }
          for (var x in data.data) {
            that.data.commentlist.push(data.data[x])
          }
          that.setData({
            com_isempty: false,
            commentlist: that.data.commentlist
          })
        }
      },
    })
  },
  scrollLoadNews: function (e) {
    this.setData({
      current_page: this.data.current_page + 1
    })
    this.getcomment();
    console.log(11111);
  },
  /**
   * @desc 播放进度触发
   * 
   */
  funtimeupdate: function (e) {
    var offset = e.detail.currentTime;
    var currentTime = parseInt(e.detail.currentTime);
    var min = parseInt(currentTime / 60);
    min = min > 9 ? min : "0" + min;
    var max = parseInt(e.detail.duration);
    var sec = parseInt(currentTime % 60);
    sec = sec > 9 ? sec : "0" + sec;
    var starttime = min + ':' + sec;
    var duration = e.detail.duration;

    var zmin = parseInt(duration / 60);
    zmin = zmin > 9 ? zmin : "0" + zmin;
    var zsec = parseInt(duration % 60);
    zsec = zsec > 9 ? zsec : "0" + zsec;
    var alltime = zmin + ":" + zsec;

    var offset = parseInt(offset * 100 / duration);
    var that = this;
    that.setData({
      offset: currentTime,
      starttime: starttime,
      max: max,
      playTime: currentTime,
      alltime: alltime
    })
    if(currentTime == max){
      this.setData({
        isplay: true
      })
    }
    if (sec == 1 || this.data.currentposition != null) {
      this.setData({
        isdownload: false
      })
    }
  },
  /**
   * @desc 拖动进度条
   * 
   */
  sliderchange: function (e) {
    console.log(e);
    var offset = parseInt(e.detail.value);
    this.audioCtx.seek(offset);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    console.log(options);
    if (Number.parseInt(options.is_collect) == 1) {
      this.setData({
        iscollect: false
      })
    }
    var that = this;
    wx.request({                             // 获取单个文章内容信息
      url: app.globalData.host,                 // 请求路径
      data: {
        action_name: 'get_dynamic',
        data: {
          dynamic_id: Number.parseInt(options.dynamic_id),
          type: 1                               // 1小程序，
        }
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',                                    // post方法
      success: function (res) {
        var data = res.data;
        console.log(data);
        if (data.code == 0) {
          that.setData({                                   // 将获取的数据传到显示层
            "palytimes": data.data.count,
            "audio.name": data.data.title,
            "audio.poster": data.data.pic,
            "audio.src": data.data.voice,
            "createtime": that.formate(data.data.create_at),
            "titles": data.data.title
          })
          wx.setNavigationBarTitle({
            title: data.data.title,
          })
          wx.getBackgroundAudioPlayerState({
            success: function (res) {
              var status = res.status;
              var dataUrl = res.dataUrl;
              var currentPosition = res.currentPosition;
              var duration = res.duration;
              console.log(data.data.voice);
              if (dataUrl == data.data.voice && status == 1) {
                // console.log(1111111)
                var min = parseInt(currentPosition / 60);
                min = min > 9 ? min : "0" + min;
                var sec = parseInt(currentPosition % 60);
                sec = sec > 9 ? sec : "0" + sec;
                var starttime = min + ':' + sec;
                var offset = parseInt(currentPosition * 100 / duration);
                wx.pauseBackgroundAudio();
                that.setData({
                  offset: currentPosition,
                  starttime: starttime,
                  max: duration,
                  isplay: false,
                  currentposition: currentPosition
                })
                that.audioCtx.seek(currentPosition);
                that.audioPlay();
              } else {
                wx.stopBackgroundAudio()
              }
            }
          })
        }
        setTimeout(() => {
          wx.hideLoading();
        }, 100);
      },
    })


    this.setData({
      dynamic_id: Number.parseInt(options.dynamic_id),
      islogin: app.globalData.isauthorize
    })


    this.getcomment();
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
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio');
    if(this.data.currentposition != null){
      this.audioPlay();
      this.audioCtx.seek(this.data.currentposition);
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getcomment();

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
    var that = this;
    console.log(this.data.playTime);
    if (!this.data.isplay) {

      wx.seekBackgroundAudio({
        position: that.data.playTime,
      })
      wx.playBackgroundAudio({
        dataUrl: that.data.audio.src,
      })
      that.audioCtx.pause();
    } else {
      wx.stopBackgroundAudio();
    }
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