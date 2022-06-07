<template>
<view class="page-body">
  <view class="page-section">
    <view class="weui-cells__title">请输入手机号</view>
    <view class="weui-cells weui-cells_after-title">
      <view class="weui-cell weui-cell_input">
        <input class="weui-input" @input="bindPhoneInput" type="number" placeholder="手机号"></input>
      </view>
    </view>
  </view>

    <view class="page-section">
    <view class="weui-cells__title">请输入验证码</view>
    <view class="weui-cells weui-cells_after-title">
      <view class="weui-cell weui-cell_input">
        <input class="weui-input" @input="bindCodeInput" type="number" placeholder="验证码"></input>
      </view>
    </view>
  </view>

<button @tap="bindLoginTap">登录</button>
<button @tap="bindAuthCodeTap">获取验证码</button>

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
    onShow(){
      let status = wfc.getConnectionStatus();
      if (status === ConnectionStatus.ConnectionStatusConnected){
          console.log('connected, switch to ConversationListView');
          uni.switchTab({
              url: '../conversationList/ConversationListView',
              success:()=>{
                  console.log('to conversation list success');
              },
              fail: e => {
                  console.log('to conversation list error', e);
              },
              complete: () => {
                  console.log('switch tab complete')
              }
          });
          return
      }
      let userId = getItem('userId');
      let token = getItem('token')
        if (token){
            wfc.connect(userId, token);
            uni.switchTab({
                url: '../conversationList/ConversationListView',
                success:()=>{
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

    },
  methods: {
    bindPhoneInput: function (e) {
      // this.setData({
      //   phone: e.detail.value
      // });
	  this.phone = e.detail.value;
    },
    bindCodeInput: function (e) {
      // this.setData({
      //   code: e.detail.value
      // });
	  this.code  = e.detail.value;
    },
    bindLoginTap: function (e) {
      console.log(this.phone); // console.log(this.data.code)

      this.login(this.phone, this.code);
    },

    login(phone, code) {
      let appServer = Config.APP_SERVER + '/login';
      let clientId = wfc.getClientId();
      uni.request({
        url: appServer,
        data: {
          mobile: phone,
          code: code,
          clientId: clientId,
		  platform:2,
        },
        header: {
          'content-type': 'application/json' // 默认值

        },
        method: 'POST',

        success(res) {
          console.log(res.data);

          if (res.statusCode === 200) {
            let loginResult = res.data;

            if (loginResult.code === 0) {
              let userId = loginResult.result.userId;
              let token = loginResult.result.token;
              wfc.connect(userId, token);
              setItem('userId', userId);
              setItem('token', token)

              uni.switchTab({
                url: '../conversationList/ConversationListView',
				success:()=>{
					console.log('to conversation list success');
				},
                fail: e => {
					console.log('to conversation list error', e);
                },
				complete: () => {
					console.log('switch tab complete')
				}
              });
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
    }

  }
};
</script>
<style>
@import "./login.css";
</style>
