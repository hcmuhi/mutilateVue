import Vue from 'vue'
import App from './app.vue'

import comJs from '@/assets/js'
import '@/assets/css/index.less'

// console.log(comJs)
Vue.prototype.$http = comJs.request

new Vue({
  el: '#app',
  render: h => h(App)
})
