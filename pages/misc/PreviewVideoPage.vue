<template>
    <view class="video-container">
        <video :src="url" autoplay="true" controls="false">

        </video>
    </view>
</template>

<script>
export default {
    name: "PreviewVideoPage",
    data() {
        return {
            url: '',
        }
    },

    onLoad(option) {
        console.log('onLoad option url', decodeURIComponent(option.url));
        this.url = decodeURIComponent(option.url);
    }

}
</script>

<style scoped>

.video-container {
    width: 100vw;
    height: 100vh;
    background-color: red;
}

.video-container video {
    width: 100%;
    height: 100%;
}

</style>