<template>
<view>
<template name="chat-time">
    <text v-if="showTime" class="chat-list-time-style">{{time}}</text>
</template>
</view>
</template>

<style>
@import "./time.css";
</style>