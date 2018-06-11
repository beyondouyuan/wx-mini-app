import { env } from '../config/index'


const basePath = env == 'development' ?  'https://www.easy-mock.com/mock/5b1a85faa547232216e80e77/api' : 'https://prod.com/api'

const urls = {
    account: '/account',
    punch: '/punch',
    rank: '/rank',
    token: '/token',
    signImg: '/signImg',
    spirit: '/spirit'
}


// 获取对应的请求路径
const parseAPI = api => {
    return `${basePath}${urls[api]}`
}

export default parseAPI
