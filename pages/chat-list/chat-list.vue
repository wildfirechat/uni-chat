<template>
<view>
<block v-for="(item, conversationId) in conversations" :key="conversationId">
    <block data-type="template" data-is="chat-item" data-attr="item:item">
    <view class="chat-item-style" @longtap="onConversationLongTap" @tap="chatTo" :data-item="item" hover-class="press-style">
        <template is="chat-item-head" data={headUrl:item.ui.portrait,unread:item.ui.unread}></template>
        <view class="chat-item-content-super-style">
            <view class="chat-item-name-style">{{item.ui.title}}</view>
            <!-- <view class="chat-item-name-style">targetName</view> -->
            <!-- <image src="./../../image/chat/send_fail.png" style="width: 28rpx;height: 28rpx;margin-right: 6rpx;"/> -->
            <text class="chat-item-content-style">{{item.ui.lastMsgContent}}</text>
        </view>
        <view class="chat-item-status-super-style">
            <view class="chat-item-time-style">{{item.ui.time}}</view>
        </view>
    </view>
    <view class="list-divide-line" style="width: 79.5%;margin-left: 20.5%"></view>
</block>
</block>
</view>
</template>

<script>
// pages/chat-list/chat-list.js
import EventType from "../../wfc/client/wfcEvent";
import ConnectionStatus from "../../wfc/client/connectionStatus";
import MessageConfig from "../../wfc/client/messageConfig";
import PersistFlag from "../../wfc/messages/persistFlag";
import wfc from "../../wfc/client/wfc";
/**
 * 会话列表页面
 */

export default {
  data() {
    return {
      conversations: []
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wfc.eventEmitter.on(EventType.ConnectionStatusChanged, this.onConnnectionStatusChange);
    wfc.eventEmitter.on(EventType.UserInfosUpdate, this.onUserInfosUpdate);
    wfc.eventEmitter.on(EventType.GroupInfosUpdate, this.onGroupInfosUpdate);
    wfc.eventEmitter.on(EventType.ReceiveMessage, this.onReceiveMessage);
    wfc.eventEmitter.on(EventType.SettingUpdate, this.onSettingUpdate);
  },

  onUnload(options) {
    wfc.eventEmitter.removeListener(EventType.ConnectionStatusChanged, this.onConnnectionStatusChange);
    wfc.eventEmitter.removeListener(EventType.UserInfosUpdate, this.onUserInfosUpdate);
    wfc.eventEmitter.removeListener(EventType.GroupInfosUpdate, this.onGroupInfosUpdate);
    wfc.eventEmitter.removeListener(EventType.ReceiveMessage, this.onReceiveMessage);
    wfc.eventEmitter.removeListener(EventType.SettingUpdate, this.onSettingUpdate);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {

    if (wfc.getConnectionStatus() === ConnectionStatus.ConnectionStatusConnected) {
      this.showConversationList();
    }
  },

  methods: {
    onConnnectionStatusChange(status) {
      if (status === ConnectionStatus.ConnectionStatusConnected) {
        this.showConversationList();
      }
    },

    onUserInfosUpdate(userInfos) {
      this.showConversationList();
    },

    onGroupInfosUpdate(groupInfos) {
      this.showConversationList();
    },

    onReceiveMessage(msg) {
      console.log('receive msg', msg);

      if (MessageConfig.getMessageContentPersitFlag(msg.content.type) == PersistFlag.Persist_And_Count) {
        this.showConversationList();
      }
    },

    onSettingUpdate() {
      this.showConversationList();
    },

    chatTo(e) {
      let item = e.currentTarget.dataset.item;
      wfc.clearConversationUnreadStatus(item.conversation);
      delete item.unread;
      wx.navigateTo({
        url: `../chat/chat?conversation=${JSON.stringify(item.conversation)}`
      });
    },

    onConversationLongTap(e) {
      let conversationInfo = e.currentTarget.dataset.item;
      let menuItems = ['清空会话', '删除会话'];

      if (conversationInfo.isTop) {
        menuItems.push('取消置顶');
      } else {
        menuItems.push('会话置顶');
      }

      let self = this;
      wx.showActionSheet({
        itemList: menuItems,

        success(res) {
          console.log(res.tapIndex);
          let item = menuItems[res.tapIndex];

          switch (item) {
            case '清空会话':
              wfc.clearMessages(conversationInfo.conversation);
              self.showConversationList();
              break;

            case '删除会话':
              wfc.removeConversation(conversationInfo.conversation, true);
              self.showConversationList();
              break;

            case '会话置顶':
              wfc.setConversationTop(conversationInfo.conversation, true);
              break;

            case '取消置顶':
              wfc.setConversationTop(conversationInfo.conversation, false);
              break;

            default:
              break;
          }
        },

        fail(res) {
          console.log(res.errMsg);
        }

      });
    },

    showConversationList() {
      let conversations = wfc.getConversationList([0, 1, 2], [0, 1]);
      console.log('conversations', conversations);
      let clUi = conversations.map(item => {
        item.ui = {
          title: item.title(),
          portrait: item.portrait(),
          lastMsgContent: '',
          unread: item.unreadCount.unread,
          time: ''
        };

        if (item.lastMessage && item.lastMessage.messageContent) {
          item.ui.lastMsgContent = item.lastMessage.messageContent.digest();
          item.ui.time = 'todo msg time';
        }

        return item;
      });
      console.log('cl', clUi);
      // this.setData({
      //   conversations: clUi
      // });
	  this.conversations = clUi;
    }

  }
};
</script>
<style>
@import "./chat-list.css";
</style>