<template>
    <view>
        <view v-if="sharedConversationState.currentConversationInfo == null" class="conversation-empty-container">
            <text>^~^</text>
        </view>
        <view v-else ref="conversationContentContainer" class="conversation-content-container"
              :dummy_just_for_reactive="currentVoiceMessage"
        >
            <uni-list ref="conversationMessageList" class="message-list" :border="false" @scroll="onScroll">
                <view v-for="(message) in sharedConversationState.currentConversationMessageList"
                      :key="message.messageId">
                    <!--todo 不同的消息类型 notification in out-->

                    <NotificationMessageContentView :message="message" v-if="isNotificationMessage(message)"/>
                    <RecallNotificationMessageContentView :message="message" v-else-if="isRecallNotificationMessage(message)"/>
                    <NormalOutMessageContentView
                        @click.native.capture="sharedConversationState.enableMessageMultiSelection? clickMessageItem($event, message) : null"
                        :message="message"
                        @longpress.native="showMessageContextMenu($event, message)"
                        v-else-if="message.direction === 0"/>
                    <NormalInMessageContentView
                        @click.native.capture="sharedConversationState.enableMessageMultiSelection ? clickMessageItem($event, message) : null"
                        :message="message"
                        @longpress.native="showMessageContextMenu($event, message)"
                        v-else/>
                </view>
            </uni-list>
            <!--            <view v-show="!sharedConversationState.enableMessageMultiSelection"-->
            <!--                  class="viewider-handler"></view>-->
            <chunLei-popups v-model="showContextMenu" :popData="contextMenuItems" @tapPopup="onContextMenuItemSelect" :x="contextMenuX" :y="contextMenuY" direction="column" theme="dark" :triangle="false" placement="bottom-start" dynamic/>
            <MessageInputView :conversationInfo="sharedConversationState.currentConversationInfo"
                              v-show="!sharedConversationState.enableMessageMultiSelection"
                              class="message-input-container"
                              ref="messageInputView"
            />
            <MultiSelectActionView v-show="sharedConversationState.enableMessageMultiSelection"/>
            <!--                <SingleConversationInfoView-->
            <!--                    v-if="showConversationInfo &&  sharedConversationState.currentConversationInfo.conversation.type === 0"-->
            <!--                    :conversation-info="sharedConversationState.currentConversationInfo"-->
            <!--                    v-bind:class="{ active: showConversationInfo }"-->
            <!--                    class="conversation-info-container"-->
            <!--                />-->
            <!--                <GroupConversationInfoView-->
            <!--                    v-if="showConversationInfo &&  sharedConversationState.currentConversationInfo.conversation.type === 1"-->
            <!--                    :conversation-info="sharedConversationState.currentConversationInfo"-->
            <!--                    v-bind:class="{ active: showConversationInfo }"-->
            <!--                    class="conversation-info-container"-->
            <!--                />-->
        </view>
    </view>
</template>

<script>
import SingleConversationInfoView from "@/pages/conversation/SingleConversationInfoView";
import GroupConversationInfoView from "@/pages/conversation/GroupConversationInfoView";
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
// import ForwardMessageByPickConversationView from "@/pages/conversation/message/forward/ForwardMessageByPickConversationView";
// import ForwardMessageByCreateConversationView from "@/pages/conversation/message/forward/ForwardMessageByCreateConversationView";
import ForwardType from "@/pages/conversation/message/forward/ForwardType";
import {fs, isElectron, shell} from "@/platform";
import FileMessageContent from "@/wfc/messages/fileMessageContent";
import ImageMessageContent from "@/wfc/messages/imageMessageContent";
// import {copyImg, copyText} from "@/pages/util/clipboard";
import Message from "@/wfc/messages/message";
// import {downloadFile} from "@/platformHelper";
import VideoMessageContent from "@/wfc/messages/videoMessageContent";
import SoundMessageContent from "@/wfc/messages/soundMessageContent";
import MessageContentType from "@/wfc/messages/messageContentType";
// import BenzAMRRecorder from "benz-amr-recorder";
// import axios from "axios";
import FavItem from "@/wfc/model/favItem";
import ConversationType from "@/wfc/model/conversationType";
import GroupMemberType from "@/wfc/model/groupMemberType";
import CompositeMessageContent from "@/wfc/messages/compositeMessageContent";
import ConnectionStatus from "../../wfc/client/connectionStatus";

var amr;
export default {
    components: {
        MultiSelectActionView,
        NotificationMessageContentView,
        RecallNotificationMessageContentView,
        NormalInMessageContentView,
        NormalOutMessageContentView,
        MessageInputView,
        GroupConversationInfoView,
        SingleConversationInfoView,
    },
    // props: ["conversation"],
    data() {
        return {
            conversationInfo: null,
            showConversationInfo: false,
            sharedConversationState: store.state.conversation,
            sharedContactState: store.state.contact,
            sharedPickState: store.state.pick,
            sharedMiscState: store.state.misc,

            savedMessageListViewHeight: -1,
            saveMessageListViewFlexGrow: -1,

            dragAndDropEnterCount: 0,

            showContextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
            contextMenuItems: []
        };
    },

    onPullDownRefresh() {
        store.loadConversationHistoryMessages(() => {
            uni.stopPullDownRefresh();
        }, () => {
            uni.stopPullDownRefresh();
        });
    },

    onLoad() {
    },

    onUnload(){
        store.setCurrentConversationInfo(null);
    },

    methods: {
        toggleConversationInfo() {
            this.showConversationInfo = !this.showConversationInfo;
        },

        toggleMessageMultiSelectionActionView(message) {
            if (!this.sharedConversationState.enableMessageMultiSelection) {
                this.saveMessageListViewFlexGrow = this.$refs['conversationMessageList'].style.flexGrow;
                this.savedMessageListViewHeight = this.$refs['conversationMessageList'].style.height;
                this.$refs['conversationMessageList'].style.flexGrow = 1;
            } else {
                if (this.saveMessageListViewFlexGrow !== -1 && this.savedMessageListViewHeight !== -1) {
                    this.$refs['conversationMessageList'].style.height = this.savedMessageListViewHeight;
                    this.$refs['conversationMessageList'].style.flexGrow = this.saveMessageListViewFlexGrow;
                }
            }
            this.sharedPickState.messages.forEach(m => console.log(m.messageId));
            store.toggleMessageMultiSelection(message);
        },

        clickMessageItem(event, message) {
            if (message.messageContent instanceof NotificationMessageContent) {
                return;
            }
            if (this.sharedConversationState.enableMessageMultiSelection) {
                store.selectOrDeselectMessage(message);
                event.stopPropagation();
            }
        },

        hideConversationInfo() {
            // TODO
            // 是否在创建群聊，或者是在查看会话参与者信息
            this.showConversationInfo && (this.showConversationInfo = false);
        },

        isNotificationMessage(message) {
            return message && message.messageContent instanceof NotificationMessageContent && message.messageContent.type !== MessageContentType.RecallMessage_Notification;
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

            console.log('onscroll');
            this.showContextMenu = false;
            // 当用户往上滑动一段距离之后，收到新消息，不自动滚到到最后
            if (e.target.scrollHeight > e.target.clientHeight + e.target.scrollTop + e.target.clientHeight / 2) {
                store.setShouldAutoScrollToBottom(false)
            } else {
                store.setShouldAutoScrollToBottom(true)
                store.clearConversationUnreadStatus(this.sharedConversationState.currentConversationInfo.conversation);
            }
        },

        onMenuClose() {
            this.$emit('contextMenuClosed')
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
            if (message && isElectron()) {
                let media = message.messageContent;
                let localPath = media.localPath;
                if (localPath) {
                    return fs.existsSync(localPath);
                }
            }
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
            if (isElectron()) {
                downloadFile(message);
            } else {
                if (!store.isDownloadingMessage(message.messageId)) {
                    downloadFile(message)
                    store.addDownloadingMessage(message.messageId)
                } else {
                    // TODO toast 下载中
                    console.log('file isDownloading')
                }
            }
        },

        openFile(message) {
            let file = message.messageContent;
            shell.openItem(file.localPath);
        },

        openDir(message) {
            let file = message.messageContent;
            shell.showItemInFolder(file.localPath);
        },

        recallMessage(message) {
            wfc.recallMessage(message.messageUid, null, null);
        },

        delMessage(message) {
            this.$alert({
                title: ' 删除消息',
                content: '确定删除消息？',
                confirmText: '本地删除',
                cancelText: '远程删除',
                cancelCallback: () => {
                    wfc.deleteRemoteMessageByUid(message.messageUid, null, null)
                },
                confirmCallback: () => {
                    wfc.deleteMessage(message.messageId);
                }
            })
        },

        forward(message) {
            return this.pickConversationAndForwardMessage(ForwardType.NORMAL, [message]);
        },

        _forward(message) {
            this.forward(message).catch(() => {
                // do nothing
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

        pickConversationAndForwardMessage(forwardType, messages) {
            return new Promise(((resolve, reject) => {
                let beforeClose = (event) => {
                    console.log('Closing...', event, event.params)
                    // What a gamble... 50% chance to cancel closing
                    if (event.params.toCreateConversation) {
                        console.log('to show')
                        Promise.race([this.createConversationAndForwardMessage(forwardType, messages)])
                            .then(resolve)
                            .catch(reject);
                    } else if (event.params.confirm) {
                        let conversations = event.params.conversations;
                        let extraMessageText = event.params.extraMessageText;
                        store.forwardMessage(forwardType, conversations, messages, extraMessageText)
                        resolve();
                    } else {
                        console.log('cancel')
                        reject();
                    }
                };

                this.$modal.show(
                    ForwardMessageByPickConversationView,
                    {
                        forwardType: forwardType,
                        messages: messages
                    }, {
                        name: 'forward-by-pick-conversation-modal',
                        width: 600,
                        height: 480,
                        clickToClose: false,
                    }, {
                        'before-close': beforeClose,
                    })
            }));
        },

        createConversationAndForwardMessage(forwardType, messages) {
            return new Promise(((resolve, reject) => {

                let beforeClose = (event) => {
                    console.log('Closing...', event, event.params)
                    if (event.params.backPickConversation) {
                        Promise.race([this.pickConversationAndForwardMessage(forwardType, messages)])
                            .then(resolve)
                            .catch(reject);
                    } else if (event.params.confirm) {
                        let users = event.params.users;
                        let extraMessageText = event.params.extraMessageText;
                        store.forwardByCreateConversation(forwardType, users, messages, extraMessageText)
                        resolve();
                    } else {
                        console.log('cancel')
                        reject();
                    }
                };
                this.$modal.show(
                    ForwardMessageByCreateConversationView,
                    {
                        forwardType: forwardType,
                        messages: messages,
                        users: this.sharedContactState.friendList,
                    }, {
                        name: 'forward-by-create-conversation-modal',
                        width: 600,
                        height: 480,
                        clickToClose: false,
                    }, {
                        'before-close': beforeClose,
                    });
            }));
        },
        playVoice(message) {
            if (amr) {
                amr.stop();
            }
            amr = new BenzAMRRecorder();
            let voice = message.messageContent;
            amr.initWithUrl(voice.remotePath).then(() => {
                message._isPlaying = true;
                amr.play();
            });
            amr.onEnded(() => {
                message._isPlaying = false;
                store.playVoice(null)
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


        showMessageContextMenu(e, message) {
            this.contextMenuX = e.touches[0].clientX;
            this.contextMenuY = e.touches[0].clientY;

            this.contextMenuItems = [];
            if (this.isCopyable(message)) {
                this.contextMenuItems.push({
                    title: "复制",
                    message:message,
                    tag: 'copy',
                })
            }
            if (this.isDownloadAble(message)) {
                this.contextMenuItems.push({
                    title: "下载",
                    message:message,
                    tag: 'copy'
                })
            }
            this.contextMenuItems.push({
                title: '删除',
                message:message,
                tag: 'delete',
            })
            if (this.isForwardable(message)){
                this.contextMenuItems.push({
                    title: '转发',
                    message:message,
                    tag: 'forward',
                })
            }
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
            console.log('xxx onContextMenuItemSelect', t)
            if (t.tag === 'delete'){
                console.log('wfc delete message', t.message.messageId)
                wfc.deleteMessage(t.message.messageId);
                // wfc.deleteMessage(3100);
            }
        }
    },

    mounted() {
        uni.setNavigationBarTitle({
            title: this.targetUserOnlineStateDesc ? this.conversationTitle + `(${this.targetUserOnlineStateDesc})` : this.conversationTitle
        });
    },

    updated() {
        if (!this.sharedConversationState.currentConversationInfo) {
            return;
        }
        console.log('conversationView updated', this.sharedConversationState.shouldAutoScrollToBottom)
        if (this.sharedConversationState.shouldAutoScrollToBottom) {
            setTimeout(() => {
                uni.pageScrollTo({
                    scrollTop: 999999,
                    duration: 10,
                });
                this.$forceUpdate()

            }, 100);
        } else {
            // 用户滑动到上面之后，收到新消息，不自动滑动到最下面
        }
        if (this.sharedConversationState.currentConversationInfo) {
            let unreadCount = this.sharedConversationState.currentConversationInfo.unreadCount;
            if (unreadCount.unread > 0) {
                store.clearConversationUnreadStatus(this.sharedConversationState.currentConversationInfo.conversation);
            }
        }

        if (this.conversationInfo && this.sharedConversationState.currentConversationInfo && !this.conversationInfo.conversation.equal(this.sharedConversationState.currentConversationInfo.conversation)) {
            this.showConversationInfo = false;
        }
        this.conversationInfo = this.sharedConversationState.currentConversationInfo;
    },

    computed: {
        conversationTitle() {
            let info = this.sharedConversationState.currentConversationInfo;
            return info.conversation._target._displayName;
        },
        targetUserOnlineStateDesc() {
            let info = this.sharedConversationState.currentConversationInfo;
            return info.conversation._targetOnlineStateDesc;
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
                if (amr) {
                    amr.stop();
                }
            }
            return null;
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
    background-color: white;
    /*border-left: 1px solid #e6e6e6;*/
}

.conversation-content-container {
    position: relative;
    display: flex;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
    /*background-color: #f3f3f3;*/
    /*padding: 0 12px;*/
    padding-bottom: 112rpx;
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

.message-list {
    /*padding-bottom: 112rpx;*/
    flex: 1 1 auto;
    overflow: auto;
}

</style>
