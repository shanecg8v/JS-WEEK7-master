import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import jQuery from 'jquery';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

window.$ = jQuery;

Vue.component('Loading', Loading);
Vue.use(VueAxios, axios);

Vue.prototype.$ajax = axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
