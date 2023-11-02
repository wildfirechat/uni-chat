export class AvengineCallback {
    onReceiveCall(session) {
        console.log('onReceiveCall', session)
        // TODO 判断下，如果现在正在处理音视频通话界面，直接忽略
        uni.navigateTo({
            url: '/pages/voip/Single',
            success: (res) => {
                console.log('navigate to voip/Single success')
                res.eventChannel.emit('callOptions', {
                    callSession: session,
                });
            },
            fail: (e) => {
                console.log('navigate to WebViewPage error', e)
            }
        })
    }

    shouldStartRing(isIncoming) {
        console.log('shouldStartRing', isIncoming);
    }

    shouldStopRing() {
        console.log('shouldStopRing')

    }

    didCallEnded(reason, duration) {
        console.log('didCallEnded', reason, duration)
        // TODO 关闭音视频通话页面
    }
}

let self = new AvengineCallback();
export default self