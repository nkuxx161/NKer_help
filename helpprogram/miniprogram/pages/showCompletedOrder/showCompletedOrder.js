import Dialog from '@vant/weapp/dialog/dialog'
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
    status: 0,
    waitOrderList: [],
    doingOrderList: [],
    cancelledOrderList: [],
    completedOrderList: [],
    pendingOrderList: [],
    currentOrderList: [],
    active: 0,
    flag: false,
    cancelFlag: false,
    show: false,
    cancelReason: ''
  },

  getList() {
    db.where({
        status: this.data.status,
        _openid: this.data.openid
      }).skip(this.data.currentOrderList.length).get()
      .then(res => {
        if (res.data.length == 0) {
          wx.showToast({
            title: '已到底',
          })
        } else {
          switch (this.data.status) {
            case 0: {
              this.setData({
                waitOrderList: this.data.waitOrderList.concat(res.data)
              })
              this.setData({
                currentOrderList: this.data.waitOrderList
              })
              break
            }
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

    if (this.data.status == 4) {
      db.where({
          status: 4,
          _openid: _.not(_.eq(this.data.openid))
        }).skip(this.data.currentOrderList.length).get()
        .then(res => {
          if (res.data.length == 0) {
            wx.showToast({
              title: '已到底',
            })
          } else {
            this.setData({
              pendingOrderList: this.data.pendingOrderList.concat(res.data)
            })
            this.setData({
              currentOrderList: this.data.pendingOrderList
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
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
        this.getList()
      })
      .catch(err => {
        console.log(err)
      })
    wx.startPullDownRefresh()
  },

  showDetail(id) {
    wx.navigateTo({
      url: '../showOrderDetail/showOrderDetail?orderId=' + id.currentTarget.dataset.id,
    })
  },

  onChange(event) {
    if (this.data.flag == true) {
      this.setData({
        flag: false,
        completedOrderList: []
      })
    }
    if (this.data.cancelFlag == true) {
      this.setData({
        cancelFlag: false,
        waitOrderList: []
      })
    }
    this.setData({
      status: event.detail.index
    })
    switch (this.data.status) {
      case 0: {
        this.setData({
          currentOrderList: this.data.waitOrderList
        })
        break
      }
      case 1: {
        this.setData({
          currentOrderList: this.data.doingOrderList
        })
        break
      }
      case 2: {
        this.setData({
          currentOrderList: this.data.cancelledOrderList
        })
        break
      }
      case 3: {
        this.setData({
          currentOrderList: this.data.completedOrderList
        })
        break
      }
      case 4: {
        this.setData({
          currentOrderList: this.data.pendingOrderList
        })
        break
      }
    }
    this.getList()
  },

  //取消订单
  cancelOrder(event) {
    //待实现
    Dialog.confirm({
        title: '确认取消订单吗？',
        message: '取消后将不再接受他人的接单',
      })
      .then(() => {
        let id = event.currentTarget.dataset.id
        if (this.data.status == 0) {
          wx.cloud.callFunction({
              name: 'updateOrderStatus',
              data: {
                id: id,
                status: 2
              }
            })
            .then(res => {
              Toast({
                type: 'success',
                message: '已取消订单',
              })
              this.setData({
                currentOrderList: [],
                waitOrderList: [],
                cancelFlag: true
              })
              this.getList()
            })
            .catch(err => {
              console.log("发单人取消订单失败", err)
            })
        }
        if (this.data.status == 1) {
          //填写取消原因
          this.setData({
            cancelFlag: true
          })
          wx.navigateTo({
            url: '../inputCancelReason/inputCancelReason?orderId=' + event.currentTarget.dataset.id,
          })
        }
      })
      .catch(() => {
        // on cancel
      })
    console.log('取消订单')
  },

  agreeCancel(event) {
    console.log(event)
    let id = event.currentTarget.dataset.id
    console.log(id)
    wx.cloud.callFunction({
        name: 'updateOrderStatus',
        data: {
          id: id,
          status: 2
        }
      })
      .then(res => {
        Toast({
          type: 'success',
          message: '已取消订单',
        })
        this.setData({
          currentOrderList: [],
          pendingOrderList: [],
          cancelFlag: true
        })
        this.getList()
      })
      .catch(err => {
        console.log("发单人取消订单失败", err)
      })
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  //提交订单 
  submitComplete(e) {
    //更改状态
    db.doc(e.currentTarget.dataset.id).update({
        data: {
          status: 3
        }
      })
      .then(res => {
        console.log(res)
        this.setData({
          doingOrderList: [],
          flag: true
        })
        this.setData({
          currentOrderList: this.data.doingOrderList
        })
        this.getList()
      })
      .catch(err => {
        console.log(err)
      })
  },

  //评价订单
  submitReview() {
    //待实现
    console.log('评价订单')
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
  changeBar(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    switch (this.data.active){
      case 'home':{ wx.redirectTo({
        url: '../home/home',
      })
      break
    }
      case 'myOrder':{
        wx.redirectTo({
          url: '../showCompletedOrder/showCompletedOrder',
        })
        break
      }
      case 'createOrder':{
        wx.navigateTo({
          url: '../createOrder/createOrder',
        })
        break
      }
      case 'receiveOrder':{
        wx.redirectTo({
          url: '../receivedOrder/receivedOrder',
        })
        break
      }
      case 'userInfo':{
        wx.redirectTo({
          url: '../userInfo/userInfo',
        })
        break
      }
    }
  },
})