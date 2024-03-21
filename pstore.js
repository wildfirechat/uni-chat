import {defineStore} from 'pinia'
import {ref} from "vue";
import ConnectionStatus from "./wfc/client/connectionStatus";
import Config from "./config";

export const pstore = defineStore('store-p', () => {
    const conversationStore = ref({

        currentConversationInfo: null,
        conversationInfoList: [],
        currentConversationMessageList: [],
        currentConversationOldestMessageId: 0,
        currentConversationOldestMessageUid: 0,

        currentConversationRead: null,

        // TODO 调用setUserEnableReceipt时，需要更新
        isMessageReceiptEnable: false,

        inputtingUser: null,
        inputClearHandler: null,

        shouldAutoScrollToBottom: true,

        previewMediaItems: [],
        previewMediaIndex: null,

        enableMessageMultiSelection: false,
        showChannelMenu: false,
        quotedMessage: null,

        // 为什么不用 map？
        // map 里面的元素并不是 reactive 的
        downloadingMessages: [],
        sendingMessages: [],
        floatingConversations: [],

        currentVoiceMessage: null,
        contextMenuConversationInfo: null,

        _reset() {
            this.currentConversationInfo = null;
            this.conversationInfoList = []
            this.currentConversationMessageList = [];
            this.currentConversationOldestMessageId = 0;
            this.currentConversationOldestMessageUid = 0;
            this.currentConversationRead = null;
            this.isMessageReceiptEnable = false;
            this.inputtingUser = null;
            this.inputClearHandler = null;
            this.shouldAutoScrollToBottom = true;
            this.previewMediaItems = [];
            this.previewMediaIndex = null;
            this.enableMessageMultiSelection = false;
            this.showChannelMenu = false;
            this.quotedMessage = null;
            this.downloadingMessages = [];
            this.sendingMessages = [];
            this.floatingConversations = [];
            this.currentVoiceMessage = null;
            this.contextMenuConversationInfo = null;
        }
    })

    const contactStore = ref({
        currentFriendRequest: null,
        currentGroup: null,
        currentChannel: null,
        currentFriend: null,
        currentOrganization: null,
        currentChatroom: null,
        currentUser: null,

        expandFriendRequestList: false,
        expandFriendList: true,
        expandGroup: false,
        expandChanel: false,
        expandOrganization: false,
        expandChatroom: false,

        unreadFriendRequestCount: 0,
        friendList: [],
        friendRequestList: [],
        favGroupList: [],
        channelList: [],
        favContactList: [],

        selfUserInfo: null,
        contextMenuUserInfo: null,


        _reset() {
            this.currentFriendRequest = null;
            this.currentGroup = null;
            this.currentChannel = null;
            this.currentFriend = null;
            this.currentOrganization = null;
            this.currentChatroom = null;
            this.currentUser = null;

            this.expandFriendRequestList = false;
            this.expandFriendList = true;
            this.expandGroup = false;
            this.expandChanel = false;

            this.unreadFriendRequestCount = 0;
            this.friendList = [];
            this.friendRequestList = [];
            this.favGroupList = [];
            this.channelList = [];
            this.favContactList = [];

            this.selfUserInfo = null;
            this.contextMenuUserInfo = null;
        }
    })

    const searchStore = ref({
        query: null,
        userSearchResult: [],
        channelSearchResult: [],
        contactSearchResult: [],
        groupSearchResult: [],
        conversationSearchResult: [],
        messageSearchResult: [],

        _reset() {
            this.query = null
            this.userSearchResult = [];
            this.channelSearchResult = [];
            this.contactSearchResult = [];
            this.groupSearchResult = [];
            this.conversationSearchResult = [];
            this.messageSearchResult = []
        }
    })

    const pickStore = ref({
        users: [],
        organizations: [],
        conversations: [],
        messages: [],
        _reset() {
            this.users = [];
            this.organizations = [];
            this.conversations = [];
            this.messages = [];

        }
    })
    const miscStore = ref({
        connectionStatus: ConnectionStatus.ConnectionStatusUnconnected,
        enableNotification: true,
        enableNotificationMessageDetail: true,
        enableAutoLogin: false,
        isMainWindow: false,
        isCommercialServer: false,
        isDisableSyncDraft: false,
        isVoipOngoing: false,
        config: Config,
        userOnlineStateMap: new Map(),

        _reset() {
            this.connectionStatus = ConnectionStatus.ConnectionStatusUnconnected;
            this.enableNotification = true;
            this.enableAutoLogin = false;
            this.isCommercialServer = false;
            this.isDisableSyncDraft = false;
            this.isVoipOngoing = false;
            this.config = Config;
            this.userOnlineStateMap = new Map();
        }
    })

    return {conversationStore, contactStore, pickStore, searchStore, miscStore}
})