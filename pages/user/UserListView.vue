<template>
    <uni-list style="width: 100%">
        <view v-for="(groupedUser) in groupedUsers" :key="groupedUser.category">
            <div ref="contactItem" class="contact-item">
                <div v-if="showCategoryLabel" class="label"
                     :style="paddingStyle"
                     v-bind:class="{sticky:enableCategoryLabelSticky}">
                    <p>{{ groupedUser.category.toUpperCase() }}</p>
                </div>
                <uni-list style="width: 100%">
                    <view v-for="(user) in groupedUser.users" :key="user.uid">
                        <div class="content"
                             :name="'user-'+user.uid"
                             :style="paddingStyle"
                             v-bind:class="{active: (sharedContactState.currentFriend
                        && user._category === sharedContactState.currentFriend._category
                        && user.uid === sharedContactState.currentFriend.uid) || (currentUser && currentUser.uid === user.uid)}"
                             @click.stop="clickUserItem(user)">
                            <img class="avatar" :src="user.portrait" alt="" @error="imgUrlAlt">
                            <div style="padding-left: 10px">
                                <p class="single-line"> {{ user._displayName ? user._displayName : user.displayName }}</p>
                                <p v-if="user._userOnlineStatusDesc" class="single-line user-online-status"> {{ user._userOnlineStatusDesc }}</p>
                            </div>
                        </div>

                    </view>
                </uni-list>
            </div>
        </view>
    </uni-list>
</template>

<script>
import store from "../../store";
import Config from "../../config";
import UniList from "../../components/uni-list/uni-list.vue";

export default {
    name: "UserListView",
    props: {
        users: {
            type: Array,
            required: true,
        },
        currentUser: {
            type: Object,
            default: null,
        },
        showCategoryLabel: {
            type: Boolean,
            required: false,
            default: true,
        },
        enableCategoryLabelSticky: {
            type: Boolean,
            required: false,
            default: false,
        },
        clickUserItemFunc: {
            type: Function,
            required: false,
        },
        paddingLeft: {
            type: String,
            required: false,
            default: '5px'
        }
    },
    data() {
        return {
            sharedContactState: store.state.contact,
        }
    },
    methods: {
        clickUserItem(user) {
            if (this.clickUserItemFunc) {
                this.clickUserItemFunc(user);
            } else {
                store.setCurrentFriend(user)
                uni.navigateTo({
                    url: '/pages/contact/UserDetailPage',
                    success: () => {
                        console.log('nav to UserDetailPage success');

                    },
                    fail: (err) => {
                        console.log('nav to UserDetailPage err', err);
                    }
                });
            }
        },

        scrollActiveElementCenter() {
            let el = this.$el.getElementsByClassName("active")[0];
            el && el.scrollIntoView({behavior: "instant", block: "center"});
        },

        imgUrlAlt(e) {
            e.target.src = Config.DEFAULT_PORTRAIT_URL;
        }

    },

    mounted() {
        console.log('userList', this.users.length);
    },

    activated() {
        this.scrollActiveElementCenter();
    },

    unmounted() {
    },

    computed: {
        groupedUsers() {
            let groupedUsers = [];
            if (!this.showCategoryLabel) {
                groupedUsers.push({
                    category: 'not-show-category',
                    users: this.users,
                })
            } else {
                let current = {};
                let lastCategory = null;
                this.users.forEach((user) => {
                    if (!lastCategory || lastCategory !== user._category) {
                        lastCategory = user._category;
                        current = {
                            category: user._category,
                            users: [user],
                        };
                        groupedUsers.push(current);
                    } else {
                        current.users.push(user);
                    }
                });
            }
            return groupedUsers;
        },
        paddingStyle() {
            return {
                paddingLeft: this.paddingLeft
            }
        },
    },
    components: {
        UniList,
    },
}
</script>

<style lang="css" scoped>

.contact-item {
    --user-item-padding-left: 30px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

.checkbox {
    margin-right: 10px;
}

.contact-item {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    align-items: flex-start;
}

.contact-item .label {
    width: 100%;
    background-color: #fafafa;
}

.contact-item .label p {
    padding: 5px 5px 5px 0;
}

.contact-item .label.sticky {
    position: sticky;
    top: 0;
}

.contact-item .content {
    padding: 10px 5px 10px 0;
    display: flex;
    width: 100%;
    align-items: center;
    position: relative;
}

.contact-item .content::after {
    content: ""; /* 使伪元素可见 */
    position: absolute;
    left: 60px; /* 偏移量 */
    right: 0;
    bottom: 0;
    border-bottom: 1px solid #f4f4f4; /* 定义边框样式 */
}

.contact-item .content span {
    margin-left: 10px;
}

.contact-item .content.active {
    background-color: #d6d6d6;
}

.contact-item .content:active {
    background-color: #d6d6d6;
}

.user-online-status {
    color: gray;
    font-size: 10px;
}

/*.contact-item .content:hover {*/
/*  background-color: red;*/
/*}*/

</style>

