<template>
    <div style="display: flex; justify-content: center">
        <div class="notification-container" @click="onClickRichNotification">
            <p class="title">{{ message.messageContent.title }}</p>
            <p class="desc">{{ message.messageContent.desc }}</p>
            <div v-if="message.messageContent.datas">
                <div v-for="(data, index) in message.messageContent.datas" :key="index" class="data">
                    <p class="key single-line">{{ data.key }}</p>
                    <p class="value">{{ data.value }}</p>
                </div>
            </div>
            <div class="ex-info-container">
                <p class="exName">{{ message.messageContent.exName }}</p>
            </div>
        </div>
    </div>
</template>

<script>

import Message from "../../../wfc/messages/message";

export default {
    name: "RichNotificationMessageContentView",
    props: {
        message: {
            type: Message,
            required: true
        }
    },

    methods: {
        onClickRichNotification() {
            console.log('onClickRichNotification');
            let targetPageUrl = '/pages/workspace/WorkspaceWebViewPage';
            this.$navigateToPage(`${targetPageUrl}?url=${encodeURIComponent(this.message.messageContent.exUrl)}`);
        }
    },
    components: {}
}
</script>

<style lang="css" scoped>
.notification-container {
    background-color: white;
    width: 600rpx;
    padding: 5px 10px;
    border-radius: 5px;
    margin: 5px 0;
}

.notification-container:active {
    background-color: lightgrey;
}

.notification-container .title {
    margin: 5px 0;
}

.desc {
    font-size: 14px;
}

.data {
    display: flex;
}

.data .key {
    width: 100px;
    font-size: 14px;
}

.data .value {
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ex-info-container {
    border-top: 1px solid lightgrey;
    padding-top: 5px;
    margin: 5px 0;
    font-size: 14px;
}

</style>
