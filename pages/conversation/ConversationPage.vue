<template>
    <view>
        <view v-if="sharedConversationState.currentConversationInfo == null" class="conversation-empty-container">
            <text>^~^</text>
        </view>
        <view v-else ref="conversationContentContainer" class="conversation-content-container"
              :dummy_just_for_reactive="currentVoiceMessage"
        >
            <view class="message-list-container">
                <view v-if="ongoingCalls && ongoingCalls.length > 0" class="ongoing-call-container">
                    <view v-for="(value, index) in ongoingCalls" :key="index" class="ongoing-call-item">
                        <text>{{ value.messageContent.digest(value) }}</text>
                        <button @click="joinMultiCall(value)">加入</button>
                    </view>
                </view>
                <scroll-view ref="conversationMessageList" class="message-list" scroll-y="true" :scroll-top="scrollTop"
                             refresher-enabled="true" :refresher-triggered="triggered"
                             :refresher-threshold="45" @refresherpulling="onPulling"
                             @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort"
                             @scroll="onScroll">
                    <view v-for="(message) in sharedConversationState.currentConversationMessageList"
                          :id="'id-'+ message.messageId"
                          :key="message.messageId">
                        <!--todo 不同的消息类型 notification in out-->

                        <NotificationMessageContentView :message="message" v-if="isNotificationMessage(message)"/>
                        <RecallNotificationMessageContentView :message="message" v-else-if="isRecallNotificationMessage(message)"/>
                        <ContextableNotificationMessageContentContainerView
                            v-else-if="isContextableNotificationMessage(message)"
                            @click.native.capture="sharedConversationState.enableMessageMultiSelection? clickMessageItem($event, message) : null"
                            :message="message"
                        />
                        <NormalOutMessageContentView
                            @click.native.capture.stop="sharedConversationState.enableMessageMultiSelection? clickMessageItem($event, message) : null"
                            :message="message"
                            @touchstart.native="onTouchStart"
                            @touchmove.native="onTouchMove"
                            v-else-if="message.direction === 0 && sharedConversationState.enableMessageMultiSelection"/>
                        <NormalOutMessageContentView
                            :message="message"
                            @touchstart.native="onTouchStart"
                            @touchmove.native="onTouchMove"
                            v-else-if="message.direction === 0 && !sharedConversationState.enableMessageMultiSelection"/>
                        <NormalInMessageContentView
                            @click.native.capture.stop="sharedConversationState.enableMessageMultiSelection ? clickMessageItem($event, message) : null"
                            :message="message"
                            @touchstart.native="onTouchStart"
                            @touchmove.native="onTouchMove"
                            v-else-if="message.direction === 1 && sharedConversationState.enableMessageMultiSelection"/>
                        <NormalInMessageContentView
                            :message="message"
                            @touchstart.native="onTouchStart"
                            @touchmove.native="onTouchMove"
                            v-else/>
                    </view>
                </scroll-view>
            </view>
            <!--            <view v-show="!sharedConversationState.enableMessageMultiSelection"-->
            <!--                  class="viewider-handler"></view>-->
            <chunLei-popups v-model="showContextMenu" :popData="contextMenuItems" @tapPopup="onContextMenuItemSelect" :x="contextMenuX" :y="contextMenuY" direction="column" theme="dark" :triangle="false" dynamic/>
            <MessageInputView :conversationInfo="sharedConversationState.currentConversationInfo"
                              v-show="!sharedConversationState.enableMessageMultiSelection"
                              class="message-input-container"
                              ref="messageInputView"
            />
            <MultiSelectActionView v-show="sharedConversationState.enableMessageMultiSelection"/>
        </view>
    </view>
</template>

<script>
import MessageInputView from "@/pages/conversation/MessageInputView";
import NormalOutMessageContentView from "@/pages/conversation/message/NormalOutMessageContentContainerView";
import NormalInMessageContentView from "@/pages/conversation/message/NormalInMessageContentContainerView";
import NotificationMessageContentView from "@/pages/conversation/message/NotificationMessageContentView";
import RecallNotificationMessageContentView from "@/pages/conversation/message/RecallNotificationMessageContentView";
import NotificationMessageContent from "@/wfc/messages/notification/notificationMessageContent";
import TextMessageContent from "@/wfc/messages/textMessageContent";
import store from "@/store";
import wfc from "../../wfc/client/wfc";
import {numberValue, stringValue} from "@/wfc/util/longUtil";
import MultiSelectActionView from "@/pages/conversation/MessageMultiSelectActionView";
import ForwardType from "@/pages/conversation/message/forward/ForwardType";
import FileMessageContent from "@/wfc/messages/fileMessageContent";
import ImageMessageContent from "@/wfc/messages/imageMessageContent";
// import {copyImg, copyText} from "@/pages/util/clipboard";
import Message from "@/wfc/messages/message";
import VideoMessageContent from "@/wfc/messages/videoMessageContent";
import SoundMessageContent from "@/wfc/messages/soundMessageContent";
import MessageContentType from "@/wfc/messages/messageContentType";
// import axios from "axios";
import FavItem from "@/wfc/model/favItem";
import ConversationType from "@/wfc/model/conversationType";
import GroupMemberType from "@/wfc/model/groupMemberType";
import CompositeMessageContent from "@/wfc/messages/compositeMessageContent";
import ConnectionStatus from "../../wfc/client/connectionStatus";
import {getItem, setItem} from "../util/storageHelper";
import Config from "../../config";
import RichNotificationMessageContent from "../../wfc/messages/notification/richNotificationMessageContent";
import ArticlesMessageContent from "../../wfc/messages/articlesMessageContent";
import ContextableNotificationMessageContentContainerView from "./message/ContextableNotificationMessageContentContainerView.vue";
import EventType from "../../wfc/client/wfcEvent";
import MultiCallOngoingMessageContent from "../../wfc/av/messages/multiCallOngoingMessageContent";
import JoinCallRequestMessageContent from "../../wfc/av/messages/joinCallRequestMessageContent";

var innerAudioContext;
export default {
    name: 'ConversationPage',
    components: {
        ContextableNotificationMessageContentContainerView,
        MultiSelectActionView,
        NotificationMessageContentView,
        RecallNotificationMessageContentView,
        NormalInMessageContentView,
        NormalOutMessageContentView,
        MessageInputView,
    },
    // props: ["conversation"],
    data() {
        return {
            conversationInfo: store.state.conversation.currentConversationInfo,
            sharedConversationState: store.state.conversation,
            sharedContactState: store.state.contact,
            sharedPickState: store.state.pick,
            sharedMiscState: store.state.misc,

            savedMessageListViewHeight: -1,
            saveMessageListViewFlexGrow: -1,

            dragAndDropEnterCount: 0,

            showContextMenu: false,
            isScroll: false,
            touchStartX: 0,
            touchStartY: 0,
            contextMenuX: 0,
            contextMenuY: 0,
            contextMenuItems: [],
            lastScrollTop: 0,
            keyboardHeight: 0,
            currentKeyboardHeight: 0,
            scrollTop: 0,

            triggered: false,

            ongoingCalls: [],
            ongoingCallTimer: 0,
        };
    },

    onLoad() {
        // #ifdef APP-PLUS
        const currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
        // currentWebview.setBounce({position:{top:'100px'},changeoffset:{top:'0px'}}); //动态重设bounce效果
        currentWebview.overrideUrlLoading({
            mode: 'reject',
            // match:'http.*'
        }, e => {
            console.log('reject url', e.url)
            if (this.sharedConversationState.enableMessageMultiSelection) {
                return;
            }
            uni.navigateTo({
                url: `/pages/misc/WebViewPage?url=${encodeURIComponent(e.url)}`,
                fail: (e) => {
                    console.log('navigate to WebViewPage error', e)
                }
            });
        });
        // #endif
    },

    onShow() {
        this.updateConversationTitle();
    },

    onNavigationBarButtonTap(e) {
        if (this.conversationInfo.conversation.type === ConversationType.Single) {
            uni.navigateTo({
                url: '/pages/conversation/SingleConversationInfoPage',
                success: (res) => {
                    res.eventChannel.emit('conversationInfo', {
                        conversationInfo: this.conversationInfo
                    });
                },
                fail: (err) => {
                    console.log('nav to SingleConversationInfoPage err', err);
                }
            });

        } else if (this.conversationInfo.conversation.type === ConversationType.Group) {
            uni.navigateTo({
                url: '/pages/conversation/GroupConversationInfoPage',
                success: (res) => {
                    res.eventChannel.emit('conversationInfo', {
                        conversationInfo: this.conversationInfo
                    });
                },
                fail: (err) => {
                    console.log('nav to GroupConversationInfoPage err', err);
                }
            });
        } else {
            uni.showToast({
                title: 'TODO 暂不支持该会话类型',
                icon: 'none'
            })
        }
    },

    onUnload() {
        store.setCurrentConversationInfo(null);
    },

    methods: {
        toggleMessageMultiSelectionActionView(message) {
            store.toggleMessageMultiSelection(message);
        },

        clickMessageItem(event, message) {
            if (message.messageContent instanceof NotificationMessageContent) {
                return;
            }
            if (this.sharedConversationState.enableMessageMultiSelection) {
                store.selectOrDeselectMessage(message);
                event.stopPropagation();
                event.preventDefault();
            }
        },

        isNotificationMessage(message) {
            return message && message.messageContent instanceof NotificationMessageContent
                && message.messageContent.type !== MessageContentType.RecallMessage_Notification
                && message.messageContent.type !== MessageContentType.Rich_Notification;
        },

        isContextableNotificationMessage(message) {
            return message && (message.messageContent instanceof RichNotificationMessageContent || message.messageContent instanceof ArticlesMessageContent);
        },


        isRecallNotificationMessage(message) {
            return message && message.messageContent.type === MessageContentType.RecallMessage_Notification;
        },

        reedit(message) {
            this.$refs.messageInputView.insertText(message.messageContent.originalSearchableContent);
        },

        onScroll(e) {
            // hide tippy userCard
            // for (const popper of document.querySelectorAll('.tippy-popper')) {
            //     const instance = popper._tippy;
            //     if (instance.state.isVisible) {
            //         instance.hide();
            //     }
            // }
            // hide message context menu
            // this.$refs.menu && this.$refs.menu.close();

            // console.log('onScroollllll',e,  this.lastScrollTop, e.scrollTop, e.scrollTop < this.lastScrollTop)
            // if (!this.lastScrollTop){
            //     this.lastScrollTop = e.detail.deltaY;
            //     return;
            // }
            // if (e.detail.deltaY < this.lastScrollTop){
            //     this.$refs.messageInputView.minimizeMessageInputView();
            //     uni.hideKeyboard();
            // }
            // this.lastScrollTop =  e.detail.deltaY;
            // this.showContextMenu = false;
        },

        onMessageSenderContextMenuClose() {
            console.log('onMessageSenderContextMenuClose')
        },

        // message context menu
        isCopyable(message) {
            return message && (message.messageContent instanceof TextMessageContent || message.messageContent instanceof ImageMessageContent);
        },
        isDownloadAble(message) {
            return message && (message.messageContent instanceof ImageMessageContent
                || message.messageContent instanceof FileMessageContent
                || message.messageContent instanceof VideoMessageContent);
        },

        isForwardable(message) {
            if (message && message.messageContent instanceof SoundMessageContent) {
                return false;
            }
            return true;
        },

        isFavable(message) {
            if (!message) {
                return false;
            }
            return [MessageContentType.VOIP_CONTENT_TYPE_START,
                MessageContentType.CONFERENCE_CONTENT_TYPE_INVITE].indexOf(message.messageContent.type) <= -1;
        },

        isRecallable(message) {
            if (message) {
                if (message.conversation.type === ConversationType.Group) {
                    let groupInfo = wfc.getGroupInfo(message.conversation.target);
                    let selfUserId = wfc.getUserId();
                    if (groupInfo && groupInfo.owner === selfUserId) {
                        return true;
                    }

                    let groupMember = wfc.getGroupMember(message.conversation.target, selfUserId);
                    if (groupMember && [GroupMemberType.Manager, GroupMemberType.Owner].indexOf(groupMember.type) > -1) {
                        return true;
                    }
                }
                let delta = wfc.getServerDeltaTime();
                let now = new Date().getTime();
                if (message.direction === 0 && now - (numberValue(message.timestamp) - delta) < 60 * 1000) {
                    return true;
                }
            }
            return false;
        },

        isLocalFile(message) {
            // TODO
            return false;
        },

        isQuotable(message) {
            if (!message) {
                return false;
            }
            return [MessageContentType.VOIP_CONTENT_TYPE_START,
                MessageContentType.Voice,
                MessageContentType.Video,
                MessageContentType.Composite_Message,
                MessageContentType.CONFERENCE_CONTENT_TYPE_INVITE].indexOf(message.messageContent.type) <= -1;
        },

        copy(message) {
            let content = message.messageContent;
            if (content instanceof TextMessageContent) {
                let selectedText = window.getSelection().toString()
                if (selectedText) {
                    copyText(selectedText);
                } else {
                    copyText(content.content)
                }
            } else {
                copyImg(content.remotePath)
            }
        },
        download(message) {
            // TODO
            // if (isElectron()) {
            //     downloadFile(message);
            // } else {
            //     if (!store.isDownloadingMessage(message.messageId)) {
            //         downloadFile(message)
            //         store.addDownloadingMessage(message.messageId)
            //     } else {
            //         // TODO toast 下载中
            //         console.log('file isDownloading')
            //     }
            // }
        },

        openFile(message) {
            let file = message.messageContent;
            // TODO
            //shell.openItem(file.localPath);
        },

        openDir(message) {
            let file = message.messageContent;
            // TODO
            // shell.showItemInFolder(file.localPath);
        },

        recallMessage(message) {
            wfc.recallMessage(message.messageUid, null, null);
        },

        forward(message) {
            this.$forward({
                forwardType: ForwardType.NORMAL,
                messages: [message],
            });
        },

        quoteMessage(message) {
            store.quoteMessage(message);
        },

        // call from child
        favMessages(messages) {
            console.log('fav messages');
            let compositeMessageContent = new CompositeMessageContent();
            let title = '';
            let msgConversation = messages[0].conversation;
            if (msgConversation.type === ConversationType.Single) {
                let users = store.getUserInfos([wfc.getUserId(), msgConversation.target], '');
                title = users[0]._displayName + '和' + users[1]._displayName + '的聊天记录';
            } else {
                title = '群的聊天记录';
            }
            compositeMessageContent.title = title;
            compositeMessageContent.messages = messages;

            let message = new Message(msgConversation, compositeMessageContent);
            message.from = wfc.getUserId();
            this.favMessage(message);
        },

        favMessage(message) {
            // fixme 收藏
            // TODO 收藏
            uni.showToast({
                title: 'TODO ',
                icon: 'none'
            });
            return;
            let favItem = FavItem.fromMessage(message);
            axios.post('/fav/add', {
                messageUid: stringValue(favItem.messageUid),
                type: favItem.favType,
                convType: favItem.conversation.type,
                convTarget: favItem.conversation.target,
                convLine: favItem.conversation.line,
                origin: favItem.origin,
                sender: favItem.sender,
                title: favItem.title,
                url: favItem.url,
                thumbUrl: favItem.thumbUrl,
                data: favItem.data,
            }, {withCredentials: true})
                .then(response => {
                    if (response && response.data && response.data.code === 0) {
                        this.$notify({
                            // title: '收藏成功',
                            text: '收藏成功',
                            type: 'info'
                        });
                    } else {
                        this.$notify({
                            // title: '收藏成功',
                            text: '收藏失败',
                            type: 'error'
                        });
                    }
                })
                .catch(err => {
                    this.$notify({
                        // title: '收藏失败',
                        text: '收藏失败',
                        type: 'error'
                    });

                })
        },

        multiSelect(message) {
            this.toggleMessageMultiSelectionActionView(message);
        },

        // why？
        // 用于控制，同时只能播放一个语言，如果是将逻辑放到 AudioMessageContentView 里面，控制起来会更麻烦
        playVoice(message) {
            if (innerAudioContext) {
                innerAudioContext.stop();
            }
            let voice = message.messageContent;
            let mp3RemotePath = voice.remotePath;
            if(!voice.remotePath.endsWith(".mp3") && Config.AMR_TO_MP3_SERVER_ADDRESS){
                mp3RemotePath = Config.AMR_TO_MP3_SERVER_ADDRESS + voice.remotePath;
            }
            innerAudioContext = uni.createInnerAudioContext();
            innerAudioContext.autoplay = false;
            innerAudioContext.src = mp3RemotePath;
            innerAudioContext.onPlay(() => {
                message._isPlaying = true;
            });
            innerAudioContext.onError((res) => {
                message._isPlaying = false;
                store.playVoice(null)
            });
            innerAudioContext.onEnded(() => {
                message._isPlaying = false;
                store.playVoice(null)
            })
            innerAudioContext.onCanplay(() => {
                innerAudioContext.play();
            })
        },
        mentionMessageSenderTitle(message) {
            if (!message) {
                return ''
            }
            let displayName = wfc.getGroupMemberDisplayName(message.conversation.target, message.from);
            return '@' + displayName;
        },

        mentionMessageSender(message) {
            this.$refs.messageInputView.mention(message.conversation.target, message.from);
        },

        onReceiveMessage(messages, hasMore) {
            for (const message of messages) {
                if (this.conversationInfo && this.conversationInfo.conversation.equal(message.conversation)
                    && message.messageContent instanceof MultiCallOngoingMessageContent
                    && Config.ENABLE_MULTI_CALL_AUTO_JOIN
                ) {
                    // 自己是不是已经在通话中
                    // console.log('MultiCallOngoingMessageContent', message.messageContent)
                    if (message.messageContent.targets.indexOf(wfc.getUserId()) >= 0) {
                        return;
                    }
                    let index = this.ongoingCalls.findIndex(call => call.messageContent.callId === message.messageContent.callId);
                    if (index > -1) {
                        this.ongoingCalls[index] = message;
                    } else {
                        this.ongoingCalls.push(message);
                    }
                    if (!this.ongoingCallTimer) {
                        this.ongoingCallTimer = setInterval(() => {
                            this.ongoingCalls = this.ongoingCalls.filter(call => {
                                return (new Date().getTime() - (numberValue(call.timestamp) - numberValue(wfc.getServerDeltaTime()))) < 3 * 1000;
                            })
                            if (this.ongoingCalls.length === 0) {
                                clearInterval(this.ongoingCallTimer);
                                this.ongoingCallTimer = 0;
                            }
                            console.log('ongoing calls', this.ongoingCalls.length);
                        }, 1000)
                    }
                }
            }
        },

        joinMultiCall(message) {
            let request = new JoinCallRequestMessageContent(message.messageContent.callId, wfc.getClientId());
            wfc.sendConversationMessage(this.conversationInfo.conversation, request);
        },

        onTouchStart(e) {
            this.isScroll = false
            this.touchStartX = e.touches[0].clientX
            this.touchStartY = e.touches[0].clientY
        },

        onTouchMove(e) {
            uni.hideKeyboard();

            let delX = e.touches[0].clientX - this.touchStartX
            let delY = e.touches[0].clientY - this.touchStartY
            if (Math.abs(delX) > 5 || Math.abs(delY) > 5) {
                this.isScroll = true
            }
        },

        showMessageContextMenu(e, message) {
            if (this.isScroll) {
                return;
            }
            this.contextMenuX = e.clientX ? e.clientX : e.touches[0].clientX;
            this.contextMenuY = e.clientY ? e.clientY : e.touches[0].clientY;

            this.contextMenuItems = [];
            if (this.isCopyable(message)) {
                this.contextMenuItems.push({
                    title: "复制",
                    message: message,
                    tag: 'copy',
                })
            }
            if (this.isDownloadAble(message)) {
                this.contextMenuItems.push({
                    title: "下载",
                    message: message,
                    tag: 'copy'
                })
            }
            this.contextMenuItems.push({
                title: '本地删除',
                message: message,
                tag: 'delete',
            })
            this.contextMenuItems.push({
                title: '远程删除',
                message: message,
                tag: 'deleteRemote',
            })
            if (this.isForwardable(message)) {
                this.contextMenuItems.push({
                    title: '转发',
                    message: message,
                    tag: 'forward',
                })
            }
            if (this.isRecallable(message)) {
                this.contextMenuItems.push({
                    title: '撤回',
                    message: message,
                    tag: 'recall',
                })
            }
            if (this.isQuotable(message)) {
                this.contextMenuItems.push({
                    title: '引用',
                    message: message,
                    tag: 'quote',
                })
            }
            this.contextMenuItems.push({
                title: '多选',
                message: message,
                tag: 'multiSelection',
            })
            this.showContextMenu = true;

            // <!--                    <li v-if="isCopyable(message)">-->
            //     <!--                        <a @click.prevent="copy(message)">{{ $t('common.copy') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li v-if="isDownloadAble(message)">-->
            //     <!--                        <a @click.prevent="download(message)">{{ $t('common.save') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li>-->
            //     <!--                        <a @click.prevent="delMessage(message)">{{ $t('common.delete') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li v-if="isForwardable(message)">-->
            //     <!--                        <a @click.prevent="_forward(message)">{{ $t('common.forward') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li v-if="isFavable(message)">-->
            //     <!--                        <a @click.prevent="favMessage(message)">{{ $t('common.fav') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li v-if="isQuotable(message)">-->
            //     <!--                        <a @click.prevent="quoteMessage(message)">{{ $t('common.quote') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li>-->
            //     <!--                        <a @click.prevent="multiSelect(message)">{{ $t('common.multi_select') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li v-if="isRecallable(message)">-->
            //     <!--                        <a @click.prevent="recallMessage(message)">{{ $t('common.recall') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li v-if="isLocalFile(message)">-->
            //     <!--                        <a @click.prevent="openFile(message)">{{ $t('common.open') }}</a>-->
            //     <!--                    </li>-->
            //     <!--                    <li v-if="isLocalFile(message)">-->
            //     <!--                        <a @click.prevent="openDir(message)">{{ $t('common.open_dir') }}</a>-->
            //     <!--                    </li>-->
        },

        onContextMenuItemSelect(t) {
            switch (t.tag) {
                case 'delete':
                    console.log('wfc delete message', t.message.messageId)
                    wfc.deleteMessage(t.message.messageId);
                    break;
                case 'deleteRemote':
                    wfc.deleteRemoteMessageByUid(t.message.messageUid, () => {
                        console.log('delete remote message success')
                    }, err => {
                        console.log('delete remote message fail', err);
                    })
                    break;
                case 'forward':
                    this.forward(t.message)
                    break;
                case 'recall':
                    this.recallMessage(t.message);
                    break;
                case 'quote':
                    store.quoteMessage(t.message);
                    break;
                case 'multiSelection':
                    this.multiSelect(t.message);
                    break;
                default:
                    uni.showToast({
                        title: 'TODO ' + t.title,
                        icon: 'none'
                    })
                    break;
            }
            this.$eventBus.$emit('contextMenuClosed')
        },

        updateConversationTitle() {
            uni.setNavigationBarTitle({
                title: this.targetUserOnlineStateDesc ? this.conversationTitle + `(${this.targetUserOnlineStateDesc})` : this.conversationTitle
            });
        },

        onPulling(e) {
            // console.log("onpulling", e);
        },
        onRefresh() {
            console.log('onRresh...')
            if (this._freshing) {
                return;
            }

            this._freshing = true;
            this.triggered = true;
            store.loadConversationHistoryMessages(() => {
                console.log('onRresh... 11')
                this.triggered = false;
                this._freshing = false;
            }, () => {
                console.log('onRresh... 12')
                this.triggered = false;
                this._freshing = false;
            });
        },
        onRestore() {
            this.triggered = 'restore'; // 需要重置
            console.log("onRestore");
        },
        onAbort() {
            console.log("onAbort");
        },

        scrollToBottom() {
            this.scrollTop = 999999 + this.lastMessageId;
        }
    },

    mounted() {
        uni.setNavigationBarTitle({
            title: this.targetUserOnlineStateDesc ? this.conversationTitle + `(${this.targetUserOnlineStateDesc})` : this.conversationTitle
        });
        this.scrollToBottom();
        store.clearConversationUnreadStatus(this.conversationInfo.conversation);

        this.keyboardHeight = getItem('keyboardHeight');
        // #ifdef APP-PLUS
        uni.onKeyboardHeightChange(res => {
            if (this.keyboardHeight !== res.height && res.height > 0) {
                this.keyboardHeight = res.height;
                setItem('keyboardHeight', this.keyboardHeight)
            }
            if (this.$refs.messageInputView) {
                this.$refs.messageInputView.onKeyboardHeightChange(this.keyboardHeight, res.height);
            }
            this.scrollTop = 99999;

            // currentKeyboardHeight 显示扩展面板的时候，也应当置上
            console.log('------------- keyboardHeight', this.keyboardHeight, this.currentKeyboardHeight);
        });
        // #endif
        this.$eventBus.$on('openMessageContextMenu', ([event, message]) => {
            this.showMessageContextMenu(event, message)
        });

        wfc.eventEmitter.on(EventType.ReceiveMessages, this.onReceiveMessage)
    },

    unmounted() {
        this.$eventBus.$off('openMessageContextMenu')
        wfc.eventEmitter.removeListener(EventType.ReceiveMessages, this.onReceiveMessage)
    },

    beforeUpdate() {
    },
    updated() {
        if (!this.sharedConversationState.currentConversationInfo) {
            return;
        }
        // console.log('conversationView updated', this.sharedConversationState.shouldAutoScrollToBottom)
        if (this.sharedConversationState.shouldAutoScrollToBottom) {
            this.scrollToBottom();
        } else {
            // 用户滑动到上面之后，收到新消息，不自动滑动到最下面
        }
        if (this.sharedConversationState.currentConversationInfo) {
            let unreadCount = this.sharedConversationState.currentConversationInfo.unreadCount;
            if (unreadCount.unread > 0) {
                store.clearConversationUnreadStatus(this.sharedConversationState.currentConversationInfo.conversation);
            }
        }

        this.conversationInfo = this.sharedConversationState.currentConversationInfo;
    },

    computed: {
        conversationTitle() {
            let info = this.sharedConversationState.currentConversationInfo;
            return !info ? '' : info.conversation._target._displayName;
        },
        targetUserOnlineStateDesc() {
            let info = this.sharedConversationState.currentConversationInfo;
            return info ? info.conversation._targetOnlineStateDesc : null;
        },
        loadingIdentifier() {
            let conversation = this.sharedConversationState.currentConversationInfo.conversation;
            return conversation.type + '-' + conversation.target + '-' + conversation.line;
        },
        currentVoiceMessage() {
            let voice = this.sharedConversationState.currentVoiceMessage;
            if (voice) {
                this.playVoice(voice);
            } else {
                if (innerAudioContext) {
                    innerAudioContext.stop();
                    innerAudioContext = null;
                }
            }
            return null;
        },

        lastMessageId() {
            return this.conversationInfo.lastMessage ? this.conversationInfo.lastMessage.messageId : '';
        }
    },

    directives: {
        // ClickOutside
    },
};
</script>

<style lang="css" scoped>
.conversation-empty-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /*border-left: 1px solid #e6e6e6;*/
}

.conversation-content-container {
    position: relative;
    display: flex;
    height: var(--page-full-height-without-header);
    overflow: hidden;
    flex-direction: column;
    background-color: #f3f3f3;
    /*padding: 0 12px;*/
}


.viewider-handler::before {
    cursor: row-resize;
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    border-top: 1px solid #e2e2e2;
    margin: 0 auto;
}

.conversation-content-container .ongoing-call-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: white;
}

.ongoing-call-item {
    padding: 10px 20px;
    display: flex;
    border-bottom: 1px solid lightgrey;
    align-items: center;
}

.ongoing-call-item text {
    flex: 1;
}

.ongoing-call-item button {
    //padding: 5px 10px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
}

.ongoing-call-item button:active {
    border: 1px solid #4168e0;
}

.message-list-container {
    min-height: 100px;
    flex: 1 1 auto;
    overflow: hidden;
}

.message-list {
    height: 100%;
    overflow: auto;
}

>>> .uni-scroll-view-refresher {
    max-height: 100px; /* 设置下拉刷新区域的最大高度为200像素 */
}


</style>
