import Toast from '@vant/weapp/toast/toast'

const DB = wx.cloud.database()
const db = DB.collection('orderInfo')
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    receiveStudentID: '',
    status: 1,
    doingOrderList: [],
    cancelledOrderList: [],
    completedOrderList: [],
    currentOrderList: [],
    active: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户openid
    wx.cloud.callFunction({
        name: 'getOpenID',
      })
      .then(res => {
        this.setData({
          openid: res.result.openid
        })
        this.getReceiveStudentID(this.data.openid)
      })
      .catch(err => {
        console.log(err)
      })
    wx.startPullDownRefresh()
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
    this.getList()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取接单人的学号
  getReceiveStudentID(_openid) {
    DB.collection('userInfo').where({
        _openid: _openid
      }).get()
      .then(res => {
        if (res.data.length == 0) {
          console.log("接单人不存在学号")
        } else {
          // console.log("获取接单人学号信息", res.data[0].studentID)
          this.setData({
            receiveStudentID: res.data[0].studentID
          })
          this.getList()
        }
      })
      .catch(err => {
        console.log("查询接单人学号失败")
      })
  },

  //根据学号和状态查询订单
  getList() {
    // console.log("接单人学号", this.data.receiveStudentID)
    db.where({
        status: this.data.status,
        receiveStudentID: this.data.receiveStudentID
      }).skip(this.data.currentOrderList.length).limit(20).get()
      .then(res => {
        if (res.data.length == 0) {
          wx.showToast({
            title: '已到底',
          })
        } else {
          switch (this.data.status) {
            case 1: {
              this.setData({
                doingOrderList: this.data.doingOrderList.concat(res.data)
              })
              this.setData({
                currentOrderList: this.data.doingOrderList
              })
              break
            }
            case 2: {
              this.setData({
                cancelledOrderList: this.data.cancelledOrderList.concat(res.data)
              })
              this.setData({
                currentOrderList: this.data.cancelledOrderList
              })
              break
            }
            case 3: {
              this.setData({
                completedOrderList: this.data.completedOrderList.concat(res.data)

              })
              this.setData({
                currentOrderList: this.data.completedOrderList
              })
              break
            }
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  },

  //跳转到订单详情页
  showDetail(id) {
    wx.navigateTo({
      url: '../showOrderDetail/showOrderDetail?orderId=' + id.currentTarget.dataset.id,
    })
  },

  //切换订单列表
  onChange(event) {
    // console.log("切换的栏目编号", event.detail.index)
    this.setData({
      status: event.detail.index + 1,
    })
    switch (this.data.status) {
      case 1:
        this.setData({
          currentOrderList: this.data.doingOrderList
        })
        break;
      case 2:
        this.setData({
          currentOrderList: this.data.cancelledOrderList
        })
        break;
      case 3:
        this.setData({
          currentOrderList: this.data.completedOrderList
        })
        break;
      default:
        Toast.fail('切换订单状态失败')
        break;
    }
    this.getList()
  },

  //取消订单
  cancelOrder() {
    //待实现
    console.log('取消订单')

  },

  //提交订单 
  submitComplete() {
    // 待实现
    console.log('提交订单')

  }

})