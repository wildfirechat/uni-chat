<template>
    <div class="video-content-container">
        <image controls
               @click="preview"
               :src="'data:video/jpeg;base64,' + message.messageContent.thumbnail"
               />
        <view class="wxfont play play-button"></view>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import store from "@/store";

export default {
    name: "VideoMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        },
        isInCompositeView:{
            default: false,
            type: Boolean,
            required: false,
        }
    },
    methods: {
        preview() {
            let message = this.message;
            if (this.isInCompositeView) {
                this.$parent.previewCompositeMessage(message.messageUid);
            } else {
                console.log('preview', message.messageContent.remotePath);
                uni.navigateTo({
                    url: `/pages/misc/PreviewVideoPage?url=${message.messageContent.remotePath}`,
                    fail: (e) => {
                        console.log('navigate to PreviewVideoPage error', e)
                    }
                });
            }
        },
    }
}
</script>

<style lang="css" scoped>
.video-content-container {
    margin: 0 10px;
    position: relative;
    border: 1px solid #efefef;
    border-radius: 5px;
}

.video-content-container video {
    max-height: 400px;
    max-width: 400px;
    border-radius: 5px;
    overflow: hidden;
}

.play-button{
    position: absolute;
    left: 50%;
    top: 50%;
    color: white;
    font-size: 20px;
    transform: translate(-50%, -50%);
}

.right-arrow:before {
    border-left-color: white;
}

.left-arrow:before {
    border-left-color: white;
}

</style>
