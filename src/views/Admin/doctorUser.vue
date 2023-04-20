<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>医生用户</el-breadcrumb-item>
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
              >添加医生</el-button
            >
          </el-col>
        </el-row>
  
        <br />
        <el-table :data="usersList" border>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="docName" label="医生姓名"></el-table-column>
          <el-table-column prop="docPass" label="登录密码"></el-table-column>
          <el-table-column prop="docSex" label="性别"></el-table-column>
          <el-table-column prop="docAge" label="年龄"></el-table-column>
          <el-table-column prop="docInform" label="基本信息"></el-table-column>
          <el-table-column prop="docEmail" label="邮箱"></el-table-column>
          <el-table-column prop="docTel" label="电话"></el-table-column>
          <el-table-column prop="docImg" label="照片"></el-table-column>
  
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
        title="修改医生信息"
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
          <el-form-item label="医生姓名" prop="docName">
            <el-input v-model="edit_form.docName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="docPass">
            <el-input v-model="edit_form.docPass"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="docSex">
            <el-input v-model="edit_form.docSex"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="docAge">
            <el-input v-model="edit_form.docAge"></el-input>
          </el-form-item>
          <el-form-item label="具体信息" prop="docInform">
            <el-input v-model="edit_form.docInform"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="docEmail">
            <el-input v-model="edit_form.docEmail"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="docTel">
            <el-input v-model="edit_form.docTel"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-input v-model="edit_form.docImg"></el-input>
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
          <el-form-item label="医生姓名" prop="docName">
            <el-input v-model="add_form.docName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="docPass">
            <el-input v-model="add_form.docPass"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="docSex">
            <el-input v-model="add_form.docSex"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="docAge">
            <el-input v-model="add_form.docAge"></el-input>
          </el-form-item>
          <el-form-item label="具体信息" prop="docInform">
            <el-input v-model="add_form.docInform"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="docEmail">
            <el-input v-model="add_form.docEmail"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="docTel">
            <el-input v-model="add_form.docTel"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="docImg">
            <el-input v-model="add_form.docImg"></el-input>
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
  const checkAge = (rule, value, callback) => {
    console.log(value);
  
    if (Number(value)>0 && Number(value)<=120 ) {
      return callback();
    } else {
      callback(new Error("请输入正确年龄"));
    }
  };
  // 修改用户信息的验证规则
  const editFormRules = {
    docName: [
      {
        message: "请输入用户名",
        trigger: "blur",
      },
      {
        validator: checkusername,
        trigger: "blur",
      },
    ],
   docPass: [
      {
        message: "请输入密码",
        trigger: "blur",
      },
      {
        validator: pasd,
        trigger: "blur",
      },
    ],
    docAge: [
      {
        message: "请输入年龄",
        trigger: "blur",
      },
      {
        validator: checkAge,
        trigger: "blur",
      },
    ],
    docSex: [
      {
        message: "请输入性别",
        trigger: "blur",
      },
      {
        validator: checksex,
        trigger: "blur",
      },
    ],
    docEmail: [
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
    docTel: [
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
    docInform: [
      { required: true, message: "请完善医生的基本信息", trigger: "blur" },
    ],
    docImg: [
      { required: true, message: "请完善医生图片", trigger: "blur" },
    ],
  };
//   添加用户校验规则
  const addRules = {
    docName: [
      {
        required: true,
        message: "请输入用户名",
        trigger: "blur",
      },
      {
        required: true,
        validator: checkusername,
        trigger: "blur",
      },
    ],
    docAge: [
      {
        required:true,
        message: "请输入年龄",
        trigger: "blur",
      },
      {
        validator: checkAge,
        trigger: "blur",
      },
    ],
   docPass: [
      {
        required: true,
        message: "请输入密码",
        trigger: "blur",
      },
      {
        validator: pasd,
        trigger: "blur",
      },
    ],
    docSex: [
      {
        required: true,
        message: "请输入性别",
        trigger: "blur",
      },
      {
        validator: checksex,
        trigger: "blur",
      },
    ],
    docEmail: [
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
    docTel: [
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
    docInform: [
      { required: true, message: "请完善医生的基本信息", trigger: "blur" },
    ],
    docImg: [
      { required: true, message: "请完善医生图片", trigger: "blur" },
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
      docName:'',
      docPass:'',
      docSex:'',
      docAge:'',
      docInform:'',
      docEmail:'',
      docTel:'',
      docImg:''
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
      "http://localhost:3000/docUser",
      queryInfo.value
    );
    console.log(res.data);
    total.value = res.paging.total;
    window.sessionStorage.setItem("docUser_total", total.value);
  
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
          .post("http://localhost:3000/docUser/delete", {
            docId: data.docId,
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
          .post("http://localhost:3000/docUser/edit", edit_form)
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
          .post("http://localhost:3000/docUser/add", add_form)
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
  