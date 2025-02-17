<template>
    <section class="organization-tree-container">
        <nav class="breadcrumb">
            <ul>
                <li v-for="org in currentOrganizationPathList" :key="org.id">
                    <a href="#" @click="loadAndShowOrganization(org)">{{ org.name }}</a>
                </li>
            </ul>
        </nav>
        <div class="member-list-container">
            <ul>
                <li v-for="(org, index) in subOrganizations" :key="org.id">
                    <div class="organization-item" @click="loadAndShowOrganization(org)">
                        <img :src="org.portrait ? org.portrait : defaultDepartmentPortraitUrl">
                        <p class="name">{{ org.name }}</p>
                    </div>
                </li>
                <li v-for="(employee, index) in employees" :key="employee.employeeId">
                    <div :ref="'ref-employee-' + employee.employeeId" class="organization-item"
                         @click="showUserInfo(employee)"
                    >
                        <img :src="employee.portrait ? employee.portrait : defaultEmployeePortraitUrl">
                        <p class="name">{{ employee.name }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import store from "../../store";
import Config from "../../config";
import organizationServerApi from "../../api/organizationServerApi";
import wfc from "../../wfc/client/wfc";

export default {
    name: "OrganizationTreeView",
    props: {},
    components: {
    },
    data() {
        return {
            sharedContactState: store.state.contact,
            subOrganizations: [],
            employees: [],
            currentOrganizationPathList: [],
            defaultDepartmentPortraitUrl: Config.DEFAULT_DEPARTMENT_PORTRAIT_URL,
            defaultEmployeePortraitUrl: Config.DEFAULT_PORTRAIT_URL,
        }
    },
    mounted() {
        this.loadAndShowOrganization(this.sharedContactState.currentOrganization);
        // uni.setNavigationBarTitle({
        //     title: this.sharedContactState.currentOrganization.name
        // });
    },
    methods: {
        loadAndShowOrganization(org) {
            organizationServerApi.getOrganizationEx(org.id)
                .then(res => {
                    this.subOrganizations = res.subOrganizations;
                    this.employees = res.employees;
                });
            organizationServerApi.getOrganizationPath(org.id)
                .then(orgs => {
                    this.currentOrganizationPathList = orgs.reverse();
                })
        },
        employeeToUserInfo(employee) {
            return organizationServerApi.employeeToUserInfo(employee);
        },
        showUserInfo(employee) {
            wfc.getUserInfoEx(employee.employeeId, false, userInfo => {
                store.setCurrentFriend(userInfo);
                uni.navigateTo({
                    url: '/pages/contact/UserDetailPage',
                    success: () => {
                        console.log('nav to UserDetailPage success');
                    },
                    fail: (err) => {
                        console.log('nav to UserDetailPage err', err);
                    }
                })
            }, err => {

            })
        },
    },

}
</script>

<style lang="css" scoped>

.organization-tree-container {
    display: flex;
    height: 100%;
    flex-direction: column;
}

.breadcrumb {
    padding: 10px 0 0 10px;
}

.breadcrumb ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
}

.breadcrumb a {
    text-decoration: none;
    font-size: 13px;
}

.breadcrumb li:not(:last-child)::after {
    display: inline-block;
    margin: 0 10px;
    color: #8f959f;
    content: ">";
}

.breadcrumb li:not(:last-child) a {
    color: #4168e0;
}

.breadcrumb li:last-child a {
    color: #8f959f;
    pointer-events: none;
}

.member-list-container {
    flex: 1;
    overflow-y: scroll;
}

.organization-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 56px;
    padding: 0 10px;
    font-size: 14px;
}

.organization-item:hover {
    background: #d6d6d6;
}

.organization-item img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    margin-right: 10px;
}

.organization-item .button {
    justify-self: flex-end;
    margin-left: auto;
    padding: 5px;
    font-size: 14px;
    color: #4168e0;
}

.organization-item .button:hover {
    background: #dbe1f0;
    border-radius: 5px;
}

</style>
