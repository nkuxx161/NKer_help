// miniprogram/pages/showUserInfo/showUserInfo.js
const DB = wx.cloud.database()
const db = DB.collection('orderInfo')
const userdb = DB.collection('userInfo')
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: '',
    user: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userID: options.userID
    })
    console.log(this.data.userID)

    userdb.where({
      _openid: this.data.userID
    }).get()
    .then(res => {
      this.setData({
        user: res.data[0]
      })
    })
    .catch(err => {
      console.log(err)
    })
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

  }
})