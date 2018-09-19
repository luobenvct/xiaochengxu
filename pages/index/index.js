//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: ' 我 爱 你',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res,'由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回,所以此处加入 callback 以防止这种情况');
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res,'getUserInfo');
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.onUserCaptureScreen(function (res) {
      wx.showModal({
        title: '提示',
        content: '用户截屏了',
        showCancel: false
      })
      console.log('用户截屏了')
    })
  },
  getUserInfo: function(e) {
    console.log(e,'getUserInfo事件')
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showToast({
      title: '监听用户下拉动作',
      icon: 'none',
      duration: 1000
    })
    console.log('监听用户下拉动作')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title: '页面上拉触底事件的处理函数',
      icon: 'none',
      duration: 1000
    })
  },
  //地图
  map:function(){
    wx.navigateTo({
      url: '../map/map'
    })
  },
  wifi(){
    wx.navigateTo({
      url: '../wifi/wifi'
    })
  },
  qrerweima(){
    wx.navigateTo({
      url: '../qrCode/qrCode'
    })
  }
})
