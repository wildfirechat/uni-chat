<template>
    <div>
        <button @click="setUserEnableReceipt">setUserEnableReceipt</button>
    </div>

</template>

<script>
import wfc from "../../wfc/client/wfc";

export default {
    name: "ApiTestPage",

    methods:{
        setUserEnableReceipt(){
            wfc.setUserEnableReceipt(true, () => {
                console.log('setUserEnableReceipt success')
            }, (err) => {
                console.log('setUserEnableReceipt fail', err)
            })
        }
    }
}
</script>

<style scoped>

</style>