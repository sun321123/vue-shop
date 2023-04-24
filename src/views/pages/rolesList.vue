<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="btn1">
            <el-button type="primary" @click="is_show()">
                新建用户
            </el-button>
        </div>
        <div>
            <el-table :data="rolesList" style="width: 100%">
                <el-table-column prop="id" label="编号" width="180" />
                <el-table-column prop="roleName" label="职位" width="180" />
                <el-table-column prop="roleDesc" label="职责" width="180" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" @click="editRow(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="deleteRow(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <!-- mg_state 状态 -->
            </el-table>
        </div>

        <!-- 新增窗口 -->
        <div>
            <el-dialog v-model="dialogFormVisible" title="新建用户">
                <el-form :model="formData" :rules="rules" ref="userForm">
                    <el-form-item label="职位" prop="roleName">
                        <el-input v-model="formData.roleName" placeholder="职位" />
                    </el-form-item>
                    <div class="roleDesc_style">
                        <el-form-item label="职责" prop="roleDesc">
                            <el-input v-model="formData.roleDesc" placeholder="职责" />
                        </el-form-item>
                    </div>


                </el-form>

                <div class="btn_form">
                    <el-row>
                        <el-button type="primary" @click="add_info(userForm)">确认</el-button>
                        <el-button @click="clear1">取消</el-button>
                    </el-row>

                </div>
            </el-dialog>

        </div>
         <!-- 编辑弹窗 -->
         <div>
            <el-dialog v-model="dialogFormEVisible" title="编辑角色">
                <el-form :model="formData2" :rules="rules2" ref="userForm2">

                    <el-form-item label="职位" prop="roleName">
                        <el-input v-model="formData2.roleName" placeholder="职位" />
                    </el-form-item>
                    <div class="roleDesc_style">
                    <el-form-item label="职责" prop="roleDesc">
                        <el-input v-model="formData2.roleDesc" placeholder="职责" />
                    </el-form-item>
                </div>
                </el-form>

                <div class="btn_form">
                    <el-row>

                        <el-button type="primary" @click="change_info(userForm2)">确认</el-button>
                        <el-button @click="clear2">取消</el-button>


                    </el-row>

                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { reactive, ref, toRefs } from 'vue';
import { getRolesApi, addRolesApi ,editRolesApi,rolesDeleteApi} from "@/util/request.js"
export default {
    name: 'role',
    setup() {

        const data = reactive({
            rolesList: [],
            dialogFormVisible: false,
            dialogFormEVisible:false,
            formData: {
                roleName: "",
                roleDesc: ""
            },
            formData2: {
                id:"",
                roleName: "",
                roleDesc: ""
            },
            

            rules: {
                roleName: [
                    { required: true, message: "此项为必填", trigger: "blur" }
                ],
                roleDesc: [
                    {
                        required: false,
                        trigger: "blur"
                    }
                ],
            },
            rules2: {
                roleName: [
                    { required: true, message: "此项为必填", trigger: "blur" }
                ],
                roleDesc: [
                    {
                        required: false,
                        trigger: "blur"
                    }
                ],
            }
        })
        const userForm = ref(null)
        const get_info = () => {
            getRolesApi().then(res => {
                data.rolesList = res.data
            })
        }
        const is_show = () => {
            data.dialogFormVisible = true
        }
        const add_info = (info) => {
            if (info.validate) {
                addRolesApi(data.formData).then(res => {
                    if (res.data) {
                        data.dialogFormVisible = false
                        data.formData = {
                            roleName: "",
                            roleDesc: ""
                        }
                        get_info()
                    }
                })
            }

        }
        const editRow = (row) => {
            data.dialogFormEVisible = true
            data.formData2.id = row.id
            data.formData2.roleName = row.roleName
            data.formData2.roleDesc = row.roleDesc

        }
        const userForm2 = ref(null)
        const change_info = (info) => {
            if (info.validate){
                editRolesApi( data.formData2).then(res => {
                    if(res.data){
                        data.dialogFormEVisible = false
                        get_info()


                    }
                })
            }
        }
        const deleteRow = async (row) => {
            let res =  await rolesDeleteApi(row)
            console.log(res)
            get_info()
                
            
        }
        const clear1 = function () {
            data.formData = {
                roleName: "",
                roleDesc: ""
            }
            data.dialogFormVisible = false
        }
        const clear2 = () => {
            data.dialogFormEVisible = false
        }
        get_info()
        return {
            ...toRefs(data),//如果data内容不是放在响应式ref或者reactive里面的，那么在原数据data修改时，DOM页面是不会变化的哦，所以updated生命周期也不会触发

            is_show,
            clear1,
            add_info,
            userForm,
            editRow,
            deleteRow,
            userForm2,
            change_info,
            clear2

        }
    }
}
</script>

<style>
.btn1 {
    margin-top: 10px;
}

.roleDesc_style {
    margin-left: 10px;
}
</style>