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
