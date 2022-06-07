<template>
    <div class="test-page">
        <button @click="testWebrtc">test-webrtc</button>

    </div>
</template>

<script>
export default {
    name: "testPage",
    methods: {
        testWebrtc() {
            uni.navigateTo({
                url: './testWebrtc',
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