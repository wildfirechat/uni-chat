<template>
    <div>
        <button @click="setUserEnableReceipt">setUserEnableReceipt</button>
        <button @click="modifyMyInfo">modifyMyInfo</button>
        <button @click="systemInfo">SystemInfo</button>
        <button @click="startConference(false)">发起视频互动会议</button>
        <button @click="startConference(true)">发起音频互动会议</button>
    </div>

</template>

<script>
import wfc from "../../wfc/client/wfc";
import ModifyMyInfoEntry from "../../wfc/model/modifyMyInfoEntry";
import ModifyMyInfoType from "../../wfc/model/modifyMyInfoType";
import wfcUIKit from "../../wfc/uikit/wfcUIKit";

export default {
    name: "ApiTestPage",

    methods: {
        setUserEnableReceipt() {
            wfc.setUserEnableReceipt(true, () => {
                console.log('setUserEnableReceipt success')
            }, (err) => {
                console.log('setUserEnableReceipt fail', err)
            })
        },
        modifyMyInfo() {
            let entry = new ModifyMyInfoEntry();
            entry.type = ModifyMyInfoType.Modify_Gender;
            entry.value = '1'
            wfc.modifyMyInfo([entry], () => {
                console.log('modifyMyInfo success');
            }, (err) => {
                console.log('modifyMyInfo error', err);
            })
        },
        systemInfo() {
            console.log('systemInfo', uni.getSystemInfoSync())
        },
        startConference(audioOnly) {
            if (wfcUIKit) {
                if (wfcUIKit.isSupportConference()) {
                    wfcUIKit.startConference('', audioOnly, '', wfc.getUserId(), '测试会议', 'uni-chat 发起的测试会议', false, false, false, '');
                } else {
                    uni.showToast({
                        title: '当前音视频插件不支持会议功能，请联系野火官方',
                        icon: 'none',
                    });
                }
            } else {
                uni.showToast({
                    title: '未导入野火IM音视频插件',
                    icon: 'none',
                });
            }
        },
    }
}
</script>

<style scoped>

</style>