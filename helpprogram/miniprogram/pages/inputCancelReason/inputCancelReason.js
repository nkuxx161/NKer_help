// pages/inputCancelReason/inputCancelReason.js
import Toast from '@vant/weapp/toast/toast'
const DB = wx.cloud.database()
const db = DB.collection('cancelReason')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'sender',
    cancelReason: '',
    orderId: '',
    sendStudentID: '',
    receiveStudentID: '',
    sendStudentOpenId: '',
    receiveStudentOpenId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type != undefined) {
      this.setData({
        type: decodeURIComponent(options.type),
        orderId: decodeURIComponent(options.orderId)
      })
    }
    this.getOpenid()
    // console.log(this.data.type)
  },

  //让用户获取消息推送的授权
  getAccess() {
    wx.requestSubscribeMessage({
      tmplIds: ['mVQCWb63Fa1nGEDlNU4GHgVlEOmiKyH6_wlWQr4ijxY'],
      success: (res) => {
        console.log('授权成功', res)
      },
      fail: (err) => {
        console.log('授权失败', err)
      }
    })
  },

  //提交取消订单原因
  submitCancelReason() {
    this.getAccess() //允许系统向我推送订单取消成功的消息
    // console.log(this.data.type)
    if (this.data.type == 'sender') { //发单人申请取消订单
      wx.cloud.callFunction({
          name: 'updateCancelStatus',
          data: {
            id: this.data.orderId,
            status: 4,
            cancelPerson: 'sender',
            updateTime: new Date().getTime()
          }
        })
        .then(res => {
          this.messageToUser()
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
    } else if (this.data.type == 'receiver') { //接单人申请取消订单
      wx.cloud.callFunction({
          name: 'updateCancelStatus',
          data: {
            id: this.data.orderId,
            status: 4,
            cancelPerson: 'receiver',
            updateTime: new Date().getTime()
          }
        })
        .then(res => {
          this.messageToUser()
          Toast({
            type: 'success',
            message: '该订单等待处理',
          })
        })
        .catch(err => {
          console.log("接单人取消订单失败", err)
        })
      db.add({
          data: {
            orderId: this.data.orderId,
            sendCancelReason: '',
            receiveCancelReason: this.data.cancelReason,
          }
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
      wx.navigateTo({
        url: '../receivedOrder/receivedOrder',
      })
    } else {
      console.log('申请取消订单失败')
    }
  },

  //放弃填写取消原因
  cancelCancelReason() {
    if (this.data.type == 'sender') {
      wx.navigateTo({
        url: '../showCompletedOrder/showCompletedOrder',
      })
    } else if (this.data.type == 'receiver') {
      wx.navigateTo({
        url: '../receivedOrder/receivedOrder',
      })
    } else {
      console.log('取消申请取消订单失败')
    }
  },

  //根据学号查找openid
  getOpenIdByStudentID(studentID) {
    wx.cloud.database().collection('userInfo').where({
        studentID: studentID
      })
      .get()
      .then(res => {
        // console.log('查询用户成功', res.data[0]._openid)
        if (this.data.type == 'receiver') {
          this.setData({
            sendStudentOpenId: res.data[0]._openid
          })
        } else {
          this.setData({
            receiveStudentOpenId: res.data[0]._openid
          })
        }
      })
      .catch(err => {
        console.log('查询用户信息失败', err)
      })
  },

  //根据订单号查询需要推送消息的对象的openId
  getOpenid() {
    wx.cloud.database().collection('orderInfo').doc(this.data.orderId)
      .get()
      .then(res => {
        console.log('查询订单信息成功', res)
        this.setData({
          sendStudentID: res.data.sendStudentID,
          receiveStudentID: res.data.receiveStudentID,
          title: res.data.title,
          goodsType: res.data.type
        })
        //利用学号查找openid
        if (this.data.type == 'receiver') {
          this.getOpenIdByStudentID(this.data.sendStudentID)
        } else {
          this.getOpenIdByStudentID(this.data.receiveStudentID)
        }
        console.log('消息推送', this.data)
      })
      .catch(err => {
        console.log('查询订单信息失败', err)
      })
  },

  //小程序请求取消的消息推送
  messageToUser() {
    if (this.data.type == 'receiver') { //接单人申请取消订单
      wx.cloud.callFunction({
        name: 'pushCancelMessage',
        data: {
          url: '/pages/showCompletedOrder/showCompletedOrder',
          openId: this.data.sendStudentOpenId,
          title: this.data.title,
          orderId: this.data.orderId,
          reason: this.data.cancelReason,
          type: this.data.goodsType
        }
      }).then(res => {
        console.log('推送申请取消消息成功', res)
      }).catch(err => {
        console.log('推送申请取消消息失败', err)
      })
    } else { //发单人申请取消订单
      wx.cloud.callFunction({
        name: 'pushCancelMessage',
        data: {
          url: '/pages/receivedOrder/receivedOrder',
          openId: this.data.receiveStudentOpenId,
          title: this.data.title,
          orderId: this.data.orderId,
          reason: this.data.cancelReason,
          type: this.data.goodsType
        }.then(res => {
          console.log('推送取消消息成功', res)
        }).catch(err => {
          console.log('推送取消消息失败', err)
        })
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

  }
})