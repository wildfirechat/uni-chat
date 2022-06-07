<template>
    <div>
<!--        //ok <web-view src="https://wall.alva.com.cn/web-zhuizong/examples/basic.html" @message="">-->
            <web-view src="https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html" @message="">
        </web-view>
    </div>
</template>

<script>
export default {
    name: "testWebrtc",
    methods: {
        handleMessage(evt) {
            console.log('receive message', JSON.stringify(evt))
        }
    }
}
</script>

<style scoped>

</style>