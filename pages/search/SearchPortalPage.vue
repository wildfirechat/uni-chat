<template>
    <view class="search-portal-container">
        <input class="input" type="text" v-model="keyword" :placeholder="$t('common.search')" @input="search">
        <view v-if="keyword && keyword.trim()">
            <SearchResultView/>
        </view>
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
            users: null,
        }
    },
    methods: {
        search() {
            store.setSearchQuery(this.keyword)
        }
    }
}
</script>

<style scoped>

.search-portal-container {
    height: 100%;
    position: relative;
}

.search-portal-container input {
    padding: 5px 10px;
    height: 35px;
    margin-bottom: 5px;
    border-bottom: 1px solid lightgrey;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background-color: white;
}

.search-portal-container .tip-container {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: grey;
}

</style>