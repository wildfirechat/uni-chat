<template>
    <div>
        <div class="message-time-container" v-bind:class="{checked:sharedPickState.messages.indexOf(message) >= 0}">
            <p v-if="this.message._showTime" class="time">{{ message._timeStr }}</p>
            <div class="message-content-container"
                 v-bind:class="{checked:sharedPickState.messages.indexOf(message) >= 0}">
                <checkbox id="checkbox" v-if="sharedConversationState.enableMessageMultiSelection" type="checkbox"
                          class="checkbox"
                          :checked="isMessageChecked"
                          :value="message" placeholder=""/>

                <div class="message-avatar-content-container">
                    <!-- 文件的进度条有点特殊，有进度的消息的进度条有点特殊 -->
                    <!--          <button>progress...</button>-->
                    <LoadingView v-if="message.status === 0 || isDownloading"/>
                    <i v-if="message.status === 2" class="icon-ion-close-circled" style="color: red" @click="resend"/>
                    <div class="flex-column flex-align-end">
                        <MessageContentContainerView :message="message"
                                                     class="message-content-container-view"
                                                     @contextmenu.native.prevent="openMessageContextMenu($event, message)"/>
                        <QuoteMessageView v-if="quotedMessage"
                                          style="padding: 5px 0; max-width: 80%"
                                          :message="message"
                                          :quoted-message="quotedMessage"
                                          :message-digest="this.message.messageContent.quoteInfo.messageDigest"
                                          :show-close-button="false"/>
                    </div>

                    <img
                        class="avatar"
                        @click="onClickUserPortrait(message.from)"
                        draggable="false"
                        :src="message._from.portrait" alt="">
                </div>
            </div>
            <p v-if="shouldShowMessageReceipt" class="receipt" @click="showMessageReceiptDetail">
                {{ messageReceipt }}</p>
        </div>
    </div>

</template>

<script>
import Message from "@/wfc/messages/message";
import MessageContentContainerView from "@/pages/conversation/message/MessageContentContainerView";
import store from "@/store";
import LoadingView from "@/pages/common/LoadingView";
import wfc from "@/wfc/client/wfc";
import ConversationType from "@/wfc/model/conversationType";
import {gte} from "@/wfc/util/longUtil";
import MessageReceiptDetailView from "@/pages/conversation/message/MessageReceiptDetailView";
import QuoteMessageView from "@/pages/conversation/message/QuoteMessageView";
import Config from "@/config";

export default {
    name: "NormalOutMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        },
    },
    data() {
        return {
            sharedConversationState: store.state.conversation,
            sharedPickState: store.state.pick,
            highLight: false,
            quotedMessage: null,
        }
    },
    components: {
        QuoteMessageView,
        LoadingView,
        MessageContentContainerView,

    },
    mounted() {
        if (this.message.messageContent.quoteInfo) {
            let messageUid = this.message.messageContent.quoteInfo.messageUid;
            let msg = store.getMessageByUid(messageUid);
            if (!msg) {
                wfc.loadRemoteMessage(messageUid, (ms) => {
                    msg = store._patchMessage(ms[0]);
                    this.quotedMessage = msg;
                }, err => {
                    console.log('load remote message error', messageUid, err)
                })
            } else {
                this.quotedMessage = msg;
            }
        }
    },
    methods: {
        onClickUserPortrait(userId) {
            store.setCurrentFriend(this.message._from);
            uni.navigateTo({
                url: '/pages/contact/UserDetailPage',
                success: () => {
                    console.log('nav to UserDetailPage success');

                },
                fail: (err) => {
                    console.log('nav to UserDetailPage err', err);
                }
            })
        },
        resend() {
            wfc.deleteMessage(this.message.messageId);
            wfc.sendMessage(this.message);
        },
        openMessageContextMenu(event, message) {
            this.$eventBus.$emit('openMessageContextMenu', [event, message])
            this.highLight = true;
        },

        showMessageReceiptDetail() {
            let conversation = this.message.conversation;
            if (conversation.type === ConversationType.Single) {
                return;
            }

            let timestamp = this.message.timestamp;
            let readEntries = this.sharedConversationState.currentConversationRead;

            if (conversation.type === ConversationType.Group) {
                let groupMembers = wfc.getGroupMemberIds(conversation.target, false);
                if (!groupMembers || groupMembers.length === 0) {
                    // do nothing
                } else {
                    let readUserIds = [];
                    let unreadUserIds = [];
                    groupMembers.forEach(memberId => {
                        let readDt = readEntries ? readEntries.get(memberId) : 0;
                        if (readDt && gte(readDt, timestamp)) {
                            readUserIds.push(memberId);
                        } else {
                            unreadUserIds.push(memberId)
                        }
                    });
                    let readUsers = store.getUserInfos(readUserIds, conversation.target)
                    let unreadUsers = store.getUserInfos(unreadUserIds, conversation.target)

                    // TODO 消息已读页面
                    // this.$modal.show(
                    //     MessageReceiptDetailView,
                    //     {
                    //         readUsers: readUsers,
                    //         unreceiveUsers: unreadUsers,
                    //     }, {
                    //         name: 'message-receipt-detail-modal',
                    //         width: 480,
                    //         height: 300,
                    //         clickToClose: true,
                    //     }, {})
                }
            }
        },
    },

    computed: {
        messageReceipt() {
            let conversation = this.message.conversation;
            let timestamp = this.message.timestamp;
            let receiptDesc = ''
            let readEntries = this.sharedConversationState.currentConversationRead;

            if (conversation.type === ConversationType.Single) {
                let readDt = readEntries ? readEntries.get(conversation.target) : 0
                readDt = readDt ? readDt : 0;

                if (gte(readDt, timestamp)) {
                    receiptDesc = "已读";
                } else {
                    receiptDesc = "未读";
                }
            } else {
                let groupMembers = wfc.getGroupMemberIds(conversation.target, false);
                if (!groupMembers || groupMembers.length === 0) {
                    receiptDesc = '';
                } else {
                    let memberCount = groupMembers.length;
                    let readCount = 0;

                    let readUserIds = [];
                    let unreadUserIds = [];
                    groupMembers.forEach(memberId => {
                        let readDt = readEntries ? readEntries.get(memberId) : 0;
                        if (readDt && gte(readDt, timestamp)) {
                            readCount++;
                            readUserIds.push(memberId);
                        } else {
                            unreadUserIds.push(memberId)
                        }
                    });
                    receiptDesc = `已读 ${readCount}/${memberCount}`
                }
            }
            return receiptDesc;
        },

        isDownloading() {
            return store.isDownloadingMessage(this.message.messageId);
        },

        shouldShowMessageReceipt() {
            return this.sharedConversationState.isMessageReceiptEnable && ["FireRobot", Config.FILE_HELPER_ID].indexOf(this.message.conversation.target) < 0;
        },

        isMessageChecked() {
            return this.sharedPickState.messages.findIndex(m => m.messageId === this.message.messageId) >= 0;
        }
    },

}
</script>

<style lang="css" scoped>

.message-time-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.message-time-container.checked {
    background-color: #e7e7e7;
}

.message-time-container .time {
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
    color: #b4b4b4;
    font-size: 10px;
    background-color: #f3f3f3;
}

.message-time-container .receipt {
    margin-right: 70px;
    font-size: 12px;
    margin-top: -10px;
    color: #b4b4b4;
}

.message-content-container {
    width: 100%;
    display: flex;
    padding: 10px 20px;
    justify-content: space-between;
    align-items: center;
    position: relative;
}


.message-avatar-content-container {
    display: flex;
    max-width: calc(100% - 60px);
    overflow: hidden;
    /*max-height: 800px;*/
    margin-left: auto;
    text-overflow: ellipsis;
    align-items: flex-start;
}

.message-avatar-content-container .avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

.message-content-container-view.highlight {
    background-color: #dadada;
    opacity: 0.5;
    --out-arrow-color: #dadada !important;
}

</style>
