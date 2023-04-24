<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>账号列表</el-breadcrumb-item>
        </el-breadcrumb>

        <div>
            <div class="flex">
                <div class="inputbuttom">
                    <el-input v-model="input1" placeholder="搜索" class="input-with-select" >
                        <template #append>
                            <el-button  @click="serach_info(input1)"> <el-icon>
                                    <Search />
                                </el-icon></el-button>
                        </template>
                    </el-input>
                </div>

                <el-button class="buttom1" type="primary" @click="addUser()">新建用户</el-button>
            </div>

            <el-table :data="userList" style="width: 100%">
                <el-table-column prop="username" label="姓名" width="180" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="mobile" label="电话" />
                <el-table-column prop="role_name" label="角色" />
                <el-table-column prop="mg_state" label="状态">
                    <template #default="scope">
                        <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" @click="editRow(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="deleteRow(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <!-- mg_state 状态 -->
            </el-table>
            <!-- 分页 -->

            <el-pagination background layout="prev, pager,sizes, next, jumper, ->, total"
                v-model:current-page=searchParams.pagenum :total=total v-model:page-size=searchParams.pagesize
                :page-sizes="[10, 20, 30, 40]" @size-change="searchList" @current-change="searchList" />
        </div>
        <!-- 新增弹窗 -->
        <div>
            <el-dialog v-model="dialogFormVisible" title="新建用户">
                <el-form :model="formData" :rules="rules" ref="userForm">
                    <el-form-item label="用户名称" prop="username">
                        <el-input v-model="formData.username" placeholder="用户名称" />
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password">
                        <el-input v-model="formData.password" placeholder="用户密码" type="password" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">

                        <el-input v-model="formData.email" placeholder="邮箱" class="email_style" />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="formData.mobile" placeholder="手机号码" />
                    </el-form-item>
                </el-form>

                <div class="btn_form">
                    <el-row>
                        <el-button type="primary" @click="submit(userForm)">确认</el-button>
                        <el-button @click="clear1">取消</el-button>
                    </el-row>

                </div>
            </el-dialog>
        </div>
        <!-- 编辑弹窗 -->
        <div>
            <el-dialog v-model="dialogFormEVisible" title="编辑用户">
                <el-form :model="formData2" :rules="rules2" ref="userForm2">

                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData2.email" placeholder="邮箱" />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="formData2.mobile" placeholder="手机号码" />
                    </el-form-item>
                </el-form>

                <div class="btn_form">
                    <el-row>

                        <el-button type="primary" @click="subremake(userForm2)">确认</el-button>
                        <el-button @click="clear2">取消</el-button>


                    </el-row>

                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { reactive, ref, toRefs } from "vue"
import { ArrowRight } from '@element-plus/icons-vue'
import { userListApi, userAddApi, userChangeStateApi, userChangeInfoApi, userDeleteApi } from "@/util/request.js"
export default {
    name: "user",
    setup() {
        const data = reactive({
            // values:"邮\u00a0\u00a0箱",
            searchParams: {
                query: "",
                pagesize: 5,
                pagenum: 1
            },
            input1: "",
            total: 0,
            new_userList : [],
            userList: [],
            dialogFormVisible: false,
            dialogFormEVisible: false,
            formData: {
                username: "",
                password: "",
                email: "",
                mobile: "",
            },
            formData2: {
                id: "",
                email: "",
                mobile: "",
            },
            rules: {
                username: [
                    { required: true, message: "此项为必填", trigger: "blur" }
                ],

                password: [
                    { required: true, message: "此项为必填", trigger: "blur" }
                ],
                email: [
                    {
                        required: false,
                        pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: "请填写正确邮箱", trigger: "blur"
                    }
                ],
                mobile: [
                    {
                        required: false,
                        pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                        message: "请填写正确手机号", trigger: "blur"
                    }
                ]
            },
            rules2: {

                email: [
                    {
                        required: false,
                        pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: "请填写正确邮箱", trigger: "blur"
                    }
                ],
                mobile: [
                    {
                        required: false,
                        pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                        message: "请填写正确手机号", trigger: "blur"
                    }
                ]
            }
        })
        const serach_info = (info) => {
            data.new_userList = []

            for (let x of data.userList) {
                if (info == x.username) {
                    data.new_userList.push(x)
                }
                
            }
            if(data.new_userList.length > 0){
                data.userList = data.new_userList
            }
            else{
                searchList()
            }
            

        }
        const searchList = () => {
            userListApi(data.searchParams).then(res => {
                if (res.data) {
                    // 
                    //console.log("用户数据", res)
                    data.userList = res.data.users
                    //console.log(data.userList)
                    data.total = res.data.total
                }
            })
        }
        const addUser = () => {
            data.dialogFormVisible = true
        }
        const userForm = ref(null)
        async function submit(info) {
            await info.validate((res) => {
                if (!res) {
                    return new Promise(() => { })
                }
                else {
                    userAddApi(data.formData).then(res => {
                        //关闭窗口
                        if (res.data) {
                            console.log(res)
                            data.dialogFormVisible = false
                            //清空数据
                            data.formData = {
                                username: "",
                                password: "",
                                email: "",
                                mobile: "",
                            }
                            //刷新获取的数据
                            searchList()
                        }

                    })
                }
            })
        }
        const userForm2 = ref(null)
        async function editRow(row) {
            if (row) {
                data.dialogFormEVisible = true
                data.formData2.id = row.id
                data.formData2.email = row.email
                data.formData2.mobile = row.mobile
            }



        }
        async function subremake(info) {

            await info.validate(res => {
                if (!res) {
                    return new Promise(() => { })
                }
                else {
                    userChangeInfoApi(data.formData2).then(res => {
                        if (res.data) {
                            data.dialogFormEVisible = false
                            searchList()
                        }
                    })
                }
            })
        }
        const switchChange = async function (row) {
            // console.log(row)
            await userChangeStateApi(row).then(res => {
                if (res.data) {
                    data.userList.mg_state = res.data.mg_state
                    //console.log(data.userList.mg_state)
                    searchList()
                }
            })
        }

        const deleteRow = async function (info) {
            if (info.id) {

                await userDeleteApi(info).then(res => {
                    searchList()
                    console.log(res)
                })
            }

        }
        const clear1 = function () {
            data.formData = {
                username: "",
                password: "",
                email: "",
                mobile: "",
            }
            data.dialogFormVisible = false
        }
        const clear2 = function () {
            
            data.dialogFormEVisible = false
        }

        searchList()

        return {
            ...toRefs(data),
            searchList,
            addUser,
            submit,
            userForm,
            switchChange,
            editRow,
            userForm2,
            subremake,
            clear1,
            clear2,
            deleteRow,
            serach_info
        }
    }
}

</script>

<style scoped>
.inputbuttom {
    margin-top: 20px;
    margin-right: 30px;
    width: 200px;
}

.buttom1 {
    margin-top: 20px;
}

.email_style {
    margin-left: 28px;
}

/* .pagination_style{
    width: 100%;
} */
</style>
