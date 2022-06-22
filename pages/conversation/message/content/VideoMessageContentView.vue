<template>
    <div class="video-content-container">
        <image preload="metadata"
               controls
               draggable="true"
               @click="preview"
               :src="'data:video/jpeg;base64,' + message.messageContent.thumbnail"
               />
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

.right-arrow:before {
    border-left-color: white;
}

.left-arrow:before {
    border-left-color: white;
}

</style>
