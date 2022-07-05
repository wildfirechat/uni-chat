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

    beforeDestroy() {
        store.state.search.conversation = null;
    },

    methods: {
        search() {
            //store.setSearchQuery(this.keyword)
            console.log('owoooo')
            if (this.query && this.query.trim()) {
                this.messages = store.searchMessage(this.conversationInfo.conversation, this.query);
                console.log('xxxx ', this.messages.length, this.conversationInfo.conversation, this.query)
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
    display: block;
    z-index: 100;
    overflow: auto;
    /*background-color: red;*/
    background-color: #f3f3f3e5;
}

.search-conversation-message-container .input {
    padding: 0 10px;
    margin: 5px 0;
    height: 35px;
    background-color: white;
    border-bottom: 1px solid lightgrey;
}

.search-conversation-message-container .category {
    padding: 0 10px;
}

.search-conversation-message-container ul {
    list-style: none;
    background-color: white;
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
}


</style>
