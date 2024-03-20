<script>
import store from "./store";
import {getItem} from "./pages/util/storageHelper";
import wfc from "./wfc/client/wfc";
import avengineKit from "./wfc/av/engine/avengineKit";
import conferenceManager from "./pages/voip/conference/conferenceManager";
import ConferenceInviteMessageContent from "./wfc/av/messages/conferenceInviteMessageContent";
import Message from "./wfc/messages/message";
import ForwardType from "./pages/conversation/message/forward/ForwardType";

export default {
    data() {
        return {
            wfc: null,
            avengineKit: null,
            store: null,
            conferenceManager: null,
        }
    },
    onLaunch: function () {
        console.log("App Launch");
        this.wfc = wfc;
        this.avengineKit = avengineKit;
        this.store = store;
        this.conferenceManager = conferenceManager;
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
        },

        forwardConferenceInviteMessage(callId, host, title, desc, startTime, audioOnly, defaultAudience, advance, pin) {
            let inviteMessageContent = new ConferenceInviteMessageContent(callId, host, title, desc, startTime, audioOnly, defaultAudience, advance, pin);
            console.log('invite', inviteMessageContent);
            let message = new Message(null, inviteMessageContent);
            this.$forward({
                forwardType: ForwardType.NORMAL,
                messages: [message]
            });
        },
    }
}
</script>

<style lang="css">
/*每个页面公共css */
@import './global.css';
@import './wfc.css';
/* #ifndef APP-NVUE */
@import './static/iconfonts/customicons.css';
@import './static/iconfonts/icomoon/style.css';
/* #endif */


:root {
    --uni-tabbar-height: 50px;

    /*app-plus header 和 tabbar 是原生的*/

    /* #ifdef APP-PLUS */
    --uni-page-header-height: 0;
    --page-full-height-without-header-and-tabbar: 100vh;
    --page-full-height-without-header: 100vh;
    /* #endif */

    /* #ifdef H5 */
    --uni-page-header-height: 44px;
    --page-full-height-without-header-and-tabbar: calc(100vh - 44px - 50px);
    --page-full-height-without-header: calc(100vh - 44px);
    /* #endif */
}

</style>
