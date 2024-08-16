//
//  ClientModule.h
//  WFClientUniPlugin
//
//  Created by Rain on 2022/5/30.
//  Copyright © 2022 DCloud. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JSCallback.h"
#import "EventListener.h"

NS_ASSUME_NONNULL_BEGIN

@interface WFClientModule : NSObject
- (void)initProto;

- (void)setEventListener:(void (^)(NSString *channel, NSObject *value))eventListener;

- (void)startBugly:(NSString *)appId;

- (NSNumber *)connect:(NSString *)host userId:(NSString *)userId token:(NSString *)token;

- (NSString *)getClientId;
- (NSString *)getUserId;

- (void)setDeviceToken:(int)type token:(NSString *)token;
- (void)chooseFile:(NSString *)type success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)registerMessageFlag:(int)type flag:(int)flag;

- (void)useSM4;

- (void)setProxyInfo:(NSString *)host ip:(NSString *)ip port:(int)port username:(NSString *)username password:(NSString *)password;

- (void)disconnect:(BOOL)disablePush clearSession:(BOOL)clearSession;
- (void)setSendLogCommand:(NSString *)cmd;

- (NSNumber *)getServerDeltaTime;

- (NSNumber *)getConnectionStatus;

- (void)setBackupAddressStrategy:(int)strategy;

- (void)setBackupAddress:(NSString *)backupHost backupPort:(int)backupPort;

- (void)setUserAgent:(NSString *)userAgent;

- (void)addHttpHeader:(NSString *)header value:(NSString *)value;

- (void)notify:(NSString *)title content:(NSString *)content;

- (void)clearAllNotification;
- (void)getAuthCode:(NSString *)appId appType:(int)appType host:(NSString *)host success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)configApplication:(NSString *)appId appType:(int)appType timestamp:(int64_t)timestamp nonceStr:(NSString *)nonceStr signature:(NSString *)signature success:(JSCallback)successCB error:(JSCallback)errorCB;
- (NSString *)getUserInfo:(NSString *)userId refresh:(BOOL)refresh groupId:(NSString *)groupId;
- (NSString *)getUserInfos:(NSArray<NSString *> *)userIds groupId:(NSString *)groupId;

- (void)getUserInfoEx:(NSString *)userId refresh:(BOOL)refresh success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)searchUser:(NSString *)keyword searchType:(int)searchType page:(int)page success:(JSCallback)successCB error:(JSCallback)errorCB;
- (NSString *)searchFriends:(NSString *)keyword;
- (NSString *)searchGroups:(NSString *)keyword;
- (NSString *)getIncommingFriendRequest;

- (NSString *)getOutgoingFriendRequest;

- (NSString *)getFriendRequest:(NSString *)userId incoming:(BOOL)incoming;

- (void)loadFriendRequestFromRemote;
- (NSString *)getFavUsers;
- (BOOL)isFavUser:(NSString *)userId;

- (void)setFavUser:(NSString *)userId isFav:(BOOL)isFav success:(JSCallback)successCB error:(JSCallback)errorCB;
- (void)getRemoteMessages:(NSString *)strConv beforeUid:(NSString *)beforeUid count:(int)count success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)getRemoteMessage:(NSString *)strMessageUid success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSNumber *)getUnreadFriendRequestStatus;

- (void)clearUnreadFriendRequestStatus;

- (void)deleteFriend:(NSString *)userId success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)handleFriendRequest:(NSString *)userId accept:(BOOL)accept success:(JSCallback)successCB error:(JSCallback)errorCB extra:(NSString *)extra;

- (BOOL)isBlackListed:(NSString *)userId;

- (NSString *)getBlackList;

- (void)setBlackList:(NSString *)userId block:(BOOL)block success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getMyFriendList:(BOOL)refresh;

- (NSString *)getFriendList:(BOOL)refresh;

- (NSString *)getFriendAlias:(NSString *)userId;

- (void)setFriendAlias:(NSString *)userId alias:(NSString *)alias success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)createGroup:(NSString *)groupId type:(int)type name:(NSString *)name portrait:(NSString *)portrait groupExtra:(NSString *)groupExtra memberIds:(NSArray<NSString *> *)memberIds memberExtra:(NSString *)memberExtra lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)setGroupManager:(NSString *)groupId isSet:(BOOL)isSet memberIds:(NSArray<NSString *> *)memberIds lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)allowGroupMember:(NSString *)groupId isSet:(BOOL)isSet memberIds:(NSArray<NSString *> *)memberIds lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)muteGroupMember:(NSString *)groupId isSet:(BOOL)isSet memberIds:(NSArray<NSString *> *)memberIds lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getGroupInfo:(NSString *)groupId refresh:(BOOL)refresh;
- (NSString *)getGroupInfos:(NSArray<NSString *> *)groupIds refresh:(BOOL)refresh;
- (void)getGroupInfoEx:(NSString *)groupId refresh:(BOOL)refresh success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)addMembers:(NSString *)groupId memberIds:(NSArray<NSString *> *)memberIds extra:(NSString *)extra lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getGroupMembers:(NSString *)groupId refresh:(BOOL)refresh;

- (NSString *)getGroupMember:(NSString *)groupId memberId:(NSString *)memberId;
- (NSString *)getGroupMembersByType:(NSString *)groupId type:(int)memberType;
- (void)getGroupMembersEx:(NSString *)groupId refresh:(BOOL)refresh  success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)kickoffMembers:(NSString *)groupId memberIds:(NSArray<NSString *> *)memberIds lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)quitGroup:(NSString *)groupId lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;
- (void)quitGroupEx:(NSString *)groupId keepMessage:(BOOL)keepMessage lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)dismissGroup:(NSString *)groupId lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)modifyGroupInfo:(NSString *)groupId type:(int)type newValue:(NSString *)newValue lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)modifyGroupAlias:(NSString *)groupId alias:(NSString *)alias lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)modifyGroupMemberAlias:(NSString *)groupId memberId:(NSString *)memberId alias:(NSString *)alias lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)modifyGroupMemberExtra:(NSString *)groupId memberId:(NSString *)memberId extra:(NSString *)extra lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)transferGroup:(NSString *)groupId newOwner:(NSString *)newOwner lines:(NSArray<NSNumber *> *)lines messagePayload:(NSString *)strMessagePayload success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getFavGroups;

- (BOOL)isFavGroup:(NSString *)groupId;

- (void)setFavGroup:(NSString *)groupId fav:(BOOL)fav success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getUserSetting:(int)scope key:(NSString *)key;

- (NSString *)getUserSettings:(int)scope;

- (void)setUserSetting:(int)scope key:(NSString *)key value:(NSString *)value success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)modifyMyInfo:(int)type value:(NSString *)value success:(JSCallback)successCB error:(JSCallback)errorCB;

- (BOOL)isGlobalSlient;

- (void)setGlobalSlient:(BOOL)silent success:(JSCallback)successCB error:(JSCallback)errorCB;
- (BOOL)isHiddenNotificationDetail;

- (void)setHiddenNotificationDetail:(BOOL)hide success:(JSCallback)successCB error:(JSCallback)errorCB;

- (BOOL)isHiddenGroupMemberName:(NSString *)groupId;

- (BOOL)isUserReceiptEnabled;

- (void)setUserReceiptEnable:(BOOL)enable success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)joinChatroom:(NSString *)chatroomId success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)quitChatroom:(NSString *)chatroomId success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)getChatroomInfo:(NSString *)chatroomId updateDt:(long long)updateDt success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)getChatroomMemberInfo:(NSString *)chatroomId maxCount:(int)maxCount updateDt:(long long)updateDt success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)createChannel:(NSString *)name portrait:(NSString *)portrait status:(int)status desc:(NSString *)desc extra:(NSString *)extra success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getChannelInfo:(NSString *)channelId refresh:(BOOL)refresh;

- (void)modifyChannelInfo:(NSString *)channelId type:(int)type newValue:(NSString *)newValue success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)searchChannel:(NSString *)keyword success:(JSCallback)successCB error:(JSCallback)errorCB;

- (BOOL)isListenedChannel:(NSString *)channelId;

- (void)listenChannel:(NSString *)channelId listen:(BOOL)listen success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getMyChannels;

- (NSString *)getListenedChannels;

- (void)destoryChannel:(NSString *)channelId success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getConversationInfos:(NSArray<NSNumber *> *)types lines:(NSArray<NSNumber *> *)lines;

- (NSString *)getConversationInfo:(NSString *)strConv;

- (NSString *)searchConversation:(NSString *)keywork types:(NSArray<NSNumber *> *)types lines:(NSArray<NSNumber *> *)lines;

- (void)removeConversation:(NSString *)strConv clearMsg:(BOOL)clearMsg;

- (void)setConversationTop:(NSString *)strConv top:(int)top success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)setConversationSlient:(NSString *)strConv silent:(BOOL)silent success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)setConversationDraft:(NSString *)strConv draft:(NSString *)draft;

- (void)setConversationTimestamp:(NSString *)strConv timestamp:(NSString *)timestamp;

- (NSString *)getUnreadCount:(NSArray<NSNumber *> *)types lines:(NSArray<NSNumber *> *)lines;

- (NSString *)getConversationUnreadCount:(NSString *)strConv;

- (void)clearUnreadStatus:(NSString *)strConv;

- (BOOL)setLastReceivedMessageUnRead:(NSString *)strConv messageUid:(NSString *)messageUidStr timestamp:(NSString *)timestampStr;

- (NSString *)getConversationRead:(NSString *)strConv;

- (NSString *)getMessageDelivery:(NSString *)strConv;

- (void)clearAllUnreadStatus;

- (NSNumber *)getConversationFirstUnreadMessageId:(NSString *)strConv;

- (void)setMediaMessagePlayed:(int)messageId;

- (void)setMessageLocalExtra:(int)messageId extra:(NSString *)extra;

- (BOOL)isMyFriend:(NSString *)userId;

- (void)sendFriendRequest:(NSString *)userId reason:(NSString *)reason extra:(NSString *)extra success:(JSCallback)successCB error:(JSCallback)errorCB;

- (NSString *)getMessages:(NSString *)strConv types:(NSArray<NSNumber *> *)types fromIndex:(int)fromIndex before:(BOOL)before count:(int)count withUser:(NSString *)withUser;

- (NSString *)getMessagesEx:(NSArray<NSNumber *> *)convTypes lines:(NSArray<NSNumber *> *)lines contentTypes:(NSArray<NSNumber *> *)contentTypes fromIndex:(int)fromIndex before:(BOOL)before count:(int)count withUser:(NSString *)withUser;

- (NSString *)getUserMessages:(NSString *)userId conversation:(NSString *)strConv types:(NSArray<NSNumber *> *)types fromIndex:(int)fromIndex before:(BOOL)before count:(int)count;

- (NSString *)getUserMessagesEx:(NSString *)userId convTypes:(NSArray<NSNumber *> *)convTypes lines:(NSArray<NSNumber *> *)lines contentTypes:(NSArray<NSNumber *> *)contentTypes fromIndex:(int)fromIndex before:(BOOL)before count:(int)count;
- (void)getMessagesV2:(NSString *)strConv fromIndex:(int)fromIndex before:(BOOL)before count:(int)count withUser:(NSString *)withUser success:(JSCallback)successCB error:(JSCallback)errorCB;
- (void)getMessagesExV2:(NSArray<NSNumber *> *)convTypes lines:(NSArray<NSNumber *> *)lines contentTypes:(NSArray<NSNumber *> *)contentTypes fromIndex:(int)fromIndex before:(BOOL)before count:(int)count withUser:(NSString *)withUser success:(JSCallback)successCB error:(JSCallback)errorCB;
- (void)getMessagesEx2V2:(NSArray<NSNumber *> *)convTypes lines:(NSArray<NSNumber *> *)lines messageStatuses:(NSArray<NSNumber *> *)contentTypes fromIndex:(int)fromIndex before:(BOOL)before count:(int)count withUser:(NSString *)withUser success:(JSCallback)successCB error:(JSCallback)errorCB;
- (void)getMessagesByTimestampV2:(NSString *)strConv types:(NSArray<NSNumber *> *)types timestamp:(int64_t)timestamp before:(BOOL)before count:(int)count withUser:(NSString *)withUser success:(JSCallback)successCB error:(JSCallback)errorCB;
- (void)getUserMessagesV2:(NSString *)userId conversation:(NSString *)strConv from:(int)fromIndex before:(BOOL)before count:(int)count contentTypes:(NSArray<NSNumber *> *)contentTypes success:(JSCallback)successCB error:(JSCallback)errorCB;
- (void)getUserMessagesExV2:(NSString *)userId conversationTypes:(NSArray<NSNumber *> *)convTypes lines:(NSArray<NSNumber *> *)lines from:(int)fromIndex before:(BOOL)before count:(int)count contentTypes:(NSArray<NSNumber *> *)contentTypes success:(JSCallback)successCB error:(JSCallback)errorCB;
- (NSString *)getMessage:(int)messageId;

- (NSString *)getMessageByUid:(NSString *)strUid;

- (NSString *)searchMessage:(NSString *)strConv keyword:(NSString *)keyword withUser:(NSString *)user;

- (NSString *)searchMessageEx:(NSString *)strConv keyword:(NSString *)keyword desc:(BOOL)desc limit:(int)limit offset:(int)offset withUser:(NSString *)user;

- (NSString *)searchMessageByTypes:(NSString *)strConv keyword:(NSString *)keyword contentTypes:(NSArray<NSNumber *> *)contentTypes desc:(BOOL)desc limit:(int)limit offset:(int)offset withUser:(NSString *)user;

- (NSString *)searchMessageByTypesAndTimes:(NSString *)strConv keyword:(NSString *)keyword contentTypes:(NSArray<NSNumber *> *)contentTypes startTime:(int64_t)startTime endTime:(int64_t)endTime desc:(BOOL)desc limit:(int)limit offset:(int)offset withUser:(NSString *)user;

- (NSString *)searchMessageEx2:(NSArray<NSNumber *> *)convTypes lines:(NSArray<NSNumber *> *)lines contentTypes:(NSArray<NSNumber *> *)contentTypes keyword:(NSString *)keyword fromIndex:(int)fromIndex desc:(BOOL)desc count:(int)count withUser:(NSString *)user;

- (void)sendMessage:(NSString *)strConv messagePayload:(NSString *)strMessagePayload toUsers:(NSArray<NSString *> *)toUsers expireDuration:(int)expireDuration prepared:(JSCallback)preparedCB progress:(JSCallback)progressCB  success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)recall:(NSString *)strMessageUid success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)deleteRemoteMessage:(NSString *)strMessageUid success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)updateRemoteMessageContent:(NSString *)strMessageUid messagePayload:(NSString *)strMessagePayload distribute:(BOOL)distribute updateLocal:(BOOL)updateLocal success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)deleteMessage:(int)messageId;

- (void)watchOnlineState:(int)convType targets:(NSArray<NSString *> *)targets duration:(int)duration success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)unwatchOnlineState:(int)convType targets:(NSArray<NSString *> *)targets success:(JSCallback)successCB error:(JSCallback)errorCB;

- (BOOL)isCommercialServer;

- (BOOL)isReceiptEnabled;

- (BOOL)isGlobalDisableSyncDraft;

- (BOOL)isEnableUserOnlineState;

- (void)getAuthorizedMediaUrl:(NSString *)strMessageUid mediaType:(int)mediaType mediaPath:(NSString *)mediaPath success:(JSCallback)successCB error:(JSCallback)errorCB;

- (BOOL)isSupportBigFilesUpload;

- (void)getUploadMediaUrl:(NSString *)fileName mediaType:(int)mediaType contentType:(NSString *)contentType success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)getConversationFiles:(NSString *)strConv fromUser:(NSString *)fromUser beforeUid:(NSString *)beforeUid count:(int)count success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)getMyFiles:(NSString *)beforeUid count:(int)count success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)deleteFileRecord:(NSString *)messageUid success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)clearMessages:(NSString *)strConv;

- (void)clearRemoteConversationMessages:(NSString *)strConv success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)clearMessagesByTime:(NSString *)strConv before:(int64_t)before;

- (void)insertMessage:(NSString *)strConv sender:(NSString *)sender messagePayload:(NSString *)strPayload status:(int)status notify:(BOOL)notify toUsers:(NSArray<NSString *> *)users serverTime:(int64_t)serverTime;

- (void)updateMessage:(long)messageId messagePayload:(NSString *)strMessagePayload;

- (void)updateMessageStatus:(long)messageId status:(int)status;

- (void)uploadMedia:(NSString *)fileName data:(NSString *)data mediaType:(int)mediaType success:(JSCallback)successCB error:(JSCallback)errorCB progress:(JSCallback)progressCB;
- (void)uploadMediaFile:(NSString *)mediaFilePath mediaType:(int)mediaType success:(JSCallback)successCB error:(JSCallback)errorCB progress:(JSCallback)progressCB;
- (void)sendConferenceRequest:(long long)sessionId roomId:(NSString *)roomId request:(NSString *)request data:(NSString *)data advance:(BOOL)advance success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)searchFiles:(NSString *)keyword conversation:(NSString *)strConv fromUser:(NSString *)fromUser beforeUid:(NSString *)beforeUid count:(int)count success:(JSCallback)successCB error:(JSCallback)errorCB;

- (void)searchMyFiles:(NSString *)keyword beforeUid:(NSString *)beforeUid count:(int)count success:(JSCallback)successCB error:(JSCallback)errorCB;
@end

NS_ASSUME_NONNULL_END
