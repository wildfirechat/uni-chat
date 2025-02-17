<template>
    <div ref="userCardTippy"
         @click="userInfo"
         :name="'userCardInfoTrigger' + message.messageId"
         class="user-card-content-container">
        <div class="portrait-name-container">
            <img :src="message.messageContent.portrait">
            <p>{{ message.messageContent.displayName }}</p>
        </div>
        <p class="desc single-line">个人名片</p>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import wfc from "@/wfc/client/wfc";
import store from "../../../../store";

export default {
    name: "UserCardMessageContentView",
    props: {
        message: {
            required: true,
            type: Message,
        }
    },
    components: {},

    methods: {
        userInfo() {
            let userCard = this.message.messageContent;
            let userInfo = wfc.getUserInfo(userCard.target);
            store.setCurrentFriend(userInfo)
            uni.navigateTo({
                url: '/pages/contact/UserDetailPage',
                success: () => {
                    console.log('nav to UserDetailPage success');

                },
                fail: (err) => {
                    console.log('nav to UserDetailPage err', err);
                }
            })
        }
    }
}
</script>

<style scoped lang="css">
.user-card-content-container {
    width: 230px;
    height: 100px;
    margin: 0 10px;
    padding: 10px;
    background-color: white;
    position: relative;
    border-radius: 5px;
}

.portrait-name-container {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
}

.portrait-name-container img {
    width: 45px;
    height: 45px;
    border-radius: 3px;
}

.portrait-name-container p {
    padding-left: 10px;
    padding-right: 10px;
}

.desc {
    padding-top: 8px;
    font-size: 13px;
    color: #b8b8b8;
}

</style>
