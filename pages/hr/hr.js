var app = getApp();
var utils = require('../../utils/util.js');
var config = require('.././../assets/config.json');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    briefer: null,
    num: 0,
    time: '',
    total: 0,
    type: 0,
    tishi: '',
    username: null,
    reviewerList: [],
    ellipsis: true,
    index: 0,
    choseQuestionBankBriefer: null
  },
  ellipsis: function () {
    this.setData({
      ellipsis: !this.data.ellipsis
    })
  },
  // 绑定grade数据
  inputChange(event) {
    let view_name = event.detail.value
    if (view_name > 10) {
      this.setData({
        total: 0,
        time: '',
        tishi: '請輸入小於10的分數',
      })
    } else {
      this.setData({
        total: parseInt(view_name),
        time: parseInt(view_name),
        tishi: '',
      })
    }
  },
 bindPickerChangeBriefer: function (e) {
    var that = this
    let postBrifer = null;
    let postNum = 0;
    //每次更新成功，将reviewerList减少一人
    //that.data.reviewerList.splice(0, 1)
    if (parseInt(e.detail.value) == 0) {
      let warn = "正在簡報中，請選擇其它";
      wx.showModal({
        title: '提示',
        content: warn
      })
    } else {
      wx.request({
        url: config.dataList[0]['apiURL'] + '/hr/updateReviewer',
        method: "POST",
        data: {
          briefer: that.data.briefer,
          num: parseInt(that.data.num) + parseInt(e.detail.value),
          username: that.data.username,
          postBrifer : that.data.reviewerList[parseInt(e.detail.value)],
          postNum: parseInt(that.data.num)
        },
        header: {
          'Content-Type': 'aapplication/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status == true) {
            that.data.reviewerList.splice(0, 1)
            that.setData({
              num: res.data.num,
              index: 0,
              choseQuestionBankBriefer: '簡報人：' + that.data.reviewerList[parseInt(e.detail.value)-1],
              briefer: that.data.reviewerList[parseInt(e.detail.value)-1],
              reviewerList: res.data.reviewerList
            })
            console.log("提交成功")
          } else {
            let warn = "請先給當前簡報者打分！";
            wx.showModal({
              title: '提示',
              content: warn
            })
          }
        }
      })
    }
  },
  
  timeInput: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  /**生命周期函数，监听页面加载 */
  onLoad: function (options) {
    var that = this
    //将字符串转换成对象
    var bean = JSON.parse(options.reviewerList);
    if (options.reviewerList == null) {
      wx.showToast({
        title: '數據為空',
      })
      return;
    }
    that.setData({
      briefer: options.nameData,
      choseQuestionBankBriefer: '簡報人：' + options.nameData,
      num: options.num,
      reviewerList: bean,
      username: options.username,
      subject1: utils.getSubject().subject1,
      subject2: utils.getSubject().subject2
    })
  },

  commit: function () {
    var that = this;
    var warn = "";
    console.log(that.data);
    if (that.data.total == '' || that.data.total === 0) {
      warn = "不能打0分";
      wx.showModal({
        title: '提示',
        content: warn
      })
      return;
    } else {
      var time = parseInt(that.data.total);
      wx.request({
        url: config.dataList[0]['apiURL'] + '/hr/grade',
        method: "POST",
        data: {
          briefer: that.data.briefer,
          num: that.data.num,
          time: that.data.time,
          username: that.data.username
        },
        header: {
          'Content-Type': 'aapplication/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data == true) {
            that.setData({
              time: '',
              total: 0,
              choseQuestionBank: '點擊評分'
            })
            console.log("提交成功")
          } else if (res.data.data == false && res.data.twiceCommit == true) {
            warn = "不允許多次打分";
            that.setData({
              time: '',
              total: 0,
              choseQuestionBank: '點擊評分'
            })
            wx.showModal({
              title: '提示',
              content: warn
            })

          } else {
            console.log("提交失敗")
          }
        }
      })
    }
  },
  onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    console.log("刷新")
    this.onRefresh();
  },
  //刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    this.getData();
  },
  //网络请求，获取数据
  getData() {
    var that = this;
    wx.request({
      url: config.dataList[0]['apiURL'] + '/refresh/reviewer',
      method: "POST",
      data: {
        username: that.data.username
      },
      success: function (res) {
        that.setData({
          briefer: res.data.ename,
          num: res.data.num,
          total: 0,
          choseQuestionBank: 0,
          choseQuestionBankBriefer: '簡報人：' + res.data.ename
        })
      },
      fail: function (err) {
        warn = "err";
        wx.showModal({
          title: '更新簡報者異常',
          content: warn
        })
        return;
      }, //请求失败
      //网络请求执行完后将执行的动作
      complete(res) {
        //隐藏loading 提示框
        wx.hideLoading();
        //隐藏导航条加载动画
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
      }
    })
  },
  viewScore: function (e) {
    var that = this;
    var warn = "";
    wx.request({
      url: config.dataList[0]['apiURL'] + '/hr/viewScore',
      method: "POST",
      data: {
        username: that.data.username
      },
      success: function (res) {
        if (res.data.data == false) {
          warn = "無打分記錄"
          wx.showModal({
            title: '查看失敗',
            content: warn
          })
        } else if (res.data.data == true) {
          var scoreList = JSON.stringify(res.data.scoreList);
          wx.navigateTo({
            title:"goback",
            url: '../hrscore/hrscore?scoreList=' + scoreList
          })
        }
      },
      fail: function (err) {
        warn = "err";
        wx.showModal({
          title: '查看失敗',
          content: warn
        })
        return;
      }
    })
  },

  totalScore: function (e) {
    var that = this;
    var warn = "";
    wx.request({
      url: config.dataList[0]['apiURL'] + '/hr/viewTotalScore',
      method: "POST",
      data: {
        username: that.data.username
      },
      success: function (res) {
        if (res.data.data == false) {
          warn = "無打分記錄"
          wx.showModal({
            title: '查看失敗',
            content: warn
          })
        } else if (res.data.data == true) {
          var totalScoreList = JSON.stringify(res.data.scoreList);
          wx.navigateTo({
            title:"goback",
            url: '../totalscore/totalscore?scoreList=' + totalScoreList
          })
        }
      },
      fail: function (err) {
        warn = "err";
        wx.showModal({
          title: '查看失敗',
          content: warn
        })
        return;
      }
    })
  },
  downloadTotalScore: function (e) {
    var that = this;
    var warn = "";
    wx.request({
      url: config.dataList[0]['apiURL'] + '/hr/downloadTotalScore',
      method: "POST",
      data: {
        username: that.data.username
      },
      success: function (res) {
        if (res.data.data == false) {
          warn = "無打分記錄"
          wx.showModal({
            title: '下載失敗',
            content: warn
          })
        } else if (res.data.data == true) {
          wx.downloadFile({
            url: 'http://localhost:8088/totalScore.xlsx', //请更改为你自己部署的接口
            filePath:wx.env.USER_DATA_PATH + '/totalScore.xlsx',
            success(res) {
              console.log(res)
              that.setData({
                statusCode: res.statusCode
              })
              if (res.statusCode === 200) {
                var filePath = res.filePath
                wx.openDocument({
                  filePath: filePath,
                  success: function (res) {
                   wx.hideLoading();
                  }
                 })
              }
            },
            fail(res){
              console.log(res)
            }
          })
          console.log("下載功能測試")
        }
      },
      fail: function (err) {
        warn = "err";
        wx.showModal({
          title: '查看失敗',
          content: warn
        })
        return;
      }
    })
  }
})