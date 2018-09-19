//index.js
var util = require('../../utils/util.js');
var QR = require("../../utils/qrcode.js");
//获取应用实例
const app = getApp()

Page({
  data: {
   idData:[
     {
       id:0
     },
     {
       id:1
     },
     {
       id: 2
     },
     {
       id: 3
     },
     {
       id: 4
     },
     {
       id: 5
     }
   ]
  },
  //事件处理函数
 
  onLoad: function () {
    //条形二维码
   //util.barcode('barcode' + '0001', '0001000002233', 420, 108);
    this.QRerweima()
  },
  /**
   * 监听页面初次渲染完成
   */
  onReady: function () {
    var size = this.setCanvasSize();
    var initUrl = 'https://wap-test.dianwandashi.com/coin?device_no=100003825&slot_num=3';
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },
  //条形二维码
  QRerweima(){
    for(let i=0; i<4; i++){
      console.log(i)
      util.barcode('barcode'+i, '152556655858855', 420, 108);
    }
  },
  /**
   * 设置canvas长宽
   */
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 206;
      var width = res.windowWidth / scale;
      var height = width;
      size.w = width;
      size.h = height;
    } catch (e) {
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  /**
   * 创建二维码(正方形)
   */
  createQrCode: function (url, canvasId, cavW, cavH) {
    QR.qrApi.draw(url, canvasId, cavW, cavH);

  },
  /**
   * 生成二维码
   */
  formSubmit: function (e) {
    var self = this;
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      wx.hideToast()
      var size = self.setCanvasSize();
      //绘制二维码
      self.createQrCode('https://wap-test.dianwandashi.com/coin?device_no=100003825&slot_num=2', "mycanvas", size.w, size.h);
      
      clearTimeout(st);
    }, 2000)

  },
})
