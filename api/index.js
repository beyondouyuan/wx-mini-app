import request from '../utils/request'
import parseAPI from './api'

import { appid, secret, env } from '../config/index'

// 打卡
export const requestPunch = data => {
  const url = parseAPI('punch')
  const setting = {
    method: 'POST',
    data: {
      ...data
    }
  }
  return request(url, setting)
    .then(res => res.data)
}
// 累积打卡步数
export const requestHistorySteps = sessionId => {
  const url = parseAPI('history_steps')
  const setting = {
    method: 'POST',
    data: {
      sessionId
    }
  }
  return request(url, setting)
    .then(res => res.data)
}
// 累积打卡天数
export const requestHistoryPunch = sessionId => {
  const url = parseAPI('history_punch')
  const setting = {
    method: 'POST',
    data: {
      sessionId
    }
  }
  return request(url, setting)
    .then(res => res.data)
}
// 获取一句话日签
export const requestQuote = () => {
  const url = parseAPI('quote')
  const setting = {
    method: 'POST'
  }
  return request(url, setting)
    .then(res => res.data)
}
// 元气总值
export const requestPowers = sessionId => {
  const url = parseAPI('powers')
  const setting = {
    method: 'POST',
    data: {
      sessionId
    }
  }
  return request(url, setting)
    .then(res => res.data)
}
// 分页获取元气记录
export const requestPowerRecord = (sessionId,page) => {
  const url = parseAPI('power_record')
  const setting = {
    method: 'GET',
    data: {
      sessionId,
      page
    }
  }
  return request(url, setting)
    .then(res => res.data)
}



// 打卡排行
export const requestRank = data => {
  const url = parseAPI('rank')
  const setting = {
    method: 'POST',
    data: {
      ...data
    }
  }
  return request(url, setting)
    .then(res => res.data)
}


// 获取会话凭证
export const requestSession = code => {
  const url = parseAPI('login_session')
  const setting = {
    method: 'POST',
    data: {
      code
    }
  }
  return request(url, setting)
    .then(res => res.data)
}

// 更新用户信息

export const requestUpdateuserInfo = userInfo => {
  const url = parseAPI('update_userinfo')
  const setting = {
    method: 'POST',
    data: {
      ...userInfo
    }
  }
  return request(url, setting)
    .then(res => res.data)
}
// 获取微信步数
export const requestWxSteps = data => {
  const url = parseAPI('wx_steps')
  const setting = {
    method: 'POST',
    data: {
      ...data
    }
  }
  return request(url, setting)
    .then(res => res.data)
}



// 日签页
export const requestPerImage = () => {
  const url = parseAPI('per_image')
  const setting = {
    method: 'POST'
  }
  return request(url, setting)
    .then(res => res.data)
}

export const requestOpenidGid = data => {
  const url = parseAPI('openid_gid')
  const setting = {
    method: 'POST',
    data: {
      ...data
    }
  }
  return request(url, setting)
    .then(res => res.data)

}
