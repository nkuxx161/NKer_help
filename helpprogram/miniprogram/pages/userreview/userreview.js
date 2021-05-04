// pages/userreview/userreview.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
let file = {} //用来临时存放评价图片

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    orderId: '',
    studentID: '',
    score: 5,
    word: '',
    image: '',
    goods: '',
    fileList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId: options.id,
      studentID: options.studentID,
      type: options.type
    })
    wx.cloud.database().collection('orderInfo').doc(this.data.orderId)
      .get()
      .then(res => {
        // console.log('评价的商品信息', res)
        this.setData({
          goods: res.data
        })
      })
      .catch(err => {
        console.log('返回评价的商品信息失败', err)
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

  //跳转到订单详情页
  showDetail(id) {
    wx.navigateTo({
      url: '../showOrderDetail/showOrderDetail?orderId=' + id.currentTarget.dataset.id,
    })
  },

  //更改评价分数
  onChangeScore(event) {
    this.setData({
      score: event.detail
    })
    // console.log('更改后的得分', this.data.score)
  },

  //选择图片的回调函数
  afterRead(event) {
    file = event.detail.file
    console.log(file)
    this.setData({
      fileList: [].concat(file)
    })
  },

  //删除选择的图片
  deleteImage(event) {
    // console.log(event.detail)
    this.setData({
      fileList: []
    })
  },

  //随机生成图片名字
  randomString(length) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
      result += str[Math.floor(Math.random() * str.length)];
    return result;
  },


  //提交评价
  completeReview() {
    console.log('提交评价', this.data)
    if (file == null) { //当不上传图片时
      // console.log(this.data)
      db.add({
        data: {
          receiveStudentID: this.data.studentID,
          orderId: this.data.orderId,
          RtoSImage: 'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/defaultGoods.png',
          RtoSScore: this.data.score,
          RtoSWord: this.data.word,
        }
      })
    } else if (this.data.type == "RtoS"){ //当接单人对发单人评价时
      let imageName = this.data.openid + this.randomString(10)
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      wx.cloud.uploadFile({
        cloudPath: 'images/' + imageName,
        filePath: file.url,
        success: res => {
          this.setData({
            image: res.fileID
          })
          // console.log(this.data)
          wx.cloud.database().collection('RtoSReview').add({
            data: {
              receiveStudentID: this.data.studentID,
              orderId: this.data.orderId,
              RtoSImage: this.data.image,
              RtoSScore: this.data.score,
              RtoSWord: this.data.word,
            }
          })
          Toast({
            type: 'success',
            message: '提交评价成功',
            onClose: () => { //待实现比如说跳转界面等
              console.log('执行OnClose函数');
            },
          });
        },
        fail: err => {
          wx.showToast({
            title: '提交评价失败',
            icon: 'fail',
            duration: 1000
          })
        }
      })
    } else if (this.data.type == 'StoR') { //当发单人对接单人做评价时
      //未实现
    }
  }
})