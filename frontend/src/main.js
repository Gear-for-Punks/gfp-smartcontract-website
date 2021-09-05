import Vue from 'vue'
import App from './App.vue'
import store from "./store/index.js";
import router from "./router.js";
import VueGtag from "vue-gtag";
import Toasted from 'vue-toasted';

import 'windi.css'

Vue.use(Toasted);
Vue.config.productionTip = false;

Vue.use(VueGtag, {
  config: { id: "G-ZBNW2Q85XG" }
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
