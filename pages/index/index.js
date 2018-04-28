var format = require('../../util/util.js').format
Page({
  data: {
    list: [],
    date: ''
  },
  onLoad() {
    this.getData()
  },
  getData() {
    var date = format(new Date())
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    
    my.httpRequest({
      url: 'https://api.gzbhkyy.com/fx/getBasicRate', // 目标服务器 url
      success: (res) => {
        console.log(res)
        this.setData({
          list: res.data,
          date: date
        })
      },
      fail: (err) => {
        my.alert({
          title: '网络请求超时',
          content: '请稍后重试',
          buttonText: '确定',
          success: () => {
          }
        });
      },
      complete: () => {
          my.hideLoading();
          console.log(1111)
      }
    });
  }
});
