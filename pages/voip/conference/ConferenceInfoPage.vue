<template>
    <div class="conference-info-container">
        <div class="item-container">
            <div class="item">
                <p class="title">会议主题</p>
                <p class="desc">{{ conferenceInfo.conferenceTitle }}</p>
            </div>
            <div class="item">
                <p class="title">发起人</p>
                <p class="desc">{{ ownerName }}</p>
            </div>
            <div class="item">
                <p class="title">会议号</p>
                <p class="desc">{{ conferenceInfo.conferenceId }}</p>
            </div>
            <div class="item">
                <p class="title">二维码</p>
                <i>&gt;</i>
            </div>
        </div>
        <div class="item-container">
            <div class="item">
                <p class="title">开始时间</p>
                <p class="desc">{{ startTime }}</p>
            </div>
            <div class="item">
                <p class="title">结束时间</p>
                <p class="desc">{{ endTime }}</p>
            </div>
        </div>
        <div class="item-container">
            <checkbox-group class="item" @change="enableVideo = !enableVideo">
                <label>
                    开启视频
                </label>
                <checkbox :disabled="audience" :checked="enableVideo"/>
            </checkbox-group>
            <!--            不知道为啥，下面的 class 没生效-->
            <checkbox-group class="item" @change="enableAudio= !enableAudio" style="display: flex; flex-direction: row; justify-content: space-between; padding: 12px 20px; border-spacing: 20px;">
                <label>
                    开启音频
                </label>
                <checkbox :disabled="audience" :checked="enableAudio"/>
            </checkbox-group>
        </div>

        <div class="action-container">
            <button class="destroy" v-if="enableDestroy">
                销毁会议
            </button>
            <button ref="favButton" v-if="new Date().getTime() < conferenceInfo.startTime * 1000" @click="favConference">
                尚未开始，收藏会议
            </button>
            <button v-else-if="new Date().getTime() < conferenceInfo.endTime * 1000" @click="joinConference">
                加入会议
            </button>
            <button v-else :disabled="true">
                会议已结束
            </button>
        </div>
    </div>
</template>

<script>
import wfc from "../../../wfc/client/wfc";
import conferenceApi from "../../../api/conferenceApi";
import conferenceManager from "./conferenceManager";
import checkVoipPermissions from "../voipUtil";

export default {
    name: "ConferenceInfoPage",
    data() {
        return {
            conferenceInfo: {},
            enableVideo: false,
            enableAudio: false,
            ownerName: '',
        }
    },
    onLoad(option) {
        console.log('voip/conference/ConferenceInfoPage onLoad')
        // #ifdef APP-NVUE
        const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
        // #endif
        // #ifndef APP-NVUE
        const eventChannel = this.getOpenerEventChannel();
        // #endif
        // 监听openerUsers事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('options', (options) => {
            console.log('options', options)
            let conferenceId = options.conferenceId;
            let password = options.password;
            if (options.conferenceInfo) {
                this.conferenceInfo = options.conferenceInfo;
            } else {
                this.getConferenceInfo(conferenceId, password);
            }
        })
    },
    mounted() {
        console.log('conferenceInfo', this.conferenceInfo);
        this.ownerName = wfc.getUserDisplayName(this.conferenceInfo.owner);
    },

    methods: {
        getConferenceInfo(conferenceId, password) {
            conferenceApi.queryConferenceInfo(conferenceId, password)
                .then(info => {
                    this.conferenceInfo = info;
                    console.log('conferenceInfo', info)
                })
                .catch(reason => {
                    console.error('queryConferenceInfo error', reason);
                    uni.navigateBack({
                        delta: 1,
                        fail: err => {
                            console.log('nav back from ConferenceInfoPage err', err);
                        }
                    });
                });

        },
        favConference() {
            conferenceApi.favConference(this.conferenceInfo.conferenceId)
                .then(r => {
                    this.$refs.favButton.title = '已收藏';
                    this.$refs.favButton.disabled = true;
                })
                .catch(err => {
                    console.error('favConference error', err);
                })
        },
        async joinConference() {
            if (!await checkVoipPermissions(false)) {
                return;
            }

            let info = this.conferenceInfo;
            console.log('joinConference', info, this.enableAudio, this.enableVideo);
            uni.redirectTo({
                url: `/pages/voip/conference/ConferencePage?conferenceInfo=${JSON.stringify(this.conferenceInfo)}&muteAudio=${!this.enableAudio}&muteVideo=${!this.enableVideo}`,
                success: (res) => {
                },
                fail: (e) => {
                    console.log('navigate to WebViewPage error', e)
                }
            });
        },
    },
    computed: {
        startTime() {
            let date = new Date(this.conferenceInfo.startTime * 1000);
            return date.toString();
        },
        endTime() {
            if (!this.conferenceInfo.endTime) {
                return '-'
            }

            let date = new Date(this.conferenceInfo.endTime * 1000)
            return date.toString();
        },
        audience() {
            return !(this.conferenceInfo.owner === wfc.getUserId() || !this.conferenceInfo.audience || this.conferenceInfo.allowSwitchMode)
        },

        enableDestroy() {
            return this.conferenceInfo.owner === wfc.getUserId() && new Date().getTime() < this.conferenceInfo.startTime * 1000;
        }
    }
}
</script>

<style scoped>

.conference-info-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f8f8f8;
}

.conference-info-container h2 {
    justify-content: center;
    font-weight: normal;
    font-style: normal;
    font-size: 18px;
    background: white;
    text-align: center;
    padding: 20px 0;
}

.item-container {
    background: white;
    margin-bottom: 20px;
    font-size: 14px;
}

.item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 20px;
    border-spacing: 20px;
}

.item:not(:last-of-type) {
    border-bottom: 1px solid #f1f1f1;
}

.item .desc {
    color: gray;
}

.item label {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.action-container {
    display: flex;
    margin: 0 10px;
}

button {
    background: white;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    height: 40px;
    line-height: 40px;
    border: none;
}

button:active {
    background: lightgrey;
}

button.destroy {
    margin-right: 10px;
    color: red;
}

</style>
