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
import wfc from "../../../wfc/client/wfc";
import SoundMessageContent from "../../../wfc/messages/soundMessageContent";
// #ifndef H5
import permision from "@/common/permission.js"
// #endif

const recorderManager = uni.getRecorderManager();
export default {
    name: 'AudioInputView',
    props: {
        conversationInfo: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            popupToggle: false,
            isRecording: false,
            canSend: true,
            text: '按住说话',
            recorderManager: null,
            title: ' ',
            recordTime: 0,
            recordTimer: null,
            longPressClientY: 0,
        }
    },
    mounted() {
        // 加载声音录制管理器
        recorderManager.onStop(res => {
            clearInterval(this.recordTimer);
            // 兼容 uniapp 打包app，duration 和 fileSize 需要用户自己补充
            // 文件大小 ＝ (音频码率) x 时间长度(单位:秒) / 8
            let duration = res.duration ? res.duration / 1000 : this.recordTime * 1000;
            uni.hideLoading();
            // 兼容 uniapp 语音消息没有duration
            if (this.canSend) {
                if (duration < 1000) {
                    uni.showToast({
                        title: '录音时间太短',
                        icon: 'none'
                    });
                } else {
                    let filePath = plus.io.convertLocalFileSystemURL(res.tempFilePath);
                    let soudMessageContent = new SoundMessageContent(filePath, '', this.recordTime)
                    wfc.sendConversationMessage(this.conversationInfo.conversation, soudMessageContent);

                }
            }
            this.popupToggle = false;
            this.isRecording = false;
            this.canSend = true;
            this.title = ' ';
            this.text = '按住说话'
        });
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
            recorderManager.start({
                duration: 60000,
                // 录音的时长，单位 ms，最大值 600000（10 分钟）
                sampleRate: 44100,
                // 采样率
                // numberOfChannels: 1,
                // 录音通道数
                // encodeBitRate: 192000,
                // 编码码率
                format: 'mp3' // aac 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
            });
            this.startPoint = e.target;
            this.title = '正在录音';
            this.isRecording = true;
            this.recordTime = 0;
            this.recordTimer = setInterval(() => {
                this.recordTime++;
            }, 1000);

        },

        // 录音时的手势上划移动距离对应文案变化
        handleTouchMove(e) {
            if (this.isRecording) {
                if (Math.abs(this.longPressClientY - e.changedTouches[e.changedTouches.length - 1].clientY) > 100) {
                    this.text = '抬起停止';
                    this.title = '松开手指，取消发送';
                    this.canSend = false;
                } else if (Math.abs(this.longPressClientY - e.changedTouches[e.changedTouches.length - 1].clientY) > 20) {
                    this.text = '抬起停止';
                    this.title = '上划可取消';
                    this.canSend = true;
                } else {
                    this.text = '抬起停止';
                    this.title = '正在录音';
                    this.canSend = true;
                }
            }
        },
        // 手指离开页面滑动
        handleTouchEnd() {
            this.isRecording = false;
            this.popupToggle = false;
            this.text = '按住说话';
            uni.hideLoading();
            recorderManager.stop();

        },

    },

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
    color: #fff;
}
</style>
