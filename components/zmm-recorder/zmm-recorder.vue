<template>
    <view v-if="show">
        <view class="uni-padding-wrap">
            <block v-if="recording === true">
                <view class="page-body-time">
                    <text class="time-big">{{ formatRecordTime }}</text>
                </view>
                <view class="page-body-buttons">
                    <view class="page-body-button" @click="stopRecord">
                        <view class="button-stop-record"></view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>
<script>
// #ifdef APP-PLUS
import permision from "@/common/permission.js"
import store from "../../store";
import SoundMessageContent from "../../wfc/messages/soundMessageContent";
import wfc from "../../wfc/client/wfc";
// #endif
let recordTimeInterval = null;
let recorderManager = null;
export default {
    props: {
        show: {
            type: Boolean,
            default: true
        },
        conversationInfo:{
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            recording: false, //录音中
            tempFilePath: '',
            recordTime: 0,
            formatRecordTime: '00:00:00', //录音的总时间
        }
    },
    beforeDestroy: function () {
        this.clear();
    },
    mounted() {
        recorderManager = uni.getRecorderManager();
        recorderManager.onStart(() => {
            // console.log('recorder start');
            this.recording = true;
            recordTimeInterval = setInterval(() => {
                this.recordTime += 1;
                this.formatRecordTime = this.formatTime(this.recordTime);
            }, 1000)
        });
        recorderManager.onStop((res) => {
            store.state.misc.isRecording = false;
            if (this.recordTime < 1){
                uni.showToast({
                    title: '录音时间太短',
                    icon: 'none',
                });
                return;
            }

            let filePath = plus.io.convertLocalFileSystemURL(res.tempFilePath);
            let soudMessageContent = new SoundMessageContent(filePath, '', this.recordTime)
            wfc.sendConversationMessage(this.conversationInfo.conversation, soudMessageContent);

            this.recording = false;
            this.clear()
        });
        recorderManager.onError(() => {
            console.log('recorder onError');
        });
    },
    methods: {
        formatTime(time) {
            if (typeof time !== 'number' || time < 0) {
                return time
            }

            let hour = parseInt(time / 3600)
            time = time % 3600
            let minute = parseInt(time / 60)
            time = time % 60
            let second = time

            return ([hour, minute, second]).map(function (n) {
                n = n.toString()
                return n[1] ? n : '0' + n
            }).join(':')
        },
        async startRecord() { //开始录音
            // #ifdef APP-PLUS
            let status = await this.checkPermission();
            if (status !== 1) {
                return;
            }
            // #endif

            // TODO ios 在没有请求过权限之前无法得知是否有相关权限，这种状态下需要直接调用录音，但没有状态或回调判断用户拒绝
            recorderManager.start({
                duration: 60000,
                sampleRate: 44100,
                format: 'mp3'
            });
        },
        stopRecord() { //停止录音
            recorderManager.stop();

        },
        end() {
            recorderManager.stop();
            clearInterval(recordTimeInterval)
            this.recording = false;
            this.recordTime = 0;
            this.formatRecordTime = "00:00:00";
            this.formatRecordTime = "00:00:00";
        },
        clear() {
            this.end();
        }
        // #ifdef APP-PLUS
        ,
        async checkPermission() {
            let status = permision.isIOS ? await permision.requestIOS('record') :
                await permision.requestAndroid('android.permission.RECORD_AUDIO');

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
        }
        // #endif
    }
}
</script>

<style scoped>
.uni-padding-wrap {
}

image {
    width: 130rpx;
    height: 130rpx;
}

.page-body-wrapper {
    justify-content: space-between;
    flex-grow: 1;
    margin-bottom: 300rpx;
}

.page-body-time {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.time-big {
    font-size: 26rpx;
    margin: 20rpx;
}

.time-small {
    font-size: 26rpx;
}

.page-body-buttons {
    display: flex;
    justify-content: space-around;
}

.page-body-button {
    /* width: 250rpx; */
    text-align: center;
}

.button-stop-record {
    box-sizing: border-box;
    width: 130rpx;
    height: 130rpx;
    border: 20rpx solid #fff;
    background-color: #4CD964;
    border-radius: 50%;
    animation: colors 1s linear infinite;
}

@keyframes colors {
    0% {
        opacity: 1;
    }
    50% {
        opacity: .7;
    }
    100% {
        opacity: 1;
    }
}
</style>
