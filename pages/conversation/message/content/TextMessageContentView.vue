<template>
    <div class="text-message-container"
         v-bind:class="{out:message.direction === 0}">
        <p class="text" v-html="this.textContent" ></p>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import {parser} from "@/emoji/emoji";

export default {
    name: "TextMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        }
    },
    data() {
        return {
            textSelected: false,
        }
    },
    mounted() {
    },

    methods: {
    },

    computed: {
        textContent() {
            try {
                let tmp = parser(this.message.messageContent.digest(this.message));
                // let tmp = this.message.messageContent.digest(this.message);
                // pls refer to https://stackoverflow.com/questions/4522124/replace-leading-spaces-with-nbsp-in-javascript
                tmp = tmp.replace(/^[ \t]+/gm, function (x) {
                    return new Array(x.length + 1).join('&nbsp;')
                })
                tmp = tmp.replace(/<script/gi, "&lt;script");
                tmp = tmp.replace(/<iframe/gi, "&lt;iframe");
                if (tmp.indexOf('<img') >= 0) {
                    tmp = tmp.replace(/<img/g, '<img style="max-width:400px;"')
                    return tmp;
                }
                return tmp;
            }catch (e) {
				return this.message.messageContent.digest(this.message);
            }
        }
    }
}
</script>

<style lang="css" scoped>
.text-message-container {
    margin: 0 10px;
    padding: 10px;
    background-color: white;
    position: relative;
    border-radius: 5px;
    display: flex;
    align-items: center;
}

.text-message-container p {
    user-select: text;
    white-space: pre-line;
}

.text-message-container.out {
    background-color: #98ea70;
}

.text-message-container .text {
    color: #050505;
    font-size: 16px;
    line-height: 25px;
    /*max-width: 600px;*/
    max-height: 1000px;
    word-break: break-word;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
}

/*style for v-html */
.text-message-container .text >>> img {
    max-width: 400px !important;
    display: inline-block;
}

.text-message-container .text >>> a{
    white-space: normal;
}

</style>
