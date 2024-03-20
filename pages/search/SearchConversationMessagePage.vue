<template>
    <section class="search-conversation-message-container">
        <input class="input" type="text" v-model="query" :placeholder="$t('common.search')" @input="search">
        <label class="category">聊天记录</label>
        <ul>
            <li v-for="(msg, index) in messages" :key="index">
                <div class="search-result-item" @click="onClickMessage(msg)">
                    <img :src="conversationInfo.conversation._target.portrait" alt="">
                    <div class="title-desc">
                        <span>{{ msg._from._displayName }}</span>
                        <span class="desc">{{ msg.messageContent.digest(msg) }}</span>
                    </div>
                </div>
            </li>
        </ul>
    </section>
</template>

<script>
import store from "@/store";

export default {
    name: "SearchResultView",
    data() {
        return {
            query: store.state.search.query,
            conversationInfo: store.getConversationInfo(store.state.search.conversation),
            messages: [],
        }
    },

    mounted() {
        this.search();
    },

    beforeUnmount() {
        store.state.search.conversation = null;
    },

    methods: {
        search() {
            //store.setSearchQuery(this.keyword)
            if (this.query && this.query.trim()) {
                this.messages = store.searchMessage(this.conversationInfo.conversation, this.query);
            } else {
                this.messages = [];
            }
        },

        onClickMessage(msg) {
            // fixme 跳转到具体的消息处
            // TODO 跳转到具体的消息处
            store.setCurrentConversation(msg.conversation);
            this.$go2ConversationPage();
        },
    },

    directives: {},

}
</script>

<style lang="css" scoped>

.search-conversation-message-container {
    z-index: 100;
    /*background-color: #f3f3f3e5;*/
    background-color: white;
    position: relative;
    overflow: auto;
}

.search-conversation-message-container .input {
    height: 35px;
    width: 100%;
    padding: 5px 10px;
    margin-bottom: 5px;
    background-color: white;
    border-bottom: 1px solid lightgrey;
    position: fixed;
    left: 0;
    top: 0;
}

.search-conversation-message-container .category {
    display: block;
    margin-top: 40px;
    margin-left: 10px;
    color: #b2b2b2;
    /*border-bottom: 1px solid #eeeeee;*/
}

.search-conversation-message-container ul {
    list-style: none;
    background-color: white;
    overflow: auto;
}

.category-item label {
    color: #b2b2b2;
    display: block;
    padding-top: 10px;
    padding-bottom: 2px;
    margin-left: 12px;
    border-bottom: 1px solid #eeeeee;
}

.search-result-item {
    background-color: white;
    padding: 10px 12px;
    display: flex;
    align-items: center;
}

.search-result-item:active {
    background-color: #d9d9d9;
}

.search-result-item img {
    width: 34px;
    height: 34px;
    border-radius: 2px;
}

.search-result-item span {
    font-size: 14px;
    padding-left: 10px;
}

.search-result-item .title-desc {
    display: flex;
    flex-direction: column;
}

.search-result-item .title-desc .desc {
    font-size: 12px;
    color: grey;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}


</style>
