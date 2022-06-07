<template>
<view>
<template name="chat-item">
    <view @longtap="onMessageLongTap" :data-item="item" style="width: 100%;display: flex;flex-direction: column;align-items: center">
        <block v-if="item.ui.type!=='notification'">
            <block data-type="template" data-is="chat-time" data-attr="showTime:item.ui.showTime,time:item.ui.time">
    <text v-if="showTime" class="chat-list-time-style">{{time}}</text>
</block>
            <block data-type="template" data-is="chat-word" data-attr="length:length,index:index,headUrl:item.ui.headUrl,isMy:item.ui.isMy,showTime:item.ui.showTime,time:item.ui.time,content:item.ui.content,type:item.ui.type,voiceDuration:item.ui.voiceDuration,isPlaying:item.ui.isPlaying,sendStatus:item.ui.sendStatus">
    <view :style="'width: 100%;display: flex;flex-direction: ' + (isMy?'row-reverse':'row') + ';margin-bottom: ' + (index===length-1?150:20) + 'rpx;margin-top: 20rpx;'">
        <image style="width: 70rpx;height: 70rpx;border-radius: 50%;margin-left: 15rpx;margin-right: 15rpx;" :src="headUrl"></image>
        <image v-if="type==='text'||type==='voice'" class="chat-list-arrow-style" :src="'./../../image/chat/popu_' + (isMy?'blue':'white') + '.png'"></image>

        <block v-if="type==='text'">
            <view v-if="type==='text'" :class="isMy?'isMyWordStyle':'isOtherWordStyle'" style="border-radius: 10rpx;padding: 20rpx;font-size: 30rpx;max-width: 60%;" @tap="chatTextItemClickEvent" :data-index="index">{{content}}</view>
        </block>

        <block v-if="type==='image'">
            <image v-if="type==='image'" class="chat-list-pic-style" :src="content" mode="aspectFill" @tap="imageClickEvent" :data-url="content"></image>
        </block>

        <block v-if="type==='voice'">
            <view :style="'width: ' + ((voiceDuration-1)*0.6+10) + '%;border-radius: 10rpx;padding: 20rpx;font-size: 30rpx;max-width: 60%;display: flex;justify-content: ' + (isMy?'flex-end':'flex-start')" :class="isMy?'isMyWordStyle':'isOtherWordStyle'" @tap="chatVoiceItemClickEvent" :data-voice-path="content" :data-voice-duration="voiceDuration" :data-is-my="isMy" :data-index="index">
                <template is="voice-item" :data="isMy:isMy,isPlaying:isPlaying"></template>
            </view>
            <view class="voice-duration-style">{{voiceDuration}}"</view>
        </block>

        <!-- todo 更多消息类型处理 -->

        <block v-if="isMy">
            <template is="chat-send-status" :data="sendStatus:sendStatus,index:index"></template>
        </block>

    </view>
</block>
        </block>
        <block v-else>
            <block data-type="template" data-is="chat-notification" data-attr="notification:item.ui.notification">
       <text class="chat-list-time-style">{{notification}}</text>
</block>
        </block>
    </view>
</template>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
    </script> 
    
									