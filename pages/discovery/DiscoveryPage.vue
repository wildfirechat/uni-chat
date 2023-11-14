<template>
    <div class="discovery-container">
        <div class="item" @click="showChatroomList">
            <image src="/static/image/icon/ic_chatroom.png"/>
            <text>聊天室</text>
            <i class="icon-ion-ios-arrow-right"></i>
        </div>
        <div class="item" @click="showRobotConversation">
            <image src="/static/image/icon/ic_robot.png"/>
            <text>机器人</text>
            <i class="icon-ion-ios-arrow-right"></i>
        </div>
        <div class="item" @click="showChannelList">
            <image src="/static/image/icon/ic_channel.png"/>
            <text>频道</text>
            <i class="icon-ion-ios-arrow-right"></i>
        </div>
        <div v-if="supportConference" class="item" @click="showConferencePortal">
            <image src="/static/image/icon/ic_conference.png"/>
            <text>会议</text>
            <i class="icon-ion-ios-arrow-right"></i>
        </div>
        <div class="item" @click="showDevGuide">
            <image src="/static/image/icon/ic_dev_docs.png"/>
            <text>开发手册</text>
            <i class="icon-ion-ios-arrow-right"></i>
        </div>
    </div>

</template>

<script>
import store from "../../store";
import Conversation from "../../wfc/model/conversation";
import ConversationType from "../../wfc/model/conversationType";
import avengineKit from "../../wfc/av/engine/avengineKit";

export default {
    name: "DiscoveryPage",
    data() {
        return {
            user: store.state.contact.selfUserInfo,
            supportConference: avengineKit.isSupportConference(),
        }
    },
    methods: {
        todo() {
            uni.showToast({
                title: 'TODO',
                icon: 'none',
            });
        },
        showChatroomList() {
            uni.navigateTo({
                url: '/pages/discovery/ChatroomListPage',
                fail: (e) => {
                    console.log(e)
                }
            });
        },
        showRobotConversation() {
            let conversation = new Conversation(ConversationType.Single, "FireRobot", 0);
            store.setCurrentConversation(conversation);
            this.$go2ConversationPage();
        },
        showChannelList() {
            uni.navigateTo({
                url: '/pages/contact/ChannelListPage',
                fail: (e) => {
                    console.log(e)
                }
            });
        },
        showConferencePortal(){
            uni.navigateTo({
                url: '/pages/voip/conference/ConferencePortalPage',
                fail: (e) => {
                    console.log(e)
                }
            });
        },
        showDevGuide() {
            uni.navigateTo({
                url: '/pages/misc/WebViewPage?url=https://docs.wildfirechat.cn/',
                fail: (e) => {
                    console.log(e)
                }
            });
        }
    }
}
</script>

<style scoped>

.discovery-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: var(--page-full-height-without-header-and-tabbar);
    background: #fafafa;
    overflow: hidden;
}

.item {
    width: 100%;
    padding: 15px 10px;
    margin: 5px 0;
    background: white;
    display: flex;
    align-items: center;
}

.item image {
    max-width: 20px;
    max-height: 20px;
    margin-right: 10px;
}

.item text {
    flex: 1;
}

.item i {
    color: #d6d6d6;
}

.item:active {
    background: #d6d6d6;
}


</style>
