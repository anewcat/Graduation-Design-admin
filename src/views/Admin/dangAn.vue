<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>宠物档案中心</el-breadcrumb-item>
      <el-breadcrumb-item>宠物档案</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="text-align: center">
        <h2>宠物档案中心</h2>
      </div>
      <br />
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入宠物名字查找"
            v-model="queryInfo.query_data"
            clearable
            @clear="dangAn_Msg"
          >
          </el-input>
          <el-button @click="dangAn_Msg"><el-icon><Search /></el-icon></el-button>
        </el-col>
      </el-row>
      <br />
      <el-table :data="dangAn_List" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="petName" label="宠物名"></el-table-column>
        <el-table-column prop="petType" label="宠物品种"></el-table-column>
        <el-table-column prop="petImg" label="宠物图片">
          <template #default="scope">
            <img
              style="width: 100px; height: 100px"
              :src="scope.row.petImg"
              alt="这是图片"
            />
          </template>
        </el-table-column>
        <el-table-column prop="masterName" label="宠物主人"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="petCase" label="宠物病史"></el-table-column>
        <el-table-column prop="petInform" label="宠物信息"></el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page_num"
        :page-sizes="[3, 5, 7, 9]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
const data = reactive({
  dangAn_List: [],
  // 分页的请求参数
  queryInfo: {
    query_data: "", //查询的参数
    page_num: 1, //当前的页码
    page_size: 3, //每页显示的条数
  },
  total: 0,
  fits: "fill",
  url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
  editDialogVisible: false,
  edit_form: {},
});
const {
  dangAn_List,
  queryInfo,
  total,
  fits,
  url,
  editDialogVisible,
  edit_form,
} = toRefs(data);
const dangAn_Msg = async () => {
  let { data: res } = await axios.post("http://localhost:3000/dangAn", queryInfo.value);
  // console.log(res.data)
  total.value = res.paging.total;
  dangAn_List.value = res.data;
};
// 监听pagesize  每页显示的条数的改变
const handleSizeChange = (newSizes) => {
  //给原来变量重新赋值
  queryInfo.value.page_size = newSizes;
  //每改变一次重新请求获取新的数据渲染
  dangAn_Msg();
};
// 监听当前页码值的改变
const handleCurrentChange = (newPages) => {
  queryInfo.value.page_num = newPages;
  dangAn_Msg();
}

dangAn_Msg();
</script>

<style></style>
