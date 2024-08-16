//
//  WFCCFriendRequest.h
//  WFChatClient
//
//  Created by heavyrain on 2017/10/17.
//  Copyright © 2017年 WildFireChat. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WFCCJsonSerializer.h"
/**
 好友请求
 */
@interface WFCCFriendRequest : WFCCJsonSerializer

/**
 方向
 */
@property(nonatomic, assign)int direction;

/**
 ID
 */
@property(nonatomic, strong)NSString *target;

/**
 请求说明
 */
@property(nonatomic, strong)NSString *reason;

/**
 请求扩展信息
 */
@property(nonatomic, strong)NSString *extra;

/**
 接受状态
 */
@property(nonatomic, assign)int status;

/**
 已读
 */
@property(nonatomic, assign)int readStatus;

/**
 发起时间
 */
@property(nonatomic, assign)long long timestamp;

@end
