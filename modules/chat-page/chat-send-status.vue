<template>
<view>
<template name="chat-send-status">
    <view class="sendStatusStyle" v-if="sendStatus!=='success'">
        <block v-if="sendStatus==='sending'">
            <template is="common-loading"></template>
        </block>
        <block v-if="sendStatus==='failed'">
            <image src="/static/image/chat/send_fail.png" class="chat-loading-common" @tap="resendMsgEvent" :data-resend-index="index"></image>
        </block>
    </view>
</template>
</view>
</template>

<style>
@import "./chat-send-status.css";
</style>