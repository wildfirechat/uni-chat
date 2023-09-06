<template>
    
    <view class="friend-request-list">
        <uni-list>
            <FriendRequestListView/>
        </uni-list>
    </view>
</template>
<script>
import FriendRequestListView from "./FriendRequestListView";
import store from "../../store";
import UniList from "../../components/uni-list/uni-list.vue";
import wfc from "../../wfc/client/wfc";

export default {
    name: "ContactListPage",
    components: {UniList, FriendRequestListView},
    data() {
        return {
            sharedContactState: store.state.contact,
        }
    },


    onNavigationBarButtonTap(e) {
        console.log('onNavigationBarButtonTap')
        switch (e.index) {
            case 0:
                // TODO 现在还不支持 clearFriendRequest api
                // wfc.clearFriendRequest(true)
                // wfc.clearFriendRequest(false)
                uni.showToast({
                    title: 'TODO',
                    icon: 'none'
                });
                break;
            case 1:
                uni.navigateTo({
                    url: '/pages/search/SearchPortalPage?user=true&contact=false&group=false&conversation=false'
                });
                break;
            default:
                break;
        }
    },
    methods: {}
}
</script>

<style lang="css" scoped>
.friend-request-list {
    height: var(--page-full-height-without-header);
    overflow: auto;
}

</style>
