//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName:''
    },
    collects:[],
    desc: {
      isbiaoshi: 1,
      titleText: '',
      pic: ''
    },
    isempty: true
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

  toreadfree: function (){
    wx.navigateTo({                  // 保存当前页面跳转
      url: '../more_atr/morePage',
    })
  },
  todetailBylist: function (e) {                 // 跳转详情
    this.data.desc = e.currentTarget.dataset;
    console.log(this.data.desc);
    this.setData({
      "desc.isbiaoshi": this.data.desc.dynamic_id,
      "desc.titleText": this.data.desc.title,
      "Cirpic": this.data.desc.pic
    })
    // console.log(this.data.desc.titleText)
    wx.navigateTo({
      url: '../play/play_page?dynamic_id=' + this.data.desc.isbiaoshi + '&is_collect=1',
    })
  },

   getlist: function () {
     var that = this

     wx.request({
       url: app.globalData.host,
       data: {
         action_name: 'get_collect_list',
         data: {
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
           if (data.data.length == 0) {
             that.setData({
               isempty: true
             })
           } else {
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
               collects: data.data,
               isempty: false
             })
           }
         }
       }
     })
   },

  onLoad: function () {
    // console.log('onLoad')
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getlist();


    this.setData({
      "userInfo.avatarUrl": app.globalData.user.pic,
      "userInfo.nickName": app.globalData.user.nick_name
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 100);
  },

  onShow: function () {
    this.getlist();
  },
})
