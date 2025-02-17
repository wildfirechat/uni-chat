<template>
    <div class="video-content-container">
        <image controls
               @click="preview"
               :src="thumbnailUri()"
               />
        <view class="wxfont play play-button"
              @click="preview"
        />
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import MessageStatus from "../../../../wfc/messages/messageStatus";
import Config from "../../../../config";

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
        thumbnailUri(){
            if (this.message.status === MessageStatus.Sending){
                return Config.DEFAULT_VIDEO_POSTER;
            }else {
                return 'data:video/jpeg;base64,' + this.message.messageContent.thumbnail;
            }
        },
        preview() {
            let message = this.message;
            if (this.isInCompositeView) {
                this.$parent.previewCompositeMessage(message.messageUid);
            } else {
                console.log('preview', message.messageContent.remotePath);
                uni.navigateTo({
                    url: `/pages/misc/PreviewVideoPage?url=${encodeURIComponent(message.messageContent.remotePath)}`,
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

.video-content-container image {
    max-height: 200px;
    max-width: 200px;
    border-radius: 5px;
    overflow: hidden;
}

.play-button{
    position: absolute;
    left: 50%;
    top: 50%;
    color: white;
    font-size: 60px;
    transform: translate(-50%, -50%);
}

.right-arrow:before {
    border-left-color: white;
}

.left-arrow:before {
    border-left-color: white;
}

</style>
