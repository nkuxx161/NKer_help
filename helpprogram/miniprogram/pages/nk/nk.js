// pages/nk/nk.js
const DB = wx.cloud.database()
const db = DB.collection('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      src:'https://webvpn.nankai.edu.cn/'
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
  load: function (e) {
    // 获取url
    const src = e.detail.src;
    console.log(src)
    const nkweb= "https://webvpn.nankai.edu.cn/"
    // 检测到指定值执行跳转逻辑
    // console.log(this.data.ifLogin)
    if(src == nkweb){
      // console.log(this.data.ifLogin)
      db.add({
        data:{
        college:"未设置",
        defaultCampus:"未设置",
        email:"未设置",
        phoneNumber:"未设置",
        receiveCount: 0,
        receiveScore: 0,
        sendCount: 0,
        sendScore:0,
        studentID: " ",
        studentName:"请输入一个名字",
        userIcon:"0"
      }})
      wx.redirectTo({ url: '../userInfo/userInfo?flag=Yes&showToast=Yes'}) 
    }
  }
})
