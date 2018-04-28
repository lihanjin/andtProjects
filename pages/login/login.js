let codeFlag = true;
Page({
  data: {
    codeTitle: '获取验证码',
    phone: '',
    code: '',
    tip: '',
    userName: '中文姓名',
    userNameFlag: true,
    phoneNumber: '手机号码',
    phoneNumberFlag: true,
    mailName: '邮　　箱',
    mailNameFlag: true,
    authNumber: '请输入验证码',
    authNumberFlag: true,
    sex: "1",
    primary: 'primary',
    disabled: false,
    loading: false,
    second: 60,
    codeTitle: '获取验证码',
    codeFlag: false,
    timer: ""
  },
  //验证码
  authNumber: function (e) {
    let val = e.detail.value;
    if (val.length === 0 || val == "") {
      this.setData({
        tip: '请输入正确的验证码！',
        authNumberFlag: false,
      })
    } else {
      this.setData({
        authNumber: val
      })
    }
  },
  //电话验证
  phoneNumber: function (e) {
    let val = e.detail.value;

    if (/^1[3|4|5|7|8][0-9]{9}$/.test(val) == false) {
      this.setData({
        tip: '请输入正确的手机号码！',
        phoneNumberFlag: false,
      })

    } else {

      this.setData({
        tip: '',
        phoneNumber: val,
        phoneNumberFlag: true,
      })
    }
  },
  //验证码
  authCode: function () {
    console.log(111)
    let phone = this.data.phoneNumber;
    let second = this.data.second;
    if (this.data.second <= 0) {
      this.setData({
        primary: "primary",
        disabled: false,
        codeTitle: "发送验证码"
      })
      codeFlag = true
      this.data.second = 60;
      return false;
    }
    if (/^1[3|4|5|7|8][0-9]{9}$/.test(phone) == false) {
      this.setData({
        tip: '请输入正确的手机号码！',
        phoneNumber: '',
        phoneNumberFlag: false
      });
      return false;
    } else {
      if (codeFlag) {
        /**
         * ajax发送验证码
         * url sendSmsCode?phone=phone
         */
        my.httpRequest({
          url: 'https://api.gzbhkyy.com/fx/sendSmsCode?phone=' + phone, // 目标服务器 url
          success: (res) => {

            let result = res.data.infoNo
            if (result == "OK") {
              this.setData({
                tip: '验证码已发送',
                codeFlag: true
              })
            } else if (result == "ERR_EMPTY_IP_ADDR") {

              this.setData({
                tip: '网络连接出错，请重新输入'
              })
            } else if (result == "ERR_EXCEED_DAY_COUNT_LIMIT") {
              this.setData({
                tip: '号码进行验证次数已超过今日上限'
              })
            } else if (result == "ERR_EXCEED_SAME_IP_COUNT_LIMIT" || result == "ERR_captcha_MEG") {
              this.setData({
                tip: '您获取验证码次数过于频繁，请稍后再试'
              })
            } else if (result == "ERROR") {
              this.setData({
                tip: '接口异常，请稍后再试'
              })
            } else if (result == "EXISTS" || result == "EXISTS#MT4" || result == "EXISTS#BOTH" || result == "EXISTS#MTF" || result == "EXISTS#GTS2") {
              this.setData({
                tip: '您输入的手机号码已存在'
              })
            }
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
            codeFlag = false
          }
        });
      }
      //设置成不可以点击状态
      this.setData({
        primary: "warn",
        disabled: true,
        codeTitle: second
      })
      //设置定时器
      this.data.timer = setTimeout(function () {
        this.data.second--;
        this.authCode();
      }.bind(this)
        , 1000)
    }
  },
  //提交按钮
  formBindsubmit: function (e) {
    console.log(222)
    let phone = this.data.phoneNumber;
    let val = this.data.authNumber;
    if (this.data.phoneNumber != false && this.data.userName != false && this.data.phoneNumber != '电话号码' && this.data.userName != '中文姓名' && this.authNumber != '请输入验证码') {
      /**
     * ajax提交
     * url http://172.30.5.29:8080/fx/openDemoAccount ? phone = phone & smsCode'
     * utm_source=hlcxjsb&utm_medium=mini_programs&utm_campaign=top
     */
      my.httpRequest({
        url: 'https://api.gzbhkyy.com//fx/openDemoAccount?phone=' + phone + 'smsCode=' + val + 'utmSource=zfb', // 目标服务器 url
        success: (res) => {
          if (res.data.code == "OK") {
            this.setData({
              tip: '信息正确',
              authNumberFlag: true,
            });
            let customerNumber = res.data.account.customerNumber,
              password = res.data.account.password;
            //跳转
            app.$router.go('../succ/index', {
              customerNumber,
              password
            });
          } else if (res.statusCode != '200') {
            this.setData({
              tip: '网络连接出错，请稍后重试'
            })
          } else if (res.data.error) {
            this.setData({
              tip: '请输入正确的验证码！',
              authNumberFlag: false,
            })
          } else {
            this.setData({
              tip: '请输入正确的验证码！',
              authNumberFlag: false,
            })
          }
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
          codeFlag = false
        }
      });
    } else {
      this.setData({
        tip: '请输入正确的信息',
      })
    }

  },
  onLoad() { },
});
