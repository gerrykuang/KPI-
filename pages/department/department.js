var app = getApp();
var utils = require('../../utils/util.js');
var config = require('.././../assets/config.json');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    briefer: null,
    ellipsis: true,
    num: 0,
    total: 0,
    make: null,
    content: null,
    tishi1: '',
    tishi2: '',
    typeMake:0,
    typeContent:0,
    username: null,
  },
  ellipsis: function () {  
    this.setData({
      ellipsis: !this.data.ellipsis
    }) 
  },
  makeChange(event) {
    var that=this
    let view_name = event.detail.value
    if(view_name > 30 || view_name < 0){
      this.setData({
        make:null,
        tishi1: '請輸入小於30的分數',
      });
    }else if(0<view_name <=30 && that.data.content == null || that.data.content == ''){
      console.log(parseInt(view_name))
      this.setData({
        make: view_name,
        tishi1: '',
        total: parseInt(view_name) + 0
      });
    }else if(0<view_name <=30 && that.data.content !== null || that.data.content !== '') {
      this.setData({
        make: view_name,
        tishi1: '',
        total: parseInt(view_name) + parseInt(that.data.content)
      });
    } 
  },
  contentChange(event) {
    var that=this
    let view_name = event.detail.value
    if(view_name > 30){
      this.setData({
        content:null,
        tishi2: '請輸入小於30的分數',
      });
    }else if(0<view_name <=30 && that.data.make == null || that.data.make == ''){
      this.setData({
        content: view_name,
        tishi2: '',
        total: parseInt(view_name) + 0
      });
    }else if(0<view_name <=30 && that.data.make !== null || that.data.make !== ''){
      this.setData({
        content: view_name,
        tishi2: '',
        total: parseInt(view_name) + parseInt(that.data.make)
      });
    }
  },

  /**生命周期函数，监听页面加载 */
  onLoad: function (options) {
    var that = this
    that.setData({
      briefer: options.nameData,
      num: options.num,
      subject1: utils.getSubject().subject1,
      subject2: utils.getSubject().subject2,
      username: options.username
    })
  },
  commit: function () {
    var that = this;
    var warn = "";
    if (that.data.make == 0 || that.data.content == 0) {
      warn = "不能打0分";
      wx.showModal({
        title: '提示',
        content: warn
      })
      return;
    } else {
      wx.request({
        url: config.dataList[0]['apiURL'] + '/department/grade',
        method: "POST",
        data: {
          briefer: that.data.briefer,
          num: that.data.num,
          make: parseInt(that.data.make),
          content: parseInt(that.data.content),
          total: that.data.total,
          username: that.data.username
        },
        header: {
          'Content-Type': 'aapplication/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.data.data == true) {
            that.setData({
              briefer:res.data.refreshReviewer.ename,
              num:res.data.refreshReviewer.num,
              make: '',
              content: '',
              total: 0,
              choseQuestionBank1:'點擊評分',
              choseQuestionBank2:'點擊評分'
            })
            console.log("提交成功")
          }else if(res.data.data == false && res.data.refreshReviewer == false){
            that.setData({
              make: '',
              content: '',
              total: 0,
              choseQuestionBank1:'點擊評分',
              choseQuestionBank2:'點擊評分'
            })
            console.log("review已最新")
          }else if(res.data.data == false && res.data.twiceCommit == true){
            warn = "不允許多次打分";
            that.setData({
              make: '',
              content: '',
              total: 0,
              choseQuestionBank1:'點擊評分',
              choseQuestionBank2:'點擊評分'
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
  // watchBack: function (briefer) {
  //   console.log(22222);
  //   console.log('this.name==' + briefer)
  // },
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
          make: 0,
          content: 0
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
viewScore: function(e){
  var that = this;
  var warn = "";
  wx.request({
    url: 'http://113.204.198.2:801/department/viewScore',
    method: "POST",
      data: {
        username: that.data.username
      },
      success: function (res) {
        if(res.data.data == false){
          warn = "無打分記錄"
          wx.showModal({
            title: '查看失敗',
            content: warn
          })
        }else if(res.data.data == true){
          var scoreList = JSON.stringify(res.data.scoreList);
          wx.navigateTo({
            title:"goback",
            url: '../departscore/departscore?scoreList=' + scoreList
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
}


})