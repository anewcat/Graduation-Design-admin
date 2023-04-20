import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from './views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/Admin",
    // name: "Admin",
    component: () => import("./views/Admin/index.vue"),
    meta: { redirectAlreadyLogin: true },
    children: [
      {
        path: "echarts",
        name: "echarts",
        component: () => import("./views/Admin/echarts.vue"),
      },
      {
        path: "doctorUser",
        name: "doctorUser",
        component: () => import("./views/Admin/doctorUser.vue"),
      },
      {
        path: "appUser",
        name: "appUser",
        component: () => import("./views/Admin/appUser.vue"),
      },
      {
        path: "hospitalMsg",
        name: "hospitalMsg",
        component: () => import("./views/Admin/hospitalMsg.vue"),
      },
      {
        path: "hospitalMsg2",
        name: "hospitalMsg2",
        component: () => import("./views/Admin/hospitalMsg2.vue"),
      },
      {
        path: "doctorlist",
        name: "doctorlist",
        component: () => import("./views/Admin/doctorlist.vue"),
      },
      {
        path: "nurselist",
        name: "nurselist",
        component: () => import("./views/Admin/nurselist.vue"),
      },
      {
        path: "doctorRelaxed",
        name: "doctorRelaxed",
        component: () => import("./views/Admin/doctorRelaxed.vue"),
      },
      {
        path: "nurseRelaxed",
        name: "nurseRelaxed",
        component: () => import("./views/Admin/nurseRelaxed.vue"),
      },
      {
        path: "operation",
        name: "operation",
        component: () => import("./views/Admin/operation.vue"),
      },
      {
        path: "yuYue",
        name: "yuYue",
        component: () => import("./views/Admin/yuYue.vue"),
      },
      {
        path: "guaHao",
        name: "guaHao",
        component: () => import("./views/Admin/guaHao.vue"),
      },
      {
        path: "dangAn",
        name: "dangAn",
        component: () => import("./views/Admin/dangAn.vue"),
      },
      {
        path: "qingJia",
        name: "qingJia",
        component: () => import("./views/Admin/qingJia.vue"),
      },
      {
        path: "daKa",
        name: "daKa",
        component: () => import("./views/Admin/daKa.vue"),
      },
      {
        path: "petGoods",
        name: "petGoods",
        component: () => import("./views/Admin/petGoods.vue"),
      },
      {
        path: "systemCenter",
        name: "systemCenter",
        component: () => import("./views/Admin/systemCenter.vue"),
      },
      {
        path: "systemCenter2",
        name: "systemCenter2",
        component: () => import("./views/Admin/systemCenter2.vue"),
      },
      {
        path: "systemCenterManage",
        name: "systemCenterManage",
        component: () => import("./views/Admin/systemCenterManage.vue"),
      },
      {
        path: "yi_liao",
        name: "yi_liao",
        component: () => import("./views/Admin/yi_liao.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
