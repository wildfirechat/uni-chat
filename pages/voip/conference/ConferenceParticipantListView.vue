<template>
    <div class="participant-list-container" ref="rootContainer">
        <div v-if="true" @click="invite"
             class="action-item">
            <div class="icon">+</div>
            <p>邀请新参与者</p>
        </div>
        <div v-if="false" @click="invite"
             class="action-item">
            <div class="icon">-</div>
            <p>移除参与者</p>
        </div>
        <ul>
            <li v-for="participant in participants" :key="participant.uid + participant._isScreenSharing">
                <div class="participant-user"
                     @click.stop.prevent="showContextMenu($event, participant)"
                     :ref="'userCardTippy-'+participant.uid"
                     v-bind:class="{active: participant.uid === currentParticipant.uid && participant._isScreenSharing === currentParticipant._isScreenSharing}"
                     :name="'user-'+participant.uid">
                    <div class="avatar-container">
                        <image class="avatar" :src="participant.portrait" alt=""/>
                        <div v-if=" selfUserId === session.host && !participant._isHost" @click.stop="kickoff(participant)"
                             class="icon">
                            -
                        </div>
                    </div>
                    <div class="name-desc">
                        <p class="single-line name"> {{ participantName(participant) }}</p>
                        <p class="single-line desc">{{ participantDesc(participant) }}</p>
                    </div>
                    <div class="audio-video">
                        <i v-if="participant._isAudience || participant._isAudioMuted" class="icon-ion-ios-mic-outline" style="color: gray"></i>
                        <i v-else class="icon-ion-ios-mic"></i>
                        <i v-if="participant._isAudience || participant._isVideoMuted" class="icon-ion-ios-videocam-outline" style="color: gray"></i>
                        <i v-else class="icon-ion-ios-videocam"></i>
                    </div>
                </div>
            </li>
        </ul>
        <chunLei-popups v-model="isContextMenuShow" :popData="contextMenuItems" @tapPopup="onContextMenuItemSelect" :x="contextMenuX" :y="contextMenuY" direction="column" theme="dark" :triangle="false" dynamic/>
        <uni-popup ref="alertDialog" type="dialog">
            <uni-popup-dialog :cancelText="alertDialogOptions.cancelText" :confirmText="alertDialogOptions.confirmText" :title="alertDialogOptions.title" @confirm="alertDialogOptions.onConfirm"
                              @close="alertDialogOptions.onClose"></uni-popup-dialog>
        </uni-popup>
    </div>
</template>

<script>
import ConferenceInviteMessageContent from "../../../wfc/av/messages/conferenceInviteMessageContent";
import Message from "../../../wfc/messages/message";
import ForwardType from "../../conversation/message/forward/ForwardType";
import conferenceManager from "./conferenceManager";
import avengineKit from "../../../wfc/av/engine/avengineKit";

export default {
    name: "ConferenceParticipantListView",
    props: {
        participants: {
            type: Array,
            required: true,
        },
        session: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            conferenceManager: conferenceManager,
            selfUserId: conferenceManager.selfUserId,
            isContextMenuShow: false,
            currentParticipant: {},
            contextMenuItems: [],
            contextMenuX: 0,
            contextMenuY: 0,
            alertDialogOptions: {},
        }
    },
    mounted() {
    },
    components: {},
    methods: {
        invite() {
            let defaultAudience = false;
            let callSession = this.session;
            let conferenceInfo = conferenceManager.conferenceInfo;
            let inviteMessageContent = new ConferenceInviteMessageContent(callSession.callId, conferenceInfo.owner, conferenceInfo.conferenceTitle, callSession.desc, callSession.startTime, callSession.audioOnly, defaultAudience, callSession.advance, callSession.pin)
            console.log('invite', inviteMessageContent, callSession, conferenceInfo);
            let message = new Message(null, inviteMessageContent);
            this.$forward({
                forwardType: ForwardType.NORMAL,
                messages: [message]
            });
            this.showParticipantList = false;
        },

        requestChangeMode(user) {
            if (user.uid === this.selfUserInfo.uid) {
                // TODO 需要根据实际产品定义处理，这儿直接禁止
                //this.session.switchAudience(!user._isAudience);
                return;
            }
            this.showAlertDialog({
                content: user._isAudience ? `邀请${this.participantName(user)}参与互动?` : `取消${this.participantName(user)}参与互动?`,
                onClose: () => {
                    // do nothing
                },
                onConfirm: () => {
                    this.session.requestChangeMode(user.uid, !user._isAudience);
                }
            })
        },

        kickoff(user) {
            this.showAlertDialog({
                showIcon: true,
                content: `确认将${this.participantName(user)}移除会议?`,
                onClose: () => {
                    // do nothing
                },
                onConfirm: () => {
                    avengineKit.kickoffParticipant(this.session.callId, user.uid)
                }
            })
        },

        participantName(user) {
            let name = '';
            if (user.groupAlias) {
                name = user.groupAlias;
            } else if (user.friendAlias) {
                name = user.friendAlias;
            } else if (user.displayName) {
                name = user.displayName;
            } else {
                name = user.name;
            }
            return name;
        },
        participantDesc(user) {
            let desc = '';
            if (user.uid === conferenceManager.selfUserId) {
                desc = "我"
                if (user.uid === conferenceManager.conferenceInfo.owner) {
                    desc += "、主持人"
                }
            } else if (user.uid === conferenceManager.conferenceInfo.owner) {
                desc = "主持人"
            } else if (user._isScreenSharing) {
                desc = '屏幕共享';
            }
            return desc;
        },

        // fixme
        // TODO 操作之后，需要更新participant
        buildParticipantContextMenu(participant) {
            let selfUid = conferenceManager.selfUserId;
            let items = [];
            if (!participant) {
                return items;
            }

            items.push({
                title: '查看用户信息',
                tag: 'aa',
                handler: () => {
                    this.showUserCard(participant);
                }
            })

            if (selfUid === participant.uid) {
                // TODO 临时屏蔽，现在不支持同时开视频和音频
                // if (participant._isAudience) {
                //     items.push({
                //         title: '开启音视频',
                //         handler: () => {
                //             this.$eventBus.$emit('muteAudio', false)
                //             this.$eventBus.$emit('muteVideo', false)
                //         }
                //     })
                // }

                if (participant._isAudience) {
                    if (participant._isAudioMuted) {
                        items.push({
                            title: '开启音频',
                            handler: () => {
                                avengineKit.switchAudience(false);
                                avengineKit.muteAudio(false)

                                // TODO 重新加载 profile
                            }
                        })
                    }

                    if (participant._isVideoMuted) {
                        items.push({
                            title: '开启视频',
                            handler: () => {
                                avengineKit.switchAudience(false);
                                avengineKit.muteVideo(false)
                            }
                        })
                    }

                } else {
                    if (!participant._isAudioMuted) {
                        items.push({
                            title: '关闭音频',
                            handler: () => {
                                avengineKit.muteAudio(true)
                                if (participant._isVideoMuted) {
                                    avengineKit.switchAudience(true);
                                }
                            },
                            styleObject: {
                                color: 'red',
                            }
                        })
                    }
                    if (!participant._isVideoMuted) {
                        items.push({
                            title: '关闭视频',
                            handler: () => {
                                avengineKit.muteVideo(true)
                                if (participant._isAudioMuted) {
                                    avengineKit.switchAudience(true);
                                }
                            },
                            styleObject: {
                                color: 'red',
                            }
                        })
                    }
                    if (!participant._isVideoMuted && !participant._isAudioMuted) {
                        items.push({
                            title: '关闭音视频',
                            handler: () => {
                                avengineKit.muteAudio(true);
                                avengineKit.muteVideo(true);
                                avengineKit.switchAudience(true)
                            },
                            styleObject: {
                                color: 'red',
                            }
                        })
                    }
                }
            }
            if (selfUid === conferenceManager.conferenceInfo.owner) {
                if (participant.uid !== selfUid) {
                    if (participant._isAudience || participant._isAudioMuted) {
                        items.push({
                            title: '邀请发言',
                            handler: () => {
                                conferenceManager.requestMemberMute(participant.uid, true, false)
                            },
                        })
                    } else if (!participant._isAudience && !participant._isAudioMuted) {
                        items.push({
                            title: '取消发言',
                            handler: () => {
                                conferenceManager.requestMemberMute(participant.uid, true, true)
                            },
                        })
                    }
                    if (participant._isAudience || participant._isVideoMuted) {
                        items.push({
                            title: '邀请打开摄像头',
                            handler: () => {
                                conferenceManager.requestMemberMute(participant.uid, false, false)
                            },
                        })
                    } else if (!participant._isAudience && !participant._isVideoMuted) {
                        items.push({
                            title: '关闭摄像头',
                            handler: () => {
                                conferenceManager.requestMemberMute(participant.uid, false, true)
                            },
                        })
                    }
                }
                if (participant.uid !== selfUid) {
                    items.push({
                        title: ' 移除成员',
                        handler: () => {
                            this.kickoff(participant);
                        },
                    })
                }
                if (conferenceManager.conferenceInfo.focus === participant.uid) {
                    items.push({
                        title: '取消焦点用户',
                        handler: () => {
                            conferenceManager.requestCancelFocus();
                        },
                    })
                } else {
                    items.push({
                        title: '设置为焦点用户',
                        handler: () => {
                            conferenceManager.requestFocus(participant.uid)
                        },
                    })
                }
            }
            this.contextMenuItems.length = 0;
            this.contextMenuItems.push(...items)
        },

        showContextMenu(event, participant) {
            if (this.isContextMenuShow) {
                this.$refs.menu.close();
                this.isContextMenuShow = false;
                this.currentParticipant = {};
                return;
            }

            this.buildParticipantContextMenu(participant)

            this.contextMenuX = event.touches[0].clientX;
            this.contextMenuY = event.touches[0].clientY;

            this.isContextMenuShow = true;
            this.currentParticipant = participant;

        },
        showUserCard(p) {
            // TODO
        },

        onContextMenuItemSelect(item) {
            console.log('onContextMenuItemSelect', item)
            item.handler && item.handler();
        },

        showAlertDialog(options) {
            this.alertDialogOptions = {
                cancelText: options.cancelText,
                confirmText: options.confirmText,
                title: options.title,
                content: options.content,
                onConfirm: () => {
                    options.onConfirm && options.onConfirm();
                },
                onClose: () => {
                    options.onClose && options.onClose();
                    this.alertDialogOptions = {};
                }
            }
            this.$refs.alertDialog.open()
        },
    }
}
</script>

<style scoped>
.participant-list-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    background-color: #ffffffe5;
    backdrop-filter: blur(6px);
    border-left: 1px solid #e6e6e6;
}

.participant-list-container .action-item {
    height: 50px;
    display: flex;
    padding: 5px 0 0 10px;
    align-items: center;
}

.participant-list-container .action-item .icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: 1px dashed #d6d6d6;
    margin-right: 10px;
}

.participant-user {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0 5px 10px;
}

.participant-user.active {
    background: #d6d6d6;
}

.participant-user .name-desc {
    flex: 1;
}

.participant-user .name-desc .desc {
    font-size: 13px;
}

.audio-video {
    color: black;
    padding: 0 10px;
}

.audio-video i {
    padding: 5px;
}

.participant-user .avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    margin-right: 10px;
}

.avatar-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-container .icon {
    width: 40px;
    height: 40px;
    display: none;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: 1px dashed #d6d6d6;
    margin-right: 10px;
}

.avatar-container:hover .icon {
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    color: white;
    background: #e0d6d6d6;
}

</style>
