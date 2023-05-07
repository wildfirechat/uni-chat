<template>
    <view>
        <web-view ref="web" allow='camera' :src=voipWebUrl @message="webviewEventListener" @onPostMessage="webviewEventListener"></web-view>
    </view>

</template>

<script>
import avenginekitproxy from "../../wfc/av/engine/avenginekitproxy";
import {getItem} from "../util/storageHelper";

export default {
    name: "ApiTestPage",

    data() {
        return {
            voipWebview: null,
            webviewEventListener: avenginekitproxy.voipWebviewEventListener,
            voipWebUrl: '',
            webviewInternal: 0,
        }
    },

    onLoad(option) {
        console.log('onLoad voip type', option.type);
        let authToken = getItem('authToken')
        const voipBaseWebUrl = 'https://192.168.2.180:8080';
        // const voipBaseWebUrl = '/hybrid/html/voip-dist.html';
        this.voipWebUrl = `${voipBaseWebUrl}?type=${option.type}&authToken=${authToken}`;
    },

    onUnload() {
        console.log('onUnload setVoipWebview to null')
        avenginekitproxy.setVoipWebview(null);
    },

    mounted() {
        this.webviewInternal = setInterval(() => {
            let currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
            console.log('this.$scope.$getAppWebview() ', currentWebview)
            // console.log('plus.webview.currentWebview() ', plus.webview.currentWebview(), plus.webview.currentWebview().children())
            // currentWebview = plus.webview.currentWebview();
            if (!currentWebview) {
                console.error('currentWebview is null')
                return;
            }
            let voipWebview = currentWebview.children()[0]
            if (voipWebview) {
                avenginekitproxy.setVoipWebview(voipWebview);
                console.log('setWebview');
                clearInterval(this.webviewInternal);
            }
        }, 100)
    },

    methods: {}
}
</script>

<style scoped>

</style>