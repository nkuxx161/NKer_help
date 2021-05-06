// pages/inputCancelReason/inputCancelReason.js
import Toast from '@vant/weapp/toast/toast'
const DB = wx.cloud.database()
const db = DB.collection('cancelReason')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    cancelReason: '',
    orderId: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: decodeURIComponent(options.orderId)
    })
  },

  submitCancelReason() {
    wx.cloud.callFunction({
        name: 'updateCancelStatus',
        data: {
          id: this.data.orderId,
          status: 4,
          cancelPerson: 1
        }
      })
      .then(res => {
        Toast({
          type: 'success',
          message: '该订单等待处理',
        })
      })
      .catch(err => {
        console.log("发单人取消订单失败", err)
      })
    db.add({
        data: {
          orderId: this.data.orderId,
          sendCancelReason: this.data.cancelReason,
          receiveCancelReason: ''
        }
      })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    wx.navigateTo({
      url: '../showCompletedOrder/showCompletedOrder',
    })
  },

  cancelCancelReason() {
    wx.navigateTo({
      url: '../showCompletedOrder/showCompletedOrder',
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