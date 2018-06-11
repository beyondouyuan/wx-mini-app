import request from '../utils/request'
import parseAPI from './api'

import { appid, secret, env } from '../config/index'

console.log(appid, secret, env)

// 获取打卡记录
export const requestPunchRecord = config => {
  const url = parseAPI('account')
  const setting = {
    method: 'GET',
    data: {
      page: 1,
      limit: 20
    }
  }
  Object.assign(setting, config)
  return request(url, setting)
    .then(res => res.data)
}

// 获取账户信息
export const requestAccountInfo = () => {
  const url = parseAPI('account')
  const setting = {
    method: 'GET'
  }
  return request(url, setting)
    .then(res => res.data)
}
// 打卡列表
export const requestPunch = () => {
  const url = parseAPI('punch')
  const setting = {
    method: 'GET'
  }
  return request(url, setting)
    .then(res => res.data)
}
// 打卡排行
export const requestRank = () => {
  const url = parseAPI('rank')
  const setting = {
    method: 'GET'
  }
  return request(url, setting)
    .then(res => res.data)
}
// 元气记录
export const requestSpirit = () => {
  const url = parseAPI('spirit')
  const setting = {
    method: 'GET'
  }
  return request(url, setting)
    .then(res => res.data)
}
// 获取token
export const requestToken = () => {
  const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx74b8776ca155b266&secret=d4166070415f565ba18eb7f76365c389'
  const setting = {
    method: 'GET'
  }
  return request(url, setting)
    .then(res => res.data)
}

// 获取会话凭证
export const requestSession = (code) => {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
  const setting = {
    method: 'GET'
  }
  return request(url, setting)
    .then(res => res.data)
}

// 获取小程序二维码
export const requestQRcode = ACCESS_TOKEN => {
  const url = `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${ACCESS_TOKEN}`
  // const url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${ACCESS_TOKEN}`
  const setting = {
    method: 'POST',
    data: {
      "path": "pages/index/index",
      "width": 430
    }
  }
  return request(url, setting)
    .then(res => res.data)
}

// 日签页
export const requestSign = () => {
  const url = parseAPI('signImg')
  const setting = {
    method: 'GET'
  }
  return request(url, setting)
    .then(res => res.data)
}
