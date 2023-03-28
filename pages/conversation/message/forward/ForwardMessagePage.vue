<template>
    <div>
        <ForwardMessageByPickConversationView v-if=" forwardTargetType === 'pickConversation' && messages.length > 0"
                                              :messages="messages"
                                              @forward-target-type="changeForwardTargetType"
                                              :forward-type="forwardType"/>
        <ForwardMessageByCreateConversationView v-if="forwardTargetType !== 'pickConversation' && messages.length > 0"
                                                :messages="messages"
                                                @forward-target-type="changeForwardTargetType"
                                                :forward-type="forwardType"/>
    </div>
</template>

<script>
import ForwardMessageByPickConversationView from "./ForwardMessageByPickConversationView.vue";
import ForwardMessageByCreateConversationView from "./ForwardMessageByCreateConversationView.vue";
import ForwardType from "./ForwardType";
import store from "../../../../store";

export default {
    name: "ForwardMessagePage",
    components: {
        ForwardMessageByCreateConversationView,
        ForwardMessageByPickConversationView
    },

    data() {
        return {
            forwardType: ForwardType.NORMAL,
            messages: [],
            sharedPickState: store.state.pick,
            forwardTargetType: 'pickConversation',
        }
    },

    onLoad(option) {
        console.log('ForwardMessageByPickConversationView onLoad')
        // #ifdef APP-NVUE
        const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
        // #endif
        // #ifndef APP-NVUE
        const eventChannel = this.getOpenerEventChannel();
        // #endif
        // 监听openerUsers事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('forwardOptions', (options) => {
            this.forwardType = options.forwardType;
            this.messages = options.messages;
            console.log('to forward messagse', this.messages);
        })
    },

    onUnload() {
        this.sharedPickState.conversations = [];
        this.sharedPickState.messages = [];
        this.sharedPickState.users = [];
    },

    methods: {
        changeForwardTargetType(type) {
            this.forwardTargetType = type;
        }
    },

}
</script>

<style scoped>

</style>