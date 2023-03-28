<template>
    <div class="pick-user-container">
        <div class="user-list-panel">
            <div class="input-container">
                <input type="text" :placeholder="$t('common.search')" v-model="query">
            </div>
            <div class="user-list-container">
                <div class="back" @click="backPickConversation">
                    <p>{{ $t('common.back') }}</p>
                </div>
                <CheckableUserListView class="user-list"
                                       :enable-pick="true"
                                       :users="filteredUsers"
                                       :padding-left="'20px'"
                                       :enable-category-label-sticky="true"/>
            </div>
        </div>
        <div class="checked-user-list-container">
            <header>
                <h2>{{ $t('conversation.forward_title') }}</h2>
                <span v-if="sharedPickState.users.length === 0">{{ $t('conversation.picked_contact') }}</span>
                <span v-else>{{ $t('conversation.picked_contact') + this.sharedPickState.users.length }}</span>
                <button size="mini" @click="confirm" class="confirm">{{ $t('common.send') }}</button>
            </header>
            <div class="content">
                <div class="picked-user-container" v-for="(user, index) in sharedPickState.users" :key="index">
                    <div class="picked-user" @click="unpick(user)">
                        <img class="avatar" :src="user.portrait" :alt="user + index">
                        <!--                        <button @click="unpick(user)" class="unpick-button">x</button>-->
                    </div>
                    <span class="name single-line">{{ user.displayName }}</span>
                </div>
            </div>

            <ForwardMessageView ref="forwardMessageView"
                                :forward-type="forwardType"
                                :messages="messages"/>
            <!--            <footer>-->
            <!--                <button @click="cancel" class="cancel">{{ $t('common.cancel') }}</button>-->
            <!--                <button @click="confirm" class="confirm">{{ $t('common.send') }}</button>-->
            <!--            </footer>-->
        </div>
    </div>
</template>

<script>
import store from "@/store";
import ForwardMessageView from "@/pages/conversation/message/forward/ForwardMessageView";
import CheckableUserListView from "@/pages/user/CheckableUserListView";
import Config from "@/config";

export default {
    name: "ForwardMessageByCreateConversationView",
    props: {
        forwardType: {
            // 可参考ForwardType
            type: Number,
            required: false,
        },
        messages: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            users: store.state.contact.friendList,
            sharedPickState: store.state.pick,
            query: '',
        }
    },
    methods: {
        unpick(user) {
            store.pickOrUnpickUser(user, false);
        },

        backPickConversation() {
            this.sharedPickState.users.length = 0
            this.$emit('forward-target-type', 'pickConversation')
        },

        confirm() {
            let pickedUsers = [...this.sharedPickState.users];
            this.sharedPickState.users.length = 0
            let extraMessageText = this.$refs['forwardMessageView'].extraMessageText;
            store.forwardByCreateConversation(this.forwardType, pickedUsers, this.messages, extraMessageText)
            uni.navigateBack();
        },
    },

    computed: {
        filteredUsers() {
            let result;
            if (this.query && this.query.trim()) {
                result = store.filterContact(this.query)
            } else {
                result = this.users;
            }
            return result.filter(u => u.uid !== Config.FILE_HELPER_ID)
        }
    },

    components: {
        CheckableUserListView,
        ForwardMessageView
    },
}
</script>

<style lang="css" scoped>
.pick-user-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
}

.user-list-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #f7f7f7;
    overflow: hidden;
}

.user-list-panel .input-container {
    display: flex;
    width: 100%;
}

.user-list-panel input {
    height: 25px;
    margin: 15px 20px 0 15px;
    flex: 1;
    border-radius: 3px;
    border: 1px solid #ededed;
    background-color: white;
    padding-left: 10px;
    text-align: left;
}

.user-list-panel .user-list-container {
    height: 100%;
    overflow: auto;
}

.user-list-container .back {
    background-color: #f7f7f7;
    height: 40px;
    font-size: 13px;
    padding-left: 15px;
    display: flex;
    align-items: center;
}

.user-list-container .back:active {
    background-color: #e5e5e5;
}

.checked-user-list-container {
    display: flex;
    flex-direction: column;
    min-height: 230px;
}

.checked-user-list-container header {
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.checked-user-list-container header h2 {
    font-size: 16px;
    font-weight: normal;
    margin-left: 30px;
}

.checked-user-list-container header span {
    font-size: 12px;
    margin-right: 20px;
}

.checked-user-list-container header button {
    font-size: 12px;
    margin-right: 20px;
    color: #4168e0;
}


.checked-user-list-container .content {
    height: 100%;
    flex: 1;
    display: flex;
    padding: 0 30px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    overflow: scroll;
}

.checked-user-list-container .content .picked-user-container {
    width: 20%;
    display: flex;
    flex-direction: column;
    column-count: 1;
    justify-content: center;
    align-content: center;
    padding: 5px 10px;
}

.checked-user-list-container .content .picked-user-container .name {
    width: 100%;
    font-size: 12px;
}

.checked-user-list-container .content .picked-user-container .picked-user {
    position: relative;
    height: 65px;
    width: 65px;
}

.checked-user-list-container .content .avatar {
    width: 45px;
    height: 45px;
    margin: 10px 10px;
    border-radius: 3px;
}

.checked-user-list-container .content .unpick-button {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid white;
    border-radius: 10px;
    top: 0;
    right: 0;
}

.checked-user-list-container .content .unpick-button:active {
    background-color: #e5e5e5;
}

.checked-user-list-container footer {
    height: 55px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
}

.checked-user-list-container footer button {
    padding: 5px 30px;
    border-radius: 4px;
    border: 1px solid #cccccc;
}

.checked-user-list-container footer button.confirm {
    background-color: #20bf64;
    margin-left: 20px;
    margin-right: 20px;
}


</style>
