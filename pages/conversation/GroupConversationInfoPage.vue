<template>
    <div class="conversation-info" v-if="conversationInfo">
        <header>
            <label>
                {{ $t('conversation.group_name') }}
                <input type="text"
                       ref="groupNameInput"
                       :disabled="!enableEditGroupNameOrAnnouncement"
                       v-model="newGroupName"
                       @confirm="updateGroupName"
                       :placeholder="conversationInfo.conversation._target._displayName">
            </label>
            <label>
                {{ $t('conversation.group_announcement') }}
                <input type="text"
                       ref="groupAnnouncementInput"
                       :disabled="!enableEditGroupNameOrAnnouncement"
                       @confirm='updateGroupAnnouncement'
                       v-model="newGroupAnnouncement"
                       :placeholder="groupAnnouncement">
            </label>
            <label class="switch">
                保存到通讯录
                <checkbox-group @change="setFavGroup(conversationInfo.conversation.target, $event.target.value.length === 1)">
                    <checkbox
                        value="fav"
                        :checked="conversationInfo.conversation._target._isFav"
                    />
                </checkbox-group>
                <span class="slider"></span>
            </label>
        </header>
        <div class="search-item">
            <input type="text" v-model="filterQuery" :placeholder="$t('common.search')">
            <i class="icon-ion-ios-search"></i>
        </div>
        <div class="member-container">
            <div v-if="enableAddGroupMember && !filterQuery" @click="showCreateConversationModal" class="action-item">
                <div class="icon">+</div>
                <p>{{ $t('conversation.add_member') }}</p>
            </div>
            <div v-if="enableRemoveGroupMember && !filterQuery" @click="showRemoveGroupMemberModal" class="action-item">
                <div class="icon">-</div>
                <p>{{ $t('conversation.remove_member') }}</p>
            </div>
            <UserListView :users="users"
                          :show-category-label="false"
                          :padding-left="'20px'"
            />
        </div>
        <div @click="quitGroup(false)" class="quit-group-item">
            {{ $t('conversation.quit_group') }}
        </div>
        <div v-if="isOwner" @click="quitGroup(true)" class="quit-group-item">
            解散群组
        </div>
    </div>
</template>

<script>
import UserListView from "@/pages/user/UserListView";
import store from "@/store";
import wfc from "@/wfc/client/wfc";
import GroupMemberType from "@/wfc/model/groupMemberType";
import GroupType from "@/wfc/model/groupType";
import ModifyGroupInfoType from "@/wfc/model/modifyGroupInfoType";
import Config from "../../config";
import EventType from "../../wfc/client/wfcEvent";
import appServerApi from "../../api/appServerApi";

export default {
    name: "GroupConversationInfoPage",
    data() {
        return {
            conversationInfo: null,
            groupMemberUserInfos: null,
            filterQuery: '',
            sharedContactState: store.state.contact,
            groupAnnouncement: '',
            newGroupName: '',
            newGroupAnnouncement: '',
        }
    },
    onLoad(option) {
        console.log('GroupConversationInfoPage onLoad')
        // #ifdef APP-NVUE
        const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
        // #endif
        // #ifndef APP-NVUE
        const eventChannel = this.getOpenerEventChannel();
        // #endif
        eventChannel.on('conversationInfo', (options) => {
            this.conversationInfo = options.conversationInfo;
            this.groupMemberUserInfos = store.getConversationMemberUsrInfos(this.conversationInfo.conversation);

            uni.setNavigationBarTitle({
                title: this.conversationInfo.conversation._target._displayName,
            });

            this.getGroupAnnouncement();
        })
    },

    mounted() {
        wfc.eventEmitter.on(EventType.UserInfosUpdate, this.onConversationMembersUpdate)
        wfc.eventEmitter.on(EventType.GroupMembersUpdate, this.onConversationMembersUpdate)
    },

    beforeUnmount() {
        wfc.eventEmitter.removeListener(EventType.UserInfosUpdate, this.onConversationMembersUpdate)
        wfc.eventEmitter.removeListener(EventType.GroupMembersUpdate, this.onConversationMembersUpdate)
    },

    methods: {
        onConversationMembersUpdate() {
            this.groupMemberUserInfos = store.getConversationMemberUsrInfos(this.conversationInfo.conversation);
        },

        showCreateConversationModal() {
            let beforeClose = (users) => {
                let ids = users.map(u => u.uid);
                wfc.addGroupMembers(this.conversationInfo.conversation.target, ids, null, [0], null, () => {
                    this.groupMemberUserInfos = store.getConversationMemberUsrInfos(this.conversationInfo.conversation);
                }, err => {
                    uni.showToast({
                        title: '邀请新成员失败 ' + err,
                    });
                })
            };
            let groupMemberUserInfos = store.getGroupMemberUserInfos(this.conversationInfo.conversation.target, false);
            this.$pickUsers(
                {
                    users: this.sharedContactState.favContactList.concat(this.sharedContactState.friendList),
                    initialCheckedUsers: groupMemberUserInfos,
                    uncheckableUsers: groupMemberUserInfos,
                    confirmTitle: this.$t('common.add'),
                    successCB: beforeClose,
                })
        },

        showRemoveGroupMemberModal() {
            let beforeClose = (users) => {
                let ids = users.map(u => u.uid);
                wfc.kickoffGroupMembers(this.conversationInfo.conversation.target, ids, [0], null, () => {
                    this.groupMemberUserInfos = store.getConversationMemberUsrInfos(this.conversationInfo.conversation);
                }, err => {
                    uni.showToast({
                        title: '踢除群成员失败' + err,
                    });
                })
            }
            let groupMemberUserInfos = store.getGroupMemberUserInfos(this.conversationInfo.conversation.target, false, false);
            this.$pickUsers(
                {
                    users: groupMemberUserInfos,
                    confirmTitle: this.$t('common.remove'),
                    showCategoryLabel: false,
                    successCB: beforeClose,
                })

        },

        showUserInfo(user) {
            console.log('todo show userInfo', user);
        },

        async getGroupAnnouncement() {
            let url = Config.APP_SERVER + '/get_group_announcement';
            console.log('to getGroupAnnouncement', url, this.conversationInfo.conversation.target)
            appServerApi.getGroupAnnouncement(this.conversationInfo.conversation.target)
                .then(result => {
                    if (result.text) {
                        this.groupAnnouncement = result.text;
                    } else {
                        if (this.enableEditGroupNameOrAnnouncement) {
                            this.groupAnnouncement = this.$t('conversation.click_to_edit_group_announcement');
                        }
                    }
                })
        },

        updateGroupName() {
            let groupId = this.conversationInfo.conversation.target;
            if (!this.newGroupName || this.newGroupName === this.conversationInfo.conversation._target._displayName) {
                return;
            }

            wfc.modifyGroupInfo(groupId, ModifyGroupInfoType.Modify_Group_Name, this.newGroupName, [0], null, () => {
                this.conversationInfo.conversation._target._displayName = this.newGroupName;
                uni.setNavigationBarTitle({
                    title: this.conversationInfo.conversation._target._displayName,
                });
            }, (err) => {
                // do nothing
                console.log('err', err)
            })
        },

        async updateGroupAnnouncement() {
            if (!this.newGroupAnnouncement || this.newGroupAnnouncement === this.groupAnnouncement) {
                return;
            }
            console.log('updateGroupAnnouncement')
            appServerApi.updateGroupAnnouncement(wfc.getUserId(), this.conversationInfo.conversation.target, this.newGroupAnnouncement)
                .then(result => {
                    this.groupAnnouncement = this.newGroupAnnouncement;
                })
        },

        quitGroup(dismiss) {
            if (dismiss) {
                store.dismissGroup(this.conversationInfo.conversation.target)
            } else {
                store.quitGroup(this.conversationInfo.conversation.target)
            }
            uni.switchTab({
                url: '/pages/conversationList/ConversationListPage',
                success: () => {
                    console.log('to conversation list success');
                },
                fail: e => {
                    console.log('to conversation list error', e);
                },
                complete: () => {
                    console.log('switch tab complete')
                }
            });
        },

        setFavGroup(groupId, fav) {
            console.log('setFavGroup', groupId, fav)
            wfc.setFavGroup(groupId, fav, () => {
                this.conversationInfo.conversation._target._isFav = fav;
                store.reloadFavGroupList();
            }, (err) => {
                console.log('setFavGroup error', err);
            })
        }
    },

    components: {UserListView},

    created() {
        // 这个时候，this.conversationInfo 还没数据
        // this.getGroupAnnouncement();
    },

    computed: {
        enableAddGroupMember() {
            let selfUid = wfc.getUserId();
            let groupInfo = this.conversationInfo.conversation._target;
            //在group type为Restricted时，0 开放加入权限（群成员可以拉人，用户也可以主动加入）；1 只能群成员拉人入群；2 只能群管理拉人入群
            if (groupInfo.type === GroupType.Restricted) {
                if (groupInfo.joinType === 0 || groupInfo.joinType === 1) {
                    return true;
                } else if (groupInfo.joinType === 2) {
                    let groupMember = wfc.getGroupMember(this.conversationInfo.conversation.target, selfUid);
                    return [GroupMemberType.Manager, GroupMemberType.Owner].indexOf(groupMember.type) >= 0;
                }
            }
            return true;
        },

        enableRemoveGroupMember() {
            let selfUid = wfc.getUserId();
            let groupMember = wfc.getGroupMember(this.conversationInfo.conversation.target, selfUid);
            let t = false;
            if (groupMember) {
                t = [GroupMemberType.Manager, GroupMemberType.Owner].indexOf(groupMember.type) >= 0;
            }
            return t;
        },

        enableEditGroupNameOrAnnouncement() {
            let selfUid = wfc.getUserId();
            let groupMember = wfc.getGroupMember(this.conversationInfo.conversation.target, selfUid);
            if (groupMember) {
                return [GroupMemberType.Manager, GroupMemberType.Owner].indexOf(groupMember.type) >= 0;
            }
            return false;
        },

        users() {
            if (this.filterQuery) {
                return store.filterUsers(this.groupMemberUserInfos, this.filterQuery)
            } else {
                return this.groupMemberUserInfos;
            }
        },

        isOwner() {
            let selfUid = wfc.getUserId();
            let groupInfo = this.conversationInfo.conversation._target;
            return groupInfo.owner === selfUid
        }
    },
};
</script>

<style lang="css" scoped>
.conversation-info {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: flex-start;
    height: 100%;
    overflow: hidden;
}

header {
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

header label {
    width: 100%;
    display: flex;
    margin-top: 15px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: 14px;
    color: #999999;
}

header label:last-of-type {
    padding-bottom: 15px;
    border-bottom: 1px solid #ececec;
}

header label input {
    flex: 1;
    margin-top: 5px;
    border: none;
    outline: none;
    width: 100%;
    font-size: 13px;
    background-color: transparent;
}

.member-container {
    flex: 1;
    overflow: auto;
}

.search-item {
    position: relative;
    padding: 10px 20px;
}

.search-item input {
    width: 100%;
    padding: 0 10px 0 20px;
    height: 25px;
    border-radius: 3px;
    border: 1px solid #ededed;
    background-color: white;
    text-align: left;
    outline: none;
}

.search-item input:active {
    border: 1px solid #4168e0;
}

.search-item input:focus {
    border: 1px solid #4168e0;
}

.search-item i {
    position: absolute;
    left: 25px;
    top: 15px;
}

.action-item {
    height: 50px;
    display: flex;
    padding-left: 20px;
    align-items: center;
}

.action-item .icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: 1px dashed #d6d6d6;
}

.action-item img {
    width: 40px;
    height: 40px;
}

.action-item p {
    margin-left: 10px;
    font-size: 13px;
}

.action-item:active {
    background-color: #d6d6d6;
}

.quit-group-item {
    display: flex;
    color: red;
    align-items: center;
    justify-content: center;
    height: 50px;
    max-height: 50px;
    border-top: 1px solid #ececec;
}

.quit-group-item:active {
    background: #d6d6d6;
}

.switch {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.switch checkbox {
    margin-left: 20px;
}

</style>
