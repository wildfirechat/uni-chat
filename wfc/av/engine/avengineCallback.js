import ConversationType from "../../model/conversationType";
import CallSession from "./callSession";

export class AvengineCallback {
    innerAudioContext

    onReceiveCall(session) {
        console.log('onReceiveCall', session)
        if (typeof session === 'string') {
            session = Object.assign(new CallSession(), JSON.parse(session));
        }
        let url;
        if (session.conversation.type === ConversationType.Single) {
            url = '/pages/voip/Single'
        } else if (session.conversation.type === ConversationType.Group) {
            // TODO multi
            url = '/pages/voip/Multi'
        }
        url += `?session=${JSON.stringify(session)}`
        if (url) {
            uni.navigateTo({
                url: url,
                success: (res) => {
                    console.log(`navigate to ${url} success`)
                    res.eventChannel.emit('options', {
                        callSession: session,
                    });
                },
                fail: (e) => {
                    console.log(`navigate to ${url} error`, e)
                }
            })
        }
    }

    shouldStartRing(isIncoming) {
        self.innerAudioContext = uni.createInnerAudioContext();
        self.innerAudioContext.src = isIncoming ? '/static/audios/incoming_call_ring.mp3' : '/static/audios/outgoing_call_ring.mp3'
        self.innerAudioContext.autoplay = true;
        self.innerAudioContext.loop = true;
        self.innerAudioContext.play()
        self.innerAudioContext.onPlay(() => {
            console.log('开始播放');
        });
        self.innerAudioContext.onError((e) => {
            console.error('播放响铃失败', e)
        })
    }

    shouldStopRing() {
        console.log('shouldStopRing')
        self.innerAudioContext.stop()
        self.innerAudioContext.destroy()
        self.innerAudioContext = null
    }

    didCallEnded(reason, duration) {
        // TODO toast
        console.log('didCallEnded', reason, duration)
        let pages = getCurrentPages();
        let singleVoipRoute = 'pages/voip/Single'
        let multiVoipRoute = 'pages/voip/Multi'
        let conferenceVoipRoute = 'pages/voip/conference/ConferencePage'
        let curRoute = pages[pages.length - 1].route;

        if (curRoute === singleVoipRoute || curRoute === multiVoipRoute || curRoute === conferenceVoipRoute) {
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