import {
  env
} from '../config/index'


const basePath = env == 'development' ? 'https://www.easy-mock.com/mock/5b1a85faa547232216e80e77/api' : 'https://api.piy.fun/api/yrjj'

const urls = {
  rank: '/rank',
  login_session: '/login_session', // 更新或者获取会话session_id
  update_userinfo: '/update_userinfo', // 更新用户信息
  wx_steps: '/wx_steps', // 获取步数
  punch: '/punch', // 打卡
  history_steps: '/history_steps', // 累积打卡步数
  history_punch: '/history_punch', // 累积打卡天数
  quote: '/quote', // 获取一句话日签
  powers: '/powers', // 元气总值
  power_record: '/power_record', // 分页获取元气记录
  per_image: '/per_image',
  openid_gid: '/openid_gid',
  product_image: '/product_image',
  is_punched: '/is_punched'
}



// 获取对应的请求路径
const parseAPI = api => {
  return `${basePath}${urls[api]}`
}

export default parseAPI
