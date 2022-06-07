<template>
<view>
<template name="chat-item-head">
    <view class="chat-item-head-super-style">
        <image class="chat-head-style" :src={headUrl}></image>
        <text v-if="unread>0" class="unread-style">{{unread<=99?unread:'99+'}}<>
    </text></text></view>
</template>
</view>
</template>

<style>
@import "./chat-item-head.css";
</style>