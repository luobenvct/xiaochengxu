//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
Page({
  data: {
    addr:'',
    name:'',
    model:'',
    chooseAddress:'',
    contents:'尹以敏',
    url:'luoben',
    phoneNum:'15172443151',
    tempFilePaths:''
  },
  //事件处理函数
  getLocation: function() {
    let _this = this;
    app.getPermission(_this);
  },
  getSystemInfoSync:function(){
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          model: res.model,
          getSystemInfoRes: res
        })
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
  },
  scanQRCode(){
    wx.scanCode({
      success: (res) => {
       console.log(res);
       wx.showToast({
        title: '扫描成功',
        icon: 'success',
        duration: 1000
      })
      }
    })
  },
  /**
   * 调用前端微信支付
   */
  wxRequestPayment: function (timeStamp, nonceStr, signType, packageStr, paySign) {
    var self = this;
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': packageStr,
      'signType': signType,
      'paySign': paySign,
      'success': function (res) {
        // 支付成功改变对应电玩城数据
        wx.showToast({
          title: '充值成功',
          icon: 'success',
          duration: 1000,
          success: function () {
            
          }
        })
      },
      'fail': function (res) {
        wx.showModal({
          title: '提示',
          content: '支付失败',
          showCancel: false
        })
        self.setData({
          old_out_trade_no: null
        })
      }
    })
  },
  //开始录音的时候
  start: function () {

    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  stop: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })
  },
  //播放声音
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  onLoad: function () {
    wx.getBatteryInfo({
      success(res){
        console.log(res)
        wx.showToast({
          title: '电量'+ res.level,
          icon: 'none',
          duration: 1000
        })
      }
    })    
    wx.getHCEState({
      success(res) {
        console.log(res,'getHCEState')
      },
      fail: function (err) {
        console.error('NfcHCECore-->getNfcStatus::fail:', err)
      }
    })
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success(res) {
          console.log(res,'获取第三方平台自定义的数据字段。')
        }
      })
    }
  },
  chooseAddress(){
    let _this = this;
    wx.chooseAddress({
      success: function (res) {
        _this.setData({
          chooseAddress: res
        })
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  chooseImage(){
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        _this.setData({
          tempFilePaths:res.tempFilePaths
        })
      }
    })
  },
  copyText(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  setClipboardData(){
    let that=this
    wx.setClipboardData({
      data: that.data.url,
      success(){
        that.setData({
          url:'荣荣儿'
        })
        console.log('success')
      }
    })
    wx.getClipboardData({
      success(res){
        console.log(res.data)
      }
    })
  },
  // 长按号码响应函数
  phoneNumTap: function () {
    var that = this;
    // 提示呼叫号码还是将号码添加到手机通讯录
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        if (res.tapIndex === 0) {
          // 呼叫号码
          wx.makePhoneCall({
            phoneNumber: that.data.phoneNum,
          })
        } else if (res.tapIndex == 1) {
          // 添加到手机通讯录
          wx.addPhoneContact({
            firstName: '测试',//联系人姓名
            mobilePhoneNumber: that.data.phoneNum,//联系人手机号
          })
        }
      }
    })
  },
  onReachBottom: function () {
    wx.showToast({
      title: '页面上拉触底事件的处理函数',
      icon: 'none',
      duration: 1000
    })
  },
  onShow:function(){
    // wx.showToast({
    //   title: '授权成功',
    //   icon: 'success',
    //   duration: 1000
    // })
    wx.getScreenBrightness({
      success(res) {
        console.log(res)
        wx.showToast({
          title: '屏幕亮度' + res.value,
          icon: 'none',
          duration: 3000
        })
      },
      fail() {
        wx.showToast({
          title: '获取屏幕亮度失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  }
})
