<template>
    <web-view :src="url"></web-view>
</template>

<script>
export default {
    name: "WebViewPage",
    data: {
        url: '',
    },

    onLoad(option) {
        console.log('onLoad option url', option.url);
        this.url = option.url;
    }
}
</script>

<style scoped>

</style>