<template>
    <div class="user-detail-container" v-if="sharedStateContact.currentFriend">
        <div class="header">
            <div>
                <h2>{{ name }}</h2>
                <p>你好，野火</p>
            </div>
            <div>
                <img class="avatar" :src="sharedStateContact.currentFriend.portrait">
            </div>
        </div>
        <div class="content">
            <ul>
                <li>
                    <label>{{ $t('common.alias') }}</label>
                    <div class="alias">
                        <input type="text" ref="input" :value="sharedStateContact.currentFriend.friendAlias" placeholder="备注名" @keyup.enter="updateFriendAlias"/>
                    </div>
                </li>
                <li>
                    <label>{{ $t('common.wfc_id') }}</label>
                    <p class="single-line">{{ user.name }}</p>
                </li>
                <li>
                    <label>{{ $t('common.area') }}</label>
                    <p>{{ $t('common.unknown') }}</p>
                </li>
                <li>
                    <label>{{ $t('common.label') }}</label>
                    <p>{{ $t('misc.test_user') }}</p>
                </li>
            </ul>
        </div>
        <div class="footer">
            <div class="action" @click="chat">
                <i class="icon-ion-ios-chatboxes-outline"></i>
                <a>{{ $t('message.send_message') }}</a>
            </div>
            <div class="action" @click="startAudioCall">
                <i class="icon-ion-ios-telephone-outline"></i>
                <a>语音通话</a>
            </div>
            <div class="action" @click="startVideoCall">
                <i class="icon-ion-ios-videocam-outline"></i>
                <a>视频通话</a>
            </div>
            <div v-if="!isFriend && !isSelf" class="action" @click="addFriend">
                <i class="icon-ion-person-add"></i>
                <a>添加好友</a>
            </div>
            <div v-if="isFriend && !isSelf" class="action" style="color: red" @click="deleteFriend">
                <i class="icon-ion-android-remove-circle"></i>
                <a>删除好友</a>
            </div>
        </div>
    </div>
</template>

<script>
import store from "../../store";
import ConversationType from "../../wfc/model/conversationType";
import Conversation from "../../wfc/model/conversation";
import wfc from "../../wfc/client/wfc";
import avengineKit from "../../wfc/av/engine/avengineKit";

export default {
    name: "UserDetailPage",
    data() {
        return {
            sharedStateContact: store.state.contact,
            user: store.state.contact.currentFriend,
        }
    },

    mounted() {
        wfc.getUserInfo(this.user.uid, true);
        // uni.setNavigationBarTitle({
        //     title:this.user._displayName,
        // });
    },

    onUnload() {
        store.setCurrentFriend(null);
    },

    methods: {
        chat() {
            let conversation = new Conversation(ConversationType.Single, this.user.uid, 0);
            store.setCurrentConversation(conversation);
            this.$go2ConversationPage();
        },
        updateFriendAlias() {
            let friendAlias = this.$refs.input.value;
            if (friendAlias.trim() && friendAlias !== this.sharedStateContact.currentFriend.friendAlias) {
                wfc.setFriendAlias(this.user.uid, friendAlias,
                    () => {
                        // do nothing
                        console.log('setFriendAlias success', this.user, friendAlias);
                    },
                    (error) => {
                        // do nothing
                    })
            }
        },
        deleteFriend() {
            console.log('start deleteFriend')
            wfc.deleteFriend(this.user.uid, () => {
                console.log('deleteFriend success')
                uni.showToast({
                    title: '删除好友成功',
                    icon: 'none'
                });
                setTimeout(() => {
                    uni.navigateBack({
                        delta: 1
                    })
                }, 1000)
            }, err => {
                console.log('deleteFriend fail ', err)
                uni.showToast({
                    title: '删除好友失败' + err,
                    icon: 'none'
                });
            })
        },
        addFriend() {
            let userInfo = wfc.getUserInfo(wfc.getUserId());
            let reason = '你好，我是' + userInfo.displayName;
            wfc.sendFriendRequest(this.user.uid, reason, '', () => {
                uni.showToast({
                    title: '好友请求发送成 ',
                    icon: 'none'
                });
                setTimeout(() => {
                    uni.navigateBack({
                        delta: 1
                    })
                }, 1000)
            }, err => {
                uni.showToast({
                    title: '好友请求发送失败 ' + err,
                    icon: 'none'
                });
            })
        },
        startAudioCall() {
            let callSession = avengineKit.startSingleCall(this.user.uid, true)
            if (callSession) {
                let url = `/pages/voip/Single?session=${JSON.stringify(callSession)}`
                this.$navigateToPage(url);
            }
        },
        startVideoCall() {
            let callSession = avengineKit.startSingleCall(this.user.uid, false)
            if (callSession) {
                let url = `/pages/voip/Single?session=${JSON.stringify(callSession)}`
                this.$navigateToPage(url);
            }
        }
    },
    computed: {
        name: function () {
            let name;
            let friend = this.sharedStateContact.currentFriend;
            if (!friend) {
                return null;
            }
            if (friend.displayName) {
                name = friend.displayName;
            } else {
                name = friend.name;
            }
            return name;
        },
        isFriend() {
            return wfc.isMyFriend(this.user.uid);
        },
        isSelf() {
            return this.user.uid === wfc.getUserId();
        }
    }
}
</script>

<style lang="css" scoped>

.user-detail-container {
    margin-left: 30px;
    margin-right: 30px;
    border-top-right-radius: var(--main-border-radius);
    border-bottom-right-radius: var(--main-border-radius);
}

.header {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid #e6e6e6;
}

.header .avatar {
    width: 80px;
    height: 80px;
    border-radius: 2px;
}

.header h2 {
    font-size: 20px;
    font-style: normal;
    font-weight: normal;
    margin-bottom: 5px;
}

.content {
    width: 100%;
    text-align: left;
}

.content ul {
    list-style: none;
    margin: 20px 0;
}

.content ul li {
    margin-left: 0;
    height: 40px;
    line-height: 40px;
    display: flex;
}

.content ul li label {
    margin-right: 20px;
    width: 50px;
    text-align: justify;
    text-align-last: justify;
}

.content ul li .alias > input {
    width: 100%;
    border: none;
    height: 20px;
}

.content ul li > div {
    display: inline-block;
    flex: 1;
}

.footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 30px;
    border-top: 1px solid #e6e6e6;
}

.footer a:active {
    background-color: #4168e0;
}

.footer .action {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: #5d7ce8;
}

.footer .action a {
    font-size: 10px;
    padding-top: 1px;
}

.footer .action i {
    font-size: 20px;
}

</style>
