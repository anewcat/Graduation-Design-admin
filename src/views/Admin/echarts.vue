<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="text-align: center">
        <h1>欢迎使用宠物医院系统</h1>
        <br />
        <!-- <img src="../assets/5.jpg" alt="" style="width: 100%;height: 550px;"> -->
        <el-row :gutter="12">
          <el-col :span="12">
            <el-card shadow="always">
              <div ref="hh" style="width: 550px; height: 450px"></div>
              <p>使用APP的用户数据</p>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="always">
              <div ref="hh2" style="width: 550px; height: 450px"></div>

              <p>宠物数据</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import LocalCache from "@/utils/cache";
import * as echarts from "echarts";
const apptotal = ref(0)
const doctortotal= ref(0);
const hh = ref<any>(null);
const hh2 = ref<any>(null);
let myChart:any = null;

function myCreate(){
    let appUser_total=LocalCache.getCache("appUser_total")
	let doctorUser_total=LocalCache.getCache("doctorUser_total")
    if(appUser_total==null&&doctorUser_total==null){
        apptotal.value=25
        doctortotal.value=10
    }
    else{
        apptotal.value=appUser_total
        doctortotal.value=doctorUser_total
    }
    console.log(appUser_total)
    console.log(doctorUser_total)
}
function myEcharts() {
        // 基于准备好的dom，初始化echarts实例
        myChart = echarts.init(hh.value);
        // 绘制图表

        var option = {
            series: [{
                type: 'pie',
                data: [{
                        value: apptotal.value,
                        name: '普通用户'
                    },
                    {
                        value: doctortotal.value,
                        name: '医生用户'
                    },

                ]
            }],
            radius: '45%'
        };
        myChart.setOption(option)

                }
function myEcharts2() {

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(hh2.value);
// 绘制图表

var option = {
    xAxis: {
        data: ['小猫', '小狗', '宠鸭', '仓鼠', '宠鸟', '羊驼','仓']
    },
    yAxis: {},
    series: [{
        type: 'bar',
        data: [{
                value: 335,
                name: '小猫'
            },
            {
                value: 234,
                name: '小狗'
            },
            {
                value: 1548,
                name: '宠物鸭'
            },
            {
                value: 1548,
                name: '仓鼠'
            },
            {
                value: 1548,
                name: '宠物鸟'
            },
            {
                value: 1548,
                name: '羊驼'
            },
            {
                value: 1548,
                name: '仓'
            }

        ]
    }]
};
myChart.setOption(option)

}
onMounted(()=>{
    myEcharts()
    myEcharts2()
})
myCreate()
</script>

<style>
/* .el-main{
		background-color:#74DFE2;
	} */
</style>
