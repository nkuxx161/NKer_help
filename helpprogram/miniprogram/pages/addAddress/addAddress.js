// pages/addAddress/addAddress.js
const DB = wx.cloud.database()
const db = DB.collection('addressSet')
import toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    id:"0",
    checked:false,
    name:"请填写您的姓名",
    tel:"请填写您的联系方式",
    addreValue:0,
    addreRange:['未选择','泰达校区','津南校区','八里台校区'],
    door:"详细信息",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.data)
    for(var i = 0; i < this.data.addreRange.length; i++)
      if(JSON.parse(options.data).campus==this.data.addreRange[i])
      this.setData({addreValue:i,
        name:JSON.parse(options.data).name,
        tel:JSON.parse(options.data).tel,
        door:JSON.parse(options.data).location,
        id:JSON.parse(options.data)._id
      })
      wx.cloud.callFunction({
        name: 'getOpenID',
      })
      .then(res => {
        this.setData({
          openid:res.result.openid
        })
        db.where({
          _openid:res.result.openid
        }).get()
        .then(res=>{
          if(res.data.length == 0){
            this.setData({
              checked:true
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
  setName:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  setPhone:function(e){
    this.setData({
      tel: e.detail.value
    })
  },
  setLocation:function(e){
    this.setData({
      door: e.detail.value
    })
  },
  addrePickerBindchange:function(e){
    this.setData({
      addreValue:e.detail.value
    })
  },
    save:function(e){
      console.log(this.data)
      var warn ="";
    var that = this;
    var flag = false;
    if(this.data.name==""||this.data.name=="请填写您的姓名"){
      warn = "请填写您的姓名！";
    }else if(this.data.tel==""){
      warn = "请填写您的手机号！";
    }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.tel))){
      warn = "手机号格式不正确";
    }else if(this.data.addreValue=='0'){
      warn = "请选择您的所在区域";
    }else if(this.data.door==""){
      warn = "请输入您的具体地址";
    }else{
      flag=true;
      if(this.data.id=="0"){
      db.add({
        data:{
        name:this.data.name,
        tel:this.data.tel,
        campus:this.data.addreRange[this.data.addreValue],
        location:this.data.door,
        ifdefault:this.data.checked,
      }})
      toast.success('增加成功')
    }
    else{
      db.doc(this.data.id).update({
        data:{
          name:this.data.name,
        tel:this.data.tel,
        campus:this.data.addreRange[this.data.addreValue],
        location:this.data.door,
        },
        success: function (res) {
          toast.success("修改成功")
        }
      });
    }
      wx.navigateBack({
        delta: 0,
      })
      wx.redirectTo({
        url: '../address/address',
      })
    

    }
    if(flag==false){
      wx.showModal({
      title: '提示',
      content:warn
    })
    }
    }
})