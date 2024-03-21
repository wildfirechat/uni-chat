<template>
    <div class="conversation-info">
        <div class="conversation-action-container">
            <div @click="showCreateConversationModal" class="action-item">
                <div class="icon">+</div>
                <p>{{ $t('conversation.add_member') }}</p>
            </div>
        </div>
        <UserListView :users="users"
                     :show-category-label="false"
                     :padding-left="'20px'"
                     v-if="users"
        />
    </div>
</template>

<script>
import UserListView from "@/pages/user/UserListView";
import store from "@/store";

export default {
    name: "SingleConversationInfoPage",
    data() {
        return {
            conversationInfo: null,
            users: null,
            sharedContactState: store.state.contact,
        }
    },
    onLoad(option) {
        console.log('SingleConversationInfoPage onLoad')
        // #ifdef APP-NVUE
        const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
        // #endif
        // #ifndef APP-NVUE
        const eventChannel = this.getOpenerEventChannel();
        // #endif
        eventChannel.on('conversationInfo', (options) => {
            this.conversationInfo = options.conversationInfo;
            this.users = store.getConversationMemberUsrInfos(this.conversationInfo.conversation);

            uni.setNavigationBarTitle({
                title: this.conversationInfo.conversation._target._displayName,
            });
        })
    },
    components: {UserListView},
    methods: {
        showCreateConversationModal() {
            this.$pickUsers(
                {
                    users: this.sharedContactState.favContactList.concat(this.sharedContactState.friendList),
                    initialCheckedUsers: [this.conversationInfo.conversation._target],
                    uncheckableUsers: [this.conversationInfo.conversation._target],
                    confirmTitle: this.$t('common.add'),
                    successCB: (users) => {
                        let newPickedUsers = users;
                        newPickedUsers.push(this.conversationInfo.conversation._target)
                        store.createConversation(newPickedUsers);
                    }
                })
        },
        showUserInfo(user) {
            // TODO
            console.log('todo show userInfo', user);
        },
    },

    computed: {}
};
</script>

<style lang="css" scoped>
.conversation-info {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: flex-start;
    height: 100%;
    overflow: hidden;
}

.action-item {
    height: 50px;
    display: flex;
    padding-left: 20px;
    align-items: center;
}

.action-item .icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: 1px dashed #d6d6d6;
}

.action-item img {
    width: 40px;
    height: 40px;
}

.action-item p {
    margin-left: 10px;
    font-size: 13px;
}

.action-item:active {
    background-color: #d6d6d6;
}

</style>
