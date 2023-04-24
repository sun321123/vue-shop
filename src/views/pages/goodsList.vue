<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="inputbuttom">
            <el-input v-model="params.query" placeholder="搜索" class="input-with-select">
                <template #append>
                    <el-button @click="get_info"> <el-icon>
                            <Search />
                        </el-icon></el-button>
                </template>
            </el-input>
        </div>

        <div>
            <!-- 展示商品 -->
            <el-table :data="goodlist" style="width: 100%">
                <el-table-column prop="goods_name" label="商品描述" width="180" />
                <el-table-column prop="goods_number" label="商品数量" width="180" />
                <el-table-column prop="goods_price" label="商品价格(人民币)" />
                <el-table-column prop="goods_weight" label="商品重量(KG)" />
                <el-table-column prop="goods_state" label="商品状态">
                    <template #default="scope">
                        <p>{{ switch_info(scope.row.goods_state) }}</p>
                    </template>
                </el-table-column>


            </el-table>
        </div>

        <div>
            <!-- 分页 -->
            <el-pagination background layout="prev, pager,sizes, next, jumper, ->, total"
                v-model:current-page=params.pagenum :total=total v-model:page-size=params.pagesize
                :page-sizes="[5, 10, 20, 30, 40]" @size-change="get_info" @current-change="get_info" />
        </div>

    </div>
</template>


<script>
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive, toRefs } from 'vue';
import { goodsListApi } from "@/util/request.js"
export default {
    setup() {
        const data = reactive({
            params: {
                query: "",
                pagenum: 10,
                pagesize: 5
            },
            goodlist: [],
            total: 0,
            input1:"",
            new_goodlist:[]

        })

        async function get_info() {
            let res = await goodsListApi(data.params)
            if (res.data) {

                data.goodlist = res.data.goods
                data.total = res.data.total
            }
        }
        const switch_info = (row) => {
            switch (row) {
                case 0:
                    return "未通过";
                    break;
                case 1:
                    return "审核中";
                    break;
                case 2:
                    return "已审核";
                    break;
                default:
                    return "状态错误"
                    break;
            }

        }
        const serach_info = (info) => {
            data.new_goodlist = []

            for (let x of data.goodlist) {
                if (info == x.goods_name) {
                    data.new_goodlist.push(x)
                }
                
            }
            if(data.new_goodlist.length > 0){
                data.goodlist = data.new_goodlist
            }
            else{
                get_info()
            }
            

        }
        get_info()
        return {
            ...toRefs(data),
            get_info,
            switch_info,
            serach_info


        }
    }


}
</script>

<style>

.inputbuttom {
    margin-top: 20px;
    margin-right: 30px;
    width: 200px;
}
</style>