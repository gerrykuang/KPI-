var app = getApp();
var utils = require('../../utils/util.js');
var config = require('.././../assets/config.json');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: null,
    total: 0,
    num: 0,
    tishi1:'',
    tishi2:'',
    tishi3:'',
    ellipsis: true,
    kpiNum: '',
    makeNum: '',
    contentNum: '',
  },


  ellipsis: function () {  
    this.setData({
      ellipsis: !this.data.ellipsis
    }) 
  },
 // 绑定grade数据
 gradetype(){
  var that = this;
  var kpiNum = 0;
  var makeNum = 0;
  var contentNum = 0;
  if(that.data.kpiNum !== '' ){
    kpiNum = parseInt(that.data.kpiNum)
  }
  if(that.data.makeNum !== ''){
    makeNum = parseInt(that.data.makeNum)
  }
  if(that.data.contentNum !== ''){
    contentNum = parseInt(that.data.contentNum);
  }
 return ( kpiNum + makeNum + contentNum )
},
kpiNumChange(event) {
  let that = this;
  let view_name = event.detail.value;
  if(view_name > 15){
    this.setData({
      kpiNum:'',
      tishi1: '請輸入小於15的分數',
    });
    this.setData({
      total: that.gradetype(),
    })
  }else{
    this.setData({
      kpiNum: view_name,
    });
    this.setData({
      total: that.gradetype(),
      tishi1: '',
    })
  } 
},
makeNumChange(event) {
  var that=this
  let view_name = event.detail.value
  if(view_name > 30){
    this.setData({
      makeNum:'',
      tishi2: '請輸入小於30的分數',
    });
    this.setData({
      total: that.gradetype(),
    })
  }else{
    this.setData({
      makeNum: view_name,
      tishi2: '',
    });
    this.setData({
      total: that.gradetype(),
    })
  } 
},
contentNumChange(event) {
  var that=this
  let view_name = event.detail.value
  if(view_name > 30){
    this.setData({
      contentNum:'',
      tishi3: '請輸入小於30的分數',
    });
    this.setData({
      total: that.gradetype(),
    })
  }else{
    this.setData({
      contentNum: view_name,
      tishi3: '',
    });
    this.setData({
      total: that.gradetype(),
    })
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
    if (that.data.makeNum == 0 || that.data.contentNum == 0 || that.data.kpiNum == 0) {
      warn = "不能打0分";
      wx.showModal({
        title: '提示',
        content: warn
      })
      return;
    } else {
      wx.request({
        url: config.dataList[0]['apiURL'] + '/general/grade',
        method: "POST",
        data: {
          briefer: that.data.briefer,
          num: that.data.num,
          kpi: parseInt(that.data.kpiNum),
          make: parseInt(that.data.makeNum),
          content: parseInt(that.data.contentNum),
          total: that.data.total,
          username: that.data.username
        },
        header: {
          'Content-Type': 'aapplication/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.data == true) {
            that.setData({
              briefer:res.data.refreshReviewer.ename,
              num:res.data.refreshReviewer.num,
              kpiNum: '',
              makeNum: '',
              contentNum: '',
              total: 0,
            })
            console.log("提交成功")
          }else if(res.data.data == false && res.data.refreshReviewer == false){
            that.setData({
              kpiNum: '',
              makeNum: '',
              contentNum: '',
              total: 0,
            })
            console.log("review已最新")
          }else if(res.data.data == false && res.data.twiceCommit == true){
            warn = "不允許多次打分";
            that.setData({
              kpiNum: '',
              makeNum: '',
              contentNum: '',
              total: 0,
            })
            wx.showModal({
              title: '提示',
              content: warn
            })
            
          } else {
            that.setData({
              kpiNum: '',
              makeNum: '',
              contentNum: '',
              total: 0,
            });
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
      data:{
        username: that.data.username
      },
      success: function (res) {
        that.setData({
          briefer:res.data.ename,
          num:res.data.num,
          total:0,
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
      url: 'http://113.204.198.2:801/general/viewScore',
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
              url: '../generalscore/generalscore?scoreList=' + scoreList
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