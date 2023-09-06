<template>
    <view class="search-portal-container">
        <input class="input" type="text" v-model="keyword" :placeholder="$t('common.search')" @input="search">
        <SearchResultView :query="keyword" :options="options" v-if="keyword && keyword.trim()"/>
        <view v-else class="tip-container">
            <text>请输入关键字进行搜索</text>
        </view>
    </view>
</template>


<script>
import SearchResultView from "./SearchResultView";
import store from "../../store";

export default {
    name: "SearchPortalPage",
    components: {SearchResultView},

    data() {
        return {
            keyword: '',
            type: 'all',
            options: {
                user: true,
                contact: true,
                conversation: true,
                group: true,
            }
        }
    },
    onLoad(option) {
        let queryOption = (query) => option[query] ? option[query] === 'true' : true;
        this.options.user = queryOption('user')
        this.options.group = queryOption('group')
        this.options.contact = queryOption('contact')
        this.options.conversation = queryOption('conversation')
    },
    methods: {
        search() {
            store.setSearchQuery(this.keyword, this.options)
        }
    }
}
</script>

<style scoped>

.search-portal-container {
    height: var(--page-full-height-without-header);
    overflow: auto;
    position: relative;
}

.search-portal-container input {
    padding: 5px 10px;
    height: 35px;
    box-sizing: border-box;
    border-bottom: 1px solid lightgrey;
    position: fixed;
    width: 100%;
    top: var(--uni-page-header-height);
    left: 0;
    background-color: white;
    z-index: 99;
}

.search-portal-container .tip-container {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: grey;
}

</style>
