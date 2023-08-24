<script>
import store from "./store";
import {getItem} from "./pages/util/storageHelper";
import wfc from "./wfc/client/wfc";
import avenginekit from "./wfc/av/internal/engine.min";

export default {
    onLaunch: function () {
        console.log("App Launch");
        // #ifdef APP-PLUS
        plus.push.getClientInfoAsync((info) => {
            let cid = info["clientid"];
            if (cid) {
                console.log('push clientId', cid);
                wfc.setDeviceToken(7, cid);
            }
        });
        // #endif
    },
    onShow: function () {
        console.log("App Show");
        store.state.misc.isAppHidden = false;
        // #ifdef H5
        let userId = getItem('userId');
        let token = getItem('token')
        if (token) {
            wfc.connect(userId, token);
            this.go2ConversationList();
        } else {
            uni.redirectTo({
                url: '/pages/login/LoginPage',
            })
        }
        // #endif
    },
    mounted() {
        // 必须
        avenginekit.setup();
    },

    onHide: function () {
        console.log("App Hide");
        store.state.misc.isAppHidden = true;
    },
    methods: {
        go2ConversationList() {
            uni.switchTab({
                url: '/pages/conversationList/ConversationListPage',
                success: () => {
                    console.log('to conversation list success');
                },
                fail: e => {
                    console.log('to conversation list error', e);
                },
                complete: () => {
                    console.log('switch tab complete')
                }
            });
        }
    }
}
</script>

<style>
/*每个页面公共css */
@import './global.css';
@import './wfc.css';
@import './static/customicons.css';
@import './assets/fonts/icomoon/style.css';

</style>
