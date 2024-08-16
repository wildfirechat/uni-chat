//
//  EventListener.h
//  WFClientUniPlugin
//
//  Created by Rain on 1/8/2024.
//  Copyright © 2024 DCloud. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol EventListener <NSObject>
-(void)onEvent:(NSString *)channel object:(id)object;
@end

NS_ASSUME_NONNULL_END
