<template>
    <div class="test-page">
        <button @click="testWebrtc">退出</button>

    </div>
</template>

<script>
import wfc from "../../wfc/client/wfc";
import {clear} from "../util/storageHelper";

export default {
    name: "testPage",
    methods: {
        testWebrtc() {
            wfc.disconnect();
            clear();
            uni.navigateTo({
                url: '../login/LoginPage',
                success: () => {
                    console.log('nav to test-webrtc success');

                },
                fail: (err) => {
                    console.log('nav to test-webrtc err', err);
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
.test-page {
    display: flex;
}

</style>