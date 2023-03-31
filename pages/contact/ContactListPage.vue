<template>
    <div class="contact-list">
        <uni-list>
            <view>

                <div>
                    <div @click="showNewFriends" class="category-item-container">
                        <i class="arrow right" v-bind:class="{down: sharedContactState.expandFriendRequestList}"></i>
                        <div class="category-item">
                            <span class="title">{{ $t('contact.new_friend') }}</span>
                            <span class="desc" style="color: red" v-if="sharedContactState.unreadFriendRequestCount > 0">{{ sharedContactState.unreadFriendRequestCount }}</span>
                        </div>
                    </div>
                    <FriendRequestListView v-if="sharedContactState.expandFriendRequestList"/>
                </div>
                <div>
                    <div @click="showGroups" class="category-item-container">
                        <i class="arrow right" v-bind:class="{down: sharedContactState.expandGroup}"></i>
                        <div class="category-item">
                            <span class="title">{{ $t('contact.group') }}</span>
                            <span class="desc">{{ sharedContactState.favGroupList.length }}</span>
                        </div>
                    </div>
                    <GroupListVue v-if="sharedContactState.expandGroup"/>
                    <div>
                        <div @click="showContacts" class="category-item-container">
                            <i class="arrow right" v-bind:class="{down: sharedContactState.expandFriendList}"></i>
                            <div class="category-item">
                                <span class="title">{{ $t('contact.contact') }}</span>
                                <span class="desc">{{ sharedContactState.friendList.length }}</span>
                            </div>
                        </div>
                        <UserListView :enable-pick="false"
                                     :users="sharedContactState.favContactList.concat(sharedContactState.friendList)"
                                     :click-user-item-func="setCurrentUser"
                                     :padding-left="'30px'"
                                     v-if="sharedContactState.expandFriendList"/>
                    </div>
                </div>
            </view>
        </uni-list>
        <main-action-menu ref="mainActionMenu"></main-action-menu>
    </div>
</template>
<script>
import FriendRequestListView from "./FriendRequestListView";
import GroupListVue from "./GroupListView";
import store from "../../store";
import UserListView from "../user/UserListView.vue";
import UniList from "../../components/uni-list/uni-list.vue";

export default {
    name: "ContactListPage",
    components: {UniList, UserListView, GroupListVue, FriendRequestListView},
    data() {
        return {
            sharedContactState: store.state.contact,
        }
    },

    onNavigationBarButtonTap(e) {
        console.log('onNavigationBarButtonTap')
        switch (e.index) {
            case 0:
                this.$refs.mainActionMenu.show();
                break;
            case 1:
                uni.navigateTo({
                    url: '/pages/search/SearchPortalPage'
                });
                break;
            default:
                break;
        }
    },
    methods: {
        setCurrentUser(userInfo) {
            store.setCurrentFriend(userInfo)
            uni.navigateTo({
                url: './UserDetailPage',
                success: () => {
                    console.log('nav to UserDetailPage success');

                },
                fail: (err) => {
                    console.log('nav to UserDetailPage err', err);
                }
            });
        },
        showNewFriends() {
            store.toggleFriendRequestList();
        },
        showGroups() {
            store.toggleGroupList();
        },
        showContacts() {
            store.toggleFriendList();
        },

    }
}
</script>

<style lang="css" scoped>

.contact-list {
    height: 100%;
}

.category-item-container {
    height: 40px;
    display: flex;
    align-items: center;
    z-index: 1000;
    padding-left: 15px;
    color: #262626;
    font-size: 14px;
    /* #ifndef APP-PLUS-NVUE */
    position: -webkit-sticky;
    /* #endif */
    position: sticky;
    background-color: #fafafa;
    top: var(--window-top);
}

.category-item {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.category-item span:last-of-type {
    margin-right: 15px;
}

.arrow {
    border: solid #b9b9b9;
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 3px;
    margin-right: 10px;
}

.right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}

.left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
}

.up {
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
}

.down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}

</style>
