<template>
    <div class="new-friend-item-container">
        <div v-for="(friendRequest,index) in sharedContactState.friendRequestList" :key="index"
             @click="showFriendRequest(friendRequest)"
             class="new-friend-item">
            <img class="avatar" :src="friendRequest._target.portrait">
            <div class="info">
                <div class="name">
                    <span class="single-line">{{ friendRequest._target.displayName }}</span>
                    <p class="reason single-line">{{
                            friendRequest.reason ? friendRequest.reason : $t('friend_request.im') + friendRequest._target.displayName
                        }}</p>
                </div>
                <span v-if="friendRequest.status === 1" class="status">{{
                        $t('friend_request.accepted')
                    }}</span>
                <button v-else-if="friendRequest.status === 0" class="accept" size="mini"
                        @click="accept(friendRequest)">{{
                        $t('common.add')
                    }}
                </button>
                <span
                    v-else-if="friendRequest.status === 3" class="status">{{
                        $t('friend_request.denied')
                    }}</span>
            </div>
        </div>
    </div>

</template>

<script>
import store from "../../store";
import wfc from "../../wfc/client/wfc";
import EventType from "../../wfc/client/wfcEvent";

export default {
    name: "NewFriendListView",
    props: {
        newFriends: null,
    },
    data() {
        return {
            sharedContactState: store.state.contact,
            isActive: false,
        };
    },
    methods: {
        showFriendRequest(friendRequest) {
            store.setCurrentFriendRequest(friendRequest);
            uni.navigateTo({
                url: '/pages/contact/FriendRequestDetailPage',
                success: () => {
                    console.log('nav to FriendRequestDetailPage success');

                },
                fail: (err) => {
                    console.log('nav to FriendRequestDetailPage err', err);
                }
            });
        },
        accept(friendRequest) {
            wfc.handleFriendRequest(friendRequest.target, true, "", () => {
                friendRequest.status = 1;
            }, (err) => {
                uni.showToast({
                    title: '添加好友失败 ' + err,
                    icon: 'none',
                });
                console.log('accept friend request error', err)
            })
        },
        onFriendRequestUpdate() {
            if (this.isActive) {
                wfc.clearUnreadFriendRequestStatus();
            }
        },
    },

    activated() {
        this.isActive = true;
        wfc.clearUnreadFriendRequestStatus();
    },

    deactivated() {
        this.isActive = false;
    },

    mounted() {
        this.isActive = true;
        wfc.clearUnreadFriendRequestStatus();
        wfc.eventEmitter.on(EventType.FriendRequestUpdate, this.onFriendRequestUpdate);
    },

    beforeUnmount() {
        this.isActive = false;
        wfc.eventEmitter.removeListener(EventType.FriendRequestUpdate, this.onFriendRequestUpdate);
    }
}
</script>

<style lang="css" scoped>
.new-friend-item-container {
    padding-left: 10px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

.new-friend-item {
    display: flex;
    width: 100%;
    padding: 10px 10px 10px 0;
    align-items: center;
    font-size: 13px;
    position: relative;
}

.new-friend-item::after {
    content: ""; /* 使伪元素可见 */
    position: absolute;
    left: 50px; /* 偏移量 */
    right: 0;
    bottom: 0;
    border-bottom: 1px solid #f3f3f3; /* 定义边框样式 */
}

.new-friend-item:active {
    background-color: #d6d6d6;
}

.new-friend-item .info {
    margin-left: 10px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.new-friend-item .info .name {
    flex: 1;
}

.new-friend-item .info .accept {
    text-align: center;
    color: white;
    background: #4168e0;
    border: solid 1px #4168e0;
}

.new-friend-item .info .status {
    color: #b2b2b2;
}

.new-friend-item .info .reason {
    font-size: 12px;
    color: #b2b2b2;
}


</style>
