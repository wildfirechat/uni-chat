<template>
    <div class="audio-message-container" :style="widthStyle">
        <!--    <i class="icon-ion-android-volume-up"></i>-->
        <!--    <span> {{ duration }} </span>-->

        <audio style="text-align: left" :src="remotePath" :name="duration" controls @ended="onAudioComplete">
        </audio>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import Config from "@/config";
import wfc from "@/wfc/client/wfc";
import MessageStatus from "@/wfc/messages/messageStatus";

export default {
    name: "AudioMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        },

        data() {
            return {}
        },

        widthStyle() {
            return {
                width: '10px',
            }
        },
    },
    mounted() {
    },

    methods: {
        onAudioComplete() {
            if (this.message.status === MessageStatus.Unread) {
                wfc.updateMessageStatus(this.message.messageId, MessageStatus.Played);
            }
        }
    },
    computed: {
        voice() {
            return this.message.messageContent;
        },

        remotePath() {
            let voice = this.message.messageContent;
            return Config.AMR_TO_MP3_SERVER_ADDRESS + voice.remotePath;
        },

        duration() {
            let voice = this.message.messageContent;
            let times = voice.duration * 1000;
            let seconds = 0;

            if (times <= 60 * 1000) {
                seconds = Math.ceil(times / 1000);
            } else {
                seconds = 60;
            }
            return '时长：' + seconds;
        },
    }
}
</script>

<style lang="css" scoped>

.audio-message-container {
    margin: 0 10px;
}

.audio-message-container audio {
    outline: none;
    filter: sepia(20%) saturate(70%) grayscale(1) contrast(99%) invert(12%);
}

>>> .uni-audio-button.play:before{
    content: '';
}

</style>
