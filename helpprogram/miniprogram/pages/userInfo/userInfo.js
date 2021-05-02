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
      openid: '',
      show:false,
      ifLogin:'No',
      name:'',
      showT:'No',
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      flag:'No',
      img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fphoto.yonglang.co%2Fwx_img%2Fimage_jpeg%2F3e0757a9-0eea-4d5b-8743-1e3cb14a2cde.png&refer=http%3A%2F%2Fphoto.yonglang.co&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621600425&t=a552c0f07952a07b4f053f7cc088f74f',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getOpenID',
    })
    .then(res => {
      db.where({
        _openid:res.result.openid
      }).get()
      .then(res=>{
        if(res.data.length != 0){
          this.setData({
            name:res.data[0].studentName,
            flag:'Yes'
          })
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
  wx.getSetting({
   success: function (res) {
    if (res.authSetting['scope.userInfo']) {
     wx.getUserInfo({
      success: function (res) {
       //从数据库获取用户信息
       that.queryUsreInfo();
       //用户已经授权过
       that.setData({
        ifLogin:'Yes',
       })
      }
     });
    }
   }
  })
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
   * 跳转到微信认证
   */
  logIn:function(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success () {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getUserInfo()
            }
          })
        }
      }
    })
  },
  /**
   * 去往认证页面
   */
  goNk: function(){
     wx.redirectTo({ url: '../nk/nk', }) 
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
      message: '小程序需要您的授权才能提供正常的服务哦'
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
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
     //用户按了允许授权按钮
     var that = this;
     //插入登录的用户的相关信息到数据库
     wx.request({
      url: getApp().globalData.urlPath + 'hstc_interface/insert_user',
      data: {
       openid: getApp().globalData.openid,
       nickName: e.detail.userInfo.nickName,
       avatarUrl: e.detail.userInfo.avatarUrl,
       province:e.detail.userInfo.province,
       city: e.detail.userInfo.city
      },
      header: {
       'content-type': 'application/json'
      },
      success: function (res) {
       //从数据库获取用户信息
       that.queryUsreInfo();
       console.log("插入小程序登录用户信息成功！");
      }
     });
     //授权成功后，跳转进入小程序首页
     this.setData({
       ifLogin:'Yes'
     })
     if(this.data.flag=='No'){
      Dialog.alert({
        title: '请进行认证',
        message: '小程序需要您的认证才能提供正常的服务哦'
      })
        .then(() => {
        })
       

     }
    } else {
     //用户按了拒绝按钮
     wx.showModal({
      title:'警告',
      content:'您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
      showCancel:false,
      confirmText:'返回授权',
      success:function(res){
       if (res.confirm) {
        console.log('用户点击了“返回授权”')
       } 
      }
     })
    }
   },
   //获取用户信息接口
   queryUsreInfo: function () {
    wx.request({
     url: getApp().globalData.urlPath + 'hstc_interface/queryByOpenid',
     data: {
      openid: getApp().globalData.openid
     },
     header: {
      'content-type': 'application/json'
     },
     success: function (res) {
      console.log(res.data);
      getApp().globalData.userInfo = res.data;
     }
    })
   },
    
})