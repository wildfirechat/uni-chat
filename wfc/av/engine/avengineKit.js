import avengineCallback from "./avengineCallback";
import CallSession from './callSession';
import ParticipantProfile from "./participantProfile";
import ConversationType from "../../model/conversationType";
import Config from "../../../config";

const avengineKitPlugin = Config.ENABLE_VOIP ? uni.requireNativePlugin("wf-uni-wfc-avclient") : null;

export class AVEngineKit {

    avengineCallback = avengineCallback;

    sessionCallback;

    /**
     屏幕分享替换模式。为ture时，屏幕分享会替换摄像头的数据流。为false时，屏幕分享会再单独发起一路，不会影响摄像头的输入。
     */
    static SCREEN_SHARING_REPLACE_MODE = true;

    /**
     * 判断 UIKit 原生插件是否集成
     * @return {boolean}
     */
    isAVEngineKitEnable() {
        return !!avengineKitPlugin;
    }

    init() {
        avengineKitPlugin.initAVEngineKit();
        // avengineKitPlugin.setScreenShareReplaceMode(AVEngineKit.SCREEN_SHARING_REPLACE_MODE);
        plus.globalEvent.addEventListener("wfc-av-event", (e) => {
            // console.debug('wfc-av-event', e);
            self._handleNativeAVEngineEvent(e);
            // this.log = [this.interpreter(e), ...this.log];
        });

        plus.globalEvent.addEventListener("wfc-av-session-event", (e) => {
            // console.debug('wfc-av-session-event', e);
            self._handleNativeCallSessionEvent(e);
            // this.log = [this.interpreter(e), ...this.log];
        });
    }

    _handleNativeAVEngineEvent(e) {
        let args = e.args;
        if (this.avengineCallback) {
            let func = this.avengineCallback[args[0]]
            //console.log('avengineCallback', func, ...args.slice(1))
            if (func) {
                func(...args.slice(1));
            }
        } else {
            console.warn('_handleNativeAVEngineEvent avengineCallback is null', args)
        }
    }

    _handleNativeCallSessionEvent(e) {
        let args = e.args;
        if (args[0] !== 'didReportAudioVolume') {
            console.log('_handleNativeCallSessionEvent', args)
        }
        if (args[0] === 'resumeVoipPage') {
            let session = this.currentCallSession();
            if (session) {
                this._resumeVoipPage(session);
            }
            return;
        }
        if (this.sessionCallback) {
            let func = this.sessionCallback[args[0]]
            if (func) {
                // 类型不对时，特殊处理
                if (args[0] === 'didChangeState') {
                    func(Number(args[1]));
                } else if (args[0] === 'didCallEndWithReason') {
                    func(Number(args[1]));
                } else {
                    func(...args.slice(1));
                }
            }
        } else {
            if(args[0] !== 'didReportAudioVolume'){
                console.warn('_handleNativeCallSessionEvent sessionCallback is null', args)
            }
        }
    }

    _resumeVoipPage(session) {
        console.log('_resumeVoipPage', session)
        let url;
        if (session.conference) {
            url = '/pages/voip/conference/ConferencePage'
        } else if (session.conversation.type === ConversationType.Single) {
            url = '/pages/voip/Single'
        } else if (session.conversation.type === ConversationType.Group) {
            url = '/pages/voip/Multi'
        }
        url += `?session=${JSON.stringify(session)}`
        if (url) {
            uni.navigateTo({
                url: url,
                success: (res) => {
                    console.log(`navigate to ${url} success`)
                },
                fail: (e) => {
                    console.log(`navigate to ${url} error`, e)
                }
            })
        }
    }

    setSessionCallback(cb) {
        this.sessionCallback = cb;
    }

    /**
     * 发起单人音视频通话
     * @param {string} userId 用户 id
     * @param {boolean} audioOnly 是否是音频通话
     * @return {CallSession}
     */
    startSingleCall(userId, audioOnly) {
        let sessionStr = avengineKitPlugin.startSingleCall(userId, audioOnly);
        return !sessionStr ? null : Object.assign(new CallSession(), JSON.parse(sessionStr));
    }

    /**
     * 发起群音视频通话
     * @param {string} groupId 群 id
     * @param {[string]} participants 参与者 id，要求是群成员
     * @param {boolean} audioOnly 是否是音频通话
     * @return {CallSession}
     */
    startMultiCall(groupId, participants, audioOnly) {
        let sessionStr = avengineKitPlugin.startMultiCall(groupId, participants, audioOnly)
        return !sessionStr ? null : Object.assign(new CallSession(), JSON.parse(sessionStr));
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
     * @param {string} callExtra  通话附件信息，会议的所有参与者都能看到该附加信息
     * @return {CallSession}
     */
    startConference(callId, audioOnly, pin, host, title, desc, audience, advance, record = false, callExtra = '') {
        let sessionStr = avengineKitPlugin.startConference(callId, audioOnly, pin, host, title, desc, audience, advance, record, callExtra);
        return !sessionStr ? null : Object.assign(new CallSession(), JSON.parse(sessionStr));
    }

    /**
     * 加入会议
     * @param {string} callId 会议id
     * @param {boolean} audioOnly 是否只开启音频
     * @param {string} pin 会议pin码
     * @param {string} host 会议主持人
     * @param {string} title 会议标题
     * @param {string} desc 会议描述
     * @param {boolean} audience 是否是以观众角色入会
     * @param {boolean} advance 是否是高级会议
     * @param {boolean} muteAudio 是否是静音加入会议
     * @param {boolean} muteVideo 是否是关闭摄像头加入会议
     * @param {string} callExtra 通话附加信息，会议的所有参与者都能看到该附加信息
     * @return {CallSession}
     */
    joinConference(callId, audioOnly, pin, host, title, desc, audience, advance, muteAudio, muteVideo, callExtra = '') {
        let sessionStr = avengineKitPlugin.joinConference(callId, audioOnly, pin, host, title, desc, audience, advance, muteAudio, muteVideo, callExtra);
        return !sessionStr ? null : Object.assign(new CallSession(), JSON.parse(sessionStr));
    }

    /**
     * 离开会议
     * @param {string} callId 会议id
     * @param {boolean} destroyRoom 是否销毁会议，主持有效
     */
    leaveConference(callId, destroyRoom = false) {
        avengineKitPlugin.leaveConference(callId, destroyRoom);
    }

    /**
     * 仅会议版有效
     *
     * 将参与者踢出会议
     *
     * @param {string} callId 会议 id
     * @param userId
     * @param successCB
     * @param failCB
     */
    kickoffParticipant(callId, userId, successCB, failCB) {
        avengineKitPlugin.kickoffParticipant(callId, userId, () => {
            successCB && successCB()
        }, err => {
            failCB && failCB(err)
        })

    }

    /**
     *  仅会议版有效
     * 设置参与者的 videoType
     * @param {string} callId 通话 id
     * @param {string} userId 用户 id
     * @param {boolean} screenSharing 是否是屏幕共享
     * @param {number} videoType 视频流类型，可选值参考{@link VideoType}
     */
    setParticipantVideoType(callId, userId, screenSharing, videoType) {
        console.log('setParticipantVideoType', userId, screenSharing, videoType)
        avengineKitPlugin.setParticipantVideoType(callId, userId, screenSharing, videoType);
    }

    /**
     * 判断是否支持多人音视频通话
     * @return {boolean}
     */
    isSupportMultiCall() {
        return avengineKitPlugin.isSupportMultiCall();
    }

    /**
     * 判断是否支持会议
     * @return {boolean}
     */
    isSupportConference() {
        return avengineKitPlugin.isSupportConference();
    }

    /**
     * 设置视频通话时的视频属性
     * @param {number} profile 可选值参考{@link VideoProfile}
     * @param {boolean} swapWidthHeight 是否交换宽高，默认不不用设置
     */
    setVideoProfile(profile, swapWidthHeight = false) {
        avengineKitPlugin.setVideoProfile(profile, swapWidthHeight);
    }

    /**
     * 添加 ICE Server
     * @param {string} url
     * @param {string} name
     * @param {string} password
     */
    addICEServer(url, name, password) {
        avengineKitPlugin.addICEServer(url, name, password)
    }

    /**
     * 获取当前通话会话
     *
     * @@return {callSession}
     */
    currentCallSession() {
        let result = avengineKitPlugin.currentCallSession();
        if (!result) {
            return null;
        }

        return Object.assign(new CallSession(), JSON.parse(result));
    }

    /**
     * 接听
     * @param {string} callId
     * @param {boolean} audioOnly 是否是以语音方式接听
     */
    answerCall(callId, audioOnly) {
        avengineKitPlugin.answerCall(callId, audioOnly);
    }

    /**
     * 挂断
     * @param {Object} callId 通话ID
     */
    endCall(callId) {
        avengineKitPlugin.endCall(callId);
    }

    /**
     * 仅 Android 端高级版音视频支持
     * 开启屏幕共享
     * @param {Object} callId 通话ID
     */
    startScreenShare(callId) {
        avengineKitPlugin.startScreenShare(callId);
    }

    /**
     * 仅 Android 端高级版音视频支持
     * 停止屏幕共享
     * @param {Object} callId 通话ID
     */
    stopScreenShare(callId) {
        avengineKitPlugin.stopScreenShare(callId);
    }

    /**
     * 仅 Android 端高级版音视频支持
     *  是否在进行屏幕共享
     * @param {Object} callId 通话ID
     */
    isScreenSharing(callId) {
        return avengineKitPlugin.isScreenSharing(callId);
    }

    /**
     * 关闭/开启摄像头
     * @param {string} callId 通话 id
     * @param {boolean} mute 是否关闭摄像头
     */
    muteVideo(callId, mute) {
        avengineKitPlugin.muteVideo(callId, mute)
    }

    /**
     * 关闭/开启麦克风
     * @param {string} callId 通话 id
     * @param {boolean} mute 是否关闭麦克风
     * @return {boolean} 是否关闭成功
     */
    muteAudio(callId, mute) {
        avengineKitPlugin.muteAudio(callId, mute);
    }

    /**
     * 会议时有效
     * 切换为观众
     * @param {string} callId 通话 id
     * @param {boolean} audience 是否切换成观众
     * @return {boolean} 是否切换成功
     */
    switchAudience(callId, audience) {
        return avengineKitPlugin.switchAudience(callId, audience);
    }

    /**
     * 将视频通话，降级到语音通话
     * @param {string} callId 通话 id
     */
    downgrade2Voice(callId) {
        avengineKitPlugin.downgrade2Voice(callId);
    }

    /**
     * 邀请新的通话成员
     * @param {string} callId 通话 id
     * @param {[string]} userIds 新参与者 id 列表
     */
    inviteNewParticipant(callId, userIds) {
        avengineKitPlugin.inviteNewParticipant(callId, userIds);
    }

    /**
     * 设置本地视频流容器 view
     * @param {string} callId 通话 id
     * @param {number} ref 容器 view 的 id
     */
    setLocalVideoView(callId, ref) {
        avengineKitPlugin.setLocalVideoView(callId, ref);
    }

    /**
     * 设置远程视频流容器 view
     * @param {string} callId 通话 id
     * @param {string} userId 用户 id
     * @param {number} ref 容器 view 的 id
     * @param {boolean} screenSharing 是否是屏幕共享
     */
    setRemoteVideoView(callId, userId, ref, screenSharing = false) {
        avengineKitPlugin.setRemoteVideoView(callId, userId, screenSharing, ref);
    }

    /**
     * 获取除自己外，所有通话参与者的 {@link ParticipantProfile}
     * @param {string} callId 通话 id
     * @return {[ParticipantProfile]}
     */
    getParticipantProfiles(callId) {
        let str = avengineKitPlugin.getParticipantProfiles(callId)
        if (!str) {
            return [];
        }
        let profiles = [];
        let ps = JSON.parse(str);
        ps.map(p => {
            profiles.push(Object.assign(new ParticipantProfile(), p));
        });
        return profiles;
    }

    /**
     * 获取某个通话参与者（可以是自己）的{@link ParticipantProfile}
     * @param {string} callId 通话 id
     * @param {string} userId 用户 id
     * @param {boolean} screenSharing 是否是屏幕共享
     * @return {any| ParticipantProfile}
     */
    getParticipantProfile(callId, userId, screenSharing) {
        let str = avengineKitPlugin.getParticipantProfile(callId, userId, screenSharing);
        if (!str) {
            return null;
        }
        return Object.assign(new ParticipantProfile(), JSON.parse(str))
    }

    /**
     * 获取自己的 {@link ParticipantProfile}
     * @return {any|ParticipantProfile}
     * @param {string} callId
     */
    getMyProfile(callId) {
        let str = avengineKitPlugin.getMyProfile(callId);
        if (!str) {
            return null;
        }
        return Object.assign(new ParticipantProfile(), JSON.parse(str))
    }


    /**
     * 检查是否允许显示悬浮窗
     * @return {boolean}
     */
    checkOverlayPermission() {
        return avengineKitPlugin.checkOverlayPermission();
    }

    /**
     * 最小化
     * @param {string} callId
     * @param {string} focusVideoUser 视频通话/会议时有效，表示悬浮窗显示那个用户的视频流
     * 最小化，显示悬浮窗
     */
    minimize(callId, focusVideoUser = '') {
        avengineKitPlugin.minimize(callId, focusVideoUser);
        this.sessionCallback = null;
    }

    /**
     * 打开或关闭扬声器
     * @param {string} callId 通话 id
     * @param {boolean} speakerOn 是否打开扬声器
     */
    setSpeakerOn(callId, speakerOn) {
        avengineKitPlugin.setSpeakerOn(callId, speakerOn);
    }

    /**
     * 切换摄像头
     * @param {string} callId
     */
    switchCamera(callId) {
        avengineKitPlugin.switchCamera(callId);
    }
}

const self = new AVEngineKit();
export default self;
