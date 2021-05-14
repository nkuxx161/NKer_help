// miniprogram/pages/showSearchResult/showSearchResult.js
import Dialog from '@vant/weapp/dialog/dialog'
import Toast from '@vant/weapp/toast/toast'
const DB = wx.cloud.database()
const db = DB.collection('orderInfo')
const userdb = DB.collection('userInfo')
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    flag: 0,
    studentID: '',
    currentOrderList: [],
    index: 1,
    value: '',
    waitOrderList: [],
    sameCampus: [],
    differentCampus: [],
  },

  getList() {
    console.log(this.data.flag)
    db.where(_.or([
      {
        title: DB.RegExp({
          regexp: this.data.value,
          options: 'i',
        })
      },
      {
        description: DB.RegExp({
          regexp: this.data.value,
          options: 'i',
        })
      },
      {
        goodsPlace: DB.RegExp({
          regexp: this.data.value,
          options: 'i',
        })
      }
    ]).and([
      {
        status: 0
      },
      {
        _openid: _.neq(this.data.openid)
      }
    ])).skip(this.data.waitOrderList.length).limit(20).get()
    .then(res => {
      if(res.data.length == 0 && this.data.flag == 0) {
        Toast('没有相关的订单！')
      } else {
        this.setData({
          flag: 1
        })
        if(res.data.length == 0){
          wx.showToast({
            title: '已到底！',
          })
        } else {
          this.setData({
            waitOrderList: this.data.waitOrderList.concat(res.data)
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
              if(this.data.index == 1){
                this.setData({
                  currentOrderList: this.data.waitOrderList
                })
              } else if(this.data.index == 2){
                this.setData({
                  currentOrderList: this.data.sameCampus
                })
              } else {
                this.setData({
                  currentOrderList: this.data.differentCampus
                })
          }
          if(this.data.currentOrderList.length == 0) {
            Toast('没有相关的订单！')
          }
        }
      }
    })
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
        this.setData({
          waitOrderList:[],
          currentOrderList:[],
          sameCampus: [],
          differentCampus: []
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
    this.setData({
      flag: 0,
      value: options.value,
      index: options.index,
      currentOrderList: [],
      waitOrderList: [],
      sameCampus: [],
      differentCampus:[],
      openid: options.openid,
    })
    this.getList()
    console.log(this.data.openid)
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

  }
})