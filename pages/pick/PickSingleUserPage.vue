<template>
    <div class="pick-contact-container">
        <section class="contact-list-container" v-if="users">
            <div class="input-container">
                <input type="text" :placeholder="$t('common.search')" v-model="filterQuery">
                <i class="icon-ion-ios-search"></i>
            </div>
            <div class="friend-list-container">
                <UserListView :enable-pick="true"
                              :users="filterUsers"
                              :click-user-item-func="onClickUser"
                              :show-category-label="showCategoryLabel && !filterQuery"
                              :padding-left="'20px'"
                              enable-category-label-sticky/>
            </div>
        </section>
    </div>
</template>

<script>
import store from "@/store";
import UserListView from "../user/UserListView.vue";

export default {
    name: "PickSingleUserPage",
    props: {

    },
    data() {
        return {
            sharedPickState: store.state.pick,
            filterQuery: '',
            scrollLeft: 0,
            users: [],
            showCategoryLabel: true,
        }
    },

    onLoad(option) {
        console.log('PickSingleUserPage onLoad')
        // #ifdef APP-NVUE
        const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
        // #endif
        // #ifndef APP-NVUE
        const eventChannel = this.getOpenerEventChannel();
        // #endif
        // 监听openerUsers事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('pickOptions', (options) => {
            console.log('pickOptions', options)
            this.users = options.users;
            this.showCategoryLabel = options.showCategoryLabel;
            this.confirmTitle = options.confirmTitle;
        })
    },

    methods: {

        onClickUser(user) {
            console.log('onClick user', user)
            // #ifdef APP-NVUE
            const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
            // #endif
            // #ifndef APP-NVUE
            const eventChannel = this.getOpenerEventChannel();
            // #endif
            eventChannel.emit('pickedUser', user);
            uni.navigateBack();
        },
    },

    computed: {
        filterUsers() {
            console.log('filterUsers', this.filterQuery)
            if (this.filterQuery) {
                return store.filterUsers(this.users, this.filterQuery);
            } else {
                return this.users;
            }
        }
    },

    components: {UserListView},
}
</script>

<style lang="css" scoped>
.pick-contact-container {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.contact-list-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #f7f7f7;
    overflow: auto;
}

.contact-list-container .input-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
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

</style>
