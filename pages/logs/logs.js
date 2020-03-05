//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    inside: [],
    logs: [],
    index: 0
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    var that = this;
    wx.onCompassChange(function (res) {
      //在数组尾部添加新数据
      that.data.inside.unshift({ index: that.data.index, data: res.direction });
      that.data.index += 1
      if (that.data.inside.length > 50) {
        //从数组头部删除一个数据
        that.data.inside.pop();
      }
      that.setData({ logs: that.data.inside })
    });
  }
})
