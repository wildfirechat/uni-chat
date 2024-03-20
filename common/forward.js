import store from "../store";

export default {
    install(app, options) {
        app.config.globalProperties.$forward = function (options) {
            uni.navigateTo({
                url: '/pages/conversation/message/forward/ForwardMessagePage',
                events: {
                    // pickedUsers: users => {
                    //     options.successCB && options.successCB(users);
                    // }
                },

                success: (res) => {
                    console.log('navigate success', res);
                    res.eventChannel.emit('forwardOptions', {
                        forwardType: options.forwardType,
                        messages: options.messages,
                    });
                },
                fail: (err) => {
                    console.log('navigate error', err)
                },
                complete: () => {
                    console.log('navigate complete');
                }
            })
        };
    }
}
