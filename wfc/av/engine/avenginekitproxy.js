/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import EventType from "../../client/wfcEvent";
import ConversationType from "../../model/conversationType";
import MessageContentType from "../../messages/messageContentType";
import wfc from "../../client/wfc";
import MessageConfig from "../../client/messageConfig";
import Config from "../../../config";
import {longValue, numberValue} from '../../util/longUtil'
import Conversation from "../../../wfc/model/conversation";

// main window renderer process -> voip window renderer process
// voip window renderer process -> main process -> main window renderer process
export class AvEngineKitProxy {
    wfc;
    queueEvents = [];
    type;

    conference = false;
    conversation;
    callId;
    inviteMessageUid;
    participants = [];
    isSupportVoip = false;
    hasMicrophone = false;
    hasSpeaker = false;
    hasWebcam = false;

    voipWebview;
    voipEventListeners;

    /**
     * 无法正常弹出音视频通话窗口是的回调
     * 回到参数说明：-1，有音视频通话正在进行中；-2，设备不支持音视频通话，可能原因是不支持webrtc，没有摄像头或麦克风等
     * @type {(Number) => {}}
     */
    onVoipCallErrorCallback;

    /**
     * 音视频通话通话状态回调
     */
    onVoipCallStatusCallback = (covnersation, ongonging) => {
    };

    /**
     * 应用初始化的时候调用
     * @param wfc
     */
    setup(wfc) {
        if (this.wfc === wfc) {
            console.log('re-setup, just ignore');
            return;
        }
        console.log('avenginekitproxy setup')
        this.wfc = wfc;
        wfc.eventEmitter.on(EventType.ReceiveMessage, this.onReceiveMessage);
        wfc.eventEmitter.on(EventType.ConferenceEvent, this.onReceiveConferenceEvent);
    }

    setVoipWebview(webview) {
        this.voipWebview = webview;
        if (!webview) {
            this.onVoipCallStatusCallback && this.onVoipCallStatusCallback(this.conversation, false);
            this.conversation = null;
            this.queueEvents = [];
            if (this.conference) {
                wfc.quitChatroom(this.callId);
                this.conference = false;
            }
            this.callId = null;
            this.participants = [];
            this.queueEvents = [];
        } else {
            if (this.queueEvents.length > 0) {
                this.queueEvents.forEach((eventArgs) => {
                    console.log('process queued event', eventArgs);
                    this.emitToVoip(eventArgs.event, eventArgs.args);
                })
                this.queueEvents = [];
            }
        }
    }

    updateCallStartMessageContentListener = (event, message) => {
        let messageUid = message.messageUid;
        let content = message.content;

        let msg = wfc.getMessageByUid(messageUid);
        let orgContent = msg.messageContent;
        orgContent.connectTime = content.connectTime ? content.connectTime : orgContent.connectTime;
        orgContent.endTime = content.endTime ? content.endTime : orgContent.endTime;
        orgContent.status = content.status;
        orgContent.audioOnly = content.audioOnly;
        wfc.updateMessageContent(msg.messageId, orgContent);
    }

    sendConferenceRequestListener = (event, request) => {
        console.log('to send conference request', request)
        wfc.sendConferenceRequestEx(request.sessionId ? request.sessionId : 0, request.roomId ? request.roomId : '', request.request, request.data, request.advance, (errorCode, res) => {
            this.emitToVoip('sendConferenceRequestResult', {
                error: errorCode,
                sendConferenceRequestId: request.sendConferenceRequestId,
                response: res
            })
        });
    }

    // 发送消息时，返回的timestamp，已经过修正，后面使用时,不用考虑和服务器的时间差
    sendVoipListener = (event, msg) => {

        let contentClazz = MessageConfig.getMessageContentClazz(msg.content.type);

        let content = new contentClazz();
        content.decode(msg.content);
        console.log('to send voip message', content);
        let delta = wfc.getServerDeltaTime();
        console.log('delta', delta);
        if (content.type === MessageContentType.VOIP_CONTENT_TYPE_ADD_PARTICIPANT) {
            this.participants.push(content.participants);
        } else if (content.type === MessageContentType.VOIP_CONTENT_TYPE_END) {
            this.conversation = null;
            this.queueEvents = [];
            this.callId = null;
            this.inviteMessageUid = null;
            this.participants = [];
            // 仅仅为了通知proxy，其他端已经接听电话了，关闭窗口时，不应当发送挂断信令
            if (!content.callId) {
                return;
            }
        }
        let conversation = new Conversation(msg.conversation.type, msg.conversation.target, msg.conversation.line)
        wfc.sendConversationMessage(conversation, content, msg.toUsers, (messageId, timestamp) => {

            // do nothing
        }, (uploaded, total) => {

            // do nothing
        }, (messageUid, timestamp) => {
            this.emitToVoip('sendMessageResult', {
                error: 0,
                sendMessageId: msg.sendMessageId,
                messageUid: messageUid,
                timestamp: longValue(numberValue(timestamp) - delta)
            })
            if (content.type === MessageContentType.VOIP_CONTENT_TYPE_START) {
                this.inviteMessageUid = messageUid;
            }
        }, (errorCode) => {
            this.emitToVoip('sendMessageResult', {error: errorCode, sendMessageId: msg.sendMessageId})
        });
    }

    onReceiveConferenceEvent = (event) => {
        this.emitToVoip("conferenceEvent", event);
    }

    // 收到消息时，timestamp已经过修正，后面使用时，不用考虑和服务器的时间差
    onReceiveMessage = (msg) => {
        console.log('xxx remem');
        if (!Config.ENABLE_MULTI_VOIP_CALL && msg.conversation.type === ConversationType.Group) {
            console.log('not enable multi call ');
            return;
        }
        if (!Config.ENABLE_SINGLE_VOIP_CALL && msg.conversation.type === ConversationType.Single) {
            console.log('not enable multi call ');
            return;
        }
        let now = (new Date()).valueOf();
        let delta = wfc.getServerDeltaTime();
        if (now - (numberValue(msg.timestamp) - delta) >= 90 * 1000) {
            // 消息已失效，不做处理
            console.log('expired msg, ignore')
            return;
        }
        let content = msg.messageContent;
        if (this.voipWebview && this.conference && content.type !== MessageContentType.CONFERENCE_CONTENT_TYPE_COMMAND) {
            console.log('in conference, ignore all other msg');
            return;
        }
        if (content.type === MessageContentType.VOIP_CONTENT_TYPE_START
            || content.type === MessageContentType.VOIP_CONTENT_TYPE_ADD_PARTICIPANT) {
            if (this.voipWebview) {
                if (content.type === MessageContentType.VOIP_CONTENT_TYPE_START
                    || (content.type === MessageContentType.VOIP_CONTENT_TYPE_ADD_PARTICIPANT && content.participants.indexOf(wfc.getUserId()) >= 0)) {
                    // 已在音视频通话中，其他的音视频通话，又邀请自己，这儿是只是让主界面提示一下，拒绝逻辑在 engine 里面
                    this.onVoipCallErrorCallback && this.onVoipCallErrorCallback(-1);
                }
            }
        }

        if ((msg.conversation.type === ConversationType.Single || msg.conversation.type === ConversationType.Group || (this.conference && msg.conversation.type === ConversationType.ChatRoom))) {
            if (content.type === MessageContentType.VOIP_CONTENT_TYPE_START
                || content.type === MessageContentType.VOIP_CONTENT_TYPE_END
                || content.type === MessageContentType.VOIP_CONTENT_TYPE_ACCEPT
                || content.type === MessageContentType.VOIP_CONTENT_TYPE_SIGNAL
                || content.type === MessageContentType.VOIP_CONTENT_TYPE_MODIFY
                || content.type === MessageContentType.VOIP_CONTENT_TYPE_ACCEPT_T
                || content.type === MessageContentType.VOIP_CONTENT_TYPE_ADD_PARTICIPANT
                || content.type === MessageContentType.VOIP_CONTENT_TYPE_MUTE_VIDEO
                || content.type === MessageContentType.VOIP_Join_Call_Request
                || content.type === MessageContentType.CONFERENCE_CONTENT_TYPE_KICKOFF_MEMBER
                || content.type === MessageContentType.CONFERENCE_CONTENT_TYPE_CHANGE_MODE
                || content.type === MessageContentType.CONFERENCE_CONTENT_TYPE_COMMAND
            ) {
                console.log("receive voip message", msg.messageContent.type, msg.messageUid.toString(), msg);
                if (msg.direction === 0
                    && content.type !== MessageContentType.VOIP_CONTENT_TYPE_END
                    && content.type !== MessageContentType.VOIP_CONTENT_TYPE_ACCEPT
                    && content.type !== MessageContentType.VOIP_CONTENT_TYPE_ACCEPT) {
                    return;
                }

                let participantUserInfos = [];
                let selfUserInfo = wfc.getUserInfo(wfc.getUserId());
                if (content.type === MessageContentType.VOIP_CONTENT_TYPE_START) {
                    this.conversation = msg.conversation;
                    this.callId = content.callId;
                    this.inviteMessageUid = msg.messageUid;
                    this.participants.push(...content.targetIds);
                    this.participants.push(msg.from);
                    // 参与者不包含自己
                    this.participants = this.participants.filter(uid => uid !== selfUserInfo.uid)

                    if (msg.conversation.type === ConversationType.Single) {
                        participantUserInfos = [wfc.getUserInfo(msg.from)];
                    } else {
                        let targetIds = content.targetIds.filter(id => id !== selfUserInfo.uid);
                        targetIds.push(msg.from);
                        participantUserInfos = wfc.getUserInfos(targetIds, msg.conversation.target);
                    }
                    if (!this.voipWebview) {
                        if (this.conversation) {
                            this.showCallUI(msg.conversation);
                        } else {
                            console.log('call ended')
                        }
                    }
                } else if (content.type === MessageContentType.VOIP_CONTENT_TYPE_ADD_PARTICIPANT) {
                    let participantIds = [...content.participants];
                    if (content.existParticipants) {
                        content.existParticipants.forEach(p => {
                            participantIds.push(p.userId);
                        });
                    }

                    this.conversation = msg.conversation;
                    this.callId = content.callId;
                    this.inviteMessageUid = msg.messageUid;
                    this.participants.push(...participantIds);

                    participantIds = participantIds.filter(u => u.uid !== selfUserInfo.uid);
                    participantUserInfos = wfc.getUserInfos(participantIds, msg.conversation.target);

                    if (!this.voipWebview && content.participants.indexOf(selfUserInfo.uid) > -1) {
                        if (this.conversation) {
                            this.showCallUI(msg.conversation);
                        } else {
                            console.log('call ended')
                        }
                    }
                } else if (content.type === MessageContentType.VOIP_CONTENT_TYPE_END) {
                    if (content.callId !== this.callId) {
                        return;
                    }
                }

                if (msg.conversation.type === ConversationType.Group
                    && (content.type === MessageContentType.VOIP_CONTENT_TYPE_START
                        || content.type === MessageContentType.VOIP_CONTENT_TYPE_ADD_PARTICIPANT
                    )) {
                    let memberIds = wfc.getGroupMemberIds(msg.conversation.target);
                    msg.groupMemberUserInfos = wfc.getUserInfos(memberIds, msg.conversation.target);
                }

                msg.participantUserInfos = participantUserInfos;
                msg.selfUserInfo = selfUserInfo;
                msg.timestamp = longValue(numberValue(msg.timestamp) - delta)
                this.emitToVoip("message", msg);
            }
        }
    };

    emitToVoip(event, args) {
        if (this.voipWebview) {
            const
                _funName = 'msgFromUniapp',
                _data = {
                    event,
                    args
                };
            // 这儿的延时目前是必须的，要等音视频页面加载完成，并监听相关事件
            setTimeout(() => {
                console.log('emitToVoip', _data);
                this.voipWebview.evalJS(`${_funName}(${JSON.stringify(_data)})`);
            }, 2000)
        } else if (this.queueEvents) {
            this.queueEvents.push({event, args});
        }
    }

    // emit to uniapp
    emitToMain(event, args) {
        console.log('emit to main', event, args);
        uni.postMessage({
            data: {
                event,
                args
            },
        });
    }

    // called by uniapp
    voipWebviewEventListener = evt => {
        let {event, args} = evt.detail.data[0];
        console.log('voipWebviewEventListener', evt)
        switch (event) {
            case 'voip-message':
                this.sendVoipListener(event, args);
                break;
            case 'conference-request':
                this.sendConferenceRequestListener(event, args);
                break;
            case 'update-call-start-message':
                this.updateCallStartMessageContentListener(event, args);
                break;
            default:
                break;
        }
    }

    // called by webview
    listenVoipEvent = (evt, listener) => {
        console.log('listenVoipEvent', evt);
        if (!window.msgFromUniapp) {
            this.voipEventListeners = [];
            this.voipEventListeners[evt] = listener;
            window.msgFromUniapp = data => {
                console.log('msgFromUniapp', data);
                let {event, args} = data;
                let l = this.voipEventListeners[event]
                l && l(event, args);
            }
        } else {
            this.voipEventListeners[evt] = listener;
        }
    };

    /**
     * 发起音视频通话
     * @param {Conversation} conversation 会话
     * @param {Boolean} audioOnly 是否是音频通话
     * @param {[String]} participants 参与者用户id列表
     * @param {string} callExtra 通话附加信息，会议版有效
     */
    startCall(conversation, audioOnly, participants, callExtra = '') {
        if (this.voipWebview) {
            console.log('voip call is ongoing');
            this.onVoipCallErrorCallback && this.onVoipCallErrorCallback(-1);
            return;
        }
        console.log(`startCall speaker、microphone、webcam检测结果分别为：${this.hasSpeaker} , ${this.hasMicrophone}, ${this.hasWebcam}，如果不全为true，请检查硬件设备是否正常，否则通话可能存在异常`)
        /* if (!this.isSupportVoip || !this.hasSpeaker || !this.hasMicrophone) {
             console.log('not support voip', this.isSupportVoip, this.hasSpeaker, this.hasMicrophone, this.hasWebcam);
             this.onVoipCallErrorCallback && this.onVoipCallErrorCallback(-2);
             return;
         }
         */

        let selfUserInfo = wfc.getUserInfo(wfc.getUserId());
        participants = participants.filter(uid => uid !== selfUserInfo.uid);
        let callId = conversation.target + Math.floor(Math.random() * 10000);
        this.conversation = conversation;
        this.participants.push(...participants)
        this.callId = callId;

        let participantUserInfos = wfc.getUserInfos(participants);
        let groupMemberUserInfos;
        if (conversation.type === ConversationType.Group) {
            let memberIds = wfc.getGroupMemberIds(conversation.target);
            groupMemberUserInfos = wfc.getUserInfos(memberIds, conversation.target);
        }
        this.showCallUI(conversation, false);
        this.emitToVoip('startCall', {
            conversation: conversation,
            audioOnly: audioOnly,
            callId: callId,
            selfUserInfo: selfUserInfo,
            groupMemberUserInfos: groupMemberUserInfos,
            participantUserInfos: participantUserInfos,
            callExtra: callExtra,
        });
    }

    /**
     * 开始会议
     * @param {string} callId 会议id
     * @param {boolean} audioOnly 是否仅仅开启音频; true，音频会议；false，视频会议
     * @param {string} pin 入会pin码
     * @param {string} host 主持人用户id
     * @param {string} title 会议标题
     * @param {string} desc 会议描述
     * @param {boolean} audience 其他人加入会议时，是否默认为观众；true，默认为观众；false，默认为互动者
     * @param {boolean} advance 是否为高级会议，当预计参与人员很多的时候，开需要开启超级会议
     * @param {boolean} record 是否开启服务端录制
     * @param {Object} extra 一些额外信息，主要用于将信息传到音视频通话窗口，会议的其他参与者，无法看到该附加信息
     * @param {Object} callExtra  通话附件信息，会议的所有参与者都能看到该附加信息
     * @param {boolean} muteAudio 是否是静音加入会议
     * @param {boolean} muteVideo 是否是关闭摄像头加入会议
     */
    startConference(callId, audioOnly, pin, host, title, desc, audience, advance, record = false, extra, callExtra, muteAudio = false, muteVideo = false) {
        if (this.voipWebview) {
            console.log('voip call is ongoing');
            this.onVoipCallErrorCallback && this.onVoipCallErrorCallback(-1);
            return;
        }
        if (!this.isSupportVoip || !this.hasSpeaker || !this.hasMicrophone) {
            console.log('not support voip', this.isSupportVoip, this.hasSpeaker);
            this.onVoipCallErrorCallback && this.onVoipCallErrorCallback(-2);
            return;
        }

        callId = callId ? callId : wfc.getUserId() + Math.floor(Math.random() * 10000);
        this.callId = callId;
        this.conversation = null;
        this.conference = true;

        wfc.joinChatroom(callId, () => {
            console.log('join conference chatRoom success', callId)
        }, (err) => {
            console.error('join conference chatRoom fail', callId, err);
        });

        let selfUserInfo = wfc.getUserInfo(wfc.getUserId());
        this.showCallUI(null, true);
        this.emitToVoip('startConference', {
            audioOnly: audioOnly,
            callId: callId,
            pin: pin ? pin : Math.ceil(Math.random() * 1000000) + '',
            host: host,
            title: title,
            desc: desc,
            audience: audience,
            advance: advance,
            record: record,
            selfUserInfo: selfUserInfo,
            extra: extra,
            callExtra: callExtra,
            muteAudio: muteAudio,
            muteVideo: muteVideo,
        });
    }

    /**
     * 加入会议
     * @param {string} callId 会议id
     * @param {string} audioOnly 是否只开启音频
     * @param {string} pin 会议pin码
     * @param {string} host 会议主持人
     * @param {string} title 会议标题
     * @param {string} desc 会议描述
     * @param {boolean} audience 是否是以观众角色入会
     * @param {string} advance 是否是高级会议
     * @param {boolean} muteAudio 是否是静音加入会议
     * @param {boolean} muteVideo 是否是关闭摄像头加入会议
     * @param {Object} extra 一些额外信息，主要用于将信息传到音视频通话窗口
     * @param {Object} callExtra 通话附加信息，会议的所有参与者都能看到该附加信息
     */
    joinConference(callId, audioOnly, pin, host, title, desc, audience, advance, muteAudio, muteVideo, extra = null, callExtra = null) {
        if (this.voipWebview) {
            console.log('voip call is ongoing');
            this.onVoipCallErrorCallback && this.onVoipCallErrorCallback(-1);
            return;
        }
        if (!this.isSupportVoip) {
            console.log('not support voip', this.isSupportVoip, this.hasSpeaker);
            this.onVoipCallErrorCallback && this.onVoipCallErrorCallback(-2);
            return;
        }

        this.conversation = null;
        this.conference = true;
        this.callId = callId;

        wfc.joinChatroom(callId, () => {
            console.log('join conference chatRoom success', callId)
        }, (err) => {
            console.error('join conference chatRoom fail', callId, err);
        });
        let selfUserInfo = wfc.getUserInfo(wfc.getUserId());
        this.showCallUI(null, true);
        this.emitToVoip('joinConference', {
            audioOnly: audioOnly,
            callId: callId,
            pin: pin,
            host: host,
            title: title,
            desc: desc,
            audience: audience,
            advance: advance,
            muteAudio: muteAudio,
            muteVideo: muteVideo,
            selfUserInfo: selfUserInfo,
            extra: extra,
            callExtra: callExtra,
        });
    }

    showCallUI(conversation, isConference) {
        let type = isConference ? 'conference' : (conversation.type === ConversationType.Single ? 'single' : 'multi');
        uni.navigateTo({
            url: `/pages/voip/VoipPage?type=${type}`,
            fail: (e) => {
                console.log(e)
            }
        });
    }
}

const self = new AvEngineKitProxy();
export default self;