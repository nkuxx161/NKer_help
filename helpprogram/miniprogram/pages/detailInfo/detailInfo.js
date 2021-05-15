// pages/detailInfo/detailInfo.js
const DB = wx.cloud.database()
const db = DB.collection('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    openid:'',
    allCampus:[' ','泰达校区', '津南校区', '八里台校区', ],
    allCollege:[' ','材料科学与工程学院', '电子信息与光学工程学院', '法学院','汉语言学院','化学学院','环境科学与工程学院','计算机学院','网络空间安全学院','金融学院','经济学院','历史学院','旅游与服务学院','马克思主义学院','人工智能学院', '商学院','生命科学学院','泰达学院','软件学院','统计与数据科学学院','外国语学院','文学院','物理科学学院','药学院','医学院','哲学院','周恩来政府管理学院',],
    showCampus:false,
    showCollege:false,
    showPhone:false,
    showEmail:false,
    name:'请输入一个名称',
    campus:'未设置',
    college:'未设置',
    tempPhoneNumber:'',
    tempEmail:'',
    phoneNumber:'未设置',
    email:'未设置',
    error:'',
    img:'',
    rCount:0,
    sCount:0,
    rRate:0,
    sRate:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getOpenID',
    })
    .then(res => {
      this.setData({
        openid: res.result.openid
      })
      db.where({
        _openid:res.result.openid
      }).get()
      .then(res=>{
        if(res.data.length != 0){
          if(res.data[0].userIcon=='1')
          this.setData({
            id:res.data[0]._id,
            campus:res.data[0].defaultCampus,
            college:res.data[0].college,
            phoneNumber:res.data[0].phoneNumber,
            email:res.data[0].email,
            name:res.data[0].studentName,
            rCount:res.data[0].receiveCountUnreviewed,
            sCount:res.data[0].sendCountUnreviewed,
            rRate:(res.data[0].receiveScore/res.data[0].receiveCountUnreviewed),
            sRate:(res.data[0].sendScore/res.data[0].sendCountUnreviewed),
            img:'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/'+res.data[0]._openid+'.jpg'
          })
          else
          this.setData({
            id:res.data[0]._id,
            campus:res.data[0].defaultCampus,
            college:res.data[0].college,
            phoneNumber:res.data[0].phoneNumber,
            email:res.data[0].email,
            name:res.data[0].studentName,
            rCount:res.data[0].receiveCountUnreviewed,
            sCount:res.data[0].sendCountUnreviewed,
            rRate:(res.data[0].receiveScore/res.data[0].receiveCountUnreviewed),
            sRate:(res.data[0].sendScore/res.data[0].sendCountUnreviewed),
            img:'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/defaultImg.png'
          })
        }
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
    db.doc(this.data.id).update({
      data:{
        defaultCampus:this.data.campus,
        college:this.data.college,
        phoneNumber:this.data.phoneNumber,
        email:this.data.email,
        studentName:this.data.name
      },
      success: function (res) {
        console.log("修改成功", res)
      }
    })
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
  /**
   * 显示校区弹出框
   */
  toShowCampus() {
    this.setData({ showCampus: true });
  },
/**
 * 关闭校区弹出框
 */
  closeShowCampus() {
    this.setData({ showCampus: false });
  },
  /**
   * 选择校区
   * @param {*} event 
   */
  changeCampus(event) {
    const { picker, value, index } = event.detail;
    this.setData({ campus: value });
  },
    /**
   * 显示学院弹出框
   */
  toShowCollege() {
    this.setData({ showCollege: true });
  },
/**
 * 关闭学院弹出框
 */
  closeShowCollege() {
    this.setData({ showCollege: false });
  },
  /**
   * 选择学院
   * @param {*} event 
   */
  changeCollege(event) {
    const { picker, value, index } = event.detail;
    this.setData({ college: value });
  },
  /**
   * 显示电话弹出框
   */
  toShowPhone() {
    this.setData({ showPhone: true });
  },
/**
 * 关闭电话弹出框
 */
  closeShowPhone() {
    this.setData({ showPhone: false });
  },
  /**
   * 更改电话
   * @param {*} event 
   */
  changePhone(event) {
    this.setData({ tempPhoneNumber: event.detail });
  },
  /**
   * 确认更改电话
   * 判断是否是正确的电话格式
   */
  comfirmPhone:function(){
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.tempPhoneNumber))) {
      this.setData({
        error:"请输入正确的手机号"
      })
  }
  else{
    this.setData({
      phoneNumber:this.data.tempPhoneNumber,
      error:'',
      showPhone: false
    })
    console.log(this.data.phoneNumber)
  }
  },
    /**
   * 显示电话弹出框
   */
  toShowEmail() {
    this.setData({ showEmail: true });
  },
/**
 * 关闭电话弹出框
 */
  closeShowEmail() {
    this.setData({ showEmail: false });
  },
  /**
   * 更改电话
   * @param {*} event 
   */
  changeEmail(event) {
    event.detail;
    this.setData({ tempEmail: event.detail });
  },
  /**
   * 确认更改电话
   * 判断是否是正确的电话格式
   */
  comfirmEmail:function(){
    if (!(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this.data.tempEmail))) {
      this.setData({
        error:"请输入正确的邮箱号"
      })
  }
  else{
    this.setData({
      email:this.data.tempEmail,
      error:'',
      showEmail: false
    })
  }
  },
  /**
   * 更改头像
   */
  changeImg:function(){
    const that =this
    let imageName = this.data.openid
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath:'images/'+imageName+'.jpg', 
          filePath: tempFilePaths[0],
          success :function(res){
            db.doc(that.data.id).update({
              data:{
                userIcon:'1'
              },
              success: function (res) {
                console.log("修改成功", res)
              }
            })
            wx.showToast({
              title: '上传头像成功',
              icon: 'sucess',
              duration: 1000
            })
          },
          fail: err => {
            wx.showToast({
              title: '上传头像失败',
              icon: 'fail',
              duration: 1000
            })
          }
        })
      }
    })
  },
  /**
   * 更改昵称
   */
  changeName:function(){
    wx.redirectTo({ url: '../changeName/changeName' }) 
  },

})