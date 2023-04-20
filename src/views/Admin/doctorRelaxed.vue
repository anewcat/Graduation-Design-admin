<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>值班信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>医生值班安排</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表 -->

    <el-card class="box-card">
      <br />
      <div class="search">
        <el-button type="info" @click="lastweek">上一周</el-button>
        <el-button
          type="primary"
          @click="addDialogVisible = true"
          class="addbtn"
          >新增排班</el-button
        >
        <el-button type="info" @click="nextweek">下一周</el-button>
        <br /><br />

        <div>
          <span>{{ nextMonday }}</span>
          <span>星期一</span>
          <span>~</span>
          <span>{{ lastsunday }}</span>
          <span>星期天</span>
        </div>
      </div>
      <br />
      <!-- 信息 -->
      <el-table
        :data="tableData"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          show-overflow-tooltip
          label="医生"
          prop="username"
          align="center"
        >
          <template #default="scope">{{ scope.row.username }}</template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          :label="monday1"
          prop="mondayStatus"
          align="center"
          width="175"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="thursday1"
          prop="tuesdayStatus"
          align="center"
          width="175"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="wednesday1"
          prop="wednesdayStatus"
          align="center"
          width="175"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="thuesday1"
          prop="thursdayStatus"
          align="center"
          width="175"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="friday1"
          prop="fridayStatus"
          align="center"
          width="175"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="saturday1"
          prop="saturdayStatus"
          align="center"
          width="175"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="sunday1"
          prop="sundayStatus"
          align="center"
          width="175"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="操作"
          align="center"
          width="175"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="showEditDialog(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Info.page_num"
        :page-sizes="[5, 7, 9]"
        :page-size="Info.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改值班信息"
      v-model="editDialogVisible"
      width="45%"
      @close="editDialogClose"
    >
      <el-form :model="edit_form" ref="edit_formRef" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="edit_form.username" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="星期一">
          <el-input v-model="edit_form.mondayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期二">
          <el-input v-model="edit_form.tuesdayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期三">
          <el-input v-model="edit_form.wednesdayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期四">
          <el-input v-model="edit_form.thursdayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期五">
          <el-input v-model="edit_form.fridayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期六">
          <el-input v-model="edit_form.saturdayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期天">
          <el-input v-model="edit_form.sundayStatus"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure_edit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="增加值班人员"
      v-model="addDialogVisible"
      width="45%"
      @close="addDialogClose"
    >
      <el-form v-model="add_form" ref="add_formRef" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="add_form.username"></el-input>
        </el-form-item>
        <el-form-item label="星期一">
          <el-input v-model="add_form.mondayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期二">
          <el-input v-model="add_form.tuesdayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期三">
          <el-input v-model="add_form.wednesdayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期四">
          <el-input v-model="add_form.thursdayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期五">
          <el-input v-model="add_form.fridayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期六">
          <el-input v-model="add_form.saturdayStatus"></el-input>
        </el-form-item>
        <el-form-item label="星期天">
          <el-input v-model="add_form.sundayStatus"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure_add">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, nextTick } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
const myData = reactive({
  base: "",
  monday: "",
  today: "",
  dateFormat2: "",
  dateFormat8: "",
  nextMonday: "",
  lastsunday: "",
  role: false,
  homes: [],
  workers: [],

  tableData: [],
  title: "新增",
  dialogVisible: false,
  form: {},
  formRules: {},
  monday1: "星期一",
  thuesday1: "星期二",
  wednesday1: "星期三",
  thursday1: "星期四",
  friday1: "星期五",
  saturday1: "星期六",
  sunday1: "星期天",
});
const {
  base,
  monday,
  today,
  dateFormat2,
  dateFormat8,
  nextMonday,
  lastsunday,
  role,
  homes,
  workers,

  tableData,
  title,
  dialogVisible,
  form,
  formRules,
  monday1,
  thuesday1,
  wednesday1,
  thursday1,
  friday1,
  saturday1,
  sunday1,
} = toRefs(myData);
// 分页
const Info = ref({
  page_num: 1, //当前的页码
  page_size: 5, //每页显示的条数
});
const total = ref(0);
const editDialogVisible = ref(false);
interface Rule {
  id: number;
  username: string;
  mondayStatus: string;
  tuesdayStatus: string;
  wednesdayStatus: string;
  thursdayStatus: string;
  fridayStatus: string;
  saturdayStatus: string;
  sundayStatus: string;
}
const edit_form = ref<Rule>({
  username: "",
  id: 0,
  mondayStatus: "",
  tuesdayStatus: "",
  wednesdayStatus: "",
  thursdayStatus: "",
  fridayStatus: "",
  saturdayStatus: "",
  sundayStatus: "",
});
const addDialogVisible = ref(false);
const add_form = ref({
  username: "",
  mondayStatus: "",
  tuesdayStatus: "",
  wednesdayStatus: "",
  thursdayStatus: "",
  fridayStatus: "",
  saturdayStatus: "",
  sundayStatus: "",
});
const edit_formRef = ref(null);
const add_formRef = ref(null);
const getuser = async () => {
  let { data: res } = await axios.post(
    "http://localhost:3000/docRelax",
    Info.value
  );
  console.log(res);
  if (res.code == 200) {
    total.value = res.paging.total;
    tableData.value = res.data;
  }
  // console.log(res.result,"resultresults")
  console.log(tableData.value, "tabledata");
};
const lastweek = () => {
  getBeforNday(base.value, 7);
  console.log(dateFormat2.value);
  getuser();
};
const nextweek = () => {
  getBeforNday(base.value, -7);
  console.log(dateFormat2.value);
  getuser();
};
const getTime = () => {
  var myDate = new Date();
  var year = myDate.getFullYear(); //年
  var month = myDate.getMonth() + 1; //月
  var date = myDate.getDate(); //日
  var str = myDate.getDay();

  if (str == 1) {
    getBeforNday(myDate, 1);
  }
  if (str == 2) {
    getBeforNday(myDate, 2);
  }
  if (str == 3) {
    getBeforNday(myDate, 3);
  }
  if (str == 4) {
    getBeforNday(myDate, 4);
  }
  if (str == 5) {
    getBeforNday(myDate, 5);
  }
  if (str == 6) {
    getBeforNday(myDate, 6);
  }
  if (str == 0) {
    getBeforNday(myDate, 0);
  }
};
const getBeforNday = (date, n) => {
  var todays = date.getTime();
  var myToday = new Date();
  today.value = myToday.setTime(todays);

  var yesterday_milliseconds = date.getTime() - n * 1000 * 60 * 60 * 24;
  var yesterday = new Date();

  yesterday.setTime(yesterday_milliseconds);

  var strYear = yesterday.getFullYear();
  var strDay = yesterday.getDate();
  var strMonth = yesterday.getMonth() + 1;
  var strdate = yesterday.getDay();

  if (strdate == 0) {
    //
  }
  if (strMonth < 10) {
    strMonth = "0" + strMonth;
  }
  let datastr = strYear + "年" + strMonth + "月" + strDay + "日";
  let md = strMonth + "-" + strDay;
  var sunday = md;
  lastsunday.value = datastr;
  var dateFormat1 = strYear + "-" + strMonth + "-" + strDay;
  base.value = yesterday;
  getotherday(yesterday, -1);
  getotherday(yesterday, -2);
  getotherday(yesterday, -3);
  getotherday(yesterday, -4);
  getotherday(yesterday, -5);
  getotherday(yesterday, -6);
  getotherday(yesterday, -7);
};
const getotherday = (date, n) => {
  var yesterday_milliseconds = date.getTime() - n * 1000 * 60 * 60 * 24;
  var yesterday = new Date();
  yesterday.setTime(yesterday_milliseconds);

  var strYear = yesterday.getFullYear();
  var strDay = yesterday.getDate();
  var strMonth = yesterday.getMonth() + 1;
  var strdate = yesterday.getDay();
  if (strMonth < 10) {
    strMonth = "0" + strMonth;
  }
  if (strDay < 10) {
    strDay = "0" + strDay;
  }
  if (n == -1) {
    monday.value = strMonth + "." + strDay;
    monday1.value =
      "星期一" + "(" + strYear + " / " + strMonth + " / " + strDay + ")";
    nextMonday.value = strYear + "年" + strMonth + "月" + strDay + "日";
    dateFormat2.value =
      strYear + "-" + strMonth + "-" + strDay + " " + "00:00:00";
  }
  if (n == -2) {
    var thursday = strMonth + "." + strDay;
    thursday1.value =
      "星期二" + "(" + strYear + " / " + strMonth + " / " + strDay + ")";
    var dateFormat3 = strYear + "-" + strMonth + "-" + strDay;
  }
  if (n == -3) {
    var wednesday = strMonth + "." + strDay;
    wednesday1.value =
      "星期三" + "(" + strYear + " / " + strMonth + " / " + strDay + ")";
    var dateFormat4 = strYear + "-" + strMonth + "-" + strDay;
  }
  if (n == -4) {
    var thuesday = strMonth + "." + strDay;
    thuesday1.value =
      "星期四" + "(" + strYear + " / " + strMonth + " / " + strDay + ")";
    var dateFormat5 = strYear + "-" + strMonth + "-" + strDay;
  }
  if (n == -5) {
    var friday = strMonth + "." + strDay;
    friday1.value =
      "星期五" + "(" + strYear + " / " + strMonth + " / " + strDay + ")";
    var dateFormat6 = strYear + "-" + strMonth + "-" + strDay;
  }
  if (n == -6) {
    var saturday = strMonth + "." + strDay;
    saturday1.value =
      "星期六" + "(" + strYear + " / " + strMonth + " / " + strDay + ")";
    var dateFormat7 = strYear + "-" + strMonth + "-" + strDay;
  }
  if (n == -7) {
    var sunday = strMonth + "." + strDay;
    sunday1.value =
      "星期天" + "(" + strYear + " / " + strMonth + " / " + strDay + ")";
    lastsunday.value = strYear + "年" + strMonth + "月" + strDay + "日";
    dateFormat8.value =
      strYear + "-" + strMonth + "-" + strDay + " " + "00:00:00";
  }
};

const handleSelectionChange = (val) => {
  var checkedList = val;
};

// 监听pagesize  每页显示的条数的改变
const handleSizeChange = (newSizes) => {
  //给原来变量重新赋值
  Info.value.page_size = newSizes;
  //每改变一次重新请求获取新的数据渲染
  getuser();
};
// 监听当前页码值的改变
const handleCurrentChange = (newPages) => {
  Info.value.page_num = newPages;
  getuser();
};
const showEditDialog = (row) => {
  editDialogVisible.value = true;
  nextTick(()=>{
    edit_form.value = JSON.parse(JSON.stringify(row));
  })
  // console.log("scope-row",row)
  // console.log("this.edit_form",this.edit_form)
};
const editDialogClose = () => {
  editDialogVisible.value = false;
  edit_formRef.value.resetFields();
};
const sure_edit = () => {
  // 预校验表单修改的内容
  edit_formRef.value.validate(async (vaild) => {
    // // 如果为真则可以发起请求 修改用户
    if (!vaild) {
      return;
    } else {
      let newData = {
        id: edit_form.value.id,
        mondayStatus: edit_form.value.mondayStatus,
        tuesdayStatus: edit_form.value.tuesdayStatus,
        wednesdayStatus: edit_form.value.wednesdayStatus,
        thursdayStatus: edit_form.value.thursdayStatus,
        fridayStatus: edit_form.value.fridayStatus,
        saturdayStatus: edit_form.value.saturdayStatus,
        sundayStatus: edit_form.value.sundayStatus,
      };
      //   console.log(newData);
      //   let data = this.$qs.stringify(newData);

      const { data: res } = await axios.post(
        "http://localhost:3000/docRelax/edit",
        newData
      );

      // console.log(res);

      if (res.code !== 200) {
        ElMessage({
          type: "info",
          message: "修改失败",
        });
      } else {
        editDialogVisible.value = false;
        // 重新渲染显示界面列表
        getuser();

        ElMessage({
          type: "info",
          message: "修改成功",
        });
      }
    }
  });
};

const sure_add = async () => {
  if (add_form.value.sundayStatus !== "") {
    const { data: res } = await axios.post(
      "http://localhost:3000/docRelax/add",
      add_form.value
    );

    // console.log(res);
    if (res.code == 200) {
      ElMessage({
        type: "info",
        message: "新增成功",
      });
    }
    getuser();
    addDialogVisible.value = false;
  } else {
    // alert("不能为空，请填写值班信息");
  }
};
const addDialogClose = () => {
  addDialogVisible.value = false;
  add_form.value = {
  username: "",
  mondayStatus: "",
  tuesdayStatus: "",
  wednesdayStatus: "",
  thursdayStatus: "",
  fridayStatus: "",
  saturdayStatus: "",
  sundayStatus: "",
}
};
const removeUserById = async (id) => {
  ElMessageBox.confirm("确认要删除该用户吗?", "提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确 认",
    cancelButtonText: "取 消",
  })
    .then(() => {
      // 删除内容
      axios
        .post("http://localhost:3000/docRelax/delete", {
          id
        })
        .then(() => {
          getuser();
          ElMessage({
            type: "info",
            message: "删除成功",
          });
        });
    })
    .catch(() => {
      // 取消删除
    });
};
getuser();
onMounted(() => {
  getTime();
});
</script>
<style scoped></style>
