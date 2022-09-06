<template>
    <view class="page-body">
        <view class="page-section">
            <view>请输入手机号</view>
            <view>
                <view>
                    <input class="weui-input" @input="bindPhoneInput" type="number" placeholder="手机号"></input>
                </view>
            </view>
        </view>

        <view class="page-section">
            <view>请输入验证码</view>
            <view class="auth-code-container">
                <input @input="bindCodeInput" type="number" placeholder="验证码"></input>
                <button :disabled="phone.length !== 11" @tap="bindAuthCodeTap">获取验证码</button>
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

export default {
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
            let appServer = Config.APP_SERVER + '/login';
            let clientId = wfc.getClientId();
            console.log('login', wfc.getClientId(), Config.getWFCPlatform());
            uni.request({
                url: appServer,
                data: {
                    mobile: phone,
                    code: code,
                    clientId: clientId,
                    platform: Config.getWFCPlatform(),
                },
                header: {
                    'content-type': 'application/json' // 默认值

                },
                method: 'POST',

                success: (res) => {
                    console.log(res.data);

                    if (res.statusCode === 200) {
                        let loginResult = res.data;

                        if (loginResult.code === 0) {
                            let userId = loginResult.result.userId;
                            let token = loginResult.result.token;
                            wfc.connect(userId, token);
                            setItem('userId', userId);
                            setItem('token', token)

                            this.go2ConversationList();

                        } else {
                            console.log('login failed', loginResult);
                        }
                    }
                }

            });
        },

        bindAuthCodeTap: function (e) {
            console.log(this.phone);
            this.authCode(this.phone);
        },

        authCode(phone) {
            let appServer = Config.APP_SERVER + '/send_code';
            uni.request({
                url: appServer,
                data: {
                    mobile: phone
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                method: 'POST',
                success(res) {
                    console.log(res.data);

                    if (res.statusCode === 200) {
                        console.log('发送验证码成功');
                    }
                }
            });
        },

        go2ConversationList() {
            uni.switchTab({
                url: '/pages/conversationList/ConversationListView',
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
}

.page-section {
    margin-top: 20rpx;
}

.auth-code-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    /*background-color: green;*/
}

.auth-code-container input {
    flex: 1;
    padding-right: 5px;
}

.auth-code-container button {
    /*background-color: red;*/
    font-size: 14px;
}

.confirm-button{
    margin-top: 20px;
}

/*.other-button-hover {*/
/*    background-color: #7497f1;*/
/*}*/

/*.button-hover {*/
/*    background-color: #4168e0;*/
/*}*/
</style>
