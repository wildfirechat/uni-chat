<template>
    <uni-list>
        <GroupListView/>
    </uni-list>
</template>
<script>
import store from "../../store";
import UniList from "../../components/uni-list/uni-list.vue";
import GroupListView from "./GroupListView.vue";

export default {
    name: "ContactListPage",
    components: {GroupListView, UniList},
    data() {
        return {
            sharedContactState: store.state.contact,
        }
    },


    onNavigationBarButtonTap(e) {
        console.log('onNavigationBarButtonTap')
        switch (e.index) {
            case 0:
                break;
            case 1:
                uni.navigateTo({
                    url: '/pages/search/SearchPortalPage'
                });
                break;
            default:
                break;
        }
    },
    methods: {}
}
</script>

<style lang="css" scoped>

</style>
