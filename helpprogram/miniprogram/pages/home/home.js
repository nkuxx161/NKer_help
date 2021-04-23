// miniprogram/pages/home/home.js
const DB = wx.cloud.database()
const db = DB.collection('orderInfo')
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    currentOrderList: [],
    waitOrderList: [],
  },

  getList() {
    db.where({
      status: this.data.status
    }).skip(this.data.currentOrderList.length).get()
    .then(res => {
      if (res.data.length == 0) {
        wx.showToast({
          title: '已到底',
        })
      } else {
        if(this.data.status == 0){
          this.setData({
            waitOrderList: this.data.waitOrderList.concat(res.data)
          })
          this.setData({
            currentOrderList: this.data.waitOrderList
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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