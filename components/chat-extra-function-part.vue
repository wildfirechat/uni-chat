<template name="chat-extra-function-part">
    <view class="extra-super">

        <view v-for="(item, index) in chat$input$extra$arr" :key="index" class="flex-column" style="width: 25%" @tap="_chatInput$extra$item$click$event" :data-index="index">
            <image class="extra-image-size" :src="'./../../image/chat/extra/' + item.picName + '.png'"></image>
            <text class="extra-text-size">{{item.description}}</text>
        </view>
    </view>
</template>