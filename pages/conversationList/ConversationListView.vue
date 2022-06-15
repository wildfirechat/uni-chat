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
                <ConversationItemView :conversation-info="conversationInfo" @contextmenu.prevent.native="longpressItem(conversationInfo)"/>
            </view>
        </uni-list>

        <!--        <vue-context ref="menu" v-slot="{data:conversationInfo}" v-on:close="onConversationItemContextMenuClose">-->
<!--            <li>-->
<!--                <a @click.prevent="setConversationTop(conversationInfo)">{{-->
<!--                        conversationInfo && conversationInfo.isTop ? $t('conversation.cancel_sticky_top') : $t('conversation.sticky_top')-->
<!--                    }}</a>-->
<!--            </li>-->
<!--            <li>-->
<!--                <a @click.prevent="setConversationSilent(conversationInfo)">{{-->
<!--                        conversationInfo && conversationInfo.isSilent ? $t('conversation.enable_notification') : $t('conversation.disable_notification')-->
<!--                    }}</a>-->
<!--            </li>-->
<!--            <li>-->
<!--                <a @click.prevent="removeConversation(conversationInfo)">{{ $t('common.delete') }}</a>-->
<!--            </li>-->
<!--            <li v-show="conversationInfo-->
<!--                && (!sharedConversationState.currentConversationInfo || !sharedConversationState.currentConversationInfo.conversation.equal(conversationInfo.conversation))-->
<!--                && conversationInfo._unread === 0"-->
<!--                @click.prevent="markConversationAsUnread(conversationInfo.conversation)">-->
<!--                <a>{{ $t('conversation.mark_as_unread') }}</a>-->
<!--            </li>-->
<!--            <li v-show="conversationInfo-->
<!--                && (!sharedConversationState.currentConversationInfo || !sharedConversationState.currentConversationInfo.conversation.equal(conversationInfo.conversation))-->
<!--                && conversationInfo._unread > 0"-->
<!--                @click.prevent="clearConversationUnreadStatus(conversationInfo.conversation)">-->
<!--                <a>{{ $t('conversation.mark_as_read') }}</a>-->
<!--            </li>-->
<!--        </vue-context>-->
    </view>
</template>

<script>

import ConversationItemView from "./ConversationItemView";
import store from "../../store";
import wfc from "../../wfc/client/wfc";
import UniList from "../../components/uni-list/uni-list";

export default {
    name: 'ConversationListView',
    data() {
        return {
            sharedConversationState: store.state.conversation,
            contextMenuConversationInfo: null,
        };
    },

    methods: {
        showConversation(conversationInfo) {
            store.setCurrentConversationInfo(conversationInfo);
            uni.navigateTo({
                url: '../conversation/ConversationView',
                success: () => {
                    console.log('nav to ConversationView success');

                },
                fail: (err) => {
                    console.log('nav to ConversationView err', err);
                },
                complete: ()=>{
                    console.log('nav to ConversationView complete');
                }
            });
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

        showConversationItemContextMenu(event, conversationInfo) {
            this.contextMenuConversationInfo = conversationInfo;
            console.log('showConversationItemContextMenu', conversationInfo, this.$refs.menu, this.$refs.menu.open)
            this.$refs.menu.open(event, conversationInfo)
            console.log('showConversationItemContextMenu end')
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
        longpressItem(conversationInfo){
            console.log('xxxxx, lonp', conversationInfo, this.$refs.popup.open);
            // let el = this.$refs['contextMenu-' + message.messageId][0]
            // // console.log('xxxx', this.$refs, el, el.length, el.showTab)
            // el.showTab();
        },

        onScroll(){
            // TODO
        }
    },
    activated() {
        this.scrollActiveElementCenter();
    },

    components: {
        UniList,
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
