<template>
    <div>
        <button @click="setUserEnableReceipt">setUserEnableReceipt</button>
        <button @click="modifyMyInfo">modifyMyInfo</button>
        <button @click="systemInfo">SystemInfo</button>
    </div>

</template>

<script>
import wfc from "../../wfc/client/wfc";
import ModifyMyInfoEntry from "../../wfc/model/modifyMyInfoEntry";
import ModifyMyInfoType from "../../wfc/model/modifyMyInfoType";

export default {
    name: "ApiTestPage",

    methods:{
        setUserEnableReceipt(){
            wfc.setUserEnableReceipt(true, () => {
                console.log('setUserEnableReceipt success')
            }, (err) => {
                console.log('setUserEnableReceipt fail', err)
            })
        },
        modifyMyInfo(){
            let entry = new ModifyMyInfoEntry();
            entry.type = ModifyMyInfoType.Modify_Gender;
            entry.value = '1'
            wfc.modifyMyInfo([entry], ()=> {
                console.log('modifyMyInfo success');
            }, (err) => {
                console.log('modifyMyInfo error', err);
            })
        },
        systemInfo(){
            console.log('systemInfo', uni.getSystemInfoSync())
        }
    }
}
</script>

<style scoped>

</style>