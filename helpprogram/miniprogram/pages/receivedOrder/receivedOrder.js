import Toast from '@vant/weapp/toast/toast'
import Dialog from '@vant/weapp/dialog/dialog'

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
    pendingOrderList: [],
    active: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置tabbar的状态
    if (options.active == undefined) {
      this.setData({
        active: 'receiveOrder'
      })
    } else {
      this.setData({
        active: options.active
      })
    }

    //提交或者评价订单后需要重新请求订单的数据
    if (options.status == 3) {
      this.setData({
        status: 3,
        completedOrderList: [],
        currentOrderList: []
      })
      this.getList()
    }

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
            case 4: {
              this.setData({
                pendingOrderList: this.data.pendingOrderList.concat(res.data)

              })
              this.setData({
                currentOrderList: this.data.pendingOrderList
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
    console.log("切换的栏目编号", event.detail.index)
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
      case 4:
        this.setData({
          currentOrderList: this.data.pendingOrderList
        })
        break;
      default:
        Toast.fail('切换订单状态失败')
        break;
    }
    this.getList()
  },

  //取消订单
  cancelOrder(event) {
    let orderId = event.currentTarget.dataset.id
    console.log('取消订单', orderId)
    wx.navigateTo({
      url: '../inputCancelReason/inputCancelReason?orderId=' + orderId + '&type=receiver',
    })

  },

  //提交完成订单的请求 
  submitComplete(event) {
    Dialog.confirm({
        title: '完成接单',
        message: '确认提交此订单吗',
        theme: 'round-button',
      })
      .then(() => {
        //确认提交订单
        let id = event.currentTarget.dataset.id
        // console.log(id)
        wx.cloud.callFunction({
            name: 'updateOrderStatus',
            data: {
              id: id,
              status: 3
            }
          })
          .then(res => {
            // console.log("接单人提交订单成功", res)
            this.setData({
              currentOrderList: [],
              doingOrderList: []
            })
            this.getList()
            //更改已完成但未评价的订单数
            this.updateCountUnreviewed(event.currentTarget.dataset.receivestudentid, 'receiver')
            this.updateCountUnreviewed(event.currentTarget.dataset.sendstudentid, 'sender')
          })
          .catch(err => {
            console.log("接单人提交订单失败", err)
          })
      })
      .catch(() => {
        //取消提交订单
        console.log('取消提交订单')
      })
  },

  //根据学号获取userId（唯一）,再更新完成但未评价的订单数
  updateCountUnreviewed(studentID, type) {
    wx.cloud.database().collection('userInfo').where({
        studentID: studentID
      })
      .get()
      .then(res => {
        // console.log('用户信息', res)
        if (type == 'sender') {
          let sendUserId = res.data[0]._id
          let sendCountUnreviewed = res.data[0].sendCountUnreviewed
          wx.cloud.callFunction({
            name: 'updateCountUnreviewed',
            data: {
              type: 'sender',
              userId: sendUserId,
              sendCountUnreviewed: sendCountUnreviewed + 1
            }
          }).then(res => {
            console.log('更新发单人完成单未评价的订单数成功', res)
          }).catch(err => {
            console.log('更新发单人完成单未评价的订单数失败', err)
          })
        } else if (type == 'receiver') {
          let receiveUserId = res.data[0]._id
          let receiveCountUnreviewed = res.data[0].receiveCountUnreviewed
          wx.cloud.callFunction({
            name: 'updateCountUnreviewed',
            data: {
              type: 'receiver',
              userId: receiveUserId,
              receiveCountUnreviewed: receiveCountUnreviewed + 1
            }
          }).then(res => {
            console.log('更新接单人完成单未评价的订单数成功', res)
          }).catch(err => {
            console.log('更新接单人完成单未评价的订单数失败', err)
          })
        } else {
          console.log('提交完成时传入的type参数有误')
        }
      })
      .catch(err => {
        console.log('查询用户信息失败', err)
      })
  },

  //评价订单
  submitReview(event) {
    console.log('评价订单', event.currentTarget.dataset.id)
    let orderId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/userreview/userreview' + '?id=' + orderId + '&studentID=' + this.data.receiveStudentID + '&type=RtoS' +
        '&title=' + event.currentTarget.dataset.title + '&oppositeStudentID=' + event.currentTarget.dataset.oppositestudentid,
    })
  },

  //处理取消订单，联系客服介入后的回调函数
  service() {
    //不用实现什么
    console.log('接单人联系客服介入')
  },

  //处理取消订单，同意取消
  agreeCancel(options) {
    Dialog.confirm({
        title: '完成接单',
        message: '确认同意取消此订单吗',
        theme: 'round-button',
      })
      .then(() => {
        let orderId = options.currentTarget.dataset.id
        let sendStudentOpenId = options.currentTarget.dataset.sendstudentid
        let title = options.currentTarget.dataset.title
        let description = options.currentTarget.dataset.description
        // console.log('接单人同意取消订单', orderId, sendStudentOpenId, title, description)
        //修改数据库
        wx.cloud.callFunction({
            name: 'updateOrderStatus',
            data: {
              id: orderId,
              status: 2
            }
          })
          .then(res => {
            console.log("接单人同意取消订单成功", res)
            this.setData({
              currentOrderList: [],
              pendingOrderList: []
            })
            this.getList()
            //推送取消消息
            wx.cloud.callFunction({
              name: 'pushAgreeCancelMsg',
              data: {
                url: '/pages/receivedOrder/receivedOrder',
                openId: sendStudentOpenId,
                title: title,
                orderId: orderId,
                description: description,
              }
            }).then(res => {
              console.log('推送取消消息成功', res)
            }).catch(err => {
              console.log('推送取消消息失败', err)
            })
          })
          .catch(err => {
            console.log("接单人同意取消订单失败", err)
          })
      })
      .catch(() => {
        //取消提交订单
        console.log('接单人取消同意的操作')
      })
  },

  //捕获冒泡事件
  nothing() {
    //空方法，不用实现
  },

  changeBar(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({
      active: event.detail
    });
    switch (this.data.active) {
      case 'home': {
        wx.redirectTo({
          url: '../home/home?active=' + 'home',
        })
        break
      }
      case 'myOrder': {
        wx.redirectTo({
          url: '../showCompletedOrder/showCompletedOrder?active=' + 'myOrder',
        })
        break
      }
      case 'createOrder': {
        wx.navigateTo({
          url: '../createOrder/createOrder',
        })
        break
      }
      case 'receiveOrder': {
        wx.redirectTo({
          url: '../receivedOrder/receivedOrder?active=' + 'receiveOrder',
        })
        break
      }
      case 'userInfo': {
        wx.redirectTo({
          url: '../userInfo/userInfo?active=' + 'userInfo',
        })
        break
      }
    }
  }

})