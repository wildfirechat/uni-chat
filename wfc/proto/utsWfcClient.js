import {
    initProto,
    getConnectionStatus,
    connect,
    getClientId,
    getConversationInfos,
    registerMessageFlag,
    getUserSettings,
    setWfcEventListener,
    getGroupInfo,
    getUserInfo,
    getGroupMembers,
    getUserInfos,
    getConversationInfo,
    getListenedChannels,
    getChannelInfo,
    getMyFriendList,
    getFavGroups,
    getFavUsers,
    getIncommingFriendRequest,
    getGroupInfos,
    getUnreadFriendRequestStatus,
    isFavGroup,
    getAuthCode,
    isMyFriend,
    isReceiptEnabled,
    watchOnlineState,
    isUserReceiptEnabled,
    isSupportBigFilesUpload,
    allowGroupMember,
    clearAllNotification,
    clearAllUnreadStatus,
    clearMessages,
    clearMessagesByTime,
    clearRemoteConversationMessages,
    clearUnreadFriendRequestStatus,
    clearUnreadStatus,
    configApplication,
    createChannel,
    createGroup,
    deleteFileRecord,
    getMessagesV2,

    deleteFriend,
    deleteMessage,
    deleteRemoteMessage,
    destoryChannel,
    dismissGroup,
    getAuthorizedMediaUrl,
    getBlackList,
    getChatroomInfo,
    getChatroomMemberInfo,
    getConversationFiles,
    getConversationFirstUnreadMessageId,
    getConversationRead,
    getConversationUnreadCount,
    getFriendAlias,

    getFriendList,
    getMyFiles,
    getOutgoingFriendRequest,
    getRemoteMessage,
    getRemoteMessages,
    getServerDeltaTime,
    getUnreadCount,
    getUploadMediaUrl,
    getUserInfoEx,
    getUserMessages,
    getUserMessagesEx,
    getUserMessagesExV2,
    getUserMessagesV2,
    getUserSetting,
    handleFriendRequest,

    insertMessage,
    isBlackListed,
    isCommercialServer,
    isEnableUserOnlineState,
    isFavUser,
    isGlobalDisableSyncDraft,
    isGlobalSlient,
    isHiddenNotificationDetail,
    isListenedChannel,
    joinChatroom,
    kickoffMembers,
    listenChannel,
    loadFriendRequestFromRemote,
    modifyChannelInfo,
    modifyGroupAlias,
    modifyGroupInfo,
    modifyGroupMemberAlias,
    modifyGroupMemberExtra,
    modifyMyInfo,
    muteGroupMember,
    quitChatroom,
    quitGroup,
    quitGroupEx,
    recall,
    removeConversation,
    searchChannel,
    searchConversation,
    searchFiles,
    searchFriends,
    searchGroups,
    searchMessage,
    searchMessageByTypes,
    searchMessageByTypesAndTimes,
    searchMessageEx,
    searchMessageEx2,
    searchMyFiles,
    searchUser,
    sendConferenceRequest,
    sendFriendRequest,
    sendMessage,
    setBackupAddress,
    setBackupAddressStrategy,
    setBlackList,

    setConversationDraft,
    setConversationSlient,
    setConversationTimestamp,
    setConversationTop,
    setDeviceToken,
    setFavGroup,
    setFavUser,

    setFriendAlias,
    setGlobalSlient,
    setGroupManager,
    setHiddenNotificationDetail,
    setLastReceivedMessageUnRead,
    setMediaMessagePlayed,
    setMessageLocalExtra,
    setProxyInfo,
    setUserAgent,
    setUserReceiptEnable,
    setUserSetting,
    transferGroup,
    unwatchOnlineState,
    updateMessage,
    updateMessageStatus,
    updateRemoteMessageContent,
    uploadMedia,
    useSM4,
    getMessageByUid,
    getGroupMember,
    addMembers,
    getMessage,
    disconnect

} from "@/uni_modules/wfc-client";

class UtsWfcClient {
    initProto = initProto
    connect = connect
    getConnectionStatus = getConnectionStatus
    getClientId = getClientId
    getConversationInfos = getConversationInfos
    registerMessageFlag = registerMessageFlag
    getUserSettings = getUserSettings
    setWfcEventListener = setWfcEventListener
    getGroupInfo = getGroupInfo
    getUserInfo = getUserInfo
    getGroupMembers = getGroupMembers
    getUserInfos = getUserInfos
    getConversationInfo = getConversationInfo
    getListenedChannels = getListenedChannels
    getChannelInfo = getChannelInfo
    getMyFriendList = getMyFriendList
    getFavGroups = getFavGroups
    getFavUsers = getFavUsers
    getIncommingFriendRequest = getIncommingFriendRequest
    getGroupInfos = getGroupInfos
    getUnreadFriendRequestStatus = getUnreadFriendRequestStatus
    isFavGroup = isFavGroup
    getAuthCode = getAuthCode
    isMyFriend = isMyFriend
    isReceiptEnabled = isReceiptEnabled
    watchOnlineState = watchOnlineState
    isUserReceiptEnabled = isUserReceiptEnabled
    isSupportBigFilesUpload = isSupportBigFilesUpload
    allowGroupMember = allowGroupMember
    clearAllNotification = clearAllNotification
    clearAllUnreadStatus = clearAllUnreadStatus
    clearMessages = clearMessages
    clearMessagesByTime = clearMessagesByTime
    clearRemoteConversationMessages = clearRemoteConversationMessages
    clearUnreadFriendRequestStatus = clearUnreadFriendRequestStatus
    clearUnreadStatus = clearUnreadStatus
    configApplication = configApplication
    createChannel = createChannel
    createGroup = createGroup
    deleteFileRecord = deleteFileRecord
    getMessagesV2 = getMessagesV2
    getConversationRead = getConversationRead
    deleteFriend = deleteFriend
    deleteMessage = deleteMessage
    deleteRemoteMessage = deleteRemoteMessage
    destoryChannel = destoryChannel
    dismissGroup = dismissGroup
    getAuthorizedMediaUrl = getAuthorizedMediaUrl
    getBlackList = getBlackList
    getChatroomInfo = getChatroomInfo
    getChatroomMemberInfo = getChatroomMemberInfo
    getConversationFiles = getConversationFiles
    getConversationFirstUnreadMessageId = getConversationFirstUnreadMessageId
    getConversationUnreadCount = getConversationUnreadCount
    getFriendAlias = getFriendAlias
    getFriendList = getFriendList
    getFriendList = getFriendList
    getMyFiles = getMyFiles
    getOutgoingFriendRequest = getOutgoingFriendRequest
    getRemoteMessage = getRemoteMessage
    getRemoteMessages = getRemoteMessages
    getServerDeltaTime = getServerDeltaTime
    getUnreadCount = getUnreadCount
    getUploadMediaUrl = getUploadMediaUrl
    getUserInfoEx = getUserInfoEx
    getUserMessages = getUserMessages
    getUserMessagesEx = getUserMessagesEx
    getUserMessagesExV2 = getUserMessagesExV2
    getUserMessagesV2 = getUserMessagesV2
    getUserSetting = getUserSetting
    handleFriendRequest = handleFriendRequest

    insertMessage = insertMessage
    isBlackListed = isBlackListed
    isCommercialServer = isCommercialServer
    isEnableUserOnlineState = isEnableUserOnlineState
    isFavUser = isFavUser
    isGlobalDisableSyncDraft = isGlobalDisableSyncDraft
    isGlobalSlient = isGlobalSlient
    isHiddenNotificationDetail = isHiddenNotificationDetail
    isListenedChannel = isListenedChannel
    joinChatroom = joinChatroom
    kickoffMembers = kickoffMembers
    listenChannel = listenChannel
    loadFriendRequestFromRemote = loadFriendRequestFromRemote
    modifyChannelInfo = modifyChannelInfo
    modifyGroupAlias = modifyGroupAlias
    modifyGroupInfo = modifyGroupInfo
    modifyGroupMemberAlias = modifyGroupMemberAlias
    modifyGroupMemberExtra = modifyGroupMemberExtra
    modifyMyInfo = modifyMyInfo
    muteGroupMember = muteGroupMember

    quitChatroom = quitChatroom
    quitGroup = quitGroup
    quitGroupEx = quitGroupEx
    recall = recall
    removeConversation = removeConversation
    searchChannel = searchChannel
    searchConversation = searchConversation
    searchFiles = searchFiles
    searchFriends = searchFriends
    searchGroups = searchGroups
    searchMessage = searchMessage
    searchMessageByTypes = searchMessageByTypes
    searchMessageByTypesAndTimes = searchMessageByTypesAndTimes
    searchMessageEx = searchMessageEx
    searchMessageEx2 = searchMessageEx2
    searchMyFiles = searchMyFiles
    searchUser = searchUser
    sendConferenceRequest = sendConferenceRequest
    sendFriendRequest = sendFriendRequest
    sendMessage = sendMessage
    setBackupAddress = setBackupAddress
    setBackupAddressStrategy = setBackupAddressStrategy
    setBlackList = setBlackList

    setConversationDraft = setConversationDraft
    setConversationSlient = setConversationSlient
    setConversationTimestamp = setConversationTimestamp
    setConversationTop = setConversationTop
    setDeviceToken = setDeviceToken
    setFavGroup = setFavGroup
    setFavUser = setFavUser

    setFriendAlias = setFriendAlias
    setGlobalSlient = setGlobalSlient
    setGroupManager = setGroupManager
    setHiddenNotificationDetail = setHiddenNotificationDetail
    setLastReceivedMessageUnRead = setLastReceivedMessageUnRead
    setMediaMessagePlayed = setMediaMessagePlayed
    setMessageLocalExtra = setMessageLocalExtra
    setProxyInfo = setProxyInfo
    setUserAgent = setUserAgent
    setUserReceiptEnable = setUserReceiptEnable
    setUserSetting = setUserSetting
    transferGroup = transferGroup
    unwatchOnlineState = unwatchOnlineState
    updateMessage = updateMessage
    updateMessageStatus = updateMessageStatus
    updateRemoteMessageContent = updateRemoteMessageContent
    uploadMedia = uploadMedia
    useSM4 = useSM4
    getMessageByUid = getMessageByUid
    getGroupMember = getGroupMember
    addMembers = addMembers
    getMessage = getMessage
    disconnect = disconnect
}

const utsWfcClient = new UtsWfcClient()
export default utsWfcClient