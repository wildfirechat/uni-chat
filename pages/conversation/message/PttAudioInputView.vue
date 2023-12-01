<template>
    <view class="TUI-message-input-main" @longpress="handleLongPress" @touchmove="handleTouchMove"
          @touchend="handleTouchEnd">
        <text>{{ text }}</text>
        <view class="record-modal" v-if="popupToggle" @longpress="handleLongPress" @touchmove="handleTouchMove"
              @touchend="handleTouchEnd">
            <view class="wrapper">
                <view class="modal-loading"></view>
            </view>
            <view class="modal-title">{{ title }}</view>
        </view>
    </view>
</template>

<script lang="js">
// #ifndef H5
import permision from "@/common/permission.js"
import pttClient from "../../../wfc/ptt/pttClient";
import TalkingCallback from "../../../wfc/ptt/talkingCallback";
// #endif

export default {
    name: 'PttAudioInputView',
    props: {
        conversationInfo: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            popupToggle: false,
            isPttRecording: false,
            text: '按住对讲',
            title: ' ',
            recordTime: 0,
            recordTimer: null,
            longPressClientY: 0,
        }
    },
    mounted() {
    },
    methods: {
        // #ifdef APP-PLUS
        async checkPermission() {
            let status = permision.isIOS ? await permision.requestIOS(['record']) :
                await permision.requestAndroid(['android.permission.RECORD_AUDIO']);
            if (status === null || status === 1) {
                status = 1;
            } else if (status === 2) {
                uni.showModal({
                    content: "系统麦克风已关闭",
                    confirmText: "确定",
                    showCancel: false,
                    success: function (res) {
                    }
                })
            } else {
                uni.showModal({
                    content: "需要麦克风权限",
                    confirmText: "设置",
                    success: function (res) {
                        if (res.confirm) {
                            permision.gotoAppSetting();
                        }
                    }
                })
            }
            return status;
        },
        // #endif
        async handleLongPress(e) {
            // #ifdef APP-PLUS
            let status = await this.checkPermission();
            if (status !== 1) {
                return;
            }
            // #endif
            this.longPressClientY = e.changedTouches[e.changedTouches.length - 1].clientY;
            this.popupToggle = true;

            let talkingCallBack = new TalkingCallback();
            talkingCallBack.onAmplitudeUpdate = averageAmplitude => {
                // TODO 展示对讲音量
            }
            talkingCallBack.onTalkingEnd = conversation => {
                this.isPttRecording = false;
                this.popupToggle = false;
                this.text = '按住对讲';
            }
            talkingCallBack.onStartTalking = conversation => {
                this.title = '正在对讲';
                this.text = '正在对讲'
                this.isPttRecording = true;
                this.recordTime = 0;
                this.recordTimer = setInterval(() => {
                    this.recordTime++;
                }, 1000);
            }
            talkingCallBack.onRequestFail = (conversation, errorCode) => {
                this.isPttRecording = false;
                this.popupToggle = false;
                this.text = '按住对讲';
            }
            pttClient.requestTalk(this.conversationInfo.conversation, 0, talkingCallBack);
            this.startPoint = e.target;

        },

        // 录音时的手势上划移动距离对应文案变化
        handleTouchMove(e) {
            if (this.isPttRecording) {
                this.title = '正在对讲';
            }
        },
        // 手指离开页面滑动
        handleTouchEnd() {
            this.isPttRecording = false;
            this.popupToggle = false;
            this.text = '按住对讲';
            console.log('xxxx handleTouchEnd')
            pttClient.releaseTalking(this.conversationInfo.conversation);
        },
    }
}
</script>

<style lang="scss" scoped>
.audio-contain {
    display: flex;
    justify-content: center;
    font-size: 32rpx;
    font-family: PingFangSC-Regular;
}

.TUI-message-input-main {
    background-color: #fff;
    flex: 1;
    height: 66rpx;
    margin: 0 10rpx;
    padding: 0 5rpx;
    border-radius: 5rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.record-modal {
    height: 300rpx;
    width: 60vw;
    background-color: #000;
    opacity: 0.8;
    position: fixed;
    top: 670rpx;
    z-index: 9999;
    left: 20vw;
    border-radius: 24rpx;
    display: flex;
    flex-direction: column;
}

.record-modal .wrapper {
    display: flex;
    height: 200rpx;
    box-sizing: border-box;
    padding: 10vw;
}

.record-modal .wrapper .modal-loading {
    opacity: 1;
    width: 40rpx;
    height: 16rpx;
    border-radius: 4rpx;
    background-color: #006fff;
    animation: loading 2s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
}

@keyframes loading {
    0% {
        transform: translate(0, 0)
    }

    50% {
        transform: translate(30vw, 0);
        background-color: #f5634a;
        width: 40px;
    }

    100% {
        transform: translate(0, 0);
    }
}

.modal-title {
    text-align: center;
    color: red;
}
</style>
