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
    userInfo: {},
    hasUserInfo: false,
      openid: '',
      show:false,
      ifLogin:'No',
      name:'',
      showT:'No',
      flag:'No',
      img:' ',
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
            flag:'Yes',
            img:'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/'+res.data[0]._openid+'.jpg'
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
    
})