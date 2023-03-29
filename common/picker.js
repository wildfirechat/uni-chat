import store from "../store";

export default {
    install(Vue) {
        Vue.prototype.$pickUser = function (options) {
            uni.navigateTo({
                url: '/pages/pick/PickUserPage',
                events: {
                    pickedUsers: users => {
                        options.successCB && options.successCB(users);
                    }
                },

                success: (res) => {
                    res.eventChannel.emit('pickOptions', {
                        users: options.users ? options.users : store.state.contact.favContactList.concat(store.state.contact.friendList),
                        initialCheckedUsers: options.initialCheckedUsers,
                        uncheckableUsers: options.uncheckableUsers,
                        showCategoryLabel: options.showCategoryLabel !== false,
                        confirmTitle: options.confirmTitle ? options.confirmTitle : '确定',
                    });
                }
            })
        };
    }
}
