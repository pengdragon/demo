/**
 * 创建API
 */
const api = {
  /**
   * 数组去重
   */
  uniqueArr(arr) {
    if (arr instanceof Array) {
      let set = new Set(arr)
      let uniqueArr = [...set]
      return uniqueArr
    } else {
      console.log('传入的类型不是数组')
      return
    }
  },
  /**
   * 获取时间
   */
  getTime(theDate) {
    let date = new Date(theDate)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var seconds = date.getSeconds()
    return year + '-' + this.double(month) + '-' + this.double(day) + ' ' + this.double(hour) + ':' + this.double(minute) + ':' + this.double(seconds)
  },
  double(date) {
    if (date < 10) {
      date = '0' + date
    }
    return date
  },
  /**
   * 获取日期
   */
  getDate(theDate) {
    let date = new Date(theDate)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + this.double(month) + '-' + this.double(day)
  },
  /**
   * 获取时分
   */
  getHours(theDate) {
    let date = new Date(theDate)
    var hour = date.getHours()
    var minute = date.getMinutes()
    return this.double(hour) + ':' + this.double(minute)
  },
  /**
   * 数据过滤
   * 去除多余数据
   * @param filterList:Array 可以是字符串数据/对象数据
   * @param data:Array|Object 待过滤数据
   * filterData:Array 过滤后数组
   * */
  filterData(data, filterList) {
    // 数据校验
    if (!data || !filterList || !Array.isArray(filterList)) {
      throw new Error('数据有误!')
    }
    let filterData = []
    if (Object.prototype.toString.call(data) === '[object Object]') {
      data = [data]
    }
    data.map((v) => {
      let item = {}
      filterList.map((key) => {
        if (Object.prototype.toString.call(key) === '[object Object]') {
          for (let j in key) {
            item[j] = v[j]
          }
        } else {
          item[key] = v[key]
        }
      })
      filterData.push(item)
    })
    return filterData
  }
}

export default api
