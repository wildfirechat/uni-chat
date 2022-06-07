<template>
<chat-input id="chatInput" :min-voice-time="1" :max-voice-time="60" :start-time-down="54" :tabBarHeight="0" format="mp3" :extra-array="extraArr" @extraClickEvent="onExtraClickEvent" @extraItemClickEvent="onExtraItemClickEvent" @voiceRecordEvent="onVoiceRecordEvent" @sendMessageEvent="onSendMessageEvent"></chat-input>
</template>

<script>
// chat.js
import Toast from "../../utils/toast";
/**
 * 聊天输入组件展示页面
 */
import chatInput from "../../components/chat-input/chat-input";

export default {
  data() {
    return {
      textMessage: '',
      chatItems: [],
      extraArr: [{
        picName: 'choose_picture',
        description: '照片'
      }, {
        picName: 'take_photos',
        description: '拍摄'
      }, {
        picName: 'close_chat',
        description: '自定义功能'
      }],
      pageHeight: ""
    };
  },

  components: {
    chatInput
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      pageHeight: wx.getSystemInfoSync().windowHeight
    });
    wx.setNavigationBarTitle({
      title: '好友'
    });
  },

  onReady() {
    this.chatInput = this.selectComponent('#chatInput');
  },

  methods: {
    onSendMessageEvent(e) {
      let content = e.detail.value;
      console.log(content);
    },

    onVoiceRecordEvent(e) {
      console.log(e); //duration时长，单位ms
      //recordStatus 录音状态
      //fileSize 文件大小
      //tempFilePath 文件临时路径

      const {
        detail: {
          recordStatus,
          duration,
          tempFilePath,
          fileSize
        }
      } = e;
      const status = this.chatInput.getRecordStatus();

      switch (recordStatus) {
        case status.START:
          //开始录音
          break;

        case status.SUCCESS:
          //录音成功
          break;

        case status.CANCEL:
          //取消录音
          break;

        case status.SHORT:
          //录音时长太短
          break;

        case status.UNAUTH:
          //未授权录音功能
          break;

        case status.FAIL:
          //录音失败(已经授权了)
          break;
      }
    },

    /**
     * 点击extra中的item时触发
     * @param e
     */
    onExtraItemClickEvent(e) {
      let chooseIndex = parseInt(e.detail.index);

      if (chooseIndex === 2) {
        this.myFun();
        return;
      }

      wx.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: chooseIndex === 0 ? ['album'] : ['camera'],
        success: res => {
          let tempFilePath = res.tempFilePaths[0];
        }
      });
    },

    /**
     * 点击extra按钮时触发
     * @param e
     */
    onExtraClickEvent(e) {
      console.log(e); //isShow 是否显示extra弹窗

      const {
        detail: {
          isShow
        }
      } = e;
    },

    myFun() {
      wx.showModal({
        title: '小贴士',
        content: '这是用于拓展的自定义功能！',
        confirmText: '确认',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            Toast.show('success', '自定义功能');
          }
        }
      });
    },

    resetInputStatus() {
      //关闭extra弹窗
      this.chatInput.closeExtraView();
    }

  }
};
</script>
<style>
@import "./chat-input.css";
</style>