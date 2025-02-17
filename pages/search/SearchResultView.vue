<template>
    <section class="search-result-container">
        <div v-if="!showEmptyView" class="search-result">
            <ul style="display: block">
                <li class="search-result-category-container" v-if="options.user && sharedSearchState.userSearchResult.length > 0">
                    <label>{{ $t('search.new_user') }}</label>
                    <ul>
                        <li v-for="(user, index) in toShowUserList" :key="index">
                            <div class="search-result-item contact">
                                <img :src="user.portrait">
                                <span>{{ user.displayName }}</span>
                                <button v-if="!isFriend(user)" style="margin-right: 0; margin-left: auto; border: none" size="mini" @click.stop="addFriend(user)">{{ $t('common.add') }}</button>
                            </div>
                        </li>
                    </ul>
                    <div v-if="!shouldShowAllUser && this.sharedSearchState.userSearchResult.length > 5"
                         class="show-all"
                         @click.stop="showAllUser">
                        {{ $t('search.view_all') + this.sharedSearchState.userSearchResult.length }}
                    </div>
                </li>
                <li class="search-result-category-container" v-if="options.contact && sharedSearchState.contactSearchResult.length > 0">
                    <label>{{ $t('common.contact') }}</label>
                    <ul>
                        <li v-for="(contact, index) in toShowContactList" :key="index">
                            <div class="search-result-item" @click.stop="chatToContact(contact)">
                                <img :src="contact.portrait">
                                <span>{{ contact._displayName }}</span>
                            </div>
                        </li>
                    </ul>
                    <div v-if="!shouldShowAllContact && this.sharedSearchState.contactSearchResult.length > 5"
                         class="show-all"
                         @click.stop="showAllContact">
                        {{ $t('search.view_all') + this.sharedSearchState.contactSearchResult.length }}
                    </div>
                </li>
                <li class="search-result-category-container" v-if="options.group && sharedSearchState.groupSearchResult.length > 0">
                    <label>{{ $t('contact.group') }}</label>
                    <ul>
                        <li v-for="(group, index) in toShowGroupList" :key="index">
                            <div class="search-result-item" @click="chatToGroup(group)">
                                <img :src="group.portrait" alt="">
                                <span>{{ group.remark ? group.remark : group.name }}</span>
                            </div>
                        </li>
                    </ul>
                    <div v-if="!shouldShowAllGroup && this.sharedSearchState.groupSearchResult.length > 5"
                         class="show-all"
                         @click.stop="showAllGroup">
                        {{ $t('search.view_all') + this.sharedSearchState.groupSearchResult.length }}
                    </div>
                </li>
                <li class="search-result-category-container" v-if="options.conversation && sharedSearchState.conversationSearchResult.length > 0">
                    <label>聊天记录</label>
                    <ul>
                        <li v-for="(convR, index) in toShowConversationList" :key="index">
                            <div class="search-result-item conversation" @click="onClickConversationSearchResultItem(convR)">
                                <img :src="convR._conversationInfo.conversation._target.portrait" alt="">
                                <div class="title-desc">
                                    <span>{{ convR._conversationInfo.conversation._target._displayName }}</span>
                                    <span class="desc">{{ conversationMatchDesc(convR) }}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-if="!shouldShowAllConversation&& this.sharedSearchState.conversationSearchResult.length > 5"
                         class="show-all"
                         @click.stop="showAllConversation">
                        {{ $t('search.view_all') + this.sharedSearchState.conversationSearchResult.length }}
                    </div>
                </li>
            </ul>
        </div>
        <div v-else class="empty-container">
            <text>没有搜索结果</text>
        </div>
    </section>
</template>

<script>
import store from "@/store";
import Conversation from "@/wfc/model/conversation";
import ConversationType from "@/wfc/model/conversationType";
import wfc from "../../wfc/client/wfc";

export default {
    name: "SearchResultView",
    props: {
        query: {
            required: false,
            type: String,
            default: '',
        },
        options: {
            required: false,
            type: Object,
            default: () => {
                return {
                    user: true,
                    contact: true,
                    conversation: true,
                    group: true,
                }
            }
        }
    },
    data() {
        return {
            sharedSearchState: store.state.search,
            sharedMiscState: store.state.misc,
            shouldShowAllUser: false,
            shouldShowAllContact: false,
            shouldShowAllGroup: false,
            shouldShowAllConversation: false,
        }
    },

    mounted() {
        // do nothing
        let enableCount = 0;
        for (const key in this.options) {
            if (this.options[key]) {
                enableCount++;
            }
        }
        if (enableCount === 1) {
            this.shouldShowAllUser = this.options.user;
            this.shouldShowAllContact = this.options.contact;
            this.shouldShowAllGroup = this.options.group;
            this.shouldShowAllConversation = this.options.conversation;
        }
    },

    beforeUnmount() {
        store.setSearchQuery('')
    },

    watch: {
        // "query":function (val, oldVal){
        //   console.log('searchView query changed:', val, oldVal)
        // }
        // or
        query() {
            console.log('searchView query changed:', this.query, this.options)
            // store.setSearchQuery(this.query, this.options)
        },
    },

    methods: {
        isFriend(user){
          return user.uid === wfc.getUserId() || wfc.isMyFriend(user.uid)
        },
        addFriend(user) {
            console.log('add friend', user);
            wfc.sendFriendRequest(user.uid, '你好', '', () => {
                uni.showToast({
                    title: '发送好友请求成功',
                    icon: 'none',
                });
            }, err => {
                console.log('sendFriendRequest fail', err)
                uni.showToast({
                    title: ' 发送好友请求失败',
                    icon: 'none',
                });
            })
            // this.$modal.show(
            //     FriendRequestView,
            //     {
            //         userInfo: user,
            //     },
            //     {
            //         name: 'friend-request-modal',
            //         width: 600,
            //         height: 250,
            //         clickToClose: false,
            //     }, {})
        },
        showAllUser() {
            this.shouldShowAllUser = true;
        },
        showAllContact() {
            this.shouldShowAllContact = true;
        },

        showAllGroup() {
            this.shouldShowAllGroup = true;
        },

        showAllConversation() {
            this.shouldShowAllConversation = true;
        },

        chatToContact(contact) {
            let conversation = new Conversation(ConversationType.Single, contact.uid, 0);
            store.setCurrentConversation(conversation);
            this.$go2ConversationPage();
        },

        chatToGroup(group) {
            let conversation = new Conversation(ConversationType.Group, group.target, 0);
            store.setCurrentConversation(conversation);
            this.$go2ConversationPage();
        },

        onClickConversationSearchResultItem(result) {
            if (result.matchMessage) {
                store.setCurrentConversation(result.conversation);
                this.$go2ConversationPage();
            } else {
                store.state.search.conversation = result.conversation;
                uni.navigateTo({
                        url: '/pages/search/SearchConversationMessagePage'
                    }
                );
            }
        },

        showMessageHistoryPage() {
            let hash = window.location.hash;
            let url = window.location.origin;
            if (hash) {
                url = window.location.href.replace(hash, '#/message-history');
            } else {
                url += "/message-history"
            }
            ipcRenderer.send(IPCRendererEventType.showMessageHistoryPage, {
                url: url,
            });
            console.log(IPCRendererEventType.showMessageHistoryPage, url)
        },

        conversationMatchDesc(convSearchResult) {
            // #ifdef APP-PLUS
            if (convSearchResult.matchMessage) {
                return convSearchResult.matchMessage.messageContent.digest(convSearchResult.matchMessage);
            } else {
                return convSearchResult.matchCount + '条相关聊天记录';
            }
            // #endif
            // #ifdef H5
            return '';
            // #endif
        },
    },

    computed: {
        toShowUserList: function () {
            return !this.shouldShowAllUser && this.sharedSearchState.userSearchResult.length > 5 ? this.sharedSearchState.userSearchResult.slice(0, 4) : this.sharedSearchState.userSearchResult;
        },
        toShowContactList: function () {
            return !this.shouldShowAllContact && this.sharedSearchState.contactSearchResult.length > 5 ? this.sharedSearchState.contactSearchResult.slice(0, 4) : this.sharedSearchState.contactSearchResult;
        },
        toShowGroupList: function () {
            return !this.shouldShowAllGroup && this.sharedSearchState.groupSearchResult.length > 5 ? this.sharedSearchState.groupSearchResult.slice(0, 4) : this.sharedSearchState.groupSearchResult;
        },
        toShowConversationList: function () {
            return !this.shouldShowAllConversation && this.sharedSearchState.conversationSearchResult.length > 5 ? this.sharedSearchState.conversationSearchResult.slice(0, 4) : this.sharedSearchState.conversationSearchResult;
        },

        showEmptyView() {
            const {userSearchResult, contactSearchResult, groupSearchResult, conversationSearchResult} = this.sharedSearchState;
            return userSearchResult.length + contactSearchResult.length + groupSearchResult.length + conversationSearchResult.length === 0;
        }
    },

    directives: {},

}
</script>

<style lang="css" scoped>

.search-result-container {
    margin-top: 35px;
    height: calc(100% - 35px);
    /*background-color: red;*/
    background-color: #f3f3f3e5;
}

.search-result-container .empty-container {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: grey;
}

.search-result-container ul {
    list-style: none;
    background-color: white;
}

.search-result-category-container {
    /*position: sticky;*/
    /*min-height: 40px;*/
    /*!* #ifndef APP-PLUS-NVUE *!*/
    /*position: -webkit-sticky;*/
    /*!* #endif *!*/
    /*top: 0;*/
    /*left: 0;*/
}


.search-result-category-container label {
    color: #828282;
    background: #EDEDED;
    display: block;
    padding-top: 10px;
    padding-bottom: 2px;
    padding-left: 12px;
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

.search-result-item.conversation .title-desc {
    display: flex;
    flex-direction: column;
}

.search-result-item.conversation .title-desc .desc {
    font-size: 12px;
    color: grey;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.search-result-item.contact button {
    margin-left: auto;
    padding: 3px 10px;
    border-radius: 3px;
    border: 1px solid #cccccc;
    outline: none;
}

.search-result-item.contact button:active {
    background: #cccccc;
}

.search-result-item.message {
    height: 54px;
    display: flex;
    align-items: center;
}

.show-all {
    padding-left: 12px;
    color: #66789d;
    font-size: 12px;
}

</style>
