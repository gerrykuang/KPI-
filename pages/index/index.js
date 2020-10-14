//index.js
//获取应用实例
const app = getApp()
var config = require('.././../assets/config.json');
Page({
  data: {
    phone: '',
    password: '',
    success: false,
    text: '',
    reviewerList: []

  },

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {
    var that = this;

    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (that.data.phone.length == 0) {
      wx.showToast({
        title: '用戶名不能為空',
        icon: 'loading',
        duration: 1000
      })
    } else if (that.data.password.length == 0) {
      wx.showToast({
        title: '密碼不能為空',
        icon: 'loading',
        duration: 1000
      })
    } else {

      wx.request({
        //  url: 'http://192.168.42.4:8088/login',
        url: config.dataList[0]['apiURL'] + '/login',
        // url: 'http://113.204.198.2:801/login',
        method: "POST",
        data: {
          //cardNo: that.data.phone,
          password: that.data.password,
          tenantId: "000000",
          domain: "WKSCN",
          username: that.data.phone,
          grant_type: "password",
          scope: "all"
        },
        header: {
          'Content-Type': 'aapplication/x-www-form-urlencoded',
          'Tenant-Id': "000000",
          'Captcha-Key': "",
          'Captcha-Code': ""
        },
        success: function (res) {
          if (res.data.login == true && res.data.role == 0) {
            console.log(res.data.reviewer.ename)
            that.setData({
              success: true,
              briefer: res.data.reviewer.ename,
              num: res.data.reviewer.num,
              reviewerList: res.data.reviewerList
            })
            var model = JSON.stringify(that.data.reviewerList);
            wx.redirectTo({
              url: '../hr/hr?nameData=' + that.data.briefer + '&reviewerList=' + model + '&username=' + that.data.phone + '&num=' + that.data.num
            })
          } else if (res.data.login == true && res.data.role == 1) {
            that.setData({
              success: true,
              briefer: res.data.reviewer.ename,
              num: res.data.reviewer.num
            })
            console.log(that.data.briefer)
            wx.redirectTo({
              url: '../department/department?nameData=' + that.data.briefer + '&username=' + that.data.phone + '&num=' + that.data.num
            })
          } else if (res.data.login == true && res.data.role == 2) {
            that.setData({
              success: true,
              briefer: res.data.reviewer.ename,
              num: res.data.reviewer.num
            })
            console.log(that.data.briefer)
            wx.redirectTo({
              url: '../general/general?nameData=' + that.data.briefer + '&username=' + that.data.phone + '&num=' + that.data.num
            })
          } else {
            warn = "卡號密碼不匹配";
            wx.showModal({
              title: '提示',
              content: warn
            })
            return;
          }
        }

      })
    }
  }

})