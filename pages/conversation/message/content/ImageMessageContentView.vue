<template>
    <div class="image-content-container">
        <img ref="thumbnail" v-show="imageLoaded === false" @click="preview(message)"
             v-bind:src="previewImageUri">
        <img ref="img" v-show="imageLoaded" @click="preview(message)" @load="onImageLoaded"
             draggable="true"
             v-bind:src="message.messageContent.remotePath">
    </div>
</template>

<script>
import Message from "../../../../wfc/messages/message";
import {scaleDown} from "../../../util/imageUtil";
import Config from "../../../../config";

export default {
    name: "ImageMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        },
        isInCompositeView: {
            default: false,
            type: Boolean,
            required: false,
        }
    },
    data() {
        return {
            imageLoaded: false,
        }
    },
    mounted() {
        let iw = this.message.messageContent.imageWidth;
        let ih = this.message.messageContent.imageHeight;
        if (iw && ih) {
            let size = scaleDown(iw, ih, 300, 300);
            if (size) {
                this.$nextTick(() => {
                    this.$refs.img.style.height = size.height + 'px';
                    this.$refs.img.style.width = size.width + 'px';
                    this.$refs.thumbnail.style.height = size.height + 'px';
                    this.$refs.thumbnail.style.width = size.width + 'px';
                })
            }
        }
    },
    methods: {
        preview(message) {
            if (this.isInCompositeView) {
                this.$parent.previewCompositeMessage(message.messageUid);
            } else {
                console.log('preview', message);
                //store.previewMessage(message, true);
                uni.previewImage({
                    current: 1,
                    urls: [this.message.messageContent.remotePath]
                });
            }
        },
        onImageLoaded() {
            this.imageLoaded = true
        }
    },
    computed: {
        previewImageUri() {
            if (this.message.messageContent.thumbnail) {
                return 'data:video/jpeg;base64,' + this.message.messageContent.thumbnail
            } else if (this.message.messageContent.localPath) {
                return 'file://' + this.message.messageContent.localPath
            } else {
                return Config.DEFAULT_THUMBNAIL_URL
            }
        }
    }
}
</script>

<style lang="css" scoped>
.image-content-container {
    margin: 0 10px;
    position: relative;
    border: 1px solid #efefef;
    border-radius: 5px;
}

.image-content-container img {
    max-height: 300px;
    max-width: 300px;
    border-radius: 5px;
    overflow: hidden;
    object-fit: scale-down;
}

.right-arrow:before {
    border-left-color: white;
}

.left-arrow:before {
    border-left-color: white;
}

</style>
