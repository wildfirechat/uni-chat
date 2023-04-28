<template>
    <div>
        <button @click="setUserEnableReceipt">setUserEnableReceipt</button>
        <button @click="modifyMyInfo">modifyMyInfo</button>
        <button @click="systemInfo">SystemInfo</button>
        <button @click="setHiddenGroupMemberName">setHiddenGroupMemberName</button>
        <button @click="openTestPage">打开 webview</button>
    </div>

</template>

<script>
import wfc from "../../wfc/client/wfc";
import ModifyMyInfoEntry from "../../wfc/model/modifyMyInfoEntry";
import ModifyMyInfoType from "../../wfc/model/modifyMyInfoType";
import wfcUIKit from "../../wfc/uikit/wfcUIKit";
import EventType from "../../wfc/client/wfcEvent";

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
        setHiddenGroupMemberName() {
            const groupId = 'tR16v6xx';
            const isHiddenGroupMemberName = wfc.isHiddenGroupMemberName(groupId);
            console.log('isHiddenGroupMemberName', isHiddenGroupMemberName)
            wfc.setHiddenGroupMemberName(groupId, !isHiddenGroupMemberName, () => {
                console.log('setHiddenGroupMemberName result', groupId, wfc.isHiddenGroupMemberName(groupId));
            }, (err) => {
                console.log('setHiddenGroupMemberName error', err);
            })
        },
        openTestPage() {
            //this.$openWebView('http://192.168.2.180:8081');
            uni.navigateTo({
                url: `/pages/voip/VoipPage`,
                fail: (e) => {
                    console.log(e)
                }
            });
        },
    }
}
</script>

<style scoped>

</style>