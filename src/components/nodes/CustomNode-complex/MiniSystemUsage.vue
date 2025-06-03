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
      default: 25
    },
    color: {
      type: String,
      default: '#156F9F'  // 默认蓝色
    }
  },
  computed: {
    option() {
      return {
        grid: {left: 5, right: 0, top: 0, bottom: 5},
        xAxis: {
          type: 'category',
          axisLine: {show: true},     // 显示坐标轴轴线
          axisTick: {show: false},    // 不显示刻度
          axisLabel: {show: false},   // 不显示刻度文字
          splitLine: {show: false}    // 不显示网格线
        },
        yAxis: {
          type: 'value',
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
          lineStyle: {width: 1, color: this.color === '#FFFFFF' ? '#156F9F' : this.color},
          areaStyle: {color: this.color === '#FFFFFF' ? '#156F9F' : this.color, opacity: 0.2},
        }]
      };
    }
  }
};
</script>
