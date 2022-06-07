import Vue from 'vue'
import App from './App'
import store from "./store";
// import VueContext from 'vue-context';
import VueI18n from 'vue-i18n'
import {getItem} from "./pages/util/storageHelper";

Vue.config.productionTip = false

App.mpType = 'app'

// Vue.use(VueContext);
// Vue.component("vue-context", VueContext)

Vue.use(VueI18n)

const i18n = new VueI18n({
    // 使用localStorage存储语言状态是为了保证页面刷新之后还是保持原来选择的语言状态
    locale: getItem('lang') ? getItem('lang') : 'zh-CN', // 定义默认语言为中文
    messages: {
        'zh-CN': require('@/assets/lang/zh-CN.json'),
        'zh-TW': require('@/assets/lang/zh-TW.json'),
        'en': require('@/assets/lang/en.json')
    }
})

Vue.prototype._i18n = i18n;
const app = new Vue({
    i18n,
    ...App
})

app.store = store;
store.init();

app.$mount()
