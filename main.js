import App from './App'
import '@/styles/variables.scss';
import '@/styles/mixins.scss';

import PageBg from '@/components/PageBg.vue'
import VehicleSelector from '@/components/VehicleSelector.vue'

Vue.component('page-bg', PageBg)
Vue.component('vehicle-selector', VehicleSelector)

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif