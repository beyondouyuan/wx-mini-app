const app = getApp()
import {
  requestSession,
  requestUpdateuserInfo,
  requestWxSteps,
  requestHistorySteps,
  requestHistoryPunch,
  requestPunch,
  requestIsPunched
} from '../../api/index'
import {
  showSuccessToast,
  showLoadingToast,
  showMessageToast,
  showShareAppMessage,
  showGroupShareAppMessage,
  formatTime,
  parseTime
} from '../../utils/util'
import promise from '../../utils/promise'
Page({
  data: {
    userInfo: {},
    sessionId: '',
    todayTxt: '今日步数',
    punchTxt: '累计打卡天数',
    totalTxt: '累计打卡步数',
    shareTxt: '转发到群，查看排名',
    btnTxt: '打卡',
    btnClass: '',
    lock: false, // 按钮防重
    hasUserInfo: false,
    hasPunch: false,
    stepTotal: 0,
    todayStep: 0,
    punchTotal: 0
  },

  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
    }
    app.sessionIdReadyCallback = res => {
      this.setData({
        sessionId: res.session_id
      })
    }
    const sessionId = wx.getStorageSync('sessionId')
    const userInfo = wx.getStorageSync('userInfo')
    if (sessionId && userInfo) {
      this.setData({
        sessionId: sessionId,
        userInfo: userInfo,
        hasUserInfo: true
      })
      this.fetchData()
    }
  },
  onShow: function() {
    this.fetchIsPunched()
    const sessionId = wx.getStorageSync('sessionId')
    const userInfo = wx.getStorageSync('userInfo')
    if (sessionId && userInfo) {
      this.setData({
        sessionId: sessionId,
        userInfo: userInfo,
        hasUserInfo: true
      })
      this.fetchData()
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
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../auth/auth'
    })
  },
  fetchData: function() {
    this.fetchWeRunData()
    this.fetchHistorySteps()
    this.fetchHistoryPunch()
  },
  fetchIsPunched: function() {
    const sessionId = wx.getStorageSync('sessionId')
    requestIsPunched(sessionId).then(res => {
      if (res.code == '1') {
        this.setData({
          hasPunch: true,
          btnTxt: '今日已打卡',
          btnClass: 'gray',
        })
      } else {
        this.setData({
          hasPunch: false,
          btnTxt: '打卡',
          btnClass: '',
        })
      }
    })
  },
  fetchHistoryPunch: function() {
    const sessionId = this.data.sessionId
    requestHistoryPunch(sessionId).then(res => {
      this.setData({
        punchTotal: res
      })
      app.globalData.punchTotal = res
    })
  },
  fetchHistorySteps: function() {
    const sessionId = this.data.sessionId
    requestHistorySteps(sessionId).then(res => {
      this.setData({
        stepTotal: res
      })
      app.globalData.stepTotal = res
    })

  },
  // 获取打卡步数
  fetchPunchData: function() {
    showLoadingToast()
    const startTime = Date.now() // 请求开始
    requestPunch().then(res => {
      const endTime = Date.now() // 请求完成
      if (res.code == '200') {
        const requestTime = endTime - startTime // 请求时间
        // 若请求时间少于2000ms，做延时关闭处理，以防出现闪瞎眼睛
        if (requestTime < 2000) {
          setTimeout(() => {
            wx.hideLoading()
          }, 2000 - requestTime)
        } else { // 大于2000ms则立即关闭
          wx.hideLoading()
        }
        // 小于6666 按钮置灰
        if (this.data.todayStep < 6666) {
          this.setData({
            btnClass: 'gray'
          })
        }
      } else {
        wx.hideLoading()
        console.log('请求出错')
      }
    }).catch(e => {
      console.log(e)
    })
  },
  getRandom: function(n, m) {
    const c = m-n+1;
    return Math.floor(Math.random() * c + n);
  },
  // 获取微信运动数据
  fetchWeRunData: function() {
    const promiseWeRunData = promise(wx.getWeRunData)
    promiseWeRunData()
      .then(res => {
        if (res.errMsg == 'getWeRunData:ok') {
          const {
            encryptedData,
            iv
          } = res
          const params = {
            encryptedData,
            iv,
            sessionId: this.data.sessionId
          }
          requestWxSteps(params).then(res => {
            if (res.errorCode == '0') {
              const {
                stepInfoList
              } = res.data

              const list = stepInfoList.reverse().map((item, index) => {
                item.timestamp = parseTime(item.timestamp, '{y}-{m}-{d}')
                return item
              })
              this.setData({
                todayStep: list[0].step
                // todayStep: list[0].step > 6666 ? list[0].step : this.getRandom(6666, 20000)
              })
              app.globalData.todayStep = list[0].step
            }
          })
        } else {
          showMessageToast('获取微信运动数据失败！', 'none')
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
    const self = this
    if (this.data.lock) {
      showMessageToast('请勿重复打卡！', 'none')
      setTimeout(() => {
        self.setData({
          lock: false // 回复按钮
        })
      }, 1000)
      return;
    }
    if (this.data.hasPunch) {
      app.globalData.hasPunch = true
      this.setData({
        hasPunch: true,
        btnClass: 'gray',
        btnTxt: '今日已打卡',
        lock: false // 回复按钮
      })
      showMessageToast('今日已打卡', 'none')
      return;
    }
    if (this.data.todayStep < 6666) {
      showMessageToast('步数超过6665步才可打卡', 'none')
      return;
    }
    this.setData({
      lock: true
    })
    const data = {
      sessionId: this.data.sessionId,
      steps: this.data.todayStep
    }
    requestPunch(data).then(res => {
      if (!res.errcode) {
        app.globalData.hasPunch = true
        setTimeout(() => {
          self.setData({
            hasPunch: true,
            btnClass: 'gray',
            btnTxt: '今日已打卡',
            lock: false // 回复按钮
          })
        }, 2000)
        const v = 8
        const txt = `打卡成功，${v}元气值已放入“我的”`
        setTimeout(() => {
          showSuccessToast({
            title: txt,
            cb: this.switchTo
          })
        }, 1200)
      } else {
        if (res.errcode == '201') {
          self.setData({
            hasPunch: true,
            btnClass: 'gray',
            btnTxt: '今日已打卡',
            lock: false // 回复按钮
          })
          app.globalData.hasPunch = true
        }
        showMessageToast(res.msg, 'none')
      }
    })

  },
  // 分享
  handleShare: function(e) {

  }
})
