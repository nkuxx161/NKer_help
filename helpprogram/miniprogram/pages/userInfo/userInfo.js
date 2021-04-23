// pages/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
      ifLogin: 'No',
      name:'张三',
      id:'1812974'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  goNk: function(){
    wx.request({
      url: 'https://auth.nankai.edu.cn/oauth/sso/login',
    })
  //   wx.navigateTo({ url: '../nk/nk', success:function() {
  //   wx.navigateTo({ url: '../aboutUs/aboutUs', })
  //   }, //成功后的回调；
  //   fail:function() { }, //失败后的回调；
  //   complete:function() {wx.navigateTo({ url: '../aboutUs/aboutUs', })  
  // } }) 
  }
  
})