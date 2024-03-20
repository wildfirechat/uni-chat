<template>
    <view class="page-body">
        <view class="login-type-title">验证码登录</view>
        <view class="mobile-container">
            <view>请输入手机号</view>
            <view>
                <view class="mobile-input-container">
                    <input class="input" @input="bindPhoneInput" type="number" placeholder="手机号"/>
                </view>
            </view>
        </view>

        <view class="auth-code-container">
            <view>请输入验证码</view>
            <view class="auth-code-input-container">
                <input @input="bindCodeInput" type="number" placeholder="验证码"/>
                <button size="mini" :disabled="phone.length !== 11" @tap="bindAuthCodeTap">获取验证码</button>
            </view>
        </view>

        <button :disabled="!(phone && code)" class="confirm-button" @tap="bindLoginTap">登录</button>

    </view>
</template>

<script>
import wfc from "../../wfc/client/wfc";
import Config from '../../config';
import {getItem, setItem} from "../util/storageHelper";
import ConnectionStatus from "../../wfc/client/connectionStatus";
import appServerApi from "../../api/appServerApi";

export default {
    name: 'LoginPage',
    data() {
        return {
            focus: false,
            phone: '',
            code: ''
        };
    },

    components: {},
    props: {},

    onShow() {
        console.log('login onShow');
        if ((Config.APP_SERVER.indexOf('wildfirechat') >= 0 && Config.IM_SERVER_HOST.indexOf('wildfirechat') === -1)
            || (Config.APP_SERVER.indexOf('wildfirechat') === -1 && Config.IM_SERVER_HOST.indexOf('wildfirechat') >= 0)) {
            console.error('!!!! 严重错误!!!! Config.APP_SERVER 和 Config.IM_SERVER_HOST要一起修改，不能一个用官方服务，一个用自己部署的服务');
        } else if (Config.IM_SERVER_HOST.indexOf(':') >= 0) {
            console.error('!!!! 严重错误!!!! Config.IM_SERVER_HOST 不能包含端口，只需要 HOST 即可');
        } else if (Config.IM_SERVER_HOST.indexOf('http') >= 0) {
            console.error('!!!! 严重错误!!!! Config.IM_SERVER_HOST 不能包含http，只需要 HOST 即可');
        }
    },
    methods: {
        bindPhoneInput: function (e) {
            this.phone = e.detail.value;
        },
        bindCodeInput: function (e) {
            this.code = e.detail.value;
        },
        bindLoginTap: function (e) {
            console.log(this.phone); // console.log(this.data.code)
            this.login(this.phone, this.code);
        },

        login(phone, code) {
            console.log('login', wfc.getClientId(), Config.getWFCPlatform());
            appServerApi.loginWithAuthCode(phone, code)
                .then(result => {
                    console.log('login result', result);
                    let userId = result.userId;
                    let token = result.token;
                    wfc.connect(userId, token);
                    setItem('userId', userId);
                    setItem('token', token)

                    this.go2ConversationList();
                })
                .catch(r => {
                    console.log('login failed', r)
                    uni.showToast({
                        title: r,
                        icon: 'none',
                    });
                });
        },

        bindAuthCodeTap: function (e) {
            console.log(this.phone);
            this.authCode(this.phone);
        },

        authCode(phone) {
            appServerApi.requestAuthCode(phone)
                .then(result => {
                    uni.showToast({
                        title: '发送验证码成功',
                        icon: 'none',
                    });
                })
                .catch(reason => {
                    uni.showToast({
                        title: reason,
                        icon: 'none',
                    });
                })
        },

        go2ConversationList() {
            uni.switchTab({
                url: '/pages/conversationList/ConversationListPage',
                success: () => {
                    console.log('to conversation list success');
                },
                fail: e => {
                    console.log('to conversation list error', e);
                },
                complete: () => {
                    console.log('switch tab complete')
                }
            });
        }
    }
};
</script>
<style>
.page-body {
    padding: 20rpx;
    height: 100vh;
}

.login-type-title {
    margin-top: 120rpx;
    font-size: 24px;
    margin-bottom: 50rpx;
}

.mobile-container {
    margin-top: 20rpx;
}

.mobile-input-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 40px;
}

.mobile-input-container input {
    font-size: 14px;
    border-bottom: 1px solid #e0e0e0;
}

.mobile-input-container .uni-input-input:focus {
    border-bottom: 1px solid #3f64e4;
}

.auth-code-container {
    margin-top: 30rpx;
}

.auth-code-input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;
}

.auth-code-input-container input {
    flex: 1;
    margin-right: 5px;
    font-size: 14px;
    border-bottom: 1px solid #e0e0e0;
}

.auth-code-input-container .uni-input-input:focus {
    border-bottom: 1px solid #3f64e4;
}

.confirm-button {
    margin-top: 40px;
}

</style>
