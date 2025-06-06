<template>
  <div style="display: flex">
  <span style="font-size: 13px;margin: auto 0; transform: translateZ(0);" :style="{color:this.color}">  {{
      data[data.length - 1]
    }}% </span>
    <v-chart :option="option" :style="{ width: size + 'px', height: size + 'px'}" autoresize/>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
// src/utils/echarts.js
import {use} from 'echarts/core';

// 渲染器
import {CanvasRenderer} from 'echarts/renderers';

// 图表类型
import {LineChart} from 'echarts/charts';

// 组件
import {
  GridComponent,
  TooltipComponent,
  DatasetComponent
} from 'echarts/components';

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  DatasetComponent
]);


export default {
  name: 'MiniSystemUsage',
  components: {VChart},
  props: {
    data: {
      type: Array,
      required: true
    },
    size: {
      type: Number,
      default: 22
    },
    color: {
      type: String,
      default: '#FFFFFF'  // 默认蓝色
    }
  },
  computed: {
    option() {
      return {
        grid: {left: 5, right: 0, top: 2, bottom: 2},
        xAxis: {
          type: 'category',
          axisLine: {show: true},     // 显示坐标轴轴线
          axisTick: {show: false},    // 不显示刻度
          axisLabel: {show: false},   // 不显示刻度文字
          splitLine: {show: false}    // 不显示网格线
        },
        yAxis: {
          type: 'value',
          // min: 0, // 设置最小值为 0
          // max: 100, // 设置最大值为 100
          axisLine: {show: true},
          axisTick: {show: false},
          axisLabel: {show: false},
          splitLine: {show: false}
        },
        series: [{
          type: 'line',
          data: this.data,
          smooth: true,
          symbol: 'none',
          lineStyle: {width: 1, color: this.color},
          areaStyle: {color: this.color, opacity: 0.2},
        }]
      };
    }
  }
};
</script>
