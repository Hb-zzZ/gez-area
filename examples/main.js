import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import packages from 'packages/index'

Vue.use(packages, {
  requestLabelKey: 'name',
  requestValueKey: 'code',
  request: (data) => {
    if (data.type === 'province') {
      return [
        {
          code: '440000000000',
          id: '440000000000',
          name: '广东省',
          type: 'province'
        }
      ]
    } else {
      return [
        {
          code: '440300000000',
          id: '440300000000',
          name: '深圳市',
          type: 'city'
        }
      ]
    }
  }
})

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
