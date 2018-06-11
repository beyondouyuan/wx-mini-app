const app = getApp()

import { requestRank } from '../../api/index'
import { showLoadingToast, showGroupShareAppMessage } from '../../utils/util'
const navList = [{
  id: "day",
  title: "今日排名"
}, {
  id: "week",
  title: "本周排名"
}, {
  id: "month",
  title: "本月排名"
}]
Page({
  data: {
    rankList: [],
    stepTotal: '',
    activeIndex: 0,
    navList: navList,
    page: 1,
    limit: 10,
    tab: 'day'
  },
  onLoad: function() {
    this.fetchRankData()
  },
  onReachBottom: function() {
    this.lower()
    console.log('上拉刷新', new Date())
  },
  onShareAppMessage: function(res) {
    return showGroupShareAppMessage()
  },
  fetchRankData: function() {
    showLoadingToast()
    requestRank().then(res => {
      if (res.code == '200') {
        console.log(res)
        this.setData({
          rankList: res.list,
          stepTotal: res.stepTotal
        })
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
      page: 1 // 切换分类时总是从第一页开始
    })
    this.fetchRankData()
  },
  lower: function() {
    console.log('滑动到底部啦', new Date())
    // this.fetchRankData()
  }
})
