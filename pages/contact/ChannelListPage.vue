<template>
    <div>
        <div v-for="(channel, index) in sharedContactState.channelList" :key="index" @click="showChannel(channel)">
            <div class="channel-item">
                <img class="avatar" :src="channel.portrait">
                <span class="single-line">{{ channel.name }}</span>
            </div>
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
        showChannel(channelInfo) {
            let conversation = new Conversation(ConversationType.Channel, channelInfo.channelId, 0);
            store.setCurrentConversation(conversation);
            this.$go2ConversationPage();
        }
    },
}
</script>

<style scoped>

.channel-item {
    height: 50px;
    padding: 5px 10px;
    display: flex;
    font-size: 13px;
    align-items: center;
}


.channel-item:active {
    background: #d6d6d6;
}

.channel-item span {
    margin-left: 10px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

</style>
