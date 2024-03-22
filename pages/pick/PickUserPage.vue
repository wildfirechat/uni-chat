<template>
    <div class="pick-contact-container">
        <section class="contact-list-container" v-if="users">
            <div class="input-container">
                <input type="text" :placeholder="$t('common.search')" v-model="filterQuery">
                <i class="icon-ion-ios-search"></i>
            </div>
            <div class="friend-list-container">
                <CheckableUserListView :enable-pick="true"
                                       :users="filterUsers"
                                       :initial-checked-users="initialCheckedUsers"
                                       :uncheckable-users="uncheckableUsers"
                                       :show-category-label="showCategoryLabel && !filterQuery"
                                       :padding-left="'20px'"
                                       enable-category-label-sticky/>
            </div>
        </section>
        <section class="checked-contact-list-container">
            <header>
                <span v-if="checkedUsers.length === 0">{{ $t('pick.picked_contact') }}</span>
                <span v-else>{{ $t('pick.picked_contact') + this.checkedUsers.length }}</span>
                <button size="mini" v-bind:class="{disabled: checkedUsers.length === 0}" :disabled="checkedUsers.length === 0" @click="confirm"> {{ confirmTitle }}</button>
            </header>
            <div class="content" ref="pickedUserContainer">
                <div class="picked-user" v-for="(user, index) in checkedUsers" :key="index" @click="unpick(user)">
                    <div class="avatar-container">
                        <img class="avatar" :src="user.portrait" alt="">
                    </div>
                    <span class="name single-line">{{ user.displayName }}</span>
                </div>
            </div>
            <!--            <footer>-->
            <!--                <button @click="cancel" class="cancel">{{ $t('common.cancel') }}</button>-->
            <!--                <button @click="confirm" class="confirm" v-bind:class="{disable:checkedUsers.length === 0}">-->
            <!--                    {{ confirmTitle }}-->
            <!--                </button>-->
            <!--            </footer>-->
        </section>
    </div>
</template>

<script>
import store from "@/store";
import CheckableUserListView from "@/pages/user/CheckableUserListView";

export default {
    name: "PickUserPage",
    props: {},
    data() {
        return {
            users: null,
            initialCheckedUsers: null,
            uncheckableUsers: null,
            title: null,
            confirmTitle: null,
            showCategoryLabel: null,
            sharedPickState: store.state.pick,
            filterQuery: '',
            scrollLeft: 0,
        }
    },

    onLoad(option) {
        console.log('PickUserPage onLoad')
        // #ifdef APP-NVUE
        const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
        // #endif
        // #ifndef APP-NVUE
        const eventChannel = this.getOpenerEventChannel();
        // #endif
        // 监听openerUsers事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('pickOptions', (options) => {
            this.users = options.users;
            this.initialCheckedUsers = options.initialCheckedUsers;
            this.uncheckableUsers = options.uncheckableUsers;
            this.showCategoryLabel = options.showCategoryLabel;
            this.confirmTitle = options.confirmTitle;
        })
    },

    onUnload() {
        this.sharedPickState.users.length = 0
    },

    methods: {
        unpick(user) {
            if (this.isUserUncheckable(user)) {
                return;
            }
            store.pickOrUnpickUser(user);
        },

        isUserUncheckable(user) {
            return this.uncheckableUsers && this.uncheckableUsers.findIndex(u => u.uid === user.uid) >= 0;
        },

        /**
         * 不包含默认选中的用户
         */
        confirm() {
            let pickedUsers = this.sharedPickState.users;
            if (this.initialCheckedUsers) {
                pickedUsers = this.sharedPickState.users.filter(u => this.initialCheckedUsers.findIndex(iu => iu.uid === u.uid) === -1);
            } else {
                pickedUsers = this.sharedPickState.users;
            }
            let users = [...pickedUsers];
            this.sharedPickState.users.length = 0

            // #ifdef APP-NVUE
            const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
            // #endif
            // #ifndef APP-NVUE
            const eventChannel = this.getOpenerEventChannel();
            // #endif
            eventChannel.emit('pickedUsers', users);

            uni.navigateBack();
        },
    },

    computed: {
        checkedUsers() {
            let users = this.sharedPickState.users;
            if (!this.initialCheckedUsers || this.initialCheckedUsers.length === 0) {
                return users;
            }
            return users.filter(u => {
                return this.initialCheckedUsers.findIndex(iu => iu.uid === u.uid) === -1
            })
        },
        filterUsers() {
            console.log('filterUsers', this.filterQuery)
            if (this.filterQuery) {
                return store.filterUsers(this.users, this.filterQuery);
            } else {
                return this.users;
            }
        }
    },

    watch: {
        checkedUsers() {
            // uniapp 里面无效，不知道为啥
            this.$nextTick(() => {
                this.$refs.pickedUserContainer.scrollLeft = this.$refs.pickedUserContainer.scrollWidth;
                this.scrollLeft = this.$refs.pickedUserContainer.scrollWidth;
            });
        }
    },

    components: {CheckableUserListView},
}
</script>

<style lang="css" scoped>
.pick-contact-container {
    display: flex;
    flex-direction: column;
    position: relative;
    height: var(--page-full-height-without-header);
    width: 100%;
    overflow: hidden;
}

.contact-list-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #f7f7f7;
    margin-bottom: 150px;
    overflow: auto;
}

.contact-list-container .input-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding-top: 10px;
}

.input-container input {
    height: 35px;
    flex: 1;
    border-radius: 3px;
    border: 1px solid #ededed;
    background-color: white;
    margin: 0 15px;
    padding-left: 20px;
    text-align: left;
    outline: none;
}

/*.input-container input:active {*/
/*    border: 1px solid #4168e0;*/
/*}*/

/*.input-container input:focus {*/
/*    border: 1px solid #4168e0;*/
/*}*/

.input-container i {
    position: absolute;
    left: 20px;
}

.contact-list-container .friend-list-container {
    height: 100%;
    overflow: auto;
}

.checked-contact-list-container {
    height: 150px;
    width: 100%;
    display: flex;
    background: white;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    left: 0;
}

.checked-contact-list-container header {
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.checked-contact-list-container header span {
    font-size: 14px;
    margin-left: 20px;
}

.checked-contact-list-container header button {
    border-style: none;
    margin-right: 20px;
    color: #4168e0;
}

.checked-contact-list-container .content {
    height: 100%;
    flex: 1;
    display: flex;
    padding: 0 10px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    overflow: scroll;
}

.checked-contact-list-container .content .picked-user {
    display: flex;
    flex-direction: column;
    column-count: 1;
    justify-content: center;
    align-items: center;
    padding: 5px 5px;
}

.checked-contact-list-container .content .picked-user .name {
    font-size: 12px;
}

.checked-contact-list-container .content .picked-user .avatar-container {
    position: relative;
    height: 65px;
    width: 65px;
}

.checked-contact-list-container .content .avatar {
    width: 45px;
    height: 45px;
    margin: 10px 10px;
    border-radius: 3px;
}

.disabled {
    color: lightgrey !important;
}

</style>
