<template>
<view>
<!--pages/friends/friends.wxml-->

<block v-for="(item, friendId) in friends" :key="friendId">
    <view class="chat-item-style" @tap="chatTo" :data-item="item">
        <block data-type="template" data-is="chat-item-head" data-attr="headUrl:item.friendHeadUrl,unread:0">
    <view class="chat-item-head-super-style">
        <image class="chat-head-style" :src="headUrl"></image>
        <text v-if="unread>0" class="unread-style">{{unread<=99?unread:'99+'}}<>
    </text></text></view>
</block>
        <view class="chat-item-content-super-style">
            <view class="chat-item-name-style">{{item.friendName}}</view>
        </view>
    </view>
    <view class="list-divide-line" style="width: 79.5%;margin-left: 20.5%"></view>
</block>
</view>
</template>

<script>
// pages/friends/friends.js
import wfc from "../../wfc/client/wfc";
import EventType from "../../wfc/client/wfcEvent";
import ConversationInfo from "../../wfc/model/conversationInfo";
import Conversation from "../../wfc/model/conversation";
import ConversationType from "../../wfc/model/conversationType";
/**
 * 获取好友列表
 */

export default {
  data() {
    return {
      friends: []
    };
  },

  components: {},
  props: {},

  onLoad(options) {
    wfc.eventEmitter.on(EventType.UserInfosUpdate, this.onUserInfoUpdate);
  },

  onUnload(options) {
    wfc.eventEmitter.removeListener(EventType.UserInfosUpdate, this.onUserInfoUpdate);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    this.showFriendList();
  },

  methods: {
    onUserInfoUpdate() {
      this.showFriendList();
    },

    showFriendList() {
      let friends = wfc.getMyFriendList(false);
      let friendsUs = friends.map(f => {
        let userInfo = wfc.getUserInfo(f, false);
        return {
          friendId: userInfo.uid,
          friendHeadUrl: userInfo.portrait,
          friendName: userInfo.displayName
        };
      });
      this.setData({
        friends: friendsUs
      });
    },

    createFriendItem(item) {
      return {
        friendId: item.userId,
        friendHeadUrl: item.myHeadUrl,
        friendName: item.nickName
      };
    },

    chatTo(e) {
      let item = e.currentTarget.dataset.item;
      let conversation = new Conversation(ConversationType.Single, item.friendId, 0);
      wx.navigateTo({
        url: `../chat/chat?conversation=${JSON.stringify(conversation)}`
      });
    }

  }
};
</script>
<style>
@import "./friends.css";
</style>