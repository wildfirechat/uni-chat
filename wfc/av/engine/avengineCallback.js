export class AvengineCallback {
    onReceiveCall(session) {
        console.log('onReceiveCall', session)
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
        // TODO ring
    }

    shouldStopRing() {
        console.log('shouldStopRing')
        // TODO stop ring
    }

    didCallEnded(reason, duration) {
        // TODO toast
        console.log('didCallEnded', reason, duration)
        let pages = getCurrentPages();
        let singleVoipRoute = 'pages/voip/Single'
        let multiVoipRoute = 'pages/voip/Single'
        let curRoute = pages[pages.length - 1].route;

        if (curRoute === singleVoipRoute || curRoute === multiVoipRoute) {
            uni.navigateBack({
                delta: 1,
                fail: err => {
                    console.log('nav back to conversationView err', err);
                }
            });
        }
    }
}

let self = new AvengineCallback();
export default self