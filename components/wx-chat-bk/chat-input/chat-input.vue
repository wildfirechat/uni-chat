<template>
    <view>
        <view class="input-flex-column" @tap.stop>
            <view class="input-text-voice-super">
                <image :src="'../../image/chat/voice/' + (inputStatus==='voice'?'keyboard':'voice') + '.png'" class="extra-btn-style" @tap="_change$input$way$event"></image>
                <block v-if="inputStatus==='voice'">
                    <block data-type="template" data-is="voice" data-attr="voiceObj:voiceObj">
                        <button @longpress="_long$click$voice$btn" catch:touchmove="_send$voice$move$event" catch:touchend="_send$voice$move$end$event" id="send$voice$btn" hover-class="btn-voice-press">{{ voiceObj.startStatus ? '松开 结束' : '按住 说话' }}
                        </button>
                        <view v-if="voiceObj.showCancelSendVoicePart"
                              :style="'width: ' + voiceObj.voicePartWidth + 'px;height: ' + voiceObj.voicePartWidth + 'px;display: flex;position: fixed;left: ' + voiceObj.voicePartPositionToLeft + 'px;bottom: ' + voiceObj.voicePartPositionToBottom + 'px;justify-content:center;align-items: center;border-radius: 20rpx;'">
                            <view :style="'background-color:black;opacity:' + (voiceObj.status==='timeDown'?0.6:0) + ';width: 100%;height: 100%;border-radius: 20rpx;position: absolute'"></view>
                            <image :src="'./../../image/chat/voice/' + (voiceObj.status==='start'?(voiceObj.moveToCancel?'recall':'speak'):'attention') + '.png'" style="width: 100%;height: 100%;border-radius: 20rpx" v-if="voiceObj.status!=='timeDown'"></image>
                            <text style="margin-bottom:30rpx;font-size: 150rpx;text-align: center;color: white;position: relative" v-if="voiceObj.status==='timeDown'">{{ voiceObj.timeDownNum }}</text>
                            <view class="voice-record-git-status-style" v-if="!voiceObj.moveToCancel&&voiceObj.status!=='short'">
                                <image
                                    src="data:image/gif;base64,R0lGODlhOgAKAKIFAERERIWFhWVlZdbW1qampv///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFFAAFACwAAAAAOgAKAAADazi6XEUwSheqvU7ozR34YMiMgyOdBHWtGed6YUw2Dxqpq9W6GxyDs4XJBsHlAjuewPcDBBVDojGX5DF/z1JNWjjqCspeoQl8Rm1TFji8HJOd5i2660Wuw1dZnFike6svbmRZZyhpGHdKeSEJACH5BAUUAAUALAAAAAA6AAoAAANrCLpcNTBKR6q9LujNnfhgyIyAI50Dda0Z53phTDYPGqmr1bobHIOzhckGweUIO17A9xMEFUOiMZfkMX/PUk1aOOoKyl6hCXxGbVMWOLwck53mLbrrRa7DV1mcWKR7qy9uZFlnKGkYd0p5IQkAIfkEBRQABQAsAAAAADoACgAAA2soulwFMEo3qr2O6M1d+GDIjIIjnQB1rRnnemFMNg8aqavVuhscg7OFyQbB5QY7HsH3CwQVQ6Ixl+Qxf89STVo46grKXqEJfEZtUxY4vByTneYtuutFrsNXWZxYpHurL25kWWcoaRh3SnkhCQAh+QQFFAAFACwAAAAAOgAKAAADaxi6XCUwSgeqvW7ozR35YMiMgSOdAnWtGed6YUw2Dxqpq9W6GxyDs4XJBsHlADvewPcjBBVDojGX5DF/z1JNWjjqCspeoQl8Rm1TFji8HJOd5i2660Wuw1dZnFike6svbmRZZyhpGHdKeSEJACH5BAUUAAUALAAAAAA6AAoAAANrSLpcFTBKJ6q9DujN3fhgyIyEI50Bda0Z53phTDYPGqmr1bobHIOzhckGweUEOx7A9xsEFUOiMZfkMX/PUk1aOOoKyl6hCXxGbVMWOLwck53mLbrrRa7DV1mcWKR7qy9uZFlnKGkYd0p5IQkAOw=="
                                    class="voice-record-git-size-style"></image>
                            </view>
                            <text class="voice-status-style" :style="'background-color: ' + (voiceObj.moveToCancel?'#ab1900':'transparent') + ';'">
                                {{ voiceObj.status === 'start' || voiceObj.status === 'timeDown' ? (voiceObj.moveToCancel ? '松开手指，取消发送' : '手指上滑，取消发送') : (voiceObj.status === 'short' ? '说话时间太短' : '说话时间超时') }}
                            </text>
                        </view>
                    </block>
                </block>
                <input v-else-if="inputStatus==='text'" class="chat-input-style" :style="'margin-left:' + (showVoicePart?0:16) + 'rpx;'" maxlength="500" confirm-type="send" :value="textMessage" @confirm="_chatInput$send$text$message" @focus="_chatInput$bind$focus$event"
                       @blur="_chatInput$bind$blur$event" @input="_chatInput$getValue$event"></input>
                <view hover-class="press-style-opacity">
                    <view v-if="inputType==='text'" class="chat-input-send-button-style" @tap.stop="_chatInput$send$text$message02">发送</view>
                    <image v-else class="extra-btn-style" src="/static/image/chat/extra.png" @tap.stop="_chatInput$extra$click$event"></image>
                </view>


            </view>
            <block v-if="extraObj.chatInputShowExtra">
                <view class="list-divide-line"></view>
                <block data-type="template" data-is="chat-extra-function-part" data-attr="chat$input$extra$arr:extraObj.chatInputExtraArr">
                    <view class="extra-super">

                        <view v-for="(item, index) in chat$input$extra$arr" :key="index" class="flex-column" style="width: 25%" @tap="_chatInput$extra$item$click$event" :data-index="index">
                            <image class="extra-image-size" :src="'./../../image/chat/extra/' + item.picName + '.png'"></image>
                            <text class="extra-text-size">{{ item.description }}</text>
                        </view>
                    </view>
                </block>
            </block>
        </view>
    </view>
</template>

<script>
const MIN_VOICE_TIME = 1,
    MAX_VOICE_TIME = 60,
    START_TIME_DOWN = 54,
    status = {
        START: 1,
        SUCCESS: 2,
        CANCEL: 3,
        SHORT: 4,
        FAIL: 5,
        UNAUTH: 6
    },
    EVENT = {
        EXTRA_CLICK: 'extraClickEvent',
        EXTRA_ITEM_CLICK: 'extraItemClickEvent',
        VOICE_RECORD: 'voiceRecordEvent',
        SEND_MESSAGE: 'sendMessageEvent'
    };

export default {
    data() {
        return {
            windowHeight: 0,
            windowWidth: 0,
            cancelLineYPosition: 0,
            _startTimeDown: START_TIME_DOWN,
            timer: -1,
            singleVoiceTimeCount: 0,
            textMessage: '',
            voiceObj: {
                moveToCancel: false
            },
            extraObj: {
                chatInputShowExtra: false,
                chatInputExtraArr: []
            },
            inputStatus: 'text',
            inputValueEventTemp: ''
        };
    },

    components: {},
    props: {
        minVoiceTime: {
            type: Number,
            default: MIN_VOICE_TIME
        },
        maxVoiceTime: {
            type: Number,
            default: MAX_VOICE_TIME
        },
        startTimeDown: {
            type: Number,
            default: START_TIME_DOWN
        },
        tabBarHeight: {
            type: Number,
            default: 0
        },
        format: {
            type: String,
            default: 'mp3'
        },
        extraArray: {
            type: Array,
            default: () => []
        }
    },
    watch: {
        'extraArray'(value) {
            this.setData({
                'extraObj.chatInputExtraArr': value || []
            });
        },

        'startTimeDown'(startTimeDown) {
            const data = this;
            data._startTimeDown = startTimeDown && startTimeDown < data.maxVoiceTime && startTimeDown > 0 ? startTimeDown : START_TIME_DOWN;
        }

    },

    created() {
        this.recorderManager = wx.getRecorderManager();
        const {
            windowHeight,
            windowWidth
        } = wx.getSystemInfoSync();

        if (!windowHeight || !windowWidth) {
            console.error('没有获取到手机的屏幕尺寸：windowWidth', windowWidth, 'windowHeight', windowHeight);
            return;
        }

        this.windowHeight = windowHeight;
        this.windowWidth = windowWidth;
        this.cancelLineYPosition = windowHeight * 0.12;
        this.dealVoiceLongClickEventWithHighVersionFun();
        this.setVoiceListenerFun();
    },

    beforeMount() {
        this.initVoiceDataFun();
    },

    destroyed() {
        clearInterval(this.timer);
    },

    methods: {
        getRecordStatus() {
            return {
                ...status
            };
        },

        closeExtraView() {
            this.setData({
                'extraObj.chatInputShowExtra': false
            });
        },

        chatInput$extra$click$eventFun() {
            const isShow = !this.extraObj.chatInputShowExtra;
            this.setData({
                'extraObj.chatInputShowExtra': isShow
            }, () => {
                this.$emit(EVENT.EXTRA_CLICK, {
                    detail: {
                        isShow
                    }
                }, {});
            });
        },

        change$input$way$eventFun() {
            this.setData({
                'inputStatus': this.inputStatus === 'text' ? 'voice' : 'text',
                'extraObj.chatInputShowExtra': false
            });
        },

        triggerVoiceRecordEventFun({
                                       status,
                                       dataset
                                   }) {
            this.$emit(EVENT.VOICE_RECORD, {
                detail: {
                    recordStatus: status,
                    ...dataset
                }
            }, {});
        },

        long$click$voice$btnFun(e) {
            if ('send$voice$btn' === e.currentTarget.id) {
                //长按时需要打开录音功能，开始录音
                this.checkRecordAuthFun(() => {
                    const {
                        maxVoiceTime,
                        singleVoiceTimeCount
                    } = this;
                    this.setData({
                        //调出取消弹窗
                        'voiceObj.showCancelSendVoicePart': true,
                        'voiceObj.timeDownNum': maxVoiceTime - singleVoiceTimeCount,
                        'voiceObj.status': 'start',
                        'voiceObj.startStatus': 1,
                        'voiceObj.moveToCancel': false
                    }, () => {
                        this.triggerVoiceRecordEventFun({
                            status: status.START
                        });
                    });
                    this.recorderManager.start({
                        duration: 60000,
                        format: this.format
                    });
                }, res => {
                    //录音失败
                    console.error('录音拒绝授权');
                    clearInterval(timer);
                    this.endRecordFun();
                    this.setData({
                        'voiceObj.status': 'end',
                        'voiceObj.showCancelSendVoicePart': false
                    });
                    this.triggerVoiceRecordEventFun({
                        status: status.UNAUTH
                    });
                    wx.showModal({
                        title: '您未授权语音功能',
                        content: '暂时不能使用语音',
                        confirmText: '去设置',
                        success: res => {
                            if (res.confirm) {
                                wx.openSetting({
                                    success: res => {
                                        if (res.authSetting['scope.record']) {
                                            this.setData({
                                                'extraObj.chatInputShowExtra': false
                                            });
                                        }
                                    }
                                });
                            } else {
                                this.setData({
                                    'inputStatus': 'text',
                                    'extraObj.chatInputShowExtra': false
                                });
                            }
                        }
                    });
                });
            }
        },

        dealVoiceLongClickEventWithHighVersionFun() {
            this.recorderManager.onStart(() => {
                this.singleVoiceTimeCount = 0;
                const {
                    _startTimeDown,
                    maxVoiceTime
                } = this; //设置定时器计时60秒

                this.timer = setInterval(() => {
                    const voiceTimeCount = ++this.singleVoiceTimeCount;

                    if (voiceTimeCount >= _startTimeDown && voiceTimeCount < maxVoiceTime) {
                        this.setData({
                            'voiceObj.timeDownNum': maxVoiceTime - voiceTimeCount,
                            'voiceObj.status': 'timeDown'
                        });
                    } else if (voiceTimeCount >= maxVoiceTime) {
                        this.setData({
                            'voiceObj.status': 'timeout'
                        });
                        this.delayDismissCancelViewFun();
                        clearInterval(this.timer);
                        this.endRecordFun();
                    }
                }, 1000);
            });
        },

        send$voice$move$eventFun(e) {
            if ('send$voice$btn' === e.currentTarget.id) {
                const {
                        windowHeight,
                        voiceObj,
                        tabBarHeight,
                        cancelLineYPosition
                    } = this,
                    y = windowHeight + tabBarHeight - e.touches[0].clientY;

                if (y > cancelLineYPosition) {
                    if (!voiceObj.moveToCancel) {
                        this.setData({
                            'voiceObj.moveToCancel': true
                        });
                    }
                } else {
                    if (voiceObj.moveToCancel) {
                        //如果移出了该区域
                        this.setData({
                            'voiceObj.moveToCancel': false
                        });
                    }
                }
            }
        },

        send$voice$move$end$eventFun(e) {
            if ('send$voice$btn' === e.currentTarget.id) {
                const {
                    singleVoiceTimeCount,
                    minVoiceTime,
                    timer
                } = this;

                if (singleVoiceTimeCount < minVoiceTime) {
                    //语音时间太短
                    this.setData({
                        'voiceObj.status': 'short'
                    });
                    this.delayDismissCancelViewFun();
                } else {
                    //语音时间正常
                    this.setData({
                        'voiceObj.showCancelSendVoicePart': false,
                        'voiceObj.status': 'end'
                    });
                }

                clearInterval(timer);
                this.endRecordFun();
            }
        },

        initVoiceDataFun() {
            const {
                    windowWidth,
                    windowHeight
                } = this,
                width = windowWidth / 2.6;
            this.setData({
                'inputStatus': 'text',
                'windowHeight': windowHeight,
                'windowWidth': windowWidth,
                'voiceObj.status': 'end',
                'voiceObj.startStatus': 0,
                'voiceObj.voicePartWidth': width,
                'voiceObj.moveToCancel': false,
                'voiceObj.voicePartPositionToBottom': (windowHeight - width / 2.4) / 2,
                'voiceObj.voicePartPositionToLeft': (windowWidth - width) / 2
            });
        },

        delayDismissCancelViewFun() {
            setTimeout(() => {
                if (this.voiceObj.status !== 'start') {
                    this.setData({
                        'voiceObj.showCancelSendVoicePart': false,
                        'voiceObj.status': 'end'
                    });
                }
            }, 1000);
        },

        endRecordFun() {
            this.setData({
                'voiceObj.startStatus': 0
            }, () => {
                this.recorderManager.stop();
            });
        },

        chatInput$bind$focus$eventFun() {
            this.setData({
                'inputType': 'text'
            });
        },

        chatInput$send$text$messageFun(e) {
            this.setData({
                textMessage: ''
            }, () => {
                this.$emit(EVENT.SEND_MESSAGE, {
                    detail: {
                        value: e.detail.value
                    }
                });
                this.inputValueEventTemp = '';
            });
        },

        chatInput$bind$blur$eventFun() {
            setTimeout(() => {
                let obj = {};

                if (!this.inputValueEventTemp) {
                    this.inputValueEventTemp = '';
                    obj['inputType'] = 'none';
                }

                obj['extraObj.chatInputShowExtra'] = false;
                this.setData(obj);
            });
        },

        chatInput$send$text$message02Fun() {
            this.setData({
                textMessage: '',
                'inputType': 'none'
            }, () => {
                if (!!this.inputValueEventTemp) {
                    this.$emit(EVENT.SEND_MESSAGE, {
                        detail: {
                            value: this.data.inputValueEventTemp
                        }
                    });
                    this.inputValueEventTemp = '';
                }
            });
        },

        chatInput$getValue$eventFun(e) {
            const {
                detail: {
                    value: textMessage
                }
            } = e;
            this.inputValueEventTemp = textMessage;
            this.setData({
                textMessage
            });
        },

        chatInput$extra$item$click$eventFun(e) {
            const {
                currentTarget: {
                    dataset
                }
            } = e;
            this.$emit(EVENT.EXTRA_ITEM_CLICK, {
                detail: {
                    ...dataset
                }
            }, {});
        },

        setVoiceListenerFun() {
            this.recorderManager.onStop(res => {
                console.log(res, this.voiceObj.status);

                if (this.voiceObj.status === 'short') {
                    //录音时间太短或者移动到了取消录音区域， 则取消录音
                    this.triggerVoiceRecordEventFun({
                        status: status.SHORT
                    });
                    return;
                } else if (this.voiceObj.moveToCancel) {
                    this.triggerVoiceRecordEventFun({
                        status: status.CANCEL
                    });
                    return;
                }

                console.log('录音成功');
                this.triggerVoiceRecordEventFun({
                    status: status.SUCCESS,
                    dataset: res
                });
            });
            this.recorderManager.onError(res => {
                this.triggerVoiceRecordEventFun({
                    status: status.FAIL,
                    dataset: res
                });
            });
        },

        checkRecordAuthFun(cbOk, cbError) {
            wx.getSetting({
                success: res => {
                    if (!res.authSetting['scope.record']) {
                        wx.authorize({
                            scope: 'scope.record',
                            success: res => {
                                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                                console.log('同意', res);
                            },
                            fail: res => {
                                console.log('拒绝', res);
                                cbError && cbError();
                            }
                        });
                    } else {
                        cbOk && cbOk();
                    }
                }
            });
        }

    }
};
</script>
<style>
@import "chat-input.css";
</style>