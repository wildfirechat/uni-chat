<template>
    <web-view :src="url"></web-view>
</template>

<script>
export default {
    name: "WebViewPage",
    data() {
        return {
            url: '',
        }
    },

    onLoad(option) {
        console.log('onLoad option url', decodeURIComponent(option.url));
        this.url = decodeURIComponent(option.url);
    }
}
</script>

<style scoped>

</style>