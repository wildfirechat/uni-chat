<template>
    <view>
        <view class="wf-message-input-container">
            <view class="wf-message-input-toolbar">
                <view class="wf-input-button-icon wxfont" @click="toggleVoice" :class="showVoice ? 'keyboard' : 'voice'"></view>
                <view class="wf-input-button-icon wxfont" v-if="isPttEnable" @click="togglePtt" :class="showPtt ? 'keyboard' : 'voice_playing'"></view>
                <view class="wf-input-voice-container" v-if="showVoice">
                    <AudioInputView :conversation-info="conversationInfo"></AudioInputView>
                </view>
                <view class="wf-input-voice-container" v-else-if="showPtt">
                    <PttAudioInputView :conversation-info="conversationInfo"></PttAudioInputView>
                </view>
                <view v-else style="width: 100%">
                    <view class="wf-input-text-container">
                        <textarea ref="textarea" @focus="onInputFocus" :focus="inputFocus" class="wf-input-textarea" @input="onInput" :value="text" placeholder="" hold-keyboard confirm-type="send" @confirm="send(text)" :maxlength="-1" auto-height/>
                    </view>
                    <view v-if="sharedConversationState.quotedMessage" class="quote-message-container">
                        <view class="quoted-message single-line">{{ sharedConversationState.quotedMessage.messageContent.digest(sharedConversationState.quotedMessage) }}</view>
                        <view class="cancel icon-ion-close" @click="cancelQuote"></view>
                    </view>
                </view>
                <view @click.prevent="toggleEmoji" class="wf-input-button-icon wxfont emoji"></view>
                <view v-if="!hideSendButton && text !== ''" class="wf-input-text-send-button" @touchstart.prevent="" @touchmove.prevent="" @touchend.prevent="send(text)"
                      :style="{ background: text !== '' ? '#4168e0' : '#F7F7F7', color: text !== '' ? '#fff' : '#ddd', 'border-color': text !== '' ? '#1BC418' : '#ddd' }">发送
                </view>
                <view v-if="hideSendButton || text === ''" @click="toggleExt" class="wf-input-button-icon wxfont add2"></view>
            </view>
            <view v-if="showExt" class="wf-ext-container" :style="'height: ' + keyboardHeight + 'px'">
                <view class="wf-ext-item" v-for="(v, i) in extList" @click="onClickExt(v)" :key="i">
                    <view class="wf-ext-item-icon">
                        <view class="wxfont" :class="v.icon"></view>
                    </view>
                    <view class="wf-ext-item-text">{{ v.title }}</view>
                </view>
            </view>
            <view v-if="showEmoji" class="wf-stickers-container" :style="'height: ' + keyboardHeight + 'px'">
                <view class="category-container">
                    <view class="category" v-for="(v, i) in emojiStickerList" :key="i" @click="onCategoryClick(i)">
                        <img :src="v.poster" v-bind:class="{active: i === currentEmojiStickerIndex}">
                    </view>
                </view>
                <scroll-view v-if="currentEmojiStickerIndex === 0" :scroll-y="true" class="wf-emoji-container" :style="'height: ' + (keyboardHeight - 60) + 'px'">
                    <view class="wf-emoji-content">
                        <view class="emoji-item" @click="onClickEmoji(v)" v-for="(v,i) in emojiStickerList[0].emojis" :key="i">{{ v }}</view>
                    </view>
                </scroll-view>
                <scroll-view v-else :scroll-y="true" class="wf-sticker-container" :style="'height: ' + (keyboardHeight - 60) + 'px'">
                    <view class="wf-sticker-content">
                        <img :src="s" class="sticker-item" @click="onClickSticker(s)" v-for="(s,j) in emojiStickerList[currentEmojiStickerIndex].stickers" :key="j"/>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
import TextMessageContent from "../../wfc/messages/textMessageContent";
import ConversationInfo from "../../wfc/model/conversationInfo";
import wfc from "../../wfc/client/wfc";
import store from "../../store";
import ConversationType from "../../wfc/model/conversationType";
import emojiStickerConfig from "./emojiStickerConfig";
import StickerMessageContent from "../../wfc/messages/stickerMessageContent";
import Config from "../../config";
import QuoteInfo from "../../wfc/model/quoteInfo";
import AudioInputView from "./message/AudioInputView.vue";
import PttAudioInputView from "./message/PttAudioInputView.vue";
import Draft from "../util/draft";
import pttClient from "../../wfc/ptt/pttClient";
import avengineKit from "../../wfc/av/engine/avengineKit";
import permision from "../../common/permission";
import checkVoipPermissions from "../voip/voipUtil";

export default {
    name: "MessageInputView",
    components: {
        AudioInputView,
        PttAudioInputView
    },
    props: {
        conversationInfo: {
            type: ConversationInfo,
            required: true,
            default: null,
        },
    },
    data() {
        return {
            emojiStickerList: emojiStickerConfig,
            currentEmojiStickerIndex: 0,
            hideSendButton: Config.getWFCPlatform() === 1 || Config.getWFCPlatform() === 8,
            showRecorder: false,
            showVoice: false,
            showPtt: false,
            isPttEnable: pttClient.isPttClientEnable(),
            extList: [
                {
                    title: '相册',
                    tag: 'image',
                    icon: 'image'
                },
                {
                    title: '语音通话',
                    tag: 'voip_a',
                    icon: 'voip'
                },
                {
                    title: '视频通话',
                    tag: 'voip_v',
                    icon: 'voip_v'
                },
                {
                    title: '拍摄',
                    tag: 'shot',
                    icon: 'camera'
                },
                {
                    title: '文件',
                    tag: 'file',
                    icon: 'file'
                },
                {
                    title: '位置',
                    tag: 'location',
                    icon: 'location'
                },
                {
                    title: '名片',
                    tag: 'userCard',
                    icon: 'user_card'
                },
            ],
            msgFocus: false,
            showExt: false,
            showEmoji: false,
            lastInputFocusState: undefined,
            text: '',
            timer: '',
            talkTo: '',
            keyboardHeight: 300,
            currentKeyboardHeight: 0,
            windowHeight: 0,
            longTapItemKey: '',
            // chatWindowData:[],
            localData: {},
            sharedMiscState: store.state.misc,
            sharedConversationState: store.state.conversation,
            mentions: [],
            groupMemberUserInfos: [],
        };
    },

    mounted() {
        console.log('mounted', this.conversationInfo);
        if (this.conversationInfo.conversation.type === ConversationType.Group) {
            this.groupMemberUserInfos = store.getGroupMemberUserInfos(this.conversationInfo.conversation.target, false, false);
        }
        this.restoreDraft();
    },

    beforeUnmount() {
        this.storeDraft(this.conversationInfo)
    },

    methods: {
        onInput(event) {
            let inserting = false;
            if (event.detail.value.length > this.text.length) {
                inserting = true;
            }
            this.text = event.detail.value;
            const cursor = event.detail.cursor;
            if (this.conversationInfo.conversation.type === ConversationType.Group) {
                if (inserting) {
                    if (inserting && this.text.length > 0 && this.text.charAt(cursor - 1) === '@') {
                        const onPickUser = user => {
                            this.text = this.text.substring(0, cursor - 1) + `@${user.displayName} ` + this.text.substring(cursor);
                            this.mentions.push(user);
                            this.inputFocus = true;
                        };
                        let atAll = {
                            uid: '@all',
                            displayName: '所有人',
                            portrait: this.conversationInfo.conversation._target.portrait,
                        }
                        this.$pickUser(
                            {
                                users: [atAll, ...this.groupMemberUserInfos],
                                showCategoryLabel: false,
                                successCB: onPickUser,
                            })
                    }
                }
            } else {
                // deleting
            }
        },

        mention() {

        },
        send() {
            if (this.text) {
                let textMessageContent = new TextMessageContent(this.text)
                let quotedMessage = this.sharedConversationState.quotedMessage;
                if (quotedMessage) {
                    let quoteInfo = QuoteInfo.initWithMessage(quotedMessage);
                    textMessageContent.setQuoteInfo(quoteInfo);
                    store.quoteMessage(null);
                }
                if (this.conversationInfo.conversation.type === ConversationType.Group && this.mentions.length > 0) {
                    const regex = /@\S+(\s|$)/g; // 匹配以@开始，后面跟着至少一个非空白字符，并且以空格或行尾结尾的字符串。
                    const matches = this.text.match(regex);
                    if (matches.length > 0) {
                        for (let i = 0; i < matches.length; i++) {
                            const match = matches[i].trim();
                            if (match === '@所有人') {
                                let index = this.mentions.findIndex(user => user.uid === '@all')
                                if (index >= 0) {
                                    textMessageContent.mentionedType = 2;
                                    break
                                }
                            } else {
                                let index = this.mentions.findIndex(user => user.displayName === match.substring(1));
                                if (index >= 0) {
                                    let uid = this.mentions[index].uid;
                                    if (!textMessageContent.mentionedTargets) {
                                        textMessageContent.mentionedTargets = [];
                                    }
                                    if (textMessageContent.mentionedTargets.indexOf(uid) === -1) {
                                        textMessageContent.mentionedType = 1;
                                        textMessageContent.mentionedTargets.push(uid);
                                    }
                                }
                            }
                        }
                    }
                }

                wfc.sendConversationMessage(this.conversationInfo.conversation, textMessageContent);
                this.text = '';
                this.mentions = [];
                Draft.setConversationDraft(this.conversationInfo.conversation, '', null);
            }
        },

        minimizeMessageInputView() {
            this.showEmoji = false;
            this.showExt = false;
            // 没有 blur 这个方法，奇怪。。。
            // this.$refs.textarea.blur();
            //uni.hideKeyboard();
        },

        onInputFocus() {
            this.showEmoji = false;
            this.showExt = false;
        },

        toggleVoice() {
            this.showVoice = !this.showVoice;
            this.showPtt = false;
            this.showEmoji = false;
            this.showExt = false;
        },

        togglePtt() {
            this.showPtt = !this.showPtt;
            this.showVoice = false;
            this.showEmoji = false;
            this.showExt = false;
        },

        toggleEmoji() {
            console.log('------------- toggleEmoji')
            this.showEmoji = !this.showEmoji;
            this.showExt = false;
            this.showVoice = false;
            this.showPtt = false;

        },
        toggleExt() {
            this.showExt = !this.showExt;
            this.showEmoji = false;
            this.showVoice = false;
            this.showPtt = false;
        },

        onClickExt(ext) {
            console.log('onClick ext', ext);
            switch (ext.tag) {
                case 'image':
                    this.chooseImage();
                    break;
                case 'shot':
                    this.chooseVideo();
                    break;
                case 'file':
                    this.chooseFile();
                    break;
                case 'voip_a':
                    this.voip(true);
                    break;
                case 'voip_v':
                    this.voip(false);
                    break;
                default:
                    uni.showToast({
                        title: 'TODO ' + ext.title,
                        icon: 'none'
                    })
                    break;
            }
        },

        onCategoryClick(i) {
            this.currentEmojiStickerIndex = i;
        },

        onClickEmoji(emoji) {
            console.log('onClick emoji', emoji)
            this.text = this.text + emoji;
        },
        onClickSticker(sticker) {
            console.log('onClick sticker', sticker)
            let stickerMsg = new StickerMessageContent('', sticker, 200, 200)
            wfc.sendConversationMessage(this.conversationInfo.conversation, stickerMsg);
        },

        chooseImage() {
            uni.chooseImage({
                // count: _self.limit ? _self.limit  - _self.fileList.length : 999,
                sourceType: ['album', 'camera'],
                sizeType: ['original', 'compressed'],
                success: (e) => {
                    console.log('choose image', e.tempFilePaths);
                    e.tempFilePaths.forEach(async path => {
                        let filePath;
                        // #ifdef APP-PLUS
                        if (path.startsWith('file://')) {
                            filePath = path.substring('file://'.length);
                        } else {
                            filePath = plus.io.convertLocalFileSystemURL(path)
                        }
                        // #endif
                        // #ifdef H5
                        filePath = await fetch(path).then(res => res.blob())
                            .then(blob => {
                                let name = `${new Date().getTime()}.${blob.type.substring(blob.type.lastIndexOf('/') + 1)}`;
                                return new File([blob], name)
                            })
                        // #endif
                        store.sendFile(this.conversationInfo.conversation, filePath);
                    })
                }
            })
        },

        async voip(audioOnly) {
            if (!await checkVoipPermissions(audioOnly)) {
                return;
            }
            let session = avengineKit.currentCallSession()
            if(session && session.state !== 0){
                uni.showToast({
                    title: '音视频通话正在进行中...',
                    icon: 'none'
                })
                return;
            }

            if (this.conversationInfo.conversation.type === ConversationType.Single) {
                let callSession = avengineKit.startSingleCall(this.conversationInfo.conversation.target, audioOnly)
                if (callSession) {
                    let url = `/pages/voip/Single?session=${JSON.stringify(callSession)}`
                    this.$navigateToPage(url);
                }
            } else if (this.conversationInfo.conversation.type === ConversationType.Group) {
                this.showPickGroupMemberToVoipModal(audioOnly)
            }
        },

        showPickGroupMemberToVoipModal(audioOnly) {
            let beforeClose = (users) => {
                let ids = users.map(u => u.uid);
                let callSession = avengineKit.startMultiCall(this.conversationInfo.conversation.target, ids, audioOnly);
                // 不加延时的话，不能正常切换页面，会报莫名其妙的错误
                setTimeout(() => {
                    if (callSession) {
                        let url = `/pages/voip/Multi?session=${JSON.stringify(callSession)}`
                        this.$navigateToPage(url);
                    }
                }, 50)
            }
            this.$pickUsers(
                {
                    users: this.groupMemberUserInfos,
                    confirmTitle: this.$t('common.confirm'),
                    showCategoryLabel: false,
                    successCB: beforeClose,
                })

        },

        chooseVideo() {
            uni.chooseVideo({
                // count: _self.limit ? _self.limit  - _self.fileList.length : 999,
                sourceType: ['camera'],
                sizeType: ['original', 'compressed'],
                success: async (e) => {
                    console.log('choose video', e);
                    let duration = e.duration;
                    let path = e.tempFilePath;
                    let filePath;
                    // #ifdef APP-PLUS
                    if (path.startsWith('file://')) {
                        filePath = path.substring('file://'.length);
                    } else {
                        filePath = plus.io.convertLocalFileSystemURL(path)
                    }
                    // #endif
                    // #ifdef H5
                    filePath = await fetch(path).then(res => res.blob())
                        .then(blob => {
                            let name = `${new Date().getTime()}.${blob.type.substring(blob.type.lastIndexOf('/') + 1)}`;
                            return new File([blob], name)
                        })
                    // #endif
                    store.sendFile(this.conversationInfo.conversation, filePath, duration);
                }
            })
        },

        chooseFile() {
            wfc.chooseFile('all', async (file) => {
                    console.log('choose file', file);
                    let path = file.path;
                    let filePath;
                    // #ifdef APP-PLUS
                    if (path.startsWith('file://')) {
                        filePath = path.substring('file://'.length);
                    } else {
                        filePath = plus.io.convertLocalFileSystemURL(path)
                    }
                    // #endif
                    // #ifdef H5
                    filePath = await fetch(path).then(res => res.blob())
                        .then(blob => {
                            let name = `${new Date().getTime()}.${blob.type.substring(blob.type.lastIndexOf('/') + 1)}`;
                            return new File([blob], name)
                        })
                    // #endif
                    file.path = filePath;
                    store.sendFile(this.conversationInfo.conversation, file);
                }
            )
        },

        onKeyboardHeightChange(keyboardHeight, currentKeyboardHeight) {
            this.keyboardHeight = keyboardHeight;
            this.currentKeyboardHeight = currentKeyboardHeight;
        },

        cancelQuote() {
            store.quoteMessage(null);
        },

        restoreDraft() {
            let draft = Draft.getConversationDraftEx(this.conversationInfo);
            if (!draft) {
                return;
            }
            console.log('restore draft', this.conversationInfo, draft);
            store.quoteMessage(draft.quotedMessage);
            if (this.text) {
                console.log('inputting, ignore', draft.text)
            } else {
                // this.text = draft.text.replace(/ /g, '&nbsp').replace(/\n/g, '<br>');
                this.text = draft.text;
            }
        },

        storeDraft(conversationInfo) {
            let quotedMessage = this.sharedConversationState.quotedMessage;
            let draftText = this.text.trim();
            let quoteInfo = quotedMessage ? QuoteInfo.initWithMessage(quotedMessage) : null;

            if (draftText.length === 0) {
                if (conversationInfo.draft !== '') {
                    Draft.setConversationDraft(conversationInfo.conversation, draftText, quoteInfo)
                }
            } else {
                if (draftText !== conversationInfo.draft) {
                    Draft.setConversationDraft(conversationInfo.conversation, draftText, quoteInfo)
                }
            }
        },
    },
    computed: {
        // quotedMessage() {
        //     lastQuotedMessage = this.sharedConversationState.quotedMessage;
        //     return this.sharedConversationState.quotedMessage;
        // },
        inputFocus() {
            return !this.showExt && !this.showEmoji && !this.showVoice;
        }
    },
}
</script>

<style scoped>

/*.message-input-container {*/
/*    display: flex;*/
/*    align-items: center;*/
/*    width: 100%;*/
/*    position: fixed;*/
/*    bottom: 0;*/
/*    background: lightgrey;*/
/*}*/

/*.message-input-container input {*/
/*    flex: 1;*/
/*}*/

.wf-message-input-container {
    background: #f7f7f7;
    /*background: red;*/
    width: 100%;
    z-index: 9999;
    transition: all 0.1s;
    /*background: red;*/
}

.wf-ext-container {
    width: 100%;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}

.wf-ext-item {
    padding: 35rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.wf-ext-item-icon {
    background-color: #fff;
    width: 110rpx;
    height: 110rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
}

.wf-ext-item-icon .wxfont {
    color: #181818;
    font-size: 64rpx;
}

.wf-ext-item-text {
    font-size: 24rpx;
    color: #666;
    margin-top: 16rpx;
}

.wf-message-input-toolbar {
    position: relative;
    z-index: 3;
    padding: 16rpx 12rpx;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-around;
    border: 1rpx #ddd solid;
    border-left: none;
    border-right: none;
}

.wf-message-input-toolbar .wf-tk-send-tool-btn {
    transition: color 0.5s;
}

.wf-input-text-container {
    overflow: auto;
    margin: 0 12rpx;
    min-height: 75rpx;
    background-color: #fff;
    border-radius: 24rpx;
    padding-top: 18rpx;
    max-height: 225rpx;
    box-sizing: border-box;
}

.quote-message-container {
    overflow: auto;
    display: flex;
    background: #EBEFEF;
    align-content: center;
    position: relative;
    margin: 0 12rpx;
    padding: 5px;
    border-radius: 24rpx;
}

.quote-message-container .quoted-message {
    max-width: 250px;
}

.quote-message-container .cancel {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0 5px;
    color: grey;
    transform: translate(0, 50%);
}

.wf-message-input-container .wf-input-textarea {
    padding: 0 24rpx;
    box-sizing: border-box !important;
    width: 100%;
    background: #fff;
}

.wf-input-voice-container {
    box-sizing: border-box;
    margin: 0 12rpx;
    width: 100%;
    height: 75rpx;
    border-radius: 24rpx;
    background: #fff;
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
}

.wf-input-voice-button {
    text-align: center;
    font-size: 24rpx;
    line-height: 75rpx;
    flex: 1;
}

.wf-input-voice-button:nth-child(1) {
    border-right: 1rpx #eee solid;
}

.wf-input-text-send-button {
    white-space: nowrap;
    padding: 10rpx 24rpx;
    border-radius: 12rpx;
    border: 1rpx #ddd solid;
    background: #f7f7f7;
    color: #ddd;
}

.wf-input-button-icon {
    font-size: 64rpx;
    color: #333;
}

.wf-voice-recorder {
    width: 250rpx;
    height: 250rpx;
    left: 50%;
    transform: translateX(-50%);
    bottom: 680rpx;
    box-sizing: border-box;
    text-align: center;
    position: fixed;
    border-radius: 50%;
    background-color: #f8f8f8;
    box-shadow: 0rpx 4rpx 10rpx rgba(0, 0, 0, 0.05);
    padding: 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.popsendCard {
    display: flex;
    background-color: #fff;
    overflow: auto;
}

.popsendCard-close {
    width: 100%;
    text-align: center;
    height: 70rpx;
    line-height: 70rpx;
    font-size: 42rpx;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
}

.wf-emoji-container {

}

.wf-emoji-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.emoji-item {
    font-size: 44rpx;
    width: 93rpx;
    height: 93rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.wf-stickers-container {
    min-height: 60rpx;
    width: 100%;
    flex-direction: column;
}

.wf-stickers-container .category-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 99;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid grey;
}

.wf-stickers-container .category {
    display: flex;
    justify-content: center;
    align-items: center;
}

.wf-stickers-container .category img {
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 0 5px;
    border-radius: 5px;
    object-fit: contain;
}

.wf-stickers-container .category img.active {
    background: lightgrey;
}

.wf-sticker-container {
}

.wf-sticker-content {
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
    padding: 10px 0;
}

.sticker-item {
    height: 33%;
    aspect-ratio: 1/1;
    padding: 8rpx;
    border-radius: 5px;
}

.sticker-item:active {
    background: lightgrey;
}

</style>
