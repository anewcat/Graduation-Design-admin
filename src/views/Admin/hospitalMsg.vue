<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医院简介和治疗方案 </el-breadcrumb-item>
      <el-breadcrumb-item>医院简介</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="box">
        <div style="text-align: center">
          <h1>医院信息简介</h1>
        </div>

        <div class="container">
          <el-container>
            <el-aside width="250px">
              <img
                src="../../assets/1.jpg"
                style="width: 230px; height: 350px"
              />
            </el-aside>
            <el-main>
              <div>
                <h5>医院名称:</h5>
                <span>{{ form.hosname }}</span>
              </div>
              <div>
                <h5>简介:</h5>
                <span>{{ form.introduce }}</span>
              </div>
              <div>
                <h5>联系电话:</h5>
                <span>{{ form.tel }}</span>
              </div>
              <div>
                <h5>地址:</h5>
                <span>{{ form.address }}</span>
              </div>
            </el-main>
          </el-container>
        </div>
        <div style="text-align: center">
          <el-button type="primary" @click="edit_btn()">修改</el-button>
        </div>
      </div>
    </el-card>

    <!-- 编辑修改的对话框 -->
    <el-dialog
      title="修改简介"
      v-model="editDialogVisible"
      width="30%"
      @close="editDialogClose"
    >
      <el-form
        :model="form"
        ref="edit_formRef"
        label-width="100px"
        :rules="editFormRules"
      >
        <el-form-item prop="hosname" label="医院名称">
          <el-input v-model="form.hosname"></el-input>
        </el-form-item>
        <el-form-item prop="introduce" label="医院简介">
          <el-input
            type="textarea"
            :rows="12"
            height="200px"
            v-model="form.introduce"
          ></el-input>
        </el-form-item>
        <el-form-item prop="tel" label="联系电话">
          <el-input v-model="form.tel"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure_edit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, toRefs } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
const form = ref({
  hosname: "",
  tel: "",
  address: "",
  introduce: "",
});
const editDialogVisible = ref(false);
const edit_formRef = ref(null);
const getMsg = async () => {
  let res = await axios.post("http://localhost:3000/hosMsg");
  form.value = res.data.result[0];
};
const edit_btn = () => {
  editDialogVisible.value = true;
  // nextTick(() => {
  //   editForm.value = JSON.parse(JSON.stringify(form.value));
  // });
};
const editDialogClose = () => {
  editDialogVisible.value = false;
  edit_formRef.value.resetFields();
};
const sure_edit = async () => {
  edit_formRef.value.validate(async (vaild) => {
    // // 如果为真则可以发起请求 修改用户
    if (!vaild) {
      return;
    } else {
      await axios.post("http://localhost:3000/hosMsg/edit", form.value);
      getMsg();
      editDialogVisible.value = false;
      ElMessage({
        type: "info",
        message: "修改成功",
      });
    }
  });
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
// 修改用户信息的验证规则
const editFormRules = {
  hosname: [
    {
      required: true,
      message: "请输入医院名称",
      trigger: "blur",
    },
  ],
  tel: [
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
  address: [
    {
      required: true,
      message: "请输入地址",
      trigger: "blur",
    },
  ],
  introduce: [
    {
      required: true,
      message: "医院简介",
      trigger: "blur",
    },
  ],
};

getMsg();
</script>

<style scoped="scoped">
h1 {
  font-size: 25px;
}
.container {
  margin-top: 15px;
}
.box {
  height: 500px;
}
</style>
