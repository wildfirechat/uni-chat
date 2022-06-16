<template>
    <view @touchmove.stop.prevent="moveHandle('touchmove')" @click="moveHandle('click')" v-if="isActive">
        <view class="main-action-menu" :animation="animationData" :style="{ top: height + 'px' }">
            <view class="main-action-menu-top-arrow"></view>
            <view class="menu-list">
                <view class="menu-item" @click="go2CreateGroup">
                    <view class="menu-item-icon">
                        <view class="wxfont message2"></view>
                    </view>
                    <view class="text">发起群聊</view>
                </view>
                <view class="menu-item" @click="go2SearchFriend">
                    <view class="menu-item-icon">
                        <view class="wxfont add2"></view>
                    </view>
                    <view class="text">添加朋友</view>
                </view>
                <view class="menu-item" @click="go2ScanQrCode">
                    <view class="menu-item-icon">
                        <view class="wxfont qr_code"></view>
                    </view>
                    <view class="text">扫一扫</view>
                </view>
            </view>
        </view>
        <view class="main-action-menu-background-model"></view>
    </view>
</template>

<script>
import Config from "../../config";
import store from "../../store";

export default {
    data() {
        return {
            height: 0,//距离顶部高度oo
            isActive: false,
            animationData: {}
        };
    },
    props: {
        list: {
            type: Array,
            default() {
                return [{}];
            }
        }
    },
    onShow() {

    },
    mounted() {
        this.getstatusBarHeight();
        let animation = uni.createAnimation({
            duration: 300,
            timingFunction: 'linear'
        });
        this.animation = animation;
    },
    methods: {
        go2CreateGroup() {
            let sharedContactState = store.state.contact;
            let users = sharedContactState.favContactList.concat(sharedContactState.friendList);
            users = users.filter(u => {
                return u.uid !== Config.FILE_HELPER_ID
            });
            this.$pickUser({
                users:users,
                successCB: users => {
                    store.createConversation(users)
                }
            });
        },
        go2SearchFriend() {
            // TODO
            // uni.navigateTo({
            //   url: '../../wx/search-friends/index'
            // })
            uni.showToast({
                title: 'TODO 添加好友',
                icon: 'none'
            })
        },
        go2ScanQrCode() {
            // this.$fc.saoyisao()

            uni.showToast({
                title: 'TODO 扫一扫',
                icon: 'none'
            })
        },
        showAnimation() {
            this.animation.opacity(1).step();
            this.animationData = this.animation.export();
        },
        hideAnimation() {
            this.animation.opacity(0).step();
            this.animationData = this.animation.export();
        },
        moveHandle(e) {
            this.hide()
        },
        show() {
            this.isActive = true
            setTimeout(() => {
                this.showAnimation()
            }, 30)
        },
        hide() {
            this.isActive = false
            this.hideAnimation()
        },
        getstatusBarHeight() {
            let SystemInfo = uni.getSystemInfoSync();
            // #ifdef H5
            this.height = SystemInfo.safeArea.top + SystemInfo.windowTop;
            // #endif
        }
    }
};
</script>
<style scoped>
.main-action-menu {
    width: 300rpx;
    position: fixed;
    z-index: 9999;
    top: -10px;
    right: 16rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    opacity: 0;
}

.main-action-menu-background-model {
    background-color: rgba(0, 0, 0, 0);
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 9998;
}

.main-action-menu-top-arrow {
    width: 0px;
    height: 0px;
    border: 10px solid transparent;
    border-bottom-color: #4C4C4C;
    margin-left: auto;
    margin-right: 20rpx;
}

.menu-list {
    width: 100%;
    background-color: #4C4C4C;
    border-radius: 10rpx;
}

.menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0rpx 36rpx;
    padding-right: 0;
}

.menu-item-icon {
    width: 38rpx;
    height: 38rpx;
    margin-right: 28rpx;
    color: #fff;
}

.menu-item-icon .wxfont {
    font-size: 40rpx;
}

.menu-item .text {
    color: #fff;
    font-size: 32rpx;
    border-bottom: 1px #535353 solid;
    padding: 30rpx 0rpx;
    flex: 1;
}

.menu-item:nth-last-child(1) .text {
    border: none;
}
</style>
