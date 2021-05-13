// pages/userInfo/userInfo.js

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const DB = wx.cloud.database()
const db = DB.collection('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontFamily:"shuai",
    userInfo: {},
    hasUserInfo: false,
      openid: '',
      show:false,
      ifLogin:'No',
      name:'',
      showT:'No',
      flag:'No',
      img:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    wx.loadFontFace({
      family: that.data.fontFamily,// 自定义字体的名字 随便起就可以
      source: 'url("https://7869-xiongxiao-9g0m49qp0514cda7-1305534329.tcb.qcloud.la/font/Artlookin-Regular.ttf?sign=c0d8c3dd900a9b5a04b9bf08a0aa6124&t=1620911193")',//这里填写第二步获取的下载地址
      success(res) {
        
      },
      fail: function(res) {
        
      },
      complete: function(res) {
       
      }
    });
    //设置tabbar的状态
    if (options.active == undefined) {
      this.setData({
        active: 'userInfo'
      })
    } else {
      this.setData({
        active: options.active
      })
    }

    wx.cloud.callFunction({
      name: 'getOpenID',
    })
    .then(res => {
      db.where({
        _openid:res.result.openid
      }).get()
      .then(res=>{
        if(res.data.length != 0){
          if(res.data[0].userIcon=='1')
          this.setData({
            name:res.data[0].studentName,
            flag:'Yes',
            img:'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/'+res.data[0]._openid+'.jpg'
          })
          else{
            this.setData({
              name:res.data[0].studentName,
              flag:'Yes',
              img:'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/defaultImg.png'
            })
          }
        }
        else{
          toast("请进行身份认证，以便正常使用小程序")
        }
      })
      .catch(err => {
        console.log(err)
      })
    })
    .catch(err => {
      console.log(err)
    })
    
  var that = this;
  // 查看是否授权
  if (wx.getUserProfile) {
    this.setData({
      ifLogin:'Yes'
    })
  }
    this.setData(
      {
        flag:options.flag,
        showT:options.showToast,
      }
    )
    if(this.data.showT=='Yes'){
      toast.success('认证成功')
      this.setData({
        showT:'No'
      })
    }
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({
      success: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 跳转到关于我们
   */
  goToAboutUs: function(){
    wx.navigateTo({ url: '../aboutUs/aboutUs', }) 
  },
    /**
   * 跳转到个人资料
   */
  goToDetail: function(){
    wx.navigateTo({ url: '../detailInfo/detailInfo', }) 
  },
    /**
   * 跳转到帮助与反馈
   */
  goToHelp: function(){
    wx.navigateTo({ url: '../help/help', }) 
  },
  /**
   * 去往认证页面
   */
  goNk: function(){
     wx.navigateTo({ url: '../nk/nk', }) 
  },
   /**
   * 去往地址管理
   */
  goToAddress: function(){
    wx.navigateTo({ url: '../address/address', }) 
 },
  onClose() {
    this.setData({ show: false });
  },
  /**
   * 退出提示
   */
  showDialog2:function(){
    Dialog.confirm({
      title: '是否确认退出',
      message: '小程序需要您的授权才能提供正常的服务哦',
      theme: 'round-button',
    })
      .then(() => {
        this.setData({
          ifLogin:'No'
        })
        Toast.success('退出成功');
      })
      .catch(() => {
        // on cancel
      });
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', 
      success: (res) => {
        
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          ifLogin:'Yes'
        })
      }
    })
  },
  changeBar(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({
      active: event.detail
    });
    switch (this.data.active) {
      case 'home': {
        wx.redirectTo({
          url: '../home/home?active='+'home',
        })
        break
      }
      case 'myOrder': {
        wx.redirectTo({
          url: '../showCompletedOrder/showCompletedOrder?active='+'myOrder',
        })
        break
      }
      case 'createOrder': {
        wx.navigateTo({
          url: '../createOrder/createOrder',
        })
        break
      }
      case 'receiveOrder': {
        wx.redirectTo({
          url: '../receivedOrder/receivedOrder?active='+'receiveOrder',
        })
        break
      }
      case 'userInfo': {
        wx.redirectTo({
          url: '../userInfo/userInfo?active='+'userInfo',
        })
        break
      }
    }
  }
    
})