export default class CallSession {
	//通话ID
    callId;
    title;
    desc;
	//通话的发起者，如果发起者离开，会重新选举出最早加入者为发起者
    initiator;
	//邀请当前用户加入通话的用户
    inviter;
	//通话状态
    state;
	//开始时间
    startTime;
	//接通时间
    connectedTime;
	//结束时间
	endTime
	//会话
	conversation;
	//是否是音频
    audioOnly;
	//通话结束原因
    endReason;
	//是否是会议
	conference;
	//是否是观众，仅当会议有效
	audience;
	//是否是超级会议
	advanced;
	//是否是多人通话
	multiCall;
    // 是否关闭摄像头
    videoMuted;
    // 是否关闭麦克风
    audioMuted;

	//call状态
	static kWFAVEngineStateIdle = 0;
	static kWFAVEngineStateOutgoing = 1;
	static kWFAVEngineStateIncomming = 2;
	static kWFAVEngineStateConnecting = 3;
	static kWFAVEngineStateConnected = 4;

    //通话结束原因
    static   kWFAVCallEndReasonUnknown = 0;
    static   kWFAVCallEndReasonBusy = 1;
    static   kWFAVCallEndReasonSignalError = 2;
    static   kWFAVCallEndReasonHangup = 3;
    static   kWFAVCallEndReasonMediaError = 4;
    static   kWFAVCallEndReasonRemoteHangup = 5;
    static   kWFAVCallEndReasonOpenCameraFailure = 6;
    static   kWFAVCallEndReasonTimeout = 7;
    static   kWFAVCallEndReasonAcceptByOtherClient = 8;
    static   kWFAVCallEndReasonAllLeft = 9;
    static   kWFAVCallEndReasonRemoteBusy = 10;
    static   kWFAVCallEndReasonRemoteTimeout = 11;
    static   kWFAVCallEndReasonRemoteNetworkError = 12;
    static   kWFAVCallEndReasonRoomDestroyed = 13;
    static   kWFAVCallEndReasonRoomNotExist = 14;
    static   kWFAVCallEndReasonRoomParticipantsFull = 15;
}
