import Vue from 'vue'
import App from './App'
import store from "./store";
import VueI18n from 'vue-i18n'
import {getItem} from "./pages/util/storageHelper";
import picker from "./common/picker";
import wfc from "./wfc/client/wfc";
import Config from "./config";
import forward from "./common/forward";
import pttClient from "./wfc/ptt/pttClient";
import avengineKit from "./wfc/av/engine/avengineKit";

Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(VueI18n)
Vue.use(picker)
Vue.use(forward)

const i18n = new VueI18n({
    // 使用localStorage存储语言状态是为了保证页面刷新之后还是保持原来选择的语言状态
    locale: getItem('lang') ? getItem('lang') : 'zh-CN', // 定义默认语言为中文
    messages: {
        'zh-CN': require('@/assets/lang/zh-CN.json'),
        'zh-TW': require('@/assets/lang/zh-TW.json'),
        'en': require('@/assets/lang/en.json')
    }
})

Vue.prototype.$navigateToPage = (url, options) => {
    uni.navigateTo({
        url: url,
        success: (res) => {
            res.eventChannel.emit('options', options);
        },
        fail: (e) => {
            console.log('navigate to WebViewPage error', e)
        }
    });
}

// 如果不存在会话页面，则入栈，如果已经存在会话页面，则返回到该页面
Vue.prototype.$go2ConversationPage = () => {
    let pages = getCurrentPages();
    let cvRoute = 'pages/conversation/ConversationPage'
    let delta = 0;
    let found = false;
    for (let i = pages.length - 1; i >= 0; i--) {
        if (pages[i].route === cvRoute) {
            found = true;
            break;
        } else {
            delta++;
        }
    }
    if (found) {
        uni.navigateBack({
            delta: delta,
            fail: err => {
                console.log('nav back to conversationView err', err);
            }
        });
    } else {
        uni.navigateTo({
            url: '/pages/conversation/ConversationPage',
            success: () => {
                console.log('nav to conversationPage success');

            },
            fail: (err) => {
                console.log('nav to conversationPage err', err);
            }
        })
    }
}
Vue.prototype.$scrollToBottom = () => {
    setTimeout(() => {
        uni.pageScrollTo({
            scrollTop: 999999,
            duration: 10
        });
        app.$forceUpdate()
    }, 100);
}

Vue.prototype._i18n = i18n;
const app = new Vue({
    i18n,
    ...App
})

app.store = store;
wfc.init();
if (avengineKit.isAVEngineKitEnable() && Config.ICE_SERVERS) {
    avengineKit.init();
    Config.ICE_SERVERS.forEach(iceServer => {
        avengineKit.addICEServer(iceServer.uri, iceServer.userName, iceServer.password);
    })
}
if (pttClient.isPttClientEnable()) {
    pttClient.init();
}

store.init();

app.$mount()
