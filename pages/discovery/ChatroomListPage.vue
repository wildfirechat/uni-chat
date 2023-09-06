<template>
    <div class="chatroom-container">
        <div class="item" @click="go2Chatroom(1)">
            <text>野火聊天室1</text>
        </div>
        <div class="item" @click="go2Chatroom(2)">
            <text>野火聊天室1</text>
        </div>
        <div class="item" @click="go2Chatroom(3)">
            <text>野火聊天室2</text>
        </div>
    </div>

</template>

<script>
import store from "../../store";
import Conversation from "../../wfc/model/conversation";
import ConversationType from "../../wfc/model/conversationType";

export default {
    name: "ChatroomListPage",
    data() {
        return {
            user: store.state.contact.selfUserInfo,
        }
    },
    methods: {
        go2Chatroom(index) {
            let conversation = new Conversation(ConversationType.ChatRoom, `chatroom${index}`, 0);
            store.setCurrentConversation(conversation);
            this.$go2ConversationPage();
        },
    }
}
</script>

<style scoped>

.chatroom-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: #fafafa;
}

.item {
    width: 100%;
    height: 50px;
    padding: 10px 10px;
    background: white;
    display: flex;
    align-items: center;
}

.item image {
    max-width: 15px;
    max-height: 15px;
    margin-right: 10px;
}

.item text {
    flex: 1;
}

.item i {
    color: #d6d6d6;
}

.item:active {
    background: #d6d6d6;
}


</style>
