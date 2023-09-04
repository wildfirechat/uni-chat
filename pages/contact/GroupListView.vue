<template>
    <div>
        <div class="group-item" v-for="(group, index) in sharedContactState.favGroupList" :key="index" @click="showGroup(group)">
            <img class="avatar" :src="group.portrait">
            <span class="single-line">{{ group.name }}</span>
        </div>
    </div>

</template>

<script>
import store from "../../store";
import Conversation from "../../wfc/model/conversation";
import ConversationType from "../../wfc/model/conversationType";

export default {
    name: "GroupListView",
    props: {},
    data() {
        return {
            sharedContactState: store.state.contact,
        }
    },
    methods: {
        showGroup(group) {
            let conversation = new Conversation(ConversationType.Group, group.target, 0);
            store.setCurrentConversation(conversation);
            this.$go2ConversationPage();
        }
    },
}
</script>

<style scoped>
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

.group-item {
    height: 50px;
    padding: 5px 10px;
    display: flex;
    font-size: 13px;
    align-items: center;
}

.group-item:active {
    background-color: #d6d6d6;
}

.group-item span {
    margin-left: 10px;
}

</style>
