<template>
    <div class="container">
        <div class="message-time-container"
             v-bind:class="{checked:sharedPickState.messages.indexOf(message) >= 0}">
            <p v-if="this.message._showTime" class="time">{{ message._timeStr }}</p>
            <div class="message-avatar-content-container">
                <div class="avatar-container">
                    <checkbox id="checkbox" v-if="sharedConversationState.enableMessageMultiSelection" type="checkbox"
                              :value="message"
                              :checked="isMessageChecked"/>
                    <img
                        @click="onClickUserPortrait(message.from)"
                        class="avatar"
                        draggable="false"
                        :src="message._from.portrait" alt="">
                </div>
                <!--消息内容 根据情况，if-else-->
                <div class="message-name-content-container">
                    <p class="name">{{ message._from._displayName }}</p>
                    <div class="flex-column flex-align-start">
                        <div class="flex-row">
                            <MessageContentContainerView class="message-content-container"
                                                         :message="message"
                                                         @contextmenu.prevent="openMessageContextMenu($event, message)"/>
                            <!--                            <LoadingView v-if="isDownloading"/>-->
                        </div>
                        <QuoteMessageView style="padding: 5px 0; max-width: 80%"
                                          v-if="quotedMessage"
                                          :message="message"
                                          :quoted-message="quotedMessage"
                                          :message-digest="this.message.messageContent.quoteInfo.messageDigest"
                                          :show-close-button="false"/>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import MessageContentContainerView from "@/pages/conversation/message/MessageContentContainerView";
import QuoteMessageView from "@/pages/conversation/message/QuoteMessageView";
import LoadingView from "@/pages/common/LoadingView";
import store from "@/store";
import wfc from "@/wfc/client/wfc";

export default {
    name: "NormalInMessageContentView",
    props: {
        message: null,
    },
    data() {
        return {
            sharedConversationState: store.state.conversation,
            sharedPickState: store.state.pick,
            highLight: false,
            quotedMessage: null,
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
        openMessageContextMenu(event, message) {
            this.$eventBus.$emit('openMessageContextMenu', [event, message])
            this.highLight = true;
        },
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
    computed: {
        isDownloading() {
            return store.isDownloadingMessage(this.message.messageId);
        },

        isMessageChecked() {
            return this.sharedPickState.messages.findIndex(m => m.messageId === this.message.messageId) >= 0;
        }
    },
    components: {
        MessageContentContainerView,
        QuoteMessageView,
        LoadingView
    },
}
</script>

<style lang="css" scoped>

.container {
    display: flex;
    align-items: flex-start;
}

.message-time-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    align-items: flex-start;
}

.message-time-container .time {
    align-self: center;
    margin-bottom: 20px;
    color: #b4b4b4;
    height: 20px;
    font-size: 10px;
}

.message-time-container.checked {
    background-color: #e7e7e7;
}

.message-avatar-content-container {
    display: flex;
    max-width: calc(100% - 60px);
    align-items: flex-start;
    overflow: hidden;
    /*max-height: 800px;*/
    text-overflow: ellipsis;
}

.avatar-container .avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

.avatar-container {
    display: flex;
    padding-left: 2px;
    align-items: center;
}

.avatar-container input {
    margin-right: 20px;
    flex: 1;
}

.message-name-content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.message-name-content-container .name {
    margin-left: 10px;
    color: #bdbdbd;
    font-size: 12px;
    margin-bottom: 2px;
}

.message-content-container.highlight {
    background-color: #dadada;
    opacity: 0.5;
    --in-arrow-color: #dadada !important;
}

</style>
