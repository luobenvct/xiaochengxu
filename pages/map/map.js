//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    src:'',
    inputValue:'',
    latitude: 30.41875,
    longitude: 120.2985,
    markers: [
      {
        id: 0,
        iconPath: "/img/Home_default.png",
        latitude: 30.41875,
        longitude: 120.2985,
        title: '人工智能小镇',
        label: {
          content: ' 人工智能小镇',
          color: '#f0f'
        },
        width: 30,
        height: 30
      }, 
      // {
      //   id: 1,
      //   latitude: 30.27,
      //     iconPath: "/img/Home_default.png",
      //   longitude: 119.97228,
      //   title: '龙运大厦',
      //   label: {
      //     content: '龙运大厦',
      //     color: '#f0f'
      //   },
      //   width: 30,
      //   height: 30
      // }
    ]
  },
  onLoad: function () {
    wx.getWeRunData({
      success(res) {
        console.log(res)
        const encryptedData = res.encryptedData
      }
    })
  },
  onReady: function (e) {
    let that = this;
    //但是wx.getLocation有bug，多次测试后有时会走fail不返回经纬度，用chooseLocation可暂时解决这个问题
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      }
    })
    this.videoContext = wx.createVideoContext('myVideo')
  },
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  getRandomColor() {
    let rgb = []
      for(let i = 0 ; i< 3; ++i){
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length == 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: this.getRandomColor()
    })
  }
})
