<template>
    <view class="conversation-list" @scroll="onScroll">
        <uni-list :border="true" @scroll="onScroll">
            <view
                @click="showConversation(conversationInfo)"
                v-for="conversationInfo in sharedConversationState.conversationInfoList"
                :key="conversationInfoKey(conversationInfo)"
                v-bind:class="{top:conversationInfo.isTop }"
            >
                <ConversationItemView :conversation-info="conversationInfo" @longpress.native="showConversationContextMenu($event, conversationInfo)"/>
            </view>
        </uni-list>

        <chunLei-popups v-model="showContextMenu" :popData="contextMenuItems" @tapPopup="onContextMenuItemSelect" :x="contextMenuX" :y="contextMenuY" direction="column" theme="dark" :triangle="false" placement="bottom-start" dynamic/>
        <main-action-menu ref="mainActionMenu"></main-action-menu>
    </view>
</template>

<script>

import ConversationItemView from "./ConversationItemView";
import store from "../../store";
import wfc from "../../wfc/client/wfc";

export default {
    name: 'ConversationListView',
    data() {
        return {
            sharedConversationState: store.state.conversation,

            showContextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
            contextMenuItems: [],
        };
    },

    onShow() {
        console.log('conversationList onShow', this.sharedConversationState.conversationInfoList.length)
    },

    onNavigationBarButtonTap(e) {
        console.log('onNavigationBarButtonTap')
        switch (e.index) {
            case 0:
                this.$refs.mainActionMenu.show();
                break;
            case 1:
                uni.navigateTo({
                    url:'/pages/search/SearchPage'
                });
                // uni.showToast({
                //     title: 'TODO 搜索',
                //     icon: 'none'
                // });
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
                title: conversationInfo.isTop ? '取消置顶' : '置顶',
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
                    store.setConversationTop(t.conversationInfo.conversation, !t.conversationInfo.isTop);
                    break;
                case 'silent':
                    store.setConversationSilent(t.conversationInfo.conversation, !t.conversationInfo.isSilent);
                    break;
                case 'mark':
                    let conversation = t.conversationInfo.conversation;
                    if (t.conversationInfo._unread === 0){
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

    components: {
        ConversationItemView,
    },
};
</script>

<style lang="css" scoped>

.conversation-list {
    height: 100vh;
    overflow: auto;
}

.conversation-list .top {
    background-color: #f1f1f1;
}

</style>
