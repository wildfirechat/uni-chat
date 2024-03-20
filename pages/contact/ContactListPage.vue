<template>
    <div class="contact-list">
        <uni-list>
            <view>
                <div @click="showNewFriends" class="category-item-container">
                    <image src="/static/image/icon/ic_new_friend.png"/>
                    <div class="category-item">
                        <span class="title">{{ $t('contact.new_friend') }}</span>
                        <span class="desc" style="color: red" v-if="sharedContactState.unreadFriendRequestCount > 0">{{ sharedContactState.unreadFriendRequestCount }}</span>
                    </div>
                </div>
                <div @click="showGroups" class="category-item-container">
                    <image src="/static/image/icon/ic_group_chat.png"/>
                    <div class="category-item">
                        <span class="title">{{ $t('contact.group') }}</span>
                        <span class="desc">{{ sharedContactState.favGroupList.length }}</span>
                    </div>
                </div>
                <div @click="showChannels" class="category-item-container">
                    <image src="/static/image/icon/ic_channel_1.png"/>
                    <div class="category-item">
                        <span class="title">{{ $t('contact.channel') }}</span>
                        <span class="desc">{{ sharedContactState.channelList.length }}</span>
                    </div>
                </div>
                <OrganizationListView/>
                <UserListView :enable-pick="false"
                              :users="sharedContactState.favContactList.concat(sharedContactState.friendList)"
                              :click-user-item-func="setCurrentUser"
                              :padding-left="'10px'"
                              v-if="sharedContactState.expandFriendList"/>
            </view>
        </uni-list>
        <main-action-menu ref="mainActionMenu"></main-action-menu>
    </div>
</template>
<script>
import store from "../../store";
import UserListView from "../user/UserListView.vue";
import UniList from "../../components/uni-list/uni-list.vue";
import OrganizationListView from "./OrganizationListView.vue";

export default {
    name: "ContactListPage",
    components: {OrganizationListView, UniList, UserListView},
    data() {
        return {
            sharedContactState: store.state.contact,
        }
    },

    onHide() {
        console.log('contactList onHide');
        this.$refs.mainActionMenu.hide();
    },

    onNavigationBarButtonTap(e) {
        console.log('onNavigationBarButtonTap')
        switch (e.index) {
            case 0:
                this.$refs.mainActionMenu.toggle();
                break;
            case 1:
                this.$refs.mainActionMenu.hide();
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
            uni.navigateTo({
                url: './NewFriendListPage',
                success: () => {
                    console.log('nav to NewFriendListPage success');

                },
                fail: (err) => {
                    console.log('nav to NewFriendListPage err', err);
                }
            });
        },
        showGroups() {
            uni.navigateTo({
                url: './GroupListPage',
                success: () => {
                    console.log('nav to GroupListPage success');

                },
                fail: (err) => {
                    console.log('nav to GroupListPage err', err);
                }
            });
        },
        showChannels() {
            uni.navigateTo({
                url: './ChannelListPage',
                success: () => {
                    console.log('nav to ChannelListPage success');

                },
                fail: (err) => {
                    console.log('nav to ChannelListPage err', err);
                }
            });
        },
        showContacts() {
            store.toggleFriendList();
        },

    }
}
</script>

<style lang="css" scoped>

.contact-list {
    height: var(--page-full-height-without-header-and-tabbar);
    overflow: auto;
}

.category-item-container {
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 1000;
    padding-left: 10px;
    color: #262626;
    font-size: 14px;
    position: sticky;
    background-color: #fafafa;
}

.category-item-container image {
    max-width: 40px;
    max-height: 40px;
    margin-right: 10px;
}

.category-item {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.category-item span:last-of-type {
    margin-right: 15px;
}

</style>
