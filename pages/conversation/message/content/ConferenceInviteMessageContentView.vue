<template>
    <div class="conference-invite-message-container"
         @click="showConferenceInfo"
         v-bind:class="{out:message.direction === 0}">
        <div class="flex-row flex-align-center"
             @click="showConferenceInfo">
            <img class="avatar" alt="host" :src="portrait">
            <div class="flex-1">
                <p class="single-line title">{{ message.messageContent.title }} </p>
                <p class="single-line desc">{{ message.messageContent.desc }}</p>
            </div>
        </div>
        <p class="type" @click="showConferenceInfo">会议邀请</p>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import store from "@/store";
import ConversationType from "@/wfc/model/conversationType";
import avenginekitproxy from "../../../../wfc/av/engine/avenginekitproxy";

export default {
    name: "ConferenceInviteMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        }
    },
    mounted() {
    },

    methods: {
        // 不知道最外层的 click 事件为啥不生效，故加了多个 click 事件处理
        showConferenceInfo() {
            console.log('showConferenceInfo')
            let cmc = this.message.messageContent;
            avenginekitproxy.joinConference(cmc.callId, cmc.audioOnly, cmc.pin, cmc.host, cmc.title, cmc.desc, cmc.audience, cmc.advanced, false, false)
            // if (wfcUIKit.isSupportConference()) {
            //     console.log('showConferenceInfo 0')
            //     let cmc = this.message.messageContent;
            //     wfcUIKit.showConferenceInfo(cmc.callId, cmc.pin);
            //     console.log('showConferenceInfo 1')
            // } else {
            //     console.log('not support conference')
            //     uni.showToast({
            //         title: '不支持会议功能',
            //         icon: 'none',
            //     });
            // }
        }
    },

    computed: {
        textContent() {
            let conferenceInviteMessageContent = this.message.messageContent;
            return '会议邀请' + ' ' + conferenceInviteMessageContent.title + ' ' + conferenceInviteMessageContent.desc;
        },

        portrait() {
            let content = this.message.messageContent;
            let groupId = this.message.conversation.type === ConversationType.Group ? this.message.conversation.target : '';
            let userInfos = store.getUserInfos([content.host], groupId)
            return userInfos[0].portrait;
        }
    }
}
</script>

<style lang="css" scoped>
.conference-invite-message-container {
    margin: 0 10px;
    padding: 5px;
    background-color: white;
    width: 250px;
    max-width: 250px;
    position: relative;
    border-radius: 5px;
}

.avatar {
    width: 60px;
    height: 60px;
    border-radius: 3px;
    background: lightgrey;
    margin: 5px 10px;
}

.type {
    padding-top: 5px;
    margin: 5px 10px 0 10px;
    border-top: 1px solid rgba(211, 211, 211, 0.4);
    font-size: 14px;
    color: gray;
}

.title {
    font-size: 16px;
    color: black;
}

.desc {
    font-size: 14px;
    color: gray;
}

</style>
