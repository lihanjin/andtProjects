var format = require('../../util/util.js').format
Page({
  data: {
    list: [],
    date: ''
  },
  onLoad() {
    this.getData()
  },
  getData () {
    var date = format(new Date())
    my.httpRequest({
      url: 'https://api.gzbhkyy.com/fx/getBasicRate', // 目标服务器 url
      success: (res) => {
        console.log(res)
        this.setData({
          list: res.data,
          date: date
        })
      },
    });
  }
});
