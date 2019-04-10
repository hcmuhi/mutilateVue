'use strict'

import axios from 'axios'

// import router from '@/router'
const Axios = axios.create({
  timeout: 30000
})
// http request 拦截器
Axios.interceptors.request.use(
  config => {
    if (localStorage.token) {
      config.headers.token = `${localStorage.token || 'edaec3127a0eb43ad00084005b3a96a0de69bb106c7dd9ae'}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
Axios.interceptors.response.use(
  response => {
    if (response.data.retCode === 10100) {
      localStorage.token = ''
      return response.data
    }
    return response.data
  },
  error => {
    // if (error) {
    //   router.push('/error/500')
    // }
    // Message({
    //   message: '网络超时！',
    //   type: 'warning'
    // })
    return Promise.reject(error) // 返回接口返回的错误信息
  })

function post(url, data) {
  // 接口处理
  const temp = data || {}
  temp.comNo = temp.comNo || localStorage.companyNo || '10001'
  temp.userNo = temp.userNo || localStorage.userNo || 'U1000001'
  temp.userName = temp.userName || localStorage.userName
  // 所有data 字符串两边空格
  // var temp = {a:[' 123',111,null,undefined,true],b:{c:'fgf ',d:2,e:null,f:undefined,g:true},aa: ' #24',bb:22,cc:() => {}}; // 测试去空格
  for (const key in temp) {
    // 一层遍历
    const temp1 = temp[key]
    if (typeof temp1 === 'string') {
      temp[key] = temp1.trim()
    }
    if (typeof temp1 === 'object') {
      for (const key1 in temp1) {
        // 二层遍历
        const temp2 = temp1[key1]
        if (typeof temp2 === 'string') {
          temp1[key1] = temp2.trim()
        }
        if (typeof temp2 === 'object') {
          for (const key2 in temp2) {
            // 三层遍历
            const temp3 = temp2[key2]
            if (typeof temp3 === 'string') {
              temp2[key2] = temp3.trim()
            }
          }
        }
      }
    }
  }
  // console.log(temp)
  return Axios.post(url, {
    caller: 'pcWeb',
    companyNo: localStorage.companyNo,
    param: temp,
    timestamp: new Date().getTime(),
    version: '2.0'
  })
}
function get(url, data) {
  // TODO: 过滤层未处理，所有接口都是post
  return Axios.get(url, { params: data })
}

export default {
  post,
  get
}
