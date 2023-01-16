import App from './App';
// vuex加载出现问题,查看uniapp环境版本，vue2用vuex vue3用pinia
// #ifndef VUE3
import Vue from 'vue';
// import store from '@/store/index.js';
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
    ...App,
	store
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
const pinia = createPinia();
export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);
  console.log('@app',app);
  return {
    app
  };
}
// #endif