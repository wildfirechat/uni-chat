<template>
    <div class="composite-message-container"
         @click="showCompositePage"
         v-bind:class="{out:message.direction === 0}">
        <p class="title">{{ title }}</p>
        <p @click="showCompositePageC" class="content" v-html="this.content"></p>
        <p class="desc">{{ $t('message.records') }}</p>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import {parser as emojiParse} from "@/emoji/emoji";
import wfc from "@/wfc/client/wfc";
import ConversationType from "@/wfc/model/conversationType";

export default {
    name: "CompositeMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        }
    },

    computed: {
        title() {
            let compositeMessageContent = this.message.messageContent;
            return compositeMessageContent.title;
        },
        content() {
            let compositeMessageContent = this.message.messageContent;
            let messages = compositeMessageContent.messages;
            let str = '';
            let conversation = messages[0].conversation;
            let groupId = conversation.type === ConversationType.Group ? conversation.target : '';
            for (let i = 0; i < messages.length && i < 4; i++) {
                str += wfc.getGroupMemberDisplayName(groupId, messages[i].from) + ': ' + emojiParse(messages[i].messageContent.digest(messages[i]));
                str += '\n';
            }
            return str;
        }
    },

    methods: {
        showCompositePageC(){
            console.log('showCompositePageC');
            this.showCompositePage();
        },
        showCompositePage() {
            console.log('to navigate to CompositeMessagePage', this.message)
            uni.navigateTo({
                url: `/pages/conversation/message/CompositeMessagePage`,
                success: (res) => {
                    console.log('navigate to CompositeMessagePage success')
                    res.eventChannel.emit('options', {
                        message: this.message,
                    });
                },
                fail: (e) => {
                    console.log('navigate to CompositeMessagePage error', e)
                }
            });
        }
    }
}
</script>

<style lang="css" scoped>
.composite-message-container {
    margin: 0 10px;
    padding: 10px;
    background-color: white;
    position: relative;
    border-radius: 5px;
}

.composite-message-container p {
    user-select: text;
    white-space: pre-line;
}

.composite-message-container .title {
    color: #050505;
    font-size: 15px;
}

.composite-message-container .content, .desc {
    padding: 5px 0;
    font-size: 14px;
    color: #b2b2b2;
}

.composite-message-container .desc {
    border-top: 1px solid #f2f2f2;
    padding: 5px 0 0 0;
}

</style>
