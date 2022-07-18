<template>
    <view>
        <view class="wf-message-input-container">
            <view class="wf-message-input-toolbar">
                <view class="wf-input-button-icon wxfont" @click="toggleVoice" :class="showVoice ? 'keyboard' : 'voice'"></view>
                <view class="wf-input-voice-container" v-if="showVoice">
                    <view class="wf-input-voice-button" @longpress="startRecord" @touchend="endRecord">按住说话</view>
                </view>
                <view v-else class="wf-input-text-container" >
                    <textarea ref="textarea" @focus="onInputFocus" :focus="inputFocus" class="wf-input-textarea" v-model="text" placeholder="" hold-keyboard confirm-type="send" @confirm="send(text)" :maxlength="-1" auto-height/>
                </view>
                <view @click.prevent="toggleEmoji" class="wf-input-button-icon wxfont emoji"></view>
                <view v-if="text !== ''" class="wf-input-text-send-button" @touchstart.prevent="" @touchmove.prevent="" @touchend.prevent="send(text)" :style="{ background: text !== '' ? '#4168e0' : '#F7F7F7', color: text !== '' ? '#fff' : '#ddd', 'border-color': text !== '' ? '#1BC418' : '#ddd' }">发送</view>
                <view v-else @click="toggleExt" class="wf-input-button-icon wxfont add2"></view>
            </view>
            <view v-if="showExt" class="wf-ext-container" :style="'height: ' + keyboardHeight + 'px'">
                <view class="wf-ext-item" v-for="(v, i) in extList" @click="onClickExt(v)" :key="i">
                    <view class="wf-ext-item-icon">
                        <view class="wxfont" :class="v.icon"></view>
                    </view>
                    <view class="wf-ext-item-text">{{ v.title }}</view>
                </view>
            </view>
            <!--            <scroll-view :scroll-y="true" v-if="showEmoji" class="wf-emoji-container">-->
            <!--                <view class="wf-emoji-content">-->
            <!--                    <view class="emoji-item" @click="onClickEmoji(v)" v-for="(v,i) in emojiList" :key="i">{{ v }}</view>-->

            <!--                </view>-->
            <!--            </scroll-view>-->
            <view v-if="showEmoji" class="wf-stickers-container" :style="'height: ' + keyboardHeight + 'px'" >
                <view class="category-container">
                    <view class="category" v-for="(v, i) in emojiStickerList" :key="i" @click="onCategoryClick(i)">
                        <img :src="v.poster" v-bind:class="{active: i === currentEmojiStickerIndex}" >
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
        <!--        <zmm-upload-image chooseType="chooseMedia" :show="false" ref="upload" @allComplete="upLoadallComplete" @oneComplete="upLoadoneComplete"></zmm-upload-image>-->
        <!-- #ifndef H5 -->
        <view class="wf-voice-recorder" v-show="sharedMiscState.isRecording">
            <zmm-recorder :show="sharedMiscState.isRecording" :conversationInfo="conversationInfo" ref="recorder"/>
        </view>
        <!-- #endif -->
    </view>
</template>

<script>
import TextMessageContent from "../../wfc/messages/textMessageContent";
import ConversationInfo from "../../wfc/model/conversationInfo";
import wfc from "../../wfc/client/wfc";
import store from "../../store";
import ConversationType from "../../wfc/model/conversationType";
import wfcUIKit from "../../wfc/uikit/wfcUIKit";
import emojiStickerConfig from "./emojiStickerConfig";
import {getItem, setItem} from "../util/storageHelper";
import StickerMessageContent from "../../wfc/messages/stickerMessageContent";

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
            emojiStickerList: emojiStickerConfig,
            currentEmojiStickerIndex: 0,
            showRecorder: false,
            showVoice: false,
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
                    tag: 'shoot',
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
            keyboardHeight: 0,
            currentKeyboardHeight: 0,
            windowHeight: 0,
            longTapItemKey: '',
            // chatWindowData:[],
            localData: {},
            sharedMiscState: store.state.misc,
        };
    },

    mounted() {
    },

    methods: {
        send() {
            if (this.text) {
                let textMessageContent = new TextMessageContent(this.text)
                wfc.sendConversationMessage(this.conversationInfo.conversation, textMessageContent);
                this.text = '';
            }
        },
        startRecord() {

            this.$refs['recorder'].startRecord();
            this.sharedMiscState.isRecording = true;
        },

        endRecord() {
            this.$refs['recorder'].stopRecord();
            this.sharedMiscState.isRecording = false;
        },

        minimizeMessageInputView(){
            this.showEmoji = false;
            this.showExt = false;
            // 没有 blur 这个方法，奇怪。。。
            // this.$refs.textarea.blur();
            //uni.hideKeyboard();
        },

        onInputFocus(){
          this.showEmoji = false;
          this.showExt = false;
        },

        toggleVoice() {
            this.showVoice = !this.showVoice;
            this.showEmoji = false;
            this.showExt = false;
        },

        toggleEmoji() {
            console.log('------------- toggleEmoji')
            this.showEmoji = !this.showEmoji;
            this.showExt = false;
            this.showVoice = false;

        },
        toggleExt() {
            this.showExt = !this.showExt;
            this.showEmoji = false;
            this.showVoice = false;
        },

        onClickExt(ext) {
            console.log('onClick ext', ext);
            switch (ext.tag) {
                case 'image':
                    this.chooseImage();
                    break;
                case 'shoot':
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
                    e.tempFilePaths.forEach(path => {
                        let filePath;
                        if (path.startsWith('file://')) {
                            filePath = path.substring('file://'.length);
                        } else {
                            filePath = plus.io.convertLocalFileSystemURL(path)
                        }
                        store.sendFile(this.conversationInfo.conversation, filePath);
                    })
                }
            })
        },

        voip(audioOnly) {
            if (this.conversationInfo.conversation.type === ConversationType.Single) {
                wfcUIKit.startSingleCall(this.conversationInfo.conversation.target, audioOnly)
            } else if (this.conversationInfo.conversation.type === ConversationType.Group) {
                this.showPickGroupMemberToVoipModal(audioOnly)
            }
        },

        showPickGroupMemberToVoipModal(audioOnly) {
            let beforeClose = (users) => {
                let ids = users.map(u => u.uid);
                wfcUIKit.startMultiCall(this.conversationInfo.conversation.target, ids, audioOnly);
            }
            let groupMemberUserInfos = store.getGroupMemberUserInfos(this.conversationInfo.conversation.target, false, false);
            this.$pickUser(
                {
                    users: groupMemberUserInfos,
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
                success: (e) => {
                    console.log('choose video', e);
                    let duration = e.duration;
                    let path = e.tempFilePath;
                    let filePath;
                    if (path.startsWith('file://')) {
                        filePath = path.substring('file://'.length);
                    } else {
                        filePath = plus.io.convertLocalFileSystemURL(path)
                    }
                    store.sendFile(this.conversationInfo.conversation, filePath, duration);
                }
            })
        },

        chooseFile() {
            wfc.chooseFile('all', (file) => {
                    console.log('choose file', file);
                    let path = file.path;
                    let filePath;
                    if (path.startsWith('file://')) {
                        filePath = path.substring('file://'.length);
                    } else {
                        filePath = plus.io.convertLocalFileSystemURL(path)
                    }
                    file.path = filePath;
                    store.sendFile(this.conversationInfo.conversation, file);
                }
            )
        },

        onKeyboardHeightChange(keyboardHeight, currentKeyboardHeight){
            this.keyboardHeight = keyboardHeight;
            this.currentKeyboardHeight = currentKeyboardHeight;
        }
    },
    computed:{
        inputFocus(){
            return !this.showExt && !this.showEmoji && !this.showVoice;
        }
    }
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
    /*background: #f7f7f7;*/
    /*background: red;*/
    /*position: fixed;*/
    width: 100%;
    z-index: 9999;
    transition: all 0.1s;
    background: red;
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
    align-items: center;
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
    width: 100%;
    margin: 0 12rpx;
    min-height: 75rpx;
    background-color: #fff;
    border-radius: 24rpx;
    padding-top: 18rpx;
    max-height: 225rpx;
    box-sizing: border-box;
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

.sticker-item:active{
    background: lightgrey;
}

</style>