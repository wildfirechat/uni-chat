<template>
    <div>

        <div>
            <img/>
        </div>
        <p>删除消息</p>
        <p>删除此条消息？</p>
        <ul>
            <li>
                <div>删除本地消息</div>
            </li>
            <li>
                <div>删除远程消息</div>
            </li>
        </ul>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";

export default {
    name: "DeleteMessageDialogView",
    props: {
        title: {
            type: String,
            required: false,

        },
        message: {
            type: Message,
            required: true,
        }
    },

}
</script>

<style scoped>

</style>
