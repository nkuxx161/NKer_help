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
    flag: false,
    cancelFlag: false,
    show: false,
    cancelReason: ''
  },

  getList() {
    db.where({
        status: this.data.status,
        _openid: this.data.openid
      }).orderBy('updateTime', 'desc').skip(this.data.currentOrderList.length).get()
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
          _openid: this.data.openid,
          // cancelPerson: 2
        }).orderBy('updateTime', 'desc').skip(this.data.currentOrderList.length).get()
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
    //设置tabbar的状态
    if (options.active == undefined) {
      this.setData({
        active: 'myOrder'
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
        this.getList()
      })
      .catch(err => {
        console.log(err)
      })
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
    //已实现
    Dialog.confirm({
        title: '确认取消订单吗？',
        message: '取消后将不再接受他人的接单',
        theme: 'round-button',
      })
      .then(() => {
        let id = event.currentTarget.dataset.id
        if (this.data.status == 0) {
          wx.cloud.callFunction({
              name: 'updateCancelStatus',
              data: {
                id: id,
                status: 2,
                cancelPerson: 'sender',
                updateTime: new Date().getTime()
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
            url: '../inputCancelReason/inputCancelReason?orderId=' + event.currentTarget.dataset.id + '&type=sender',
          })
        }
      })
      .catch(() => {
        // on cancel
      })
    console.log('取消订单')
  },

  //同意取消订单并且发送同意取消的推送
  agreeCancel(event) {
    console.log(event)
    let id = event.currentTarget.dataset.id
    console.log(id)
    Dialog.confirm({
      title: '完成接单',
      message: '确认同意取消此订单吗',
      theme: 'round-button',
    }).then(() => {
      wx.cloud.callFunction({
          name: 'updateOrderStatus',
          data: {
            id: id,
            status: 2,
            updateTime: new Date().getTime()
          }
        })
        .then(res => {
          //根据接单人学号找到其对应的openid号
          wx.cloud.database().collection('userInfo').where({
              studentID: event.currentTarget.dataset.receivestudentid
            }).get()
            .then(res => {
              let openid = res.data[0]._openid
              //发送推送
              wx.cloud.callFunction({
                name: 'pushAgreeCancelMsg',
                data: {
                  openId: openid,
                  url: '/pages/receivedOrder/receivedOrder',
                  orderId: event.currentTarget.dataset.id,
                  description: event.currentTarget.dataset.description,
                  title: event.currentTarget.dataset.title,
                }
              }).then(res => {
                console.log('同意取消订单消息推送成功', res)
              }).catch(err => {
                console.log('同意取消订单消息推送失败', err)
              })
            }).catch(err => {
              console.log('根据学号查询openid失败', err)
            })

          //同意取消后重新获得待处理的订单列表
          this.setData({
            currentOrderList: [],
            pendingOrderList: [],
            cancelFlag: true
          })
          this.getList()
        })
        .then(res => {
          //根据接单人学号找到其对应的openid号
          wx.cloud.database().collection('userInfo').where({
              studentID: event.currentTarget.dataset.receivestudentid
            }).get()
            .then(res => {
              let openid = res.data[0]._openid
              //发送推送
              wx.cloud.callFunction({
                name: 'pushAgreeCancelMsg',
                data: {
                  openId: openid,
                  url: '/pages/receivedOrder/receivedOrder',
                  orderId: event.currentTarget.dataset.id,
                  description: event.currentTarget.dataset.description,
                  title: event.currentTarget.dataset.title,
                }
              }).then(res => {
                console.log('同意取消订单消息推送成功', res)
              }).catch(err => {
                console.log('同意取消订单消息推送失败', err)
              })
            }).catch(err => {
              console.log('根据学号查询openid失败', err)
            })

          //同意取消后重新获得待处理的订单列表
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
    }).catch(() => {
      console.log('发单人取消同意')
    })
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  //提交订单 
  submitComplete(e) {
    console.log(e) //打印提交订单的数据
    Dialog.confirm({
      title: '完成接单',
      message: '确认提交此订单吗',
      theme: 'round-button',
    }).then(() => {
      //更改状态
      db.doc(e.currentTarget.dataset.id).update({
          data: {
            status: 3,
            updateTime: new Date().getTime()
          }
        })
        .then(res => {
          //根据接单人学号获取接单人的openid
          wx.cloud.database().collection('userInfo').where({
            studentID: e.currentTarget.dataset.receivestudentid
          }).get().then(res => {
            let receivestudentopenid = res.data[0]._openid
            //向接单人推送订单完成的消息
            wx.cloud.callFunction({
              name: 'pushSubmitMessage',
              data: {
                url: '/pages/receivedOrder/receivedOrder',
                openId: receivestudentopenid,
                orderId: e.currentTarget.dataset.id,
                title: e.currentTarget.dataset.title,
                goodsPlace: e.currentTarget.dataset.goodsplace,
                dealPlace: e.currentTarget.dataset.dealplace
              }
            }).then(res => {
              console.log('接单人完成订单消息推送成功', res)
            }).catch(err => {
              console.log('接单人完成订单消息推送失败', err)
            })
          }).catch(err => {
            console.log('根据学号获取接单人openid失败', err)
          })

          //更改状态后从新请求数据
          console.log(res)
          this.setData({
            doingOrderList: [],
            flag: true
          })
          this.setData({
            currentOrderList: this.data.doingOrderList
          })
          this.getList()
          //更改已完成但未评价的订单数
          this.updateCountUnreviewed(e.currentTarget.dataset.receivestudentid, 'receiver')
          this.updateCountUnreviewed(e.currentTarget.dataset.sendstudentid, 'sender')
        })
        .catch(err => {
          console.log(err)
        })
    }).catch(() => {
      console.log('取消提交订单')
    })

  },

  //根据学号获取userId（唯一）,再更新完成但未评价的订单数
  updateCountUnreviewed(studentID, type) {
    wx.cloud.database().collection('userInfo').where({
        studentID: studentID
      })
      .then(res => {
        console.log(res)
        this.setData({
          doingOrderList: [],
          flag: true
        })
        .then(res => {
          //根据接单人学号获取接单人的openid
          wx.cloud.database().collection('userInfo').where({
            studentID: e.currentTarget.dataset.receivestudentid
          }).get().then(res => {
            let receivestudentopenid = res.data[0]._openid
            //向接单人推送订单完成的消息
            wx.cloud.callFunction({
              name: 'pushSubmitMessage',
              data: {
                url: '/pages/receivedOrder/receivedOrder',
                openId: receivestudentopenid,
                orderId: e.currentTarget.dataset.id,
                title: e.currentTarget.dataset.title,
                goodsPlace: e.currentTarget.dataset.goodsplace,
                dealPlace: e.currentTarget.dataset.dealplace
              }
            }).then(res => {
              console.log('接单人完成订单消息推送成功', res)
            }).catch(err => {
              console.log('接单人完成订单消息推送失败', err)
            })
          }).catch(err => {
            console.log('根据学号获取接单人openid失败', err)
          })

          //更改状态后从新请求数据
          console.log(res)
          this.setData({
            doingOrderList: [],
            flag: true
          })
          this.setData({
            currentOrderList: this.data.doingOrderList
          })
          this.getList()
          //更改已完成但未评价的订单数
          this.updateCountUnreviewed(e.currentTarget.dataset.receivestudentid, 'receiver')
          this.updateCountUnreviewed(e.currentTarget.dataset.sendstudentid, 'sender')
        })
        .catch(err => {
          console.log(err)
        })
    }).catch(() => {
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
  submitReview(options) {
    //已实现
    console.log('评价订单')
    wx.navigateTo({
      url: '../userreview/userreview?id=' + options.currentTarget.dataset.id + '&studentID=' + options.currentTarget.dataset.studentid + '&type=StoR' +
        '&title=' + options.currentTarget.dataset.title + '&oppositeStudentID=' + options.currentTarget.dataset.oppositestudentid,
    })
  },

  createAgain(options) {
    wx.redirectTo({
      url: '../createOrder/createOrder?order=' + JSON.stringify(options.currentTarget.dataset.order),
    })
    console.log(options.currentTarget.dataset.order)
  },

  //空方法用于捕获tap防止冒泡
  null() {

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
    switch (this.data.status) {
      case 0: {
        this.setData({
          waitOrderList: []
        })
        break;
      }
      case 1: {
        this.setData({
          doingOrderList: []
        })
        break;
      }
      case 2: {
        this.setData({
          cancelledOrderList: []
        })
        break;
      }
      case 3: {
        this.setData({
          completedOrderList: []
        })
        break;
      }
      case 4: {
        this.setData({
          pendingOrderList: []
        })
        break;
      }
    }
    this.setData({
      currentOrderList: [],
    })
    this.getList()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
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