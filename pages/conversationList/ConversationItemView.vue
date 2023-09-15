<template>
    <view class="conversation-item-container">
        <view class="conversation-item">
            <view class="header">
                <img class="avatar" draggable="false" :src="conversationInfo.conversation._target.portrait" alt=""
                     @error="imgUrlAlt"/>
                <em v-if="unread > 0" class="badge" v-bind:class="{silent:conversationInfo.isSilent}">{{ unread > 99 ? '99' : unread }}</em>
            </view>
            <view class="content-container">
                <view class="title-time-container">
                    <h2 class="title single-line">{{ conversationTitle }}</h2>
                    <p class="time">{{ conversationInfo._timeStr }}</p>
                </view>
                <view class="content">
                    <p class="draft single-line" v-if="shouldShowDraft" v-html="draft"></p>
                    <p class="last-message-desc single-line" v-else>
                        <i v-if="unreadMention > 0">[有人@我]</i>
                        {{ lastMessageContent }}
                    </p>
                    <i v-if="conversationInfo.isSilent" class="icon-ion-android-notifications-off"></i>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import ConversationInfo from "../../wfc/model/conversationInfo";
import ConversationType from "../../wfc/model/conversationType";
import store from "../../store";
import Draft from "../util/draft";
import FileMessageContent from "../../wfc/messages/fileMessageContent";
import Message from "../../wfc/messages/message";
import wfc from "../../wfc/client/wfc";
import NotificationMessageContent from "../../wfc/messages/notification/notificationMessageContent";
import Config from "../../config";

export default {
    name: "ConversationItemView",
    props: {
        conversationInfo: {
            type: ConversationInfo,
            required: true,
        },
    },
    data() {
        return {
            shareConversationState: store.state.conversation,
        };
    },
    methods: {
        imgUrlAlt(e) {
            e.target.src = Config.DEFAULT_PORTRAIT_URL;
        }
    },
    computed: {
        conversationTitle() {
            let info = this.conversationInfo;
            if (info.conversation.type === ConversationType.Single) {
                return info.conversation._target._displayName;
            } else {
                return info.conversation._target.name;
            }
        },

        shouldShowDraft() {
            if (this.shareConversationState.currentConversationInfo && this.shareConversationState.currentConversationInfo.conversation.equal(this.conversationInfo.conversation)) {
                return false;
            }
            if (this.conversationInfo.unreadCount.unreadMention + this.conversationInfo.unreadCount.unreadMentionAll > 0) {
                return false;
            }
            let draft = Draft.getConversationDraftEx(this.conversationInfo);
            return draft.text.trim() !== '' || draft.quotedMessage !== null;
        },

        draft() {
            let draft = Draft.getConversationDraftEx(this.conversationInfo);
            let draftText = `<em>[${this.$t('common.draft')}]</em>` + draft.text;
            draftText = draftText.replace(/<img [:a-zA-Z0-9_+; ,\-=\/."]+>/g, '[图片]')
            draftText = draftText.replace(/&nbsp;/g, ' ');
            draftText = draftText.replace(/<br>/g, '')
            if (draft.quotedMessage) {
                draftText += '...'
            }
            return draftText;
        },

        lastMessageContent() {
            let conversationInfo = this.conversationInfo;
            if (conversationInfo.lastMessage && conversationInfo.lastMessage.messageContent) {
                let senderName = '';
                if (conversationInfo.conversation.type === 1 && conversationInfo.lastMessage.direction === 1 && !(conversationInfo.lastMessage.messageContent instanceof NotificationMessageContent)) {
                    if (conversationInfo.lastMessage._from) {
                        senderName = conversationInfo.lastMessage._from._displayName + ': ';
                    } else {
                        conversationInfo.lastMessage = store._patchMessage(conversationInfo.lastMessage, 0)
                        if (conversationInfo.lastMessage._from) {
                            senderName = conversationInfo.lastMessage._from._displayName + ': ';
                        } else {
                            senderName = '<' + conversationInfo.lastMessage.from + '>: ';
                        }
                    }
                }
                return senderName + conversationInfo.lastMessage.messageContent.digest(conversationInfo.lastMessage);
            } else {
                return '';
            }
        },

        unread() {
            let conversationInfo = this.conversationInfo;
            let unreadCount = conversationInfo.unreadCount;
            return unreadCount ? (unreadCount.unread + unreadCount.unreadMention + unreadCount.unreadMentionAll) : 0;
        },
        unreadMention() {
            let conversationInfo = this.conversationInfo;
            let unreadCount = conversationInfo.unreadCount;
            return unreadCount ? (unreadCount.unreadMention + unreadCount.unreadMentionAll) : 0;
        }
    },
};
</script>

<style scoped>
.conversation-item-container {
    padding-left: 10px;
}

.conversation-item-container:active {
    background: #d6d6d6;
}

.conversation-item {
    width: 100%;
    height: 70px;
    display: flex;
    /*border-bottom: 1px solid #eeeeee;*/
    align-items: center;
    justify-content: center;
}

.header {
    height: 100%;
    padding: 10px 10px 10px 0;
    position: relative;
}

.header .avatar {
    position: relative;
    width: 45px;
    height: 45px;
    min-width: 45px;
    min-height: 45px;
    background: #d6d6d6;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 3px;
}

.header .badge {
    position: absolute;
    color: white;
    font-size: 10px;
    background-color: red;
    border-radius: 8px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    font-style: normal;
    text-align: center;
    right: 8px;
    top: 8px;
}

.header .badge.silent {
    width: 8px;
    height: 8px;
    font-size: 0;
}

.content-container {
    width: 100%;
    height: 50px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-right: 12px;
}

.content-container .title-time-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.content-container .title-time-container .title {
    display: inline-block;
    font-size: 14px;
    color: #262626;
    font-style: normal;
    font-weight: normal;
    padding-right: 10px;
    flex: 1;
}

.content-container .title-time-container .time {
    display: inline-block;
    color: gray;
    font-size: 10px;
}

.content-container .content {
    display: flex;
    justify-content: space-between;
}

.content .draft {
    font-size: 13px;
    height: 20px;
}

/*refer to: https://blog.csdn.net/weixin_42412046/article/details/80804285*/
>>> .content .draft em {
    color: red;
    font-style: normal;
    padding-right: 5px;
}

.content .last-message-desc {
    color: #b8b8b8;
    font-size: 13px;
}

.content .last-message-desc i {
    font-style: normal;
    color: red;
}

.content i {
    color: #b8b8b8;
}


</style>
