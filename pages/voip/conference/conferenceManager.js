import conferenceApi from "../../../api/conferenceApi";
import MessageContentType from "../../../wfc/messages/messageContentType";
import ConferenceCommandMessageContent from "../../../wfc/av/messages/conferenceCommandMessageContent";
import Conversation from "../../../wfc/model/conversation";
import ConversationType from "../../../wfc/model/conversationType";
import wfc from "../../../wfc/client/wfc";
import EventType from "../../../wfc/client/wfcEvent";
import {getItem, setItem} from "../../util/storageHelper";

class ConferenceManager {

    constructor() {
    }

    vueInstance;

    conferenceInfo = {};
    applyingUnmuteAudioMembers = [];
    applyingUnmuteVideoMembers = [];
    isApplyingUnmuteAudio = false;
    isApplyingUnmuteVideo = false;
    handUpMembers = [];
    isHandUp = false;
    isMuteAll = false;

    allowUnmuteAudio = false;
    allowUnmuteVideo = false;

    currentFocusUser = null;
    localFocusUser = null;

    selfUserId = null;

    setup(app, conferencePage) {
        this.vueInstance = app;
        this.conferencePage = conferencePage;
        this.selfUserId = app.wfc.getUserId();
        this.vueInstance.wfc.eventEmitter.on(EventType.ReceiveMessage, this.onReceiveMessage);
    }

    destroy() {
        if (!this.vueInstance){
            return
        }
        console.log('conferenceManager destroy')
        this.vueInstance.wfc.eventEmitter.removeListener(EventType.ReceiveMessage, this.onReceiveMessage);
        if (this.conferenceInfo) {
            this.vueInstance.wfc.quitChatroom(this.conferenceInfo.conferenceId);
        }
        this.conferencePage = null;
        this.vueInstance = null;
        this.conferenceInfo = null;
        this.applyingUnmuteAudioMembers = [];
        this.applyingUnmuteVideoMembers = [];
    }

    setConferenceInfo(conferenceInfo) {
        this.conferenceInfo = conferenceInfo;
        this.vueInstance.wfc.joinChatroom(this.conferenceInfo.conferenceId, () => {
            console.log('join conference chatroom success')
        }, err => {
            console.log('join conference chatroom error', err)
        });
    }

    getConferenceInfo(conferenceId) {
        // TODO password
        conferenceApi.queryConferenceInfo(conferenceId, '')
            .then(info => {
                this.conferenceInfo = info;
            })
            .catch(err => {
                console.log(err)
            })
    }

    onReceiveMessage = (msg) => {
        // msg = this._fixLongSerializedIssue(msg)
        console.log('conferenceManager onReceiveMessage 000', msg, this.conferenceInfo);
        if (!this.conferenceInfo) {
            return;
        }
        if (msg.messageContent.type === MessageContentType.CONFERENCE_CONTENT_TYPE_COMMAND && this.conferenceInfo.conferenceId === msg.messageContent.conferenceId) {
            let command = msg.messageContent;
            let senderName;
            switch (command.commandType) {
                case ConferenceCommandMessageContent.ConferenceCommandType.MUTE_ALL_AUDIO:
                    this._reloadCurrentConferenceInfo();
                    this.onMuteAll(true);
                    this.allowUnmuteAudio = command.boolValue;
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.MUTE_ALL_VIDEO:
                    this._reloadCurrentConferenceInfo();
                    this.onMuteAll(false);
                    this.allowUnmuteVideo = command.boolValue;
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.CANCEL_MUTE_ALL_AUDIO:
                    this._reloadCurrentConferenceInfo();
                    this.onCancelMuteAll(true, command.boolValue);
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.CANCEL_MUTE_ALL_VIDEO:
                    this._reloadCurrentConferenceInfo();
                    this.onCancelMuteAll(false, command.boolValue);
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.REQUEST_MUTE_AUDIO:
                    if (command.targetUserId === this.selfUserId) {
                        this.onRequestMute(true, command.boolValue);
                    }
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.REQUEST_MUTE_VIDEO:
                    if (command.targetUserId === this.selfUserId) {
                        this.onRequestMute(false, command.boolValue);
                    }
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.REJECT_UNMUTE_AUDIO_REQUEST:
                    this.vueInstance.$notify({
                        text: '主持人拒绝了你的发言请求',
                        type: 'info'
                    });
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.REJECT_UNMUTE_VIDEO_REQUEST:
                    this.vueInstance.$notify({
                        text: '主持人拒绝了你的打开摄像头请求',
                        type: 'info'
                    });
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.APPLY_UNMUTE_AUDIO:
                    senderName = wfc.getUserDisplayName(msg.from);
                    if (command.boolValue) {
                        this.applyingUnmuteAudioMembers.filter(uid => uid !== msg.from)
                    } else {
                        let index = this.applyingUnmuteAudioMembers.findIndex(uid => uid === msg.from);
                        if (index === -1) {
                            this.applyingUnmuteAudioMembers.push(msg.from);
                        }
                        this.vueInstance.$notify({
                            text: senderName + '请求发言',
                            type: 'info'
                        });
                    }
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.APPLY_UNMUTE_VIDEO:
                    senderName = wfc.getUserDisplayName(msg.from);
                    if (command.boolValue) {
                        this.applyingUnmuteVideoMembers.filter(uid => uid !== msg.from)
                    } else {
                        let index = this.applyingUnmuteVideoMembers.findIndex(uid => uid === msg.from);
                        if (index === -1) {
                            this.applyingUnmuteVideoMembers.push(msg.from);
                        }
                        this.vueInstance.$notify({
                            text: senderName + '请求打开摄像头',
                            type: 'info'
                        });
                    }
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.APPROVE_UNMUTE_AUDIO:
                case ConferenceCommandMessageContent.ConferenceCommandType.APPROVE_ALL_UNMUTE_AUDIO:
                    if (this.isApplyingUnmuteAudio) {
                        this.isApplyingUnmuteAudio = false;
                        if (command.boolValue) {
                            this.conferencePage.enableAudio(true);
                            this.vueInstance.$notify({
                                text: '主持人已同意了你的发言请求',
                                type: 'info'
                            });
                        }
                    }
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.APPROVE_UNMUTE_VIDEO:
                case ConferenceCommandMessageContent.ConferenceCommandType.APPROVE_ALL_UNMUTE_VIDEO:
                    if (this.isApplyingUnmuteVideo) {
                        this.isApplyingUnmuteVideo = false;
                        if (command.boolValue) {
                            this.conferencePage.enableVideo(true);
                            this.vueInstance.$notify({
                                text: '主持人已同意了你的打开摄像头请求',
                                type: 'info'
                            });
                        }
                    }
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.HANDUP:
                    if (command.boolValue) {
                        let index = this.handUpMembers.findIndex(uid => uid === msg.from);
                        if (index === -1) {
                            this.handUpMembers.push(msg.from);
                        }
                    } else {
                        this.handUpMembers = this.handUpMembers.filter(uid => uid !== msg.from);
                    }
                    senderName = wfc.getUserDisplayName(msg.from);
                    this.vueInstance.$notify({
                        text: command.boolValue ? senderName + '举手' : senderName + '放下举手',
                        type: 'info'
                    });
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.PUT_HAND_DOWN:
                case ConferenceCommandMessageContent.ConferenceCommandType.PUT_ALL_HAND_DOWN:
                    if (this.isHandUp) {
                        this.isHandUp = false;
                        this.vueInstance.$notify({
                            text: '主持人放下了你的举手',
                            type: 'info'
                        });
                    }
                    break
                case ConferenceCommandMessageContent.ConferenceCommandType.RECORDING:
                    this.conferenceInfo.recording = command.boolValue;
                    this.vueInstance.$notify({
                        text: command.boolValue ? '主持人开始录制' : '主持人结束录制',
                        type: 'info'
                    });
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.FOCUS:
                    this.conferenceInfo.focus = command.targetUserId;
                    this.vueInstance.$notify({
                        text: '主持人锁定焦点用户',
                        type: 'info'
                    });
                    break;
                case ConferenceCommandMessageContent.ConferenceCommandType.CANCEL_FOCUS:
                    this.conferenceInfo.focus = null;
                    this.vueInstance.$notify({
                        text: '主持人取消锁定焦点用户',
                        type: 'info'
                    });
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 申请解除打开麦克风或摄摄像头
     * @param {boolean} audio true，麦克风；false，摄像头
     * @param isCancel true，取消之前的申请；false，发起申请
     */
    applyUnmute(audio, isCancel) {
        if (audio) {
            this.isApplyingUnmuteAudio = !isCancel;
        } else {
            this.isApplyingUnmuteVideo = !isCancel;
        }
        let type = audio ? ConferenceCommandMessageContent.ConferenceCommandType.APPLY_UNMUTE_AUDIO : ConferenceCommandMessageContent.ConferenceCommandType.APPLY_UNMUTE_VIDEO;
        this._sendCommandMessage(type, null, isCancel);
    }

    /**
     * 批准用户打开麦克风/摄像头请求
     * @param {string} userId 用户 id
     * @param {boolean} audio true，麦克风；false，摄像头
     * @param {boolean} isAllow 是否批准
     */
    approveUnmute(userId, audio, isAllow) {
        if (!this.isOwner()) {
            return;
        }
        if (audio) {
            this.applyingUnmuteAudioMembers = this.applyingUnmuteAudioMembers.filter(uid => uid !== userId);
        } else {
            this.applyingUnmuteVideoMembers = this.applyingUnmuteVideoMembers.filter(uid => uid !== userId);
        }
        let type = audio ? ConferenceCommandMessageContent.ConferenceCommandType.APPROVE_UNMUTE_AUDIO : ConferenceCommandMessageContent.ConferenceCommandType.APPROVE_UNMUTE_VIDEO;
        this._sendCommandMessage(type, userId, isAllow);
    }

    /**
     * 批准所有打开麦克风/摄像头请求
     * @param {boolean} audio true，麦克风；false，摄像头
     * @param {boolean} isAllow 是否批准
     */
    approveAllUnmute(audio, isAllow) {
        if (!this.isOwner()) {
            return;
        }
        if (audio) {
            this.applyingUnmuteAudioMembers.length = 0;
        } else {
            this.applyingUnmuteVideoMembers.length = 0;
        }
        let type = audio ? ConferenceCommandMessageContent.ConferenceCommandType.APPROVE_ALL_UNMUTE_AUDIO : ConferenceCommandMessageContent.ConferenceCommandType.APPROVE_ALL_UNMUTE_VIDEO;
        this._sendCommandMessage(type, null, isAllow);
    }

    /**
     * 主持人邀请打开/关闭麦克风或摄像
     * @param {string} userId
     * @param {boolean} audio true，麦克风；false，摄像头
     * @param {boolean} mute true，打开；false，关闭
     */
    requestMemberMute(userId, audio, mute) {
        if (!this.isOwner()) {
            return;
        }

        let type = audio ? ConferenceCommandMessageContent.ConferenceCommandType.REQUEST_MUTE_AUDIO : ConferenceCommandMessageContent.ConferenceCommandType.REQUEST_MUTE_VIDEO;
        this._sendCommandMessage(type, userId, mute);
    }

    /**
     * 主持人关闭所有人的麦克风或摄像头
     * @param {boolean} audio true 麦克风， false 摄像头
     * @param {boolean} allowMemberUnmute 允许成员主动开启麦克风或摄像头
     */
    requestMuteAll(audio, allowMemberUnmute) {
        if (!this.isOwner()) {
            return;
        }
        this.isMuteAll = true;
        this.conferenceInfo.audience = true;
        this.conferenceInfo.allowSwitchMode = allowMemberUnmute;
        conferenceApi.updateConference(this.conferenceInfo)
            .then(r => {
                let type = audio ? ConferenceCommandMessageContent.ConferenceCommandType.MUTE_ALL_AUDIO : ConferenceCommandMessageContent.ConferenceCommandType.MUTE_ALL_VIDEO;
                this._sendCommandMessage(type, null, allowMemberUnmute);
            })
            .catch(err => {
                console.log('updateConference error', err)
            })
    }

    /**
     * 主持人取消所有人关闭麦克风或摄像头
     * @param {boolean} audio true 麦克风， false 摄像头
     * @param {boolean} unmute 是否提示成员打开麦克风或摄像头
     */
    requestUnmuteAll(audio, unmute) {
        if (!this.isOwner()) {
            return;
        }

        this.isMuteAll = false;
        this.conferenceInfo.audience = false;
        this.conferenceInfo.allowSwitchMode = true;
        conferenceApi.updateConference(this.conferenceInfo)
            .then(r => {
                let type = audio ? ConferenceCommandMessageContent.ConferenceCommandType.CANCEL_MUTE_ALL_AUDIO : ConferenceCommandMessageContent.ConferenceCommandType.CANCEL_MUTE_ALL_VIDEO
                this._sendCommandMessage(type, null, unmute);
            })
            .catch(err => {
                console.log('updateConference error', err)
            })
    }

    /**
     * 举手
     * @param {boolean} isHandUp
     */
    handUp(isHandUp) {
        this.isHandUp = isHandUp;
        this._sendCommandMessage(ConferenceCommandMessageContent.ConferenceCommandType.HANDUP, null, isHandUp);
        this.vueInstance.$notify({
            text: isHandUp ? "已举手，等待管理员处理" : "已放下举手",
            type: 'info'
        });
    }

    /**
     * 主持人放下成员举手
     * @param {string} memberId
     */
    putMemberHandDown(memberId) {
        if (!this.isOwner()) {
            return;
        }
        this.handUpMembers = this.handUpMembers.filter(uid => uid !== memberId);
        this._sendCommandMessage(ConferenceCommandMessageContent.ConferenceCommandType.PUT_HAND_DOWN, memberId, false);
    }

    /**
     * 主持人放下所有人举手
     */
    putAllHandDown() {
        if (!this.isOwner()) {
            return;
        }
        this.handUpMembers.length = 0;
        this._sendCommandMessage(ConferenceCommandMessageContent.ConferenceCommandType.PUT_ALL_HAND_DOWN, null, false);
    }

    requestRecord(record) {
        if (!this.isOwner()) {
            return;
        }
        conferenceApi.recordConference(this.conferenceInfo.conferenceId, record)
            .then(r => {
                this.conferenceInfo.isRecording = record;
            })
            .catch(err => {
                console.log('recordConference error', err);
            });
    }

    /**
     * 主持人设置焦点用户
     * @param {string} userId
     */
    requestFocus(userId) {
        if (!this.isOwner()) {
            return;
        }
        conferenceApi.setConferenceFocusUserId(this.conferenceInfo.conferenceId, userId)
            .then(r => {
                this.conferenceInfo.focus = userId;
            })
            .catch(err => {
                console.log('requestFocus err', err);
            })
    }

    requestCancelFocus() {
        this.requestFocus(null);
    }

    /**
     * 主任任请求全员静音
     */
    onMuteAll(audio) {
        let desc;
        if (audio) {
            desc = '管理员将全体成员静音了';
            this.conferencePage.enableAudio(false)
        } else {
            desc = '管理员关闭了所有人的摄像头';
            this.conferencePage.enableVideo(false);
        }
        this.vueInstance.$notify({
            text: desc,
            type: 'info'
        });
    }

    /**
     * 主持人取消全员静音
     * @param audio
     * @param requestUnmute
     */
    onCancelMuteAll(audio, requestUnmute) {
        if (requestUnmute && this.vueInstance.selfUserInfo._isAudience) {
            this.conferencePage.alert({
                showIcon: false,
                title: audio ? '主持人关闭了全员静音，是否要打开麦克风' : '管理员取消了全体成员关闭摄像头，是否打开摄像头',
                content: audio ? '主持人关闭了全员静音，是否要打开麦克风' : '管理员取消了全体成员关闭摄像头，是否打开摄像头',
                confirmText: '打开',
                onClose: () => {
                    // do nothing
                },
                onConfirm: () => {
                    if (audio) {
                        this.conferencePage.enableAudio(true);
                    } else {
                        this.conferencePage.enableVideo(true);
                    }
                }
            })

        }
        let desc = audio ? '管理员取消了全体成员静音' : '管理员取消了全体成员关闭摄像'
        this.vueInstance.$notify({
            text: desc,
            type: 'info'
        });
    }

    /**
     * 主持人请求 mute 操作
     * @param audio
     * @param mute
     */
    onRequestMute(audio, mute) {
        if (!mute) {
            this.conferencePage.alert({
                showIcon: false,
                title: audio ? '主持人邀请你发言' : '主持人邀请你打开摄像头',
                content: audio ? '主持人邀请你发言' : '主持人邀请你打开摄像头',
                confirmText: '接受',
                onClose: () => {
                    // do nothing
                },
                onConfirm: () => {
                    if (audio) {
                        this.conferencePage.enableAudio(true);
                    } else {
                        this.conferencePage.enableVideo(true);
                    }
                }
            })
        } else {
            if (audio) {
                this.conferencePage.enableAudio(false);
            } else {
                this.conferencePage.enableVideo(false);
            }

            this.vueInstance.$notify({
                text: audio ? '管理员关闭了你的发言' : '管理员关闭了你的摄像头',
                type: 'info'
            });
        }
    }

    addHistory(conferenceInfo, durationMS) {
        console.log('addHistory', conferenceInfo, durationMS);
        let tmp = getItem('historyConfList');
        let historyList = [];
        if (tmp) {
            historyList = JSON.parse(tmp);
        }
        conferenceInfo.endTime = Math.ceil(conferenceInfo.startTime + durationMS / 1000);
        let index = historyList.findIndex(info => info.conferenceId === conferenceInfo.conferenceId)
        if (index >= 0) {
            historyList[index] = conferenceInfo;
        } else {
            historyList.push(conferenceInfo);
            if (historyList.length > 10) {
                historyList = historyList.shift();
            }
        }
        setItem('historyConfList', JSON.stringify(historyList, null, ''));
    }

    getHistoryConference() {
        let tmp = getItem('historyConfList');
        let historyList = [];
        if (tmp) {
            historyList = JSON.parse(tmp);
        }
        return historyList;
    }

    _fixLongSerializedIssue(msg) {
        if (typeof msg !== 'string') {
            return msg;
        }
        msg = JSON.parse(msg);
        if (typeof msg === 'string') {
            msg = JSON.parse(msg);
        }
        return msg;
    }

    _reloadCurrentConferenceInfo() {
        conferenceApi.queryConferenceInfo(this.conferenceInfo.conferenceId, this.conferenceInfo.password)
            .then(info => {
                this.conferenceInfo = info;
            })
            .catch(err => {
                console.log(err)
            })
    }

    isOwner() {
        return this.conferenceInfo.owner === this.selfUserId;
    }

    _sendCommandMessage(commandType, targetUser, boolValue) {
        let content = new ConferenceCommandMessageContent(this.conferenceInfo.conferenceId, commandType, targetUser, boolValue);
        let conversation = new Conversation(ConversationType.ChatRoom, this.conferenceInfo.conferenceId, 0);
        wfc.sendConversationMessage(conversation, content);
    }
}

let self = new ConferenceManager();
export default self;
