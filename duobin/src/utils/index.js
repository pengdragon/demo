/**
 * 取的时间字符串
 * */
export function parseTime(time, type = 0, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  let format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  if (type === 4) {
    format = '{y}-{m}-{d}'
  }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'number' && ('' + time).length === 10) {
      time = parseInt(time) * 1000
    }
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
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 取的当前时间差
 * */
export function formatTime(time, option) {
  if (typeof time !== 'string') {
    time = +time * 1000
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * 输出Excel表格
 * @参数
 * filename: String  文件名
 * header: Array  文件首行标题
 * filterList:Array 需过滤的json数据数组
 * filterVal:Array  过滤项数据数组
 * autoWidth: Boolean  表格宽度自适应
 */
export function exportExcel(filename, header, filterList, filterVal = [], autoWidth = true) {
  return new Promise((resolve, reject) => {
    import('@/vendor/Export2Excel').then(excel => {
      let data = []
      if (filterVal.length !== 0) {
        data = filterList.map(v => filterVal.map(j => {
          return v[j]
        }))
      } else {
        data = filterList
      }
      excel.export_json_to_excel({
        header,
        data,
        filename,
        autoWidth
      })
      resolve({ code: 200 })
    })
  })
}
