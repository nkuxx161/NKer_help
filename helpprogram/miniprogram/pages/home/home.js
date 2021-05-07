// miniprogram/pages/home/home.js
import Dialog from '@vant/weapp/dialog/dialog'
import Toast from '@vant/weapp/toast/toast'
const DB = wx.cloud.database()
const db = DB.collection('orderInfo')
const userdb = DB.collection('userInfo')
const _ = wx.cloud.database().command
const $ = _.aggregate
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    studentID: '',
    active: 0,
    index: 0,
    status: 0,
    currentOrderList: [],
    waitOrderList: [],
    sameCampus: [],
    differentCampus: [],
  },



  getList() {
    db.where({
      status: this.data.status
    }).skip(this.data.currentOrderList.length).limit(20).get()
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
          for(var i=0; i<res.data.length;i++){
            if(res.data[i].end == res.data[i].start){
              this.setData({
                sameCampus: this.data.sameCampus.concat(res.data[i])
              })
            } else {
              this.setData({
                differentCampus: this.data.differentCampus.concat(res.data[i])
              })
            }
          }
        }
      }
    })
  },

  onChange(event){
    this.setData({
      index: event.detail.index+1,
    })
    switch(this.data.index){
      case 1:
        this.setData({
          currentOrderList: this.data.waitOrderList,
        })
        break;
      case 2:
        this.setData({
          currentOrderList: this.data.sameCampus,
        })
        break;
      case 3:
        this.setData({
          currentOrderList: this.data.differentCampus,
        })
        break;
      default:
        Toast.fail('切换订单状态失败')
        break;
    }
  },

  showDetail(id) {
    wx.navigateTo({
      url: '../showOrderDetail/showOrderDetail?orderId=' + id.currentTarget.dataset.id,
    })
  },


  /** 确认接单 */
  confirmOrder(event) {
    Dialog.confirm({
      title: '确认接单吗？',
      message: '确认后需在要求时间内完成订单！',
    })
    .then(res => {
      let id = event.currentTarget.dataset.id
      wx.cloud.callFunction({
        name: 'updateReceiveStudentID',
        data:{
          id: id,
          status: 1,
          studentID: this.data.studentID
        }
      })
      .then(res => {
        console.log(res)
        this.setdata({
          waitOrderList:[],
          currentOrderList:[]
        })
        this.getList()
      })
      .catch(err => {
        console.log(err)
      })
    })
    .catch(err => {
      console.log(err)
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()

    // 获取用户openid
    wx.cloud.callFunction({
      name: 'getOpenID',
    })
    .then(res => {
      // console.log(res.result.event.userInfo.openId)
      this.setData({
        openid: res.result.event.userInfo.openId
      })
      // 获取用户学号
      userdb.where({
          '_openid': this.data.openid
        }).get()
        .then(res => {
          console.log(res.data[0].studentID)
          this.setData({
            studentID: res.data[0].studentID
          })
        }).catch(err => {
          console.log(err)
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