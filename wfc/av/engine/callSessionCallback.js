/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

export default class CallSessionCallback {

    /**
     *  自己挂断回调
     * @param {number} reason 挂断原因，参考{@link CallEndReason}
     */
    didCallEndWithReason(reason) {
        console.log('didCallEndWithReason', reason)

    }

    /**
     * 可用来实现响铃相关
     * 1. outgoing -> connecting: 开始 -> 结束播放呼出铃声
     * 2. incoming -> connecting: 开始 -> 结束播放呼入铃声
     *  自己通话状态变化时调用
     * @param {CallState} state 状态
     */
    didChangeState(state) {
        console.log('didChangeState', state)
    }

    /**
     * 新参与者加入回调
     * @param {string} userId 用户 id
     * @param {boolean} screenSharing 是否是屏幕共享
     */
    didParticipantJoined(userId, screenSharing = false) {
        console.log('didParticipantJoined', userId, screenSharing);

    }

    /**
     * 参与者连接成功
     * @param {string} userId 用户 id
     * @param {boolean} screenSharing 是否是屏幕共享
     */
    didParticipantConnected(userId, screenSharing = false) {
        console.log('didParticipantConnected', userId, screenSharing)
    }

    /**
     * 参与者挂断回调
     * @param {string} userId 用户 id
     * @param {CallEndReason} callEndReason 挂断原因
     * @param {boolean} screenSharing 是否是屏幕共享
     */
    didParticipantLeft(userId, callEndReason, screenSharing = false) {
        console.log('didParticipantLeft', userId, callEndReason, screenSharing)
    }

    /**
     * 视频通话切换到语音通话回调
     * @param {boolean} audioOnly 目前都是 true
     */
    didChangeMode(audioOnly) {
        console.log('didChangeMode', audioOnly)
    }

    /**
     * 发起者变更回调，多人通话过程中，原始发起者退出通话，会触发选举新的发起者
     * @param {string} initiator 新的发起者
     */
    didChangeInitiator(initiator) {
        console.log('didChangeInitiator', initiator)
    }

    /**
     * 本地音视频流创建成功回调
     * @param {boolean} screenSharing 是否是屏幕共享
     */
    didCreateLocalVideoTrack(screenSharing) {
        console.log('didCreateLocalVideoTrack', screenSharing)
    }

    /**
     *  收到用户远程视频流回调
     * @param {String} userId 用户 id
     * @param {boolean} screenSharing 是否是屏幕共享
     */
    didReceiveRemoteVideoTrack(userId, screenSharing) {
        console.log('didReceiveRemoteVideoTrack', userId, screenSharing)
    }

    /**
     * 用户视频流被移除回调
     * @param {String} userId
     */
    didRemoveRemoteVideoTrack(userId) {
        console.log('didRemoveRemoteVideoTrack', userId)

    }

    didAudioDeviceChanged(audioDevice) {
        console.log('didAudioDeviceChanged', audioDevice)
    }

    didError(error) {
        console.log('didError', error)
    }

    didGetStats(reports) {

    }

    /**
     * 单人、多人音视频通话时生效，会议时调用的是 {@link didMuteStateChanged}
     * @param {string} userId
     * @param {boolean} muted
     */
    didVideoMuted(userId, muted) {
        console.log('didVideoMuted', userId, muted)
    }


    /**
     * 高级版生效，多人版调用的是 {@link didVideoMuted}
     * @param {[string]} participants
     */
    didMuteStateChanged(participants) {
        console.log('didMuteStateChanged', participants)
    }

    /**
     * 当前用户发送媒体丢包回调
     * @param media 媒体类型，audio 或 video
     * @param lostPacket 丢包数
     * @param {boolean} screenSharing
     */
    didMediaLostPacket(media, lostPacket, screenSharing = false) {
        console.log('didMediaLostPacket', media, lostPacket, screenSharing)
    }

    /**
     * 接收用户媒体丢包回调
     * @param userId 用户id
     * @param media 媒体类型，audio 或 video
     * @param lostPacket 丢包数
     * @param uplink 方向，true是对方丢的，false是己方丢的
     * @param {boolean} screenSharing
     */
    didUserMediaLostPacket(userId, media, lostPacket, uplink, screenSharing = false) {
        console.log('didUserMediaLostPacket', userId, media, lostPacket, uplink, screenSharing)
    }

    /**
     * 会议时有效
     * 听众或互动者角色变更回调
     * @param {string} userId
     * @param {boolean} audience
     * @param {boolean} screenSharing
     */
    didChangeType(userId, audience, screenSharing = false) {
        console.log('didChangeType', userId, audience, screenSharing)
    }

    /**
     * 音量回调
     * @param {string} userId 用户 id
     * @param {number} volume 音量
     */
    didReportAudioVolume(userId, volume) {

    }

    /**
     * 会议时有效
     * 听众和互动者角色切换回调
     * @param {boolean} audience 是否是切换为听众
     */
    onRequestChangeMode(audience) {
        console.log('onRequestChangeMode', audience)
    }
}
