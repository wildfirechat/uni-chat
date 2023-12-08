import {EventEmitter} from 'events';
import PttEventType from "./pttEventType";
import Conversation from "../model/conversation";
import wfc from "../client/wfc";
import PersistFlag from "../messages/persistFlag";
import PttSoundMessageContent from "./messages/pttSoundMessageContent";
import Config from "../../config";

const uniWfcPttClient = Config.ENABLE_PTT ? uni.requireNativePlugin("wf-uni-wfc-pttclient") : null;

export class PttClient {

    /**
     * 只在正常模式下生效
     * 单聊会话里面，最多允许几个人同时说话
     */
    static SINGLE_CHAT_MAX_SPEAKER_COUNT = 1;

    /**
     * 只在正常模式下生效
     * 群会话里面，最多允许几个人同时说话
     */
    static GROUP_CHAT_MAX_SPEAKER_COUNT = 3;

    // 对讲时，是否发送额外的语音消息
    static SINGLE_CHAT_SEND_VOICE_MESSAGE = true;
    static GROUP_CHAT_SEND_VOICE_MESSAGE = true;
    /**
     * 单位是秒
     */
    static SINGLE_CHAT_MAX_SPEAK_TIME = 60;

    /**
     * 单位是秒
     */
    static GROUP_CHAT_MAX_SPEAK_TIME = 60;

    /**
     * 对讲模式
     * 默认是正常模式
     * 1. 正常模式，用户可以同时播放多路对讲，一个会话里面，可以配置允许多个人同时说话
     * 2. 优先级模式，用户只能播放优先级最高的那路对讲，一个会话里面，只允许一个人说话
     */
    static ENABLE_PRIORITY_MODE = false;

    /**
     * 全局开启对讲功能，为false时，会话需要分别开启 {@link PTTClient#setEnablePtt}
     */
    static ENABLE_GLOBAL_PTT = true;

    //  是否支持双工模式，双工模式下，说话的时候，允许收听其他人的说话。
    static ENABLE_FULL_DUPLEX = false;

    eventEmitter = new EventEmitter();

    isPttClientEnable() {
        return !!uniWfcPttClient;
    }

    // 初始化
    init() {
        uniWfcPttClient.initClient({
            enableFullDuplex: PttClient.ENABLE_FULL_DUPLEX,
            enableGlobalPtt: PttClient.ENABLE_GLOBAL_PTT,
            enablePriorityMode: PttClient.ENABLE_PRIORITY_MODE,
            groupChatMaxSpeakTime: PttClient.GROUP_CHAT_MAX_SPEAK_TIME,
            groupChatMaxSpeakerCount: PttClient.GROUP_CHAT_MAX_SPEAKER_COUNT,
            groupChatSaveVoiceMessage: PttClient.SINGLE_CHAT_SEND_VOICE_MESSAGE,
            singleChatMaxSpeakTime: PttClient.SINGLE_CHAT_MAX_SPEAK_TIME,
            singleChatMaxSpeakerCount: PttClient.SINGLE_CHAT_MAX_SPEAKER_COUNT,
            singleChatSaveVoiceMessage: PttClient.SINGLE_CHAT_SEND_VOICE_MESSAGE
        });

        plus.globalEvent.addEventListener("wfc-ptt-event", (e) => {
            // console.debug('wfc-event', e);
            self._handleNativeEvent(e);
            // this.log = [this.interpreter(e), ...this.log];
        });

        wfc.registerMessageContent('pttSoundMessage', PersistFlag.Persist_And_Count, 23, PttSoundMessageContent)

        // for test
        // this._eventTest();
    }

    uninit() {
        // TODO
    }

    /**
     * 请求说话
     * @param conversation
     * @param {Number} priority 对讲优先级，默认优先级都是0，数字越高，优先级越高
     * @param {TalkingCallback} talkingCallback
     */
    requestTalk(conversation, priority, talkingCallback) {
        let strConv = JSON.stringify(conversation);
        uniWfcPttClient.requestTalk(strConv, priority,
            args => {
                talkingCallback && talkingCallback.onStartTalking(conversation)
            },
            args => {
                talkingCallback && talkingCallback.onTalkingEnd(conversation)
            },
            args => {
                talkingCallback && talkingCallback.onRequestFail(conversation, args[1])
            },
            args => {
                talkingCallback && talkingCallback.onAmplitudeUpdate(conversation, args[1])
            }
        )
    }

    // 说话结束
    releaseTalking(conversation) {
        let strConv = JSON.stringify(conversation);
        uniWfcPttClient.releaseTalking(strConv);
    }

    /**
     * 获取频道允许同时说话人数
     */
    getMaxSpeakCount(conversation) {
        let strConv = JSON.stringify(conversation);
        return uniWfcPttClient.getMaxSpeakCount(strConv);
    }

    isSendVoiceMessage(conversation) {
        // TODO
    }

    getMaxSpeakTime(conversation) {
        let strConv = JSON.stringify(conversation);
        return uniWfcPttClient.getMaxSpeakTime(strConv);
    }

    setSendVoiceMessage(conversation, send, successCB, failCB) {
        let strConv = JSON.stringify(conversation);
        uniWfcPttClient.setSaveVoiceMessage(strConv, !!send, () => {
            successCB && successCB()
        }, err => {
            failCB && failCB(err);
        })
    }

    setConversationMaxSpeakTime(conversation, duration, successCB, failCB) {
        let strConv = JSON.stringify(conversation);
        uniWfcPttClient.setConversationMaxSpeakTime(strConv, duration, () => {
            successCB && successCB()
        }, err => {
            failCB && failCB(err);
        })
    }

    setConversationMaxSpeakerCount(conversation, count, successCB, failCB) {
        let strConv = JSON.stringify(conversation);
        uniWfcPttClient.setConversationMaxSpeakerCount(strConv, count, () => {
            successCB && successCB()
        }, err => {
            failCB && failCB(err);
        })
    }

    setConversationPttSilent(conversation, silent, successCB, failCB) {
        let strConv = JSON.stringify(conversation);
        uniWfcPttClient.setConversationPttSilent(strConv, !!silent, () => {
            successCB && successCB()
        }, err => {
            failCB && failCB(err);
        })
    }

    isConversationPttSilent(conversation) {
        let strConv = JSON.stringify(conversation);
        return uniWfcPttClient.isConversationPttSilent(strConv)
    }

    getTalkingConversation() {
        // TODO
    }

    getTalkingStartTime() {
        return uniWfcPttClient.getTalkingStartTime();
    }

    getTalkingMembers(conversation) {
        let strConv = JSON.stringify(conversation);
        let members = uniWfcPttClient.getTalkingMembers(strConv);
        return JSON.parse(members);
    }

    getTalkingMemberCount(conversation) {
        let strConv = JSON.stringify(conversation);
        return uniWfcPttClient.getTalkingMemberCount(strConv);
    }

    setEnablePtt(conversation, enable) {
        let strConv = JSON.stringify(conversation);
        uniWfcPttClient.setEnablePtt(strConv, !!enable);
    }


    _nativeEvent2WfcEvent = {
        'onChannelInfoUpdate': this.onChannelInfoUpdate,
        'onClearMessage': null,
        'onConferenceEvent': this.onConferenceEvent,
        'onConnectToServer': this.onConnectToServer,
        'onConnectionStatusChange': this.onConnectionChanged,
        'onConversationDraftUpdate': null,
        'onDeleteMessage': this.onDeleteRemoteMessage,
        'onFriendListUpdate': this.onFriendListUpdate,
        'onFriendRequestUpdate': this.onFriendRequestUpdate,
        'onGroupInfoUpdate': this.onGroupInfoUpdate,
        'onGroupMembersUpdate': this.onGroupMemberUpdateListener,
        'onServiceConnected': null,
        'onMessageDelivered': this.onUserReceivedMessage,
        'onMessageRead': this.onUserReadedMessage,
        'onMessageUpdate': this.onMessageUpdate,
        'onReceiveMessage': this.onReceiveMessage,
        'onRecallMessage': this.onRecallMessage,
        'onConversationRemove': null,
        'onSettingUpdate': this.onSettingUpdate,
        'onTrafficData': null,
        'onUserInfoUpdate': this.onUserInfoUpdate,
        'onUserOnlineEvent': this.onOnlineEvent,
        // sendMessageListener
        'onSendSuccess': this.onSendSuccess,
        'onSendFail': this.onSendFail,
        'onSendPrepare': this.onSendPrepare,
        'onProgress': this.onProgress,
        'onMediaUpload': this.onMediaUpload,
    }

    _handleNativeEvent(e) {
        let args = e.args;
        console.log('native ptt event', e.args)
        let conversation = Object.assign(new Conversation(), JSON.parse(args[1]))
        this.eventEmitter.emit(args[0], conversation, ...args.slice(2))
    }

    _eventTest() {
        // //某人开始在频道中讲话
        // // function (conversation, userId) {}
        // static userStartTalking = 'userStartTalking'
        //
        // //某人结束在频道中讲话
        // // function (conversation, userId) {}
        // static userEndTalking = 'userEndTalking'
        //
        // //接收到用户自定义数据
        // // function (conversation, userId, data) {}
        // static receiveData = 'receiveData';
        //
        // //用户说话音量大小回调
        // // function (conversation, userId, averageAmplitude) {}
        // static userAmplitudeUpdate = 'userAmplitudeUpdate';
        this.eventEmitter.on(PttEventType.userStartTalking, (conversation, userId) => {
            console.log('userStartTalking', conversation, userId);
        })
        this.eventEmitter.on(PttEventType.userEndTalking, (conversation, userId) => {
            console.log('userEndTalking', conversation, userId);
        })
        this.eventEmitter.on(PttEventType.receiveData, (conversation, userId, data) => {
            console.log('receiveData', conversation, userId, data);
        })
        this.eventEmitter.on(PttEventType.userAmplitudeUpdate, (conversation, userId, averageAmplitude) => {
            console.log('userAmplitudeUpdate', conversation, userId, averageAmplitude);
        })
    }
}

const self = new PttClient();
export default self;
