<template>
    <view class="search-user-container">
        <input class="input" type="text" v-model="keyword" :placeholder="$t('common.search')" @input="searchUser">
        <view v-if="users && users.length">
            <text class="category">搜索结果</text>
            <UserListView
                class="result"
                :enable-pick="false"
                :users="users"
                :show-category-label="false"
                :padding-left="'10px'"/>
        </view>
        <text v-if="keyword && !users.length" class="tip">没有搜索到用户</text>
    </view>
</template>

<script>
import UserListView from "../user/UserListView.vue";
import wfc from "../../wfc/client/wfc";
import SearchType from "../../wfc/model/searchType";

export default {
    name: "SearchUserPage",
    components: {UserListView},
    data() {
        return {
            keyword: '',
            users: null,
        }
    },
    methods: {
        searchUser() {
            if (!this.keyword.trim()) {
                this.users = null;
                return;
            }
            console.log('search user', this.keyword);
            wfc.searchUser(this.keyword, SearchType.General, 0, (keyword, users) => {
                console.log('searchUser success', keyword, users)
                this.users = users;
            }, err => {
                console.log(' searchUser err', err)
            });
        }
    }
}
</script>

<style lang="css" scoped>
.search-user-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.input {
    height: 40px;
    padding: 0 10px;
    width: 100%;
    border-bottom: 1px solid lightgrey;
}

.category{
    padding: 5px 10px;
}

.result {
    min-height: 0;
    flex: 1 1 auto;
    overflow-y: auto;
}

.tip {
    padding-top: 40px;
    text-align: center;
}

</style>