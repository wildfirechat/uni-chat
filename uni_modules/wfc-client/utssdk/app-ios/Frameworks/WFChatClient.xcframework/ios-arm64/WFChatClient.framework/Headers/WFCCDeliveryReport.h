//
//  WFCCConversation.h
//  WFChatClient
//
//  Created by heavyrain on 2017/8/16.
//  Copyright © 2017年 WildFireChat. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WFCCJsonSerializer.h"
/**
 会话
 */
@interface WFCCDeliveryReport : WFCCJsonSerializer

+(instancetype)delivered:(NSString *)userId
               timestamp:(long long)timestamp;

@property (nonatomic, strong)NSString *userId;
@property (nonatomic, assign)long long timestamp;

@end
