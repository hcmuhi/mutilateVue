// 时间格式化处理  date.Format('yyyy-MM-dd hh:mm:ss')
// eslint-disable-next-line
Date.prototype.Format = function (fmtTemp) { // author: meizz
  let fmt = fmtTemp
  const o = {
    'M+': this.getMonth() + 1,                 // 月份
    'd+': this.getDate(),                    // 日
    'h+': this.getHours(),                   // 小时
    'm+': this.getMinutes(),                 // 分
    's+': this.getSeconds(),                 // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds()             // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length)) }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))) }
  }
  return fmt
}

// 除空格
// eslint-disable-next-line
String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}

// 浮点数计算误差，按照有效数字位数进行四舍五入，默认6位有效数字
Math.signFigures = function (num, rank = 6) {
  if (!num) return (0)
  const sign = num / Math.abs(num)
  const number = num * sign
  var temp = rank - 1 - Math.floor(Math.log10(number))
  let ans
  if (temp > 0) {
    ans = parseFloat(number.toFixed(temp))
  } else if (temp < 0) {
    temp = Math.pow(10, temp)
    ans = Math.round(number / temp) * temp
  } else {
    ans = Math.round(number)
  }
  return (ans * sign)
}