<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>常见的治疗方法</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="text-align: center"><h1>常见的病情及治疗方法</h1></div>

      <br />
      <el-table :data="List" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="title_ming" label="发病名"></el-table-column>
        <el-table-column prop="reason" label="病因"></el-table-column>
        <el-table-column prop="sysbol" label="症状"></el-table-column>
        <el-table-column prop="fangfa" label="治疗方法"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              type="primary"
              @click="edit_it(scope.row)"
            >
            <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              type="danger"
              @click="delete_it(scope.row)"
            >
            <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <div style="text-align: center">
        <el-button
          type="primary"
          @click="addit"
          icon="el-icon-circle-plus-outline"
          >添加</el-button
        >
      </div>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page_num"
        :page-sizes="[2, 6, 8, 10]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑修改的对话框 -->
    <el-dialog
      title="修改信息"
      v-model="editDialogVisible"
      width="70%"
      @close="editDialogClose"
    >
      <el-form
        :model="edit_form"
        ref="edit_formRef"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="发病名">
          <el-input v-model="edit_form.title_ming"></el-input>
        </el-form-item>
        <el-form-item label="病因">
          <el-input v-model="edit_form.reason"></el-input>
        </el-form-item>
        <el-form-item label="症状">
          <el-input v-model="edit_form.sysbol"></el-input>
        </el-form-item>
        <el-form-item label="治疗方法">
          <el-input v-model="edit_form.fangfa"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure_edit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加的信息"
      v-model="AddDialogVisible"
      width="70%"
      @close="AddDialogClose"
    >
      <el-form :model="add_form" ref="Add_formRef" label-width="70px">
        <el-form-item label="发病名">
          <el-input v-model="add_form.title_ming"></el-input>
        </el-form-item>
        <el-form-item label="病因">
          <el-input v-model="add_form.reason"></el-input>
        </el-form-item>
        <el-form-item label="症状">
          <el-input v-model="add_form.sysbol"></el-input>
        </el-form-item>
        <el-form-item label="治疗方法">
          <el-input v-model="add_form.fangfa"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure_add">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref,reactive,toRefs } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Action } from "element-plus";
const checkEmail = (rule, value, callback) => {
  //验证邮箱的正则表达式
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
  if (regEmail.test(value)) {
    return callback();
  }
  callback(new Error("邮箱格式错误！"));
};

const checkTel = (rule, value, callback) => {
  //验证电话的正则表达式
  const regMobile =
    /^(0|86| 17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[571])[0-9]{8}$/;

  if (regMobile.test(value)) {
    return callback();
  }
  callback(new Error("电话格式错误，请重新输入！"));
};
const List = ref([]);
const queryInfo = ref({
  query_data: "", //查询的参数
  page_num: 1, //当前的页码
  page_size: 2, //每页显示的条数
});
const total = ref(0);
const editDialogVisible = ref(false);
const data = reactive({
  edit_form:{}
})
const {edit_form} = toRefs(data)
const edit_formRef = ref(null);
const Add_formRef = ref(null);
// 修改用户信息的验证规则
const editFormRules = ref({
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      validator: checkEmail,
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入电话",
      trigger: "blur",
    },
    {
      validator: checkTel,
      trigger: "blur",
    },
  ],
});
// 添加的对话框
const AddDialogVisible = ref(false);
const add_form = ref({
  title_ming: "",
  reason: "",
  sysbol: "",
  fangfa: "",
});

const getlist = async () => {
  let { data: res } = await axios.post("http://localhost:3000/hosMsg2",queryInfo.value);
  console.log(res.data);
  total.value = res.paging.total;
  List.value = res.data;
};
const edit_it = (data) => {
  editDialogVisible.value = true;
  nextTick(()=>{
    edit_form.value = JSON.parse(JSON.stringify(data))
  })
};
const delete_it = async (data) => {
  ElMessageBox.confirm("确认要删除该条数据吗?", "提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确 认",
    cancelButtonText: "取 消",
  })
    .then(() => {
      // 删除内容
      axios
        .post("http://localhost:3000/hosMsg2/delete", {
          id: data.id,
        })
        .then(() => {
          getlist();
          ElMessage({
            type: "info",
            message: "删除成功",
          });
        });
    })
    .catch((action: Action) => {
      // 取消删除
    });
};
const addit = () => {
  AddDialogVisible.value = true;
};
// 监听pagesize  每页显示的条数的改变
const handleSizeChange = (newSizes) => {
  //给原来变量重新赋值
  queryInfo.value.page_size = newSizes;
  //每改变一次重新请求获取新的数据渲染
  getlist();
};
// 监听当前页码值的改变
const handleCurrentChange = (newPages) => {
  queryInfo.value.page_num = newPages;
  getlist();
};
const editDialogClose = () => {
  edit_formRef.value.resetFields();
};
const sure_edit = () => {
  // 预校验表单修改的内容
  edit_formRef.value.validate(async (vaild) => {
    // // 如果为真则可以发起请求 修改用户
    if (!vaild) {
      return;
    } else {
      const { data: res } = await axios.post(
        "http://localhost:3000/hosMsg2/edit",
        edit_form.value
      );
      // console.log(res)
      if (res.code !== 200) {
        ElMessage({
          type: "info",
          message: "修改失败",
        });
      } else {
        // 关闭添加用户对话框
        editDialogVisible.value = false;
        // 重新渲染显示界面列表
        getlist();
        ElMessage({
          type: "info",
          message: "修改成功！",
        });
      }
    }
  });
};
const AddDialogClose = () => {
  AddDialogVisible.value = false;
  add_form.value = {
  title_ming: "",
  reason: "",
  sysbol: "",
  fangfa: "",
}
};
const sure_add = async () => {
    Add_formRef.value.validate(async(valid)=>{
        if(!valid){
            return;
        }else{
            const { data: res } = await axios.post(
        "http://localhost:3000/hosMsg2/add",
        add_form.value
      );
      // console.log(res)
      if (res.code !== 200) {
        ElMessage({
          type: "info",
          message: "添加失败",
        });
      } else {
        // 关闭添加用户对话框
        AddDialogVisible.value = false;
        // 重新渲染显示界面列表
        getlist();
        ElMessage({
          type: "info",
          message: "添加成功！",
        });
      }
        }
    })

};

getlist();
</script>

<style></style>
