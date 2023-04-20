<template>
  <div class="root">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="body_aside">
      <div class="togglebtn" @click="toggleCollapse">|||</div>

      <el-menu
        :default-active="2"
        background-color="#6AD6D8"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <template v-for="(item, index) in routerList" :key="index">
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <!-- <i :class="iconobj[item.id]"></i> -->
              <!-- <i class="iconfont icon-tijikongjian"></i> -->
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group>
              <template v-for="(item1,index1) in item.children" :key="index1">
                <router-link :to="item1.path">
                  <el-menu-item>{{ item1.authName }}</el-menu-item>
              </router-link>
              </template>
            </el-menu-item-group>
            <!-- <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <template>
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item> -->
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>
    <router-view class="main"></router-view>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import LocalCache from "@/utils/cache";
import axios from "axios";

import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
const isCollapse = ref(true);
interface myRule1 { 
  id: string;
  authName: string;
  path:string
}
interface myRule {
  id: string;
  authName: string;
  children: Array<myRule1>;
}
const routerList = ref<Array<myRule>>([]);
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
function getAside() {
  axios.post("http://localhost:3000/admin").then((res) => {
    routerList.value = res.data.routerList;
  });
}
onMounted(() => {
  getAside();
});
</script>
<style scoped>
.root{
  display:flex;
  height:100
}
.main{
  height:100%;
  width:100%;
}
</style>
