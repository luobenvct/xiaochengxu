//index.js
//获取应用实例
const app = getApp()

// pages/wifi/wifi.js
Page({
  data: {
    startError: '',//初始化错误提示
    wifiListError: false, //wifi列表错误显示开关
    wifiListErrorInfo: '',//wifi列表错误详细
    system: '', //版本号
    platform: '', //系统 android
    ssid: 'XiaoZhu',//wifi帐号(必填)
    pass: '87778782',//无线网密码(必填)
    bssid: '',//设备号 自动获取
    endError: ''//连接最后的提示
  },
  onLoad: function () {
    var _this = this;
    //检测手机型号
    wx.getSystemInfo({
      success: function (res) {
        console.log(res,'wifi')
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseInt(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          _this.setData({ startError: '手机版本暂时不支持' }); return
        }
        if (res.platform == 'ios' && system < 11) {
          _this.setData({ startError: '手机版本暂时不支持' }); return
        }
        _this.setData({ platform: res.platform });
        //初始化 Wi-Fi 模块
        _this.startWifi(_this);
      }
    })

  },//初始化 Wi-Fi 模块。
  startWifi: function (_this) {
    wx.startWifi({
      success: function () {
        _this.getList(_this);
      },
      fail: function (res) {
        _this.setData({ startError: res.errMsg });
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  getList: function (_this) {
    //安卓执行方法
    if (_this.data.platform == 'android') {
      //请求获取 Wi-Fi 列表
      wx.getWifiList({
        success: function (res) {
          //安卓执行方法
          _this.AndroidList(_this);
          wx.showToast({
            title: '未查询到设置的wifi03',
            icon: 'none',
            duration: 3000
          })
        },
        fail: function (res) {
          _this.setData({ wifiListError: true });
          _this.setData({ wifiListErrorInfo: res.errMsg });
          wx.showToast({
            title: '未查询到设置的wifi02',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
    //IOS执行方法
    if (_this.data.platform == 'ios') {
      _this.IosList(_this);
    }

  },
  AndroidList: function (_this) {
    //监听获取到 Wi-Fi 列表数据
    wx.onGetWifiList(function (res) { //获取列表
      if (res.wifiList.length) {
        // _this.setData({
        //   wifiList: res.wifiList
        // });
        //循环找出信号最好的那一个(wifi存在多个)
        var ssid = _this.data.ssid;
        var signalStrength = 0;
        var bssid = '';
        for (var i = 0; i < res.wifiList.length; i++) {
          if (res.wifiList[i]['SSID'] == ssid && res.wifiList[i]['signalStrength'] > signalStrength) {
            bssid = res.wifiList[i]['BSSID'];
            signalStrength = res.wifiList[i]['signalStrength'];
          }
        }
        if (!signalStrength) {
          _this.setData({ wifiListError: true });
          _this.setData({ wifiListErrorInfo: '未查询到设置的wifi04' });
          return
        }
        _this.setData({ bssid: bssid });
        //执行连接方法
        //连接wifi
        _this.Connected(_this);
      } else {
        _this.setData({ wifiListError: true });
        _this.setData({ wifiListErrorInfo: '未查询到设置的wifi' });
        wx.showToast({
          title: '未查询到设置的wifi05',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  IosList: function (_this) {
    _this.setData({ wifiListError: true });
    _this.setData({ wifiListErrorInfo: 'IOS暂不支持' });
    _this.Connected(_this);
  },//连接wifi
  Connected: function (_this) {
    wx.connectWifi({
      SSID: _this.data.ssid,
      BSSID: _this.data.bssid,
      password: _this.data.pass,
      success: function (res) {
        _this.setData({ endError: 'wifi连接成功' });
        wx.showToast({
          title: 'wifi连接成功',
          icon: 'none',
          duration: 3000
        })
      },
      fail: function (res) {
        _this.setData({ endError: res.errMsg });
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  }

})