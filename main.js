import {createSSRApp} from 'vue'
import App from './App'
import {createPinia} from 'pinia'
import store from "./store";
import {createI18n} from 'vue-i18n'
import picker from "./common/picker";
import wfc from "./wfc/client/wfc";
import Config from "./config";
import forward from "./common/forward";
import pttClient from "./wfc/ptt/pttClient";
import avengineKit from "./wfc/av/engine/avengineKit";
import {getItem} from "./pages/util/storageHelper";
import zhCNLang from  './assets/lang/zh-CN.json'
import zhTWLang from  './assets/lang/zh-TW.json'
import enLang from  './assets/lang/en.json'
import mitt from "mitt";
import CustomMessageConfig from "./wfc_custom_message/customMessageConfig";

const app = createSSRApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(picker)
app.use(forward)


const i18n = createI18n({
    // 使用localStorage存储语言状态是为了保证页面刷新之后还是保持原来选择的语言状态
    locale: getItem('lang') ? getItem('lang') : 'zh-CN', // 定义默认语言为中文
    allowComposition: true,
    messages: {
        'zh-CN': zhCNLang,
        'zh-TW': zhTWLang,
        'en': enLang
    }
})
app.use(i18n)

/**
 *
 * @param url
 * @param options 普通页面到 nvue 页面 或 nvue 页面到普通页面时，不生效
 */
app.config.globalProperties.$navigateToPage = (url, options) => {
    uni.navigateTo({
        url: url,
        success: (res) => {
            if (options) {
                res.eventChannel.emit('options', options);
            }
        },
        fail: (e) => {
            console.log('navigate to WebViewPage error', e)
        }
    });
}

// 如果不存在会话页面，则入栈，如果已经存在会话页面，则返回到该页面
app.config.globalProperties.$go2ConversationPage = () => {
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
app.config.globalProperties.$scrollToBottom = () => {
    setTimeout(() => {
        uni.pageScrollTo({
            scrollTop: 999999,
            duration: 10
        });
        app.$forceUpdate()
    }, 100);
}

app.config.globalProperties.$notify = (options) => {
    uni.showToast({
        title: options.text,
        icon: 'none',
    });
}

const eventBus = mitt()
eventBus.$on = eventBus.on
eventBus.$off = eventBus.off
eventBus.$emit = eventBus.emit
app.config.globalProperties.$eventBus = eventBus

app.config.globalProperties.$set = (obj, key, value) => obj[key] = value

wfc.init();
CustomMessageConfig.registerCustomMessages();
// 如果不进行初始化，则无法弹出音视频通话界面，不能进行音视频通话。
if (avengineKit.isAVEngineKitEnable()) {
    avengineKit.init();
    if (Config.ICE_SERVERS) {
        Config.ICE_SERVERS.forEach(iceServer => {
            avengineKit.addICEServer(iceServer.uri, iceServer.userName, iceServer.password);
        })
    }
}
if (pttClient.isPttClientEnable()) {
    pttClient.init();
}

store.init();

// app.store = store;
// app.use(store)
export function createApp() {
    return {
        app
    }
}
