<template>
    <view class="conversation-list" @scroll="onScroll">
        <uni-list :border="true" @scroll="onScroll">
            <view
                @click="showConversation(conversationInfo)"
                v-for="conversationInfo in sharedConversationState.conversationInfoList"
                :key="conversationInfoKey(conversationInfo)"
                v-bind:class="{active: sharedConversationState.currentConversationInfo && sharedConversationState.currentConversationInfo.conversation.equal(conversationInfo.conversation),
                          top:conversationInfo.isTop,
                          highlight:contextMenuConversationInfo && contextMenuConversationInfo.conversation.equal(conversationInfo.conversation) }"
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
            contextMenuConversationInfo: null,

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
                uni.showToast({
                    title: 'TODO 搜索',
                    icon: 'none'
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

        setConversationTop(conversationInfo) {
            store.setConversationTop(conversationInfo.conversation, !conversationInfo.isTop);
        },

        setConversationSilent(conversationInfo) {
            store.setConversationSilent(conversationInfo.conversation, !conversationInfo.isSilent);
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

        onConversationItemContextMenuClose() {
            this.contextMenuConversationInfo = null;
        },

        clearConversationUnreadStatus(conversation) {
            wfc.clearConversationUnreadStatus(conversation);
        },

        markConversationAsUnread(conversation) {
            wfc.markConversationAsUnread(conversation, true);
        },

        onScroll() {
            // TODO
        },

        showConversationContextMenu(e, conversationInfo) {
            console.log('xxxx ooooy')
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
            if (t.tag === 'delete') {
                store.removeConversation(t.conversationInfo.conversation);
            } else {
                uni.showToast({
                    title: 'TODO ' + t.title,
                    icon: 'none'
                })
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

.conversation-list ul:first-of-type li {
    background-color: #f8f8f8;
}

/*.conversation-list ul li:hover {*/
/*  background-color: #d6d6d6;*/
/*}*/

.conversation-list ul:first-of-type li.active {
    background-color: #d6d6d6;
}

.conversation-list ul:first-of-type li.top {
    background-color: #f1f1f1;
}

.conversation-list li.highlight {
    box-shadow: 0 0 0 2px #4168e0 inset;
    z-index: 100;
}

.conversation-list ul:first-of-type li.active.top {
    background-color: #d6d6d6;
}

</style>
