import {
  requestOpenidGid,
  requestRank
} from '../api/index'
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const parse_time = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return parse_time
}

export const Format = datetime => {
  const date = new Date(datetime);
  const time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return '';
  } else if (time / 1000 < 60) {
    return parseInt((time / 1000)) + '秒前';
  } else if ((time / 60000) < 60) {
    return parseInt((time / 60000)) + '分钟前';
  } else if ((time / 3600000) < 24) {
    return parseInt(time / 3600000) + '个小时前';
  } else if ((time / 86400000) < 31) {
    return parseInt(time / 86400000) + '天前';
  } else if ((time / 2592000000) < 12) {
    return parseInt(time / 2592000000) + '个月前';
  } else {
    return parseInt(time / 31536000000) + '年前';
  }
}

export const showLoadingToast = (title = "加载中...") => {
  wx.showLoading({
    title,
    icon: 'loading',
    mask: true
    // duration: 2000 // 不使用延时关闭，在网络请求成功后再关闭
  })
}

export const showSuccessToast = ({
  title = '打卡成功',
  icon = 'none',
  cb
}) => {
  wx.showToast({
    title,
    icon,
    success: cb()
  })
}

export const showUpdateSuccessToast = (title = '更新成功') => {
  wx.showToast({
    title
  })
}

export const showErrorToast = (title = '操作失败') => {
  wx.showToast({
    title,
    icon: 'none'
  })
}

export const showMessageToast = (title = '有新信息', icon = 'success') => {
  wx.showToast({
    title,
    icon
  })
}

export const showShareAppMessage = () => {
  return {
    title: '一起来打卡',
    desc: '一起来打卡',
    path: `/pages/index/index`,
    success: function(res) {
      showMessageToast('分享成功', 'success')
    },
    fail: function(res) {
      showMessageToast('分享失败', 'none')
    }
  }
}

export const showGroupShareAppMessage = () => {
  return {
    title: '一起来打卡',
    desc: '一起来打卡',
    path: `/pages/rank/rank`,
    success: function(res) {
      showMessageToast('分享成功', 'success')
    },
    fail: function(res) {
      showMessageToast('分享失败', 'none')
    }
  }
}


export const isToday = timer => {
  return new Date(timer).toDateString() === new Date().toDateString() ? true : false
}


export const compare = (prop, flag = 2) => {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        // 升序
        if (flag == 1) {
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
              return 1;
          } else {
              return 0;
          }
        } else if (flag == 2) { // 降序
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
              return -1;
          } else {
              return 0;
          }
        }

    }
}








