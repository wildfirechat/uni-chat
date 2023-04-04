const uniWfcUIKit = uni.requireNativePlugin("wf-uni-wfc-uikit");

export class WfcUIKit {

    /**
     * 判断 UIKit 原生插件是否集成
     * @return {boolean}
     */
    isUIKitEnable() {
        return !!uniWfcUIKit;
    }

    /**
     *
     * @param {Conversation} conversation 会话
     */
    startConversation(conversation) {
        uniWfcUIKit.startConversation(JSON.stringify(conversation));
    }

    /**
     * 发起单人音视频通话
     * @param {string} userId 用户 id
     * @param {boolean} audioOnly 是否是音频通话
     */
    startSingleCall(userId, audioOnly) {
        uniWfcUIKit.startSingleCall(userId, audioOnly);
    }

    /**
     * 发起群音视频通话
     * @param {string} groupId 群 id
     * @param {[string]} participants 参与者 id，要求是群成员
     * @param {boolean} audioOnly 是否是音频通话
     */
    startMultiCall(groupId, participants, audioOnly) {
        uniWfcUIKit.startMultiCall(groupId, participants, audioOnly)
    }

    /**
     * @deprecated 已废弃
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
     */
    startConference(callId, audioOnly, pin, host, title, desc, audience, advance, record = false, callExtra = '') {
        uniWfcUIKit.startConference(callId, audioOnly, pin, host, title, desc, audience, advance, record, callExtra);
    }

    /**
     * @deprecated 已废弃
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
     */
    joinConference(callId, audioOnly, pin, host, title, desc, audience, advance, muteAudio, muteVideo, callExtra = '') {
        uniWfcUIKit.joinConference(callId, audioOnly, pin, host, title, desc, audience, advance, muteAudio, muteVideo, callExtra);
    }

    /**
     * 设置 app server 信息
     * @param {string} appServerAddress 应用服务地址
     * @param {string} authToken 成功登录应用服务后，返回的authToken header
     */
    setupAppServer(appServerAddress, authToken) {
        uniWfcUIKit.setupAppServer(appServerAddress, authToken);
    }

    /**
     * 打开原生会议详情界面
     * @param {string} conferenceId 会议号
     * @param {string} password 会议密码
     */
    showConferenceInfo(conferenceId, password) {
        uniWfcUIKit.showConferenceInfo(conferenceId, password)
    }

    /**
     * 打开原生会议入口界面
     */
    showConferencePortal() {
        uniWfcUIKit.showConferencePortal();
    }

    /**
     * 判断是否支持多人音视频通话
     * @return {boolean}
     */
    isSupportMultiCall() {
        return uniWfcUIKit.isSupportMultiCall();
    }

    /**
     * 判断是否支持会议
     * @return {boolean}
     */
    isSupportConference() {
        return uniWfcUIKit.isSupportConference();
    }

    /**
     * 设置视频通话时的视频属性
     * @param {number} profile 可选值参考{@link VideoProfile}
     * @param {boolean} swapWidthHeight 是否交换宽高，默认不不用设置
     */
    setVideoProfile(profile, swapWidthHeight = false) {
        uniWfcUIKit.setVideoProfile(profile, swapWidthHeight);
    }

    /**
     * 添加 ICE Server
     * @param {string} url
     * @param {string} name
     * @param {string} password
     */
    addICEServer(url, name, password) {
        uniWfcUIKit.addICEServer(url, name, password)
    }

    /**
     * 配置允许 UIKit 层处理后台通知
     */
    enableNativeNotification(enable) {
        uniWfcUIKit.enableNativeNotification(enable);
    }
}

const self = new WfcUIKit();
export default self;
