//index.js
//获取应用实例
const app = getApp()
var context = wx.createCanvasContext('myCanvas')

Page({
  data: {
    // motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    angle: '--',
    directions: [0, 0, 0, 0, 0]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //指南针描画
  drawCompass: function (direction) {
    var center_x = 150
    var center_y = 150

    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('compassCanvas')

    //根据角度旋转坐标系
    context.translate(center_x, center_y);
    context.rotate(-direction / 180 * Math.PI);
    context.translate(-center_x, -center_y);
    //描画方向转盘
    context.drawImage('../../images/compass.png', 0, 0,
      center_x * 2, center_y * 2)

    //恢复坐标系
    context.translate(center_x, center_y);
    context.rotate(direction / 180 * Math.PI);
    context.translate(-center_x, -center_y);

    //描画指针。
    context.beginPath()
    context.setLineWidth(5)
    context.setStrokeStyle('red')
    context.moveTo(140, 112)
    context.lineTo(150, 60)
    context.lineTo(160, 112)
    context.closePath()
    context.stroke()

    context.draw()
  },
  onLoad: function () {
    var that = this;
    wx.onCompassChange(function (res) {

      //在数组尾部添加新数据
      that.data.directions.push(res.direction);
      if (that.data.directions.length > 5) {
        //从数组头部删除一个数据
        that.data.directions.shift();
      }
      //数组元素求和
      var total = that.data.directions.reduce(function (prev, v) { return prev + v })
      //求平均值
      var average = total / that.data.directions.length

      that.drawCompass(average);
      //保留 1 位小数
      var direction = average.toFixed(1) + '°';
      that.setData({ angle: direction })
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
