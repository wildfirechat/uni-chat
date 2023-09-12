<template>
    <div ref="container" class="audio-message-container" :style="widthStyle" @click.prevent="playVoice">
        <p v-if="message.direction === 0" class="duration">{{ duration }}"</p>
        <div class="volume-container">
            <i v-show="!message._isPlaying" class="icon-ion-android-volume-up"></i>
            <i v-show="message._isPlaying" class="icon-ion-pause"></i>
        </div>
        <p v-if="message.direction === 1" class="duration">{{ duration }}"</p>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import store from "@/store";

export default {
    name: "AudioMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        },
    },
    data() {
        return {
            widthStyle: {
                width: '100px'
            }
        }
    },
    mounted() {
        if (this.duration) {
            let width = Math.ceil(this.duration / 60 * 300);
            width = width < 100 ? 100 : width;
            this.widthStyle.width = width + 'px';
            console.log('audio message Content', width);
        }
    },
    methods: {
        playVoice() {
            this.$set(this.message, '_isPlaying', !this.message._isPlaying)
            if (this.message._isPlaying) {
                store.playVoice(this.message)
            } else {
                store.playVoice(null)
            }
        },
    },

    computed: {
        duration() {
            let voice = this.message.messageContent;
            let times = voice.duration * 1000;
            let seconds = 0;

            if (times <= 60 * 1000) {
                seconds = Math.ceil(times / 1000);
            } else {
                seconds = 60;
            }
            return seconds;
        },
        playingDesc() {
            // TODO
        }
    },
    components: {}
}
</script>

<style lang="css" scoped>

.audio-message-container {
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    max-width: 250px;
}

.audio-message-container audio {
    outline: none;
    filter: sepia(20%) saturate(70%) grayscale(1) contrast(99%) invert(12%);
}

.volume-container {
    flex: 1;
    display: flex;
    height: 40px;
    min-width: 55px;
    background: white;
    border-radius: 5px;
    padding: 5px 10px;
    align-items: center;
}

.volume-container i {
    color: #888888;
}

.volume-container div {
    margin-top: 5px;
}

.duration {
    color: #b2b2b2;
    padding: 8px;
}

</style>
