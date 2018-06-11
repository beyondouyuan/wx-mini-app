/*
* @Author: beyondouyuan
* @Date:   2018-06-10 19:39:23
* @Last Modified by:   beyondouyuan
* @Last Modified time: 2018-06-10 19:53:29
*/

const promise = fn => {
  return (obj = {}) => {
    return new Promise((resolve, reject) => {
      obj.success = function(res) {
        resolve(res)
      }
      obj.fail = function(res) {
        // reject(res)
        resolve(res)
      }
      fn(obj)
    })
  }
}

export default promise
