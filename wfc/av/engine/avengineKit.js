import avengineCallback from "./avengineCallback";

const avengineKitPlugin = uni.requireNativePlugin("wf-uni-wfc-uikit");

import CallSession from './callSession';

export class AVEngineKit {

    avengineCallback = avengineCallback;

    sessionCallback;

    /**
     * 判断 UIKit 原生插件是否集成
     * @return {boolean}
     */
    isAVEngineKitEnable() {
        return !!avengineKitPlugin;
    }

    init() {
        avengineKitPlugin.initAVEngineKit();
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
        }
    }

    _handleNativeCallSessionEvent(e) {
        let args = e.args;
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
     * @param {string} audioOnly 是否只开启音频
     * @param {string} pin 会议pin码
     * @param {string} host 会议主持人
     * @param {string} title 会议标题
     * @param {string} desc 会议描述
     * @param {string} audience 是否是以观众角色入会
     * @param {string} advance 是否是高级会议
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
     * 配置允许 UIKit 层处理后台通知
     */
    enableNativeNotification(enable) {
        avengineKitPlugin.enableNativeNotification(enable);
    }

    /**
     * 获取当前通话会话
     *
     * @@return {callSession}
     */
    currentCallSession() {
        let result = avengineKitPlugin.currentCallSession();
        if (result === '') {
            return null;
        }

        return Object.assign(new CallSession(), JSON.parse(result));
    }

    answerCall(callId, audioOnly) {
        avengineKitPlugin.answerCall(callId, audioOnly);
    }

    /**
     * @param {Object} callId 通话ID
     */
    endCall(callId) {
        avengineKitPlugin.endCall(callId);
    }

    setVideoView(userId, ref) {
        avengineKitPlugin.setVideoView(userId, ref);
    }

    setRemoteVideoView(userId, ref, screenSharing = false) {
        avengineKitPlugin.setRemoteVideoView(userId, false, ref);
    }
}

const self = new AVEngineKit();
export default self;
