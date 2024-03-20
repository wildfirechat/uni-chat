<template>
    <div class="order-conference-container">
        <input v-model="title" class="text-input" placeholder="会议标题">
        <input v-if="false" v-model="desc" class="text-input" placeholder="会议描述">
        <label>
            开始时间
            <span>现在</span>
        </label>
        <label>
            结束时间
            <input v-model="endTime" :min="new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('.')[0]">
        </label>
        <!--        uni-app 平台，checkbox 不支持 v-model，必须采用下面的方式实现-->
        <checkbox-group @change="notAudience = !notAudience">
            <label>
                参与者开启摄像头、麦克风入会
                <checkbox value="notAudience" :checked="notAudience"/>
            </label>
        </checkbox-group>
        <checkbox-group @change="allowTurnOnMic = !allowTurnOnMic">
            <label>
                允许参与者自主开启摄像头和麦克风
                <checkbox :disabled="notAudience" value="allowTurnOnMic" :checked="allowTurnOnMic"/>
            </label>
        </checkbox-group>
        <div>
            <checkbox-group @change="enablePassword = !enablePassword">
                <label>
                    启用密码
                    <checkbox :checked="enablePassword"/>
                </label>
            </checkbox-group>
            <input v-if="enablePassword" v-model="password" class="text-input" style="margin-top: 10px" maxlength="4" placeholder="123456">
        </div>
        <div>
            <checkbox-group @change="advance = !advance">
                <label>
                    大规模会议
                    <checkbox value="advance"/>
                </label>
            </checkbox-group>
            <p class="advance_desc">参会人数大于50人</p>
        </div>

        <div class="action-container">
            <button class="create-button" :disabled="!actionEnable" @click="createConference">创建会议</button>
            <button class="join-button" :disabled="!actionEnable" @click="createAndJoinConference">进入会议</button>
        </div>
    </div>
</template>

<script>
import conferenceApi from "../../../api/conferenceApi";
import ConferenceInfo from "../../../wfc/av/model/conferenceInfo";
import wfc from "../../../wfc/client/wfc";
import checkVoipPermissions from "../voipUtil";

export default {
    name: "CreateConferenceView",
    data() {
        return {
            title: '',
            desc: '',
            endTime: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 + 1 * 60 * 60 * 1000).toISOString().split('.')[0],
            notAudience: true,
            advance: false,
            allowTurnOnMic: true,
            enablePassword: false,
            password: '',
            test: [],
        }
    },

    methods: {
        async _createConference() {
            let info = new ConferenceInfo();
            info.conferenceTitle = this.title;
            if (this.password) {
                info.password = this.password;
            }
            info.pin = '' + Math.ceil((1 + Math.random() * 100000) / 10);

            info.owner = wfc.getUserId();
            info.startTime = Math.ceil(new Date().getTime() / 1000);
            info.endTime = Math.ceil(new Date(this.endTime).getTime() / 1000);
            info.audience= !this.notAudience;
            info.allowSwitchMode = this.allowTurnOnMic;
            info.advance = this.advance;

            info.conferenceId = await conferenceApi.createConference(info)
            return info;
        },
        createConference() {
            this._createConference()
                .then(infoo => {
                    uni.showToast({
                        title: '创建会议成功',
                        icon: 'none'
                    })
                    uni.navigateBack();
                })
                .catch(err => {
                    uni.showToast({
                        title: '创建会议失败',
                        icon: 'none'
                    })
                })
        },
        async createAndJoinConference() {
            if (!await checkVoipPermissions(false)) {
                return;
            }
            this._createConference()
                .then(info => {
                    console.log('joinConference', info);
                    let url =  `/pages/voip/conference/ConferencePage?conferenceInfo=${JSON.stringify(info)}&muteAudio=false&muteVideo=false`;
                    this.$navigateToPage(url);
                })
                .catch(err => {
                    uni.showToast({
                        title: '创建会议失败',
                        icon: 'none'
                    })
                })
        }
    },
    computed: {
        actionEnable() {
            let now = new Date().getTime();
            return this.title && this.title.trim() && this.endTime && new Date(this.endTime).getTime() > now;
        }
    },
    watch: {
        advance() {
            // 超级会议模式，一般参会人员会很多，但不需要所有人都能发言；互动模式，是允许每个人发言
            // 开启超级会之后，需要再次确认开启互动模式
            if (this.advance) {
                this.notAudience = false;
            }
        },
        endTime() {
            if (this.endTime) {
                if (new Date(this.endTime).getTime() < new Date().getTime()) {
                    this.endTime = '';
                    uni.showToast({
                        title: '结束时间不能小于当前时间',
                        icon: 'none'
                    })
                }
            }
        }
    }
}
</script>

<style scoped lang="css">

.order-conference-container {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
}

.order-conference-container h2 {
    justify-content: center;
    font-weight: normal;
    font-style: normal;
    font-size: 18px;
    text-align: center;
}

.order-conference-container label {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.text-input {
    height: 30px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    outline: none;
    width: 100%;
    padding: 0 5px;
}

.text-input:active {
    border: 1px solid #4168e0;
}

.text-input:focus {
    border: 1px solid #4168e0;
}

.order-conference-container button {
    height: 30px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
}

.order-conference-container button:active {
    border: 1px solid #4168e0;
}

.advance_desc {
    font-size: 12px;
    color: #F95569;
}

.order-conference-container > * {
    margin-top: 20px;
}

.action-container {
    display: flex;
    justify-content: space-between;
}

.action-container button {
    width: 50%;
    height: 40px;
    border: none;
}

.create-button {
    margin-right: 10px;
}

.create-button:enabled {
    color: gray;
}

.join-button:enabled {
    color: #4168e0;
}

</style>
