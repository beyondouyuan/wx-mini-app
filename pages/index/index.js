const app = getApp()
var WXBizDataCrypt = require('../../utils/WXBizDataCrypt.js')
import { requestPunch, requestSession } from '../../api/index'
import { showSuccessToast, showLoadingToast, showMessageToast, showShareAppMessage, showGroupShareAppMessage } from '../../utils/util'
import promise from '../../utils/promise'
Page({
  data: {
    userInfo: {},
    todayTxt: '今日步数',
    punchTxt: '已加入小程序',
    totalTxt: '累计打卡步数',
    shareTxt: '转发到群，查看排名',
    btnTxt: '打卡',
    btnClass: 'active',
    hasUserInfo: false,
    hasPunch: false,
    punchData: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })

    }
    this.fetchPunchData()
    this.fetchWeRunData()
  },
  onShow: function() {
    if (!this.data.hasPunch) {
      const userInfo = wx.getStorageSync('userInfo')
      console.log(userInfo)
      if (userInfo) {
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        })

      }
    }
  },
  onShareAppMessage: function(option) {
    const shareFrom = option.from
    if (shareFrom == 'menu') { // 分享小程序 ===>>> 分享出去为当前页面
       return showShareAppMessage()
    } else { // 分享到群 ===>>> 分享出去为排名页面
       return showGroupShareAppMessage()
    }

  },
  // 获取打卡步数
  fetchPunchData: function() {
    showLoadingToast()
    requestPunch().then(res => {
      if (res.code == '200') {
        this.setData({
          punchData: res.data
        })
        // 小于6666 按钮置灰
        if (this.data.punchData.todayStep < 6666) {
          this.setData({
            btnClass: 'gray'
          })
        }
      } else {
        console.log('请求出错')
      }
    }).catch(e => {
      console.log(e)
    })
  },
  // 获取微信运动数据
  fetchWeRunData: function() {
    const appId = 'wx74b8776ca155b266'
    let sessionKey;
    requestSession(app.globalData.code).then(res => {
      sessionKey = res.session_key
    })
    // wx.getWeRunData({
    //   success(res) {
    //     const encryptedData = res.encryptedData
    //     console.log(encryptedData)
    //     var pc = new WXBizDataCrypt(appId, sessionKey)
    //     console.log(pc)
    //     var data = pc.decryptData(encryptedData)
    //   },
    //   fail(res) {
    //     console.log(res)
    //   }
    // })
    const promiseWeRunData = promise(wx.getWeRunData)
    promiseWeRunData()
    .then(res => {
      if (res.errMsg == 'getWeRunData:ok') {
        const {encryptedData } = res
        const pc = new WXBizDataCrypt(appId, sessionKey)
        // console.log(pc)
        // const data = pc.decryptData(encryptedData)
        // console.log(data)
      }
    })
    .catch(e => console.error(e))
  },
  // 路由切换
  switchTo: function() {
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/sign/sign',
      })
    }, 2000)
  },
  // 打卡
  handlePunch: function() {
    if (this.data.punchData.todayStep < 6666) {
      showMessageToast('步数超过6665步才可打卡', 'none')
      return;
    }
    if (this.data.hasPunch) {
      showMessageToast('今日已打卡', 'none')
      return;
    }
    this.setData({
      hasPunch: true,
      btnClass: 'gray'
      // btnTxt: '今日已打卡',
    })
    showSuccessToast({cb: this.switchTo})
  },
  // 分享
  handleShare: function(e) {

  }
})
