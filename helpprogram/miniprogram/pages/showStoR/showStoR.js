// miniprogram/pages/showStoR/showStoR.js
import Dialog from '@vant/weapp/dialog/dialog'
import Toast from '@vant/weapp/toast/toast'
const DB = wx.cloud.database()
const SRdb = DB.collection('StoRReview')
const usdb = DB.collection('userInfo')
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentID: '',
    flag: 0,
    showList: [],
    userID: '',
    openid: '',
    pageflag: 1,
  },

  onClick(e){
    this.setData({
      userID: e.currentTarget.dataset.id
    })
    usdb.where({
      studentID: this.data.userID
    }).get()
    .then(res => {
      this.setData({
        openid: res.data[0]._openid
      })
      wx.navigateTo({
        url: '../showUserInfo/showUserInfo?userID=' + this.data.openid + '&pageflag=' + this.data.pageflag,
      })
    })
  },

  getList(){
    SRdb.where({
      receiveStudentID: this.data.studentID
    }).skip(this.data.showList.length).limit(20).get()
    .then(res => {
      if(res.data.length == 0 && this.data.flag == 0){
        Toast('暂无相关评价！')
      } else {
        this.setData({
          flag: 1,
        })
        if(res.data.length == 0) {
          wx.showToast({
            title: '已到底！',
          })
        } else {
          this.setData({
            showList: this.data.showList.concat(res.data)
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      studentID: options.studentID,
      flag: 0,
      showList: []
    })
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