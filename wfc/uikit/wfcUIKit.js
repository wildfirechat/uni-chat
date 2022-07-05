import {na} from "../../vendor/pinyin/data/dict-zi-web";

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
    enableNativeNotificaiton(enable) {
        uniWfcUIKit.enableNativeNotificaiton(enable);
    }
}

const self = new WfcUIKit();
export default self;