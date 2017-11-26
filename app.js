//app.js
App({
  onLaunch: function() {
    var that = this;
    try {
      var value = wx.getStorageSync('user_id_key');
      if (value) {
        console.log(111111111);
        wx.request({
          url: that.globalData.host,
          data: {
            action_name: 'get_user',
            data: {
              user_id: value
            }
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var data = res.data;
            if (data.code == 0) {
              console.log(11111);
              that.globalData.user.nick_name = data.data.nick_name;
              that.globalData.user.pic = data.data.pic;
              that.globalData.user.sex = data.data.sex;
              that.globalData.user.user_id = data.data.user_id;
              if (getCurrentPages().length != 0) {
                getCurrentPages()[getCurrentPages().length - 1].onLoad()
              }
            }

          }
        })
      } else {
        wx.login({
          success: function (res) {
            console.log(res.code);
            var code_login = res.code;

            wx.getUserInfo({
              lang: "zh_CN",
              success: function (res) {
                var simpleUser = res.userInfo;
                console.log(res);
                wx.request({
                  url: that.globalData.host,
                  data: {
                    action_name: 'add_user',
                    data: {
                      code: code_login,
                      rawData: res.rawData,
                      signature: res.signature,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    }
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    var data = res.data;
                    if (data.code == 0) {
                      that.globalData.user.nick_name = data.data.nick_name;
                      that.globalData.user.pic = data.data.pic;
                      that.globalData.user.sex = data.data.sex;
                      that.globalData.user.user_id = data.data.user_id;
                      that.globalData.isauthorize = true;
                      if (getCurrentPages().length != 0) {
                        getCurrentPages()[getCurrentPages().length - 1].onLoad()
                      }
                      wx.setStorage({
                        key: 'user_id_key',
                        data: data.data.user_id,
                      })
                    }

                  }
                })
              },
              fail: function (res) {
                that.globalData.isauthorize = false;
              }
            });
          }
        });
      } 
    } catch (e) {

    }

    console.log(this.globalData);
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        lang: "zh_CN",
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    isauthorize:true,
    host: 'https://wxapi.duobb.cn/api/response.do',
    user:{
      nick_name: '匿名',
      pic: 'http://7xld1x.com1.z0.glb.clouddn.com/FofN3Z5ZK1V2XbKwv4WwLQIi5KfS',
      sex: 1,
      user_id: null
    }
  }
})
