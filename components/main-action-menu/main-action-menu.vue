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
import WfcScheme from "../../wfcScheme";
import wfc from "../../wfc/client/wfc";

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
            this.$pickUsers({
                users: users,
                successCB: users => {
                    // TODO 创建群聊会比较慢，可以在这儿加一个 loading 页面
                    store.createConversation(users, (conversation) => {
                        // 不加延时的话，不能正常切换页面，会报莫名其妙的错误
                        setTimeout(() => {
                            this.$go2ConversationPage();
                        }, 50)
                    }, err => {

                    })
                }
            });
        },
        go2SearchFriend() {
            uni.navigateTo({
                url: '/pages/contact/SearchUserPage',
                fail: err => {
                }
            })
        },
        go2ScanQrCode() {
            uni.scanCode({
                success: (res) => {
                    console.log('条码类型：' + res.scanType);
                    console.log('条码内容：' + res.result);
                    if (res.result) {
                        // TODO
                        // wildfirechat://pcsession/xxxx
                        this.onScanQrCode(res.result)
                        // uni.showToast({
                        //     title: '扫码成功: ' + res.result,
                        //     icon: 'none',
                        // });
                    }
                }
            });
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
        toggle() {
            if (this.isActive) {
                this.hide();
            } else {
                this.show();
            }
        },
        show() {
            this.isActive = true
            setTimeout(() => {
                this.showAnimation()
            }, 30)
        },
        hide() {
            if (this.isActive) {
                this.isActive = false
                this.hideAnimation()
            }
        },
        getstatusBarHeight() {
            let SystemInfo = uni.getSystemInfoSync();
            // #ifdef H5
            this.height = SystemInfo.safeArea.top + SystemInfo.windowTop;
            // #endif
        },
        onScanQrCode(qrcode) {
            let prefix = qrcode.substring(0, qrcode.lastIndexOf('/') + 1)
            let value = qrcode.substring(qrcode.lastIndexOf('/') + 1)
            switch (prefix) {
                case WfcScheme.QR_CODE_PREFIX_USER:
                    wfc.getUserInfoEx(value, false, userInfo => {
                        store.setCurrentFriend(userInfo);
                        uni.navigateTo({
                            url: '/pages/contact/UserDetailPage',
                            success: () => {
                                console.log('nav to UserDetailPage success');
                            },
                            fail: (err) => {
                                console.log('nav to UserDetailPage err', err);
                            }
                        })
                    }, err => {

                    })
                    break;
                default:
                    uni.showToast({
                        title: '不支持该二维码: ' + qrcode,
                        icon: 'none',
                    });
                    break;
            }
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
