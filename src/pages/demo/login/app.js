import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './app.vue'

import comJs from '@/common/js'

// console.log(comJs)
Vue.prototype.$http = comJs.request
Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(App)
})
