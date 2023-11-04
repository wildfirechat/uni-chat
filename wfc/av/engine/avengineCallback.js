import ConversationType from "../../model/conversationType";
import CallSession from "./callSession";

export class AvengineCallback {
    onReceiveCall(session) {
        console.log('onReceiveCall', session)
        session = Object.assign(new CallSession(), JSON.parse(session));
        let url;
        if (session.conversation.type === ConversationType.Single) {
            url = '/pages/voip/Single'
        } else if (session.conversation.type === ConversationType.Group) {
            // TODO multi
            url = '/pages/voip/Multi'
        }
        if (url) {
            uni.navigateTo({
                url: url,
                success: (res) => {
                    console.log(`navigate to ${url} success`)
                    res.eventChannel.emit('callOptions', {
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
        let multiVoipRoute = 'pages/voip/Multi'
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