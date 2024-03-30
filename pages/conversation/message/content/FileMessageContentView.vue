<template>
    <div class="file-message-container"
         @click="clickFile"
         v-bind:class="{out:message.direction === 0}">
        <img :src="fileIcon" alt=""/>
        <div class="flex-column flex-align-start" draggable="true" @dragstart="dragFile($event)">
            <p class="file-name">{{ this.message.messageContent.name }}</p>
            <p class="file-size single-line">{{ size }}</p>
        </div>
        <div v-if="message.direction === 1 && downloadStats " style="height:5px; background: #4168e0a0; position: absolute; left: 0; bottom: 0"
             v-bind:style="{width: downloadStats.receivedBytes / downloadStats.totalBytes * 100 + '%'}">
        </div>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import helper from "@/pages/util/helper";
import store from "@/store";

export default {
    name: "FileMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        }
    },
    data() {
        return {
            sharedConversationState: store.state.conversation,
        }
    },
    methods: {
        clickFile() {
            uni.downloadFile({
                url: this.message.messageContent.remotePath,
                success: res => {
                    let filePath = res.tempFilePath;
                    console.log('download file success', filePath);
                    uni.openDocument({
                        filePath: filePath,
                        showMenu: true,
                        success: (res) => {
                            console.log('打开文档成功');
                        },
                        fail: (res) => {
                            console.log('打开文档失败', res);
                            uni.showToast({
                                title: '打开文档失败',
                                icon: 'none',
                            });
                        }
                    });
                }
            });
        },

        dragFile(event) {
            let file = this.message.messageContent;
            let fileObj = {
                url: file.remotePath,
                name: file.name,
                size: file.size
            }
            event.dataTransfer.setData('text', JSON.stringify(fileObj))
        },
        isDownloading() {
            return store.isDownloadingMessage(this.message.messageId);
        },
    },

    computed: {
        size() {
            let fileMsgContent = this.message.messageContent;
            return helper.humanSize(fileMsgContent.size)
        },
        fileIcon() {
            let fileName = this.message.messageContent.name;
            let icon = helper.getFiletypeIcon(fileName.substring(fileName.lastIndexOf('.') + 1))
            return "/static/image/filetypes/" + icon;
        },

        downloadStats() {
            let dm = store.getDownloadingMessageStatus(this.message.messageId);
            return dm;
        }
    }
}
</script>

<style lang="css" scoped>
.file-message-container {
    margin: 0 10px;
    padding: 10px;
    background-color: white;
    position: relative;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    max-width: 200px;
    min-width: 150px;
}

.file-message-container image {
    width: 32px;
    height: 32px;
    margin-right: 10px;
    min-width: 32px;
    border-radius: 3px;
}

.file-message-container .file-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-message-container .file-size {
    color: #888888;
    font-size: 13px;
}

.file-message-container .text {
    color: #050505;
    font-size: 16px;
}

.rightarrow:before {
    border-left-color: white;
}

</style>
