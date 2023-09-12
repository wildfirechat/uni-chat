<template>
    <section class="composite-page">
        <div v-if="!compositeMessage" style="display: flex; justify-content: center; align-items: center">
            加载中...
        </div>
        <ul v-else>
            <li v-for="(message, index) in compositeMessage.messageContent.messages"
                :key="message.uid">
                <div class="message-container">
                    <div class="portrait-container">
                        <img
                            v-if="index === 0 || message.from !== compositeMessage.messageContent.messages[index -1].from"
                            alt="" :src="message._from.portrait">
                    </div>
                    <div class="name-time-content-container">
                        <div class="name-time-container">
                            <p class="name"> {{ message._from._displayName }}</p>
                            <p class="time"> {{ message._timeStr }}</p>
                            <!--                            <p class="time"> 1223</p>-->
                        </div>
                        <div class="content">
                            <!--message content-->
                            <TextMessageContentView :message="message"
                                                    v-if="message.messageContent.type === 1"
                                                    :style="{'--out-arrow-color':'#98ea70', '--in-arrow-color':'white'}"
                                                    v-bind:class="{leftarrow:message.direction === 1, rightarrow: message.direction === 0}"/>
                            <!--                            <AudioMessageContentView :message="message"-->
                            <!--                                                     v-else-if="message.messageContent.type === 2"/>-->
                            <ImageMessageContentView :message="message"
                                                     :is-in-composite-view="true"
                                                     v-else-if="message.messageContent.type === 3"/>
                            <!--                           v-bind:class="{leftarrow:message.direction === 1, rightarrow: message.direction === 0}"/>-->
                            <FileMessageContentView :message="message"
                                                    v-else-if="message.messageContent.type === 5"
                                                    v-bind:class="{leftarrow:message.direction === 1, rightarrow: message.direction === 0}"/>
                            <VideoMessageContentView :message="message"
                                                     :is-in-composite-view="true"
                                                     v-else-if="message.messageContent.type === 6"/>
                            <!--                           v-bind:class="{leftarrow:message.direction === 1, rightarrow: message.direction === 0}"/>-->
                            <StickerMessageContentView :message="message"
                                                       v-else-if="message.messageContent.type === 7"/>
                            <CompositeMessageContentView :message="message"
                                                         v-else-if="message.messageContent.type === 11"/>
                            <!--                            <CallStartMessageContentView :message="message"-->
                            <!--                                                         v-else-if="message.messageContent.type === 400"/>-->
                            <!--                            <ConferenceInviteMessageContentView :message="message"-->
                            <!--                                                                v-else-if="message.messageContent.type === 408"/>-->
                            <UnsupportMessageContentView :message="message"
                                                         v-else-if="[2, 10, 400, 408].indexOf(message.messageContent.type) >= 0"/>
                            <UnknowntMessageContentView :message="message"
                                                        v-else
                                                        v-bind:class="{leftarrow:message.direction === 1, rightarrow: message.direction === 0}"/>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </section>

</template>

<script>
import TextMessageContentView from "@/pages/conversation/message/content/TextMessageContentView";
import UnsupportMessageContentView from "@/pages/conversation/message/content/UnsupportMessageContentView";
import store from "../../../store";
import CompositeMessageContentView from "@/pages/conversation/message/content/CompositeMessageContentView";
import ImageMessageContentView from "@/pages/conversation/message/content/ImageMessageContentView";
import VideoMessageContentView from "@/pages/conversation/message/content/VideoMessageContentView";
import FileMessageContentView from "@/pages/conversation/message/content/FileMessageContentView";
import StickerMessageContentView from "@/pages/conversation/message/content/StickerMessageContentView";
import UnknowntMessageContentView from "@/pages/conversation/message/content/UnknownMessageContentView";

export default {
    name: "CompositeMessagePage",
    data() {
        return {
            message: null,
            compositeMessage: null,
        }
    },

    onLoad(option) {
        console.log('CompositeMessagePage onLoad')
        // #ifdef APP-NVUE
        const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
        // #endif
        // #ifndef APP-NVUE
        const eventChannel = this.getOpenerEventChannel();
        // #endif
        // 监听openerUsers事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('options', (options) => {
            this.message = options.message;
            store._patchMessage(this.message, 0);
            if (this.message.messageContent.remotePath) {
                this.loadMediaCompositeMessage(this.message);
            } else {
            	this.compositeMessage = this.message;
            }

            uni.setNavigationBarTitle({
                title: this.message.messageContent.title
            });
        })
    },

    mounted() {
        // do nothing
    },

    methods: {
        loadMediaCompositeMessage(msg) {
            let content = msg.messageContent;
            console.log('to load', msg, content.remotePath);
            uni.request({
                url: content.remotePath,
                dataType: 'string',
                success: (res) => {
                    content._decodeMessages(res.data);
                    store._patchMessage(this.message, 0);
                    this.compositeMessage = this.message;
                    content.loaded = true;
                }
            })

        }
    },

    components: {
        UnknowntMessageContentView,
        // ConferenceInviteMessageContentView,
        CompositeMessageContentView,
        // AudioMessageContentView,
        // CallStartMessageContentView,
        UnsupportMessageContentView,
        TextMessageContentView,
        ImageMessageContentView,
        VideoMessageContentView,
        FileMessageContentView,
        StickerMessageContentView,
    }
}
</script>

<style scoped>

.composite-page {
    width: var(--composite-message-page-width);
    height: var(--composite-message-page-height);
    background: #f7f7f7;
    overflow: scroll;
}

.close-button-container {
    position: absolute;
    padding: 5px 10px 10px 5px;
    top: 0;
    right: 0;
}

.close-button-container:active {
    background: lightgrey;
}

.composite-page ul {
    width: 100%;
    height: 100%;
    padding: 20px 30px;
    list-style-position: inside;
}

.composite-page ul li {
    position: relative;
    padding: 10px 0;
}

.composite-page ul li:not(:last-child)::after {
    content: "";
    width: calc(100% - 55px);
    position: absolute;
    margin-left: 55px;
    padding: 5px 0;
    border-bottom: 1px solid #f1f1f1;
}

.message-container {
    width: 100%;
    display: flex;
}

.name-time-content-container {
    width: 100%;
}

.name-time-container {
    width: 100%;
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
}

.name-time-container p {
    font-size: 12px;
    color: #c2c2c2;
}

.name-time-content-container .content {
    display: inline-block;
    margin-left: -10px;
}

.portrait-container {
    width: 40px;
    height: 40px;
    overflow: hidden;
    margin: 10px;
}

.portrait-container img {
    width: 100%;
    height: 100%;
    border-radius: 3px;
}

>>> .text-message-container.out {
    background-color: #f7f7f7;
}

>>> .text-message-container {
    background-color: #f7f7f7;
    padding-left: 0;
}

>>> .rightarrow::before {
    display: none;
}

>>> .leftarrow::before {
    display: none;
}

</style>
