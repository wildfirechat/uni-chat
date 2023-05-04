<template>
    <view class="conversation-list" @scroll="onScroll">
        <view v-if="connectionStatusDesc" style="text-align: center; padding: 5px 0">{{ connectionStatusDesc}}</view>
        <uni-list :border="true" @scroll="onScroll">
            <view
                @click="showConversation(conversationInfo)"
                v-for="conversationInfo in sharedConversationState.conversationInfoList"
                :key="conversationInfoKey(conversationInfo)"
                v-bind:class="{top:conversationInfo.top }"
            >
                <ConversationItemView :conversation-info="conversationInfo" @longpress.native="showConversationContextMenu($event, conversationInfo)"/>
            </view>
        </uni-list>

        <chunLei-popups v-model="showContextMenu" :popData="contextMenuItems" @tapPopup="onContextMenuItemSelect" :x="contextMenuX" :y="contextMenuY" direction="column" theme="dark" :triangle="false" dynamic/>
        <main-action-menu ref="mainActionMenu"></main-action-menu>
    </view>
</template>

<script>

import ConversationItemView from "./ConversationItemView";
import store from "../../store";
import wfc from "../../wfc/client/wfc";
import ConnectionStatus from "../../wfc/client/connectionStatus";

export default {
    name: 'ConversationListPage',
    data() {
        return {
            sharedConversationState: store.state.conversation,
            sharedMiscState: store.state.misc,

            showContextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
            contextMenuItems: [],
        };
    },

    onShow() {
        console.log('conversationList onShow', this.sharedConversationState.conversationInfoList.length)
    },

    onHide(){
        console.log('conversationList onHide');
        this.$refs.mainActionMenu.hide();
    },

    onNavigationBarButtonTap(e) {
        console.log('onNavigationBarButtonTap')
        switch (e.index) {
            case 0:
                this.$refs.mainActionMenu.toggle();
                break;
            case 1:
                this.$refs.mainActionMenu.hide();
                uni.navigateTo({
                    url: '/pages/search/SearchPortalPage'
                });
                break;
            default:
                break;
        }
    },

    methods: {
        showConversation(conversationInfo) {
            store.setCurrentConversationInfo(conversationInfo);
            this.$go2ConversationPage();
        },

        removeConversation(conversationInfo) {
            store.removeConversation(conversationInfo.conversation);
        },

        conversationInfoKey(conversationInfo) {
            let conv = conversationInfo.conversation;
            return conv.target + '-' + conv.type + '-' + conv.line;
        },
        scrollActiveElementCenter() {
            let el = this.$el.getElementsByClassName("active")[0];
            el && el.scrollIntoView({behavior: "instant", block: "center"});
        },

        onScroll() {
            // TODO
        },

        showConversationContextMenu(e, conversationInfo) {
            this.contextMenuX = e.touches[0].clientX;
            this.contextMenuY = e.touches[0].clientY;
            this.contextMenuItems = [];

            this.contextMenuItems.push({
                title: conversationInfo.top ? '取消置顶' : '置顶',
                tag: 'top',
                conversationInfo: conversationInfo,
            })

            this.contextMenuItems.push({
                title: conversationInfo.isSilent ? '取消静音' : '静音',
                tag: 'silent',
                conversationInfo: conversationInfo,
            })

            this.contextMenuItems.push({
                title: '删除会话',
                tag: 'delete',
                conversationInfo: conversationInfo,
            })

            this.contextMenuItems.push({
                title: conversationInfo._unread === 0 ? '标记为未读' : '标记为已读',
                tag: 'mark',
                conversationInfo: conversationInfo,
            })
            this.showContextMenu = true;

        },

        onContextMenuItemSelect(t) {
            switch (t.tag) {
                case 'delete':
                    store.removeConversation(t.conversationInfo.conversation);
                    break;
                case 'top':
                    store.setConversationTop(t.conversationInfo.conversation, t.conversationInfo.top > 0 ? 0 : 1);
                    break;
                case 'silent':
                    store.setConversationSilent(t.conversationInfo.conversation, !t.conversationInfo.isSilent);
                    break;
                case 'mark':
                    let conversation = t.conversationInfo.conversation;
                    if (t.conversationInfo._unread === 0) {
                        wfc.markConversationAsUnread(conversation, true);
                    } else {
                        wfc.clearConversationUnreadStatus(conversation);
                    }
                    break;
                default:
                    uni.showToast({
                        title: 'TODO ' + t.title,
                        icon: 'none'
                    })
                    break;

            }
        }
    },
    activated() {
        this.scrollActiveElementCenter();
    },

    computed: {
        connectionStatusDesc() {
            let desc = '';
            switch (this.sharedMiscState.connectionStatus) {
                case ConnectionStatus.ConnectionStatusConnecting:
                    desc = '正在连接...';
                    break;
                case ConnectionStatus.ConnectionStatusReceiveing:
                    desc = '正在同步...';
                    break;
                case ConnectionStatus.ConnectionStatusConnected:
                    desc = '';
                    break;
                case ConnectionStatus.ConnectionStatusUnconnected:
                    desc = '连接失败';
                    break;
            }
            return desc;
        }
    },

    components: {
        ConversationItemView,
    },
};
</script>

<style lang="css" scoped>

.conversation-list {
    height: 100vh;
    overflow: auto;
    background: #f3f3f3;
}

.conversation-list .top {
    background-color: #f1f1f1;
}

</style>