<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>App用户</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>医生用户</el-breadcrumb-item> -->
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="30">
        <el-col :span="9">
          <el-input
            placeholder="请输入用户名搜索"
            v-model="queryInfo.query_data"
            clearable
            @clear="getlist"
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button @click="mySearch">
              <el-icon><Search /></el-icon>
            </el-button>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="addUser"
            icon="el-icon-circle-plus-outline"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <br />
      <el-table :data="usersList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>

        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="tel" label="电话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="petname" label="宠物名字"></el-table-column>

        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="edit_user(scope.row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" @click="delete_user(scope.row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page_num"
        :page-sizes="[5, 8, 10, 15]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑修改的对话框 -->
    <el-dialog
      title="修改用户信息"
      v-model="editDialogVisible"
      width="30%"
      @close="editDialogClose"
    >
      <el-form
        :model="edit_form"
        ref="edit_formRef"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="edit_form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="edit_form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edit_form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="edit_form.tel"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="edit_form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure_edit(edit_form)"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      v-model="AddDialogVisible"
      width="40%"
      @close="AddDialogClose"
    >
      <el-form
        :model="add_form"
        ref="Add_formRef"
        :rules="addRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="add_form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="add_form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="add_form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="add_form.tel"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="add_form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure_add(add_form)"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  nextTick,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Action } from "element-plus";
import axios from "axios";
const checkEmail = (rule, value, callback) => {
  //验证邮箱的正则表达式
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
  if (regEmail.test(value)) {
    return callback();
  }
  callback(new Error("邮箱格式错误！!!!!"));
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
const checkusername = (rule, value, callback) => {
  if (value.length >= 3) {
    return callback();
  }
  callback(new Error("用户的长度必须大于等于3位数，请重新输入！"));
};
const pasd = (rule, value, callback) => {
  if (value.length >= 3) {
    return callback();
  }
  callback(new Error("密码长度必须大于3位数，请重新输入！"));
};
const checksex = (rule, value, callback) => {
  console.log(value);

  if (value == "男" || value == "女") {
    return callback();
  } else {
    callback(new Error("请重新正确的性别，男或女！"));
  }
};
const checkrole = (rule, value, callback) => {
  console.log(value);

  if (value == "普通用户") {
    return callback();
  } else {
    callback(new Error("角色身份只能输入为：普通用户！"));
  }
};
// 修改用户信息的验证规则
const editFormRules = {
  username: [
    {
      message: "请输入用户名",
      trigger: "blur",
    },
    {
      validator: checkusername,
      trigger: "blur",
    },
  ],
  password: [
    {
      message: "请输入密码",
      trigger: "blur",
    },
    {
      validator: pasd,
      trigger: "blur",
    },
  ],
  sex: [
    {
      message: "请输入性别",
      trigger: "blur",
    },
    {
      validator: checksex,
      trigger: "blur",
    },
  ],
  email: [
    {
      // required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      validator: checkEmail,
      trigger: "blur",
    },
  ],
  tel: [
    {
      // required: true,
      message: "请输入电话",
      trigger: "blur",
    },
    {
      validator: checkTel,
      trigger: "blur",
    },
  ],
};
const addRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      validator: checkusername,
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      validator: pasd,
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  tel: [
    { required: true, message: "请输入电话", trigger: "blur" },
    {
      validator: checkTel,
      trigger: "blur",
    },
  ],
  address: [{ required: true, message: "请输入地址", trigger: "blur" }],
  role: [
    { required: true, message: "请输入身份角色", trigger: "blur" },
    {
      validator: checkrole,
      trigger: "blur",
    },
  ],
};
// const usersList = ref([]);
const data = reactive({
  radio: "1",
  // 分页的请求参数
  queryInfo: {
    query_data: "", //查询的参数
    page_num: 1, //当前的页码
    page_size: 5, //每页显示的条数
  },
  total: 0,
  // 修改对话框
  editDialogVisible: false,
  edit_form: {},
  usersList: [],
  add_form: {
    username: "",
    password: "",
    address: "",
    email: "",
    tel: "",
    // role: "",
    // petname:''
  },
});
const {
  radio,
  queryInfo,
  total,
  editDialogVisible,
  edit_form,
  add_form,
  usersList,
} = toRefs(data);
const { proxy } = getCurrentInstance();
const Add_formRef = ref(null);
const edit_formRef = ref(null);
import LocalCache from "@/utils/cache";
// 添加用户的对话框
const AddDialogVisible = ref(false);
const getlist = async () => {
  // 获取数据接口的用户列表,参数为需要显示多少条
  // http://localhost:3000/api/app_users/getlist?page_num=1&page_size=2
  let { data: res } = await axios.post(
    "http://localhost:3000/appUserController",
    queryInfo.value
  );
  console.log(res.data);
  total.value = res.paging.total;
  window.sessionStorage.setItem("appUser_total", total.value);

  usersList.value = res.data;
};
const edit_user = (data) => {
  editDialogVisible.value = true;
  nextTick(() => {
    console.log(data, "datadata");
    edit_form.value = JSON.parse(JSON.stringify(data));
  });
};
const delete_user = async (data) => {
  ElMessageBox.confirm("确认要删除该用户吗?", "提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确 认",
    cancelButtonText: "取 消",
  })
    .then(() => {
      // 删除内容
      axios
        .post("http://localhost:3000/appUserController/delete", {
          userId: data.userId,
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
const addUser = () => {
  AddDialogVisible.value = true;
};
// 监听pagesize  每页显示的条数的改变
const handleSizeChange = (newSizes: any) => {
  //给原来变量重新赋值
  queryInfo.value.page_size = newSizes;
  //每改变一次重新请求获取新的数据渲染
  getlist();
};
// 监听当前页码值的改变
const handleCurrentChange = (newPages: any) => {
  queryInfo.value.page_num = newPages;
  getlist();
};
const editDialogClose = () => {
  edit_formRef.value.resetFields();
};
const sure_edit = async (edit_form) => {
  // 预校验表单修改的内容
  edit_formRef.value.validate(async (vaild) => {
    // // 如果为真则可以发起请求 修改用户
    if (!vaild) {
      return;
    } else {
      console.log(edit_form, "editFormeditForm");
      axios
        .post("http://localhost:3000/appUserController/edit", edit_form)
        .then((res) => {
          getlist();
          editDialogVisible.value = false;
        });
    }
  });
};
const AddDialogClose = () => {
  // AddDialogVisible.value = false;
  Add_formRef.value.resetFields();
};

const sure_add = async (add_form) => {
  // 预校验表单
  Add_formRef.value.validate(async (vaild) => {
    if (!vaild) {
      return;
    } else {
      axios
        .post("http://localhost:3000/appUserController/add", add_form)
        .then(() => {
          getlist();
          AddDialogVisible.value = false;
          ElMessage({
            type: "info",
            message: "添加成功",
          });
        });
    }
  });
};
const mySearch = ()=>{
  queryInfo.value.page_num = 1
  getlist()
}
onMounted(() => {
  getlist();
});
</script>

<style></style>
