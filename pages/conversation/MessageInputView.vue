<template>
    <div class="message-input-container">
<!--        <button>语音</button>-->
        <input type="text" placeholder="请输入" v-model="text">
        <!--        <button>+</button>-->
        <button @click="send">发送</button>
    </div>
</template>

<script>
import TextMessageContent from "../../wfc/messages/textMessageContent";
import ConversationInfo from "../../wfc/model/conversationInfo";
import wfc from "../../wfc/client/wfc";

export default {
    name: "MessageInputView",
    props: {
        conversationInfo: {
            type: ConversationInfo,
            required: true,
            default: null,
        },
    },
    data() {
        return {
            text: '',
        }
    },
    methods: {
        send() {
            if (this.text) {
                let textMessageContent = new TextMessageContent(this.text)
                wfc.sendConversationMessage(this.conversationInfo.conversation, textMessageContent);
                this.text = '';
            }
        }
    }
}
</script>

<style scoped>

.message-input-container {
    display: flex;
    align-items: center;
}

.message-input-container input {
    flex: 1;
}

</style>