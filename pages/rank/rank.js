const app = getApp()

import {
  requestRank,
  requestPunch,
  requestWxSteps,
  requestIsPunched
} from '../../api/index'
import {
  showLoadingToast,
  showMessageToast,
  parseTime,
  showGroupShareAppMessage,
  compare
} from '../../utils/util'
import promise from '../../utils/promise'
const navList = [{
  id: "today",
  index: 0,
  active: true,
  title: "今日排名"
}, {
  id: "yesterday",
  index: 1,
  active: false,
  title: "昨日排名"
}, {
  id: "week",
  index: 2,
  active: false,
  title: "本周排名"
}]
Page({
  data: {
    rankList: [],
    stepTotal: '',
    activeIndex: 0,
    navList: navList,
    page: 1,
    limit: 10,
    rankType: '今日',
    tab: 'today',
    opengid: '',
    hasPunch: true,
    userInfo: null,
    todayStep: 0
  },
  onLoad: function(option) {
    const self = this
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    // this.fetchRankData()
    this.touchDot = 0; //触摸时的原点
    this.timer = 0; //  时间记录，用于滑动时且时间小于1s则执行左右滑动
    this.interval = ""; // 记录/清理 时间记录
    this.nth = this.data.activeIndex; // 设置活动菜单的index
    this.nthMax = 3; //活动菜单的最大个数
    this.tmpFlag = true; // 判断左右滑动超出菜单最大值时不再执行滑动事件
    app.opengIdReadyCallback = res => {
      self.setData({
        opengid: res.opengid
      })
      self.fetchRankData()
    }
    app.PunchReadyCallback = res => {
      this.setData({
        hasPunch: res
      })
      // console.log(res)
    }
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
    this.fetchRankData()
    this.fetchWeRunData()
  },
  onShow: function(option) {
    this.fetchRankData()
    this.fetchWeRunData()
    this.fetchIsPunched()
  },
  onReachBottom: function() {
    this.lower()
  },
  onShareAppMessage: function(res) {
    return showGroupShareAppMessage()
  },
  fetchIsPunched: function() {
    const sessionId = wx.getStorageSync('sessionId')
    requestIsPunched(sessionId).then(res => {
      if (res.code == '1') {
        this.setData({
          hasPunch: true
        })
      } else {
        this.setData({
          hasPunch: false
        })
      }
    })
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
            sessionId: wx.getStorageSync('sessionId')
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
              })
              app.globalData.todayStep = list[0].step
            }
          })
        }
      })
      .catch(e => console.error(e))
  },
  fixedNumber: function(num) {
    const str = "" + num
    const reg = /(?=(?!\b)(\d{3})+$)/g
    return str.replace(reg, ',')
  },
  fetchRankData: function() {
    showLoadingToast()
    const startTime = Date.now() // 请求开始
    const params = {
      type: this.data.tab,
      sessionId: wx.getStorageSync('sessionId'),
      openGid: this.data.opengid
    }
    requestRank(params).then(res => {
      const endTime = Date.now() // 请求完成
      if (!res.errMsg) {
        const {
          rank
        } = res
        const requestTime = endTime - startTime // 请求时间
        if (requestTime < 2000) {
          setTimeout(() => {
            wx.hideLoading()
          }, 2000 - requestTime)
        } else { // 大于2000ms则立即关闭
          wx.hideLoading()
        }
        let stepsTotal = 0;
        for (var i = 0; i < rank.length; i++) {
          stepsTotal += Number(rank[i].steps)
        }
        const self = this
        if (!this.data.hasPunch) {
          // 过滤
          const myRank = rank.filter(function(item,index,array){   //返回数组，filter函数获取满足条件的项
          return (item.nick != self.data.userInfo.nickName);
          })
          console.log(myRank)
        }

        this.setData({
          rankList: rank,
          // stepTotal: stepsTotal > 9999 ? (stepsTotal / 10000).toFixed(2) + 'w' : stepsTotal
          stepTotal: this.fixedNumber(stepsTotal)
        })
      } else {
        wx.hideLoading()
      }
    })
  },
  handleShare: function() {

  },
  handleTap: function(e) {
    const tab = e.currentTarget.id // 请求数据类型
    const index = e.currentTarget.dataset.index // 激活项索引
    this.setData({
      activeIndex: index,
      tab: tab,
      rankType: tab == 'today' ? '今日' : tab == 'yesterday' ? '昨日' : '本周',
      page: 1 // 切换分类时总是从第一页开始
    })
    this.fetchRankData()
  },
  lower: function() {
    console.log('滑动到底部啦', new Date())
    // this.fetchRankData()
  },
  handleSwiperpage: function() {

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
      sessionId: wx.getStorageSync('sessionId'),
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
  touchStart: function(e) {
    console.log('start')
    const self = this
    this.touchDot = e.touches[0].pageX
    this.interval = setInterval(function() {
      self.timer++
    }, 100)
  },
  touchMove: function(e) {
    const self = this
    const touchMove = e.touches[0].pageX
    const dist = 40
    const mDist = touchMove - this.touchDot
    // 向左滑动
    if (mDist <= -dist && this.timer < 10) {
      //每次移动中且滑动时不超过最大值 只执行一次
      if (this.nth >= this.nthMax) {
        showLoadingToast('已经是最后一页了！')
        setTimeout(() => {
          wx.hideLoading()
        }, 600)
        return;
      }
      if (this.tmpFlag && (this.nth < this.nthMax)) {
        const menu = this.data.navList.map(function(item, index) {
          self.tmpFlag = false;
          if (item.active) { // 当前是激活项目
            self.nth = index
              ++self.nth
            item.active = self.nth > self.nthMax ? true : false
          }
          if (self.nth == index) {
            item.active = true
            self.setData({
              activeIndex: index
            })
          }
          return item
        })
        self.fetchRankData() // 刷新数据
        self.setData({
          navList: menu // 更新菜单
        })
      }

    }
    // 向右滑动
    if (mDist >= dist && this.timer < 10) {
      if (this.nth <= 0) {
        showLoadingToast('已经是第一页了！')
        setTimeout(() => {
          wx.hideLoading()
        }, 600)
        return false;
      }
      if (this.tmpFlag && this.nth > 0) {
        this.nth = --this.nth < 0 ? 0 : this.nth
        const menu = this.data.navList.map(function(item, index) {
          self.tmpFlag = false
          item.active = false
          if (self.nth == index) {
            item.active = true
            self.setData({
              activeIndex: index
            })
          }
          return item
        })
        self.fetchRankData() // 刷新数据
        self.setData({
          navList: menu // 更新菜单
        })

      }
    }
  },
  touchEnd: function(e) {
    const self = this
    clearInterval(self.interval)
    this.timer = 0
    this.tmpFlag = true
  }
})
