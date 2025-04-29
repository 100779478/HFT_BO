<template>
  <div style="display: flex">
  <span style="font-size: 15px;margin: auto 0;font-weight: bold" :style="{color:this.color}">  {{
      data[data.length - 1]
    }} </span>
    <v-chart :option="option" :style="{ width: size + 'px', height: size + 'px' }" autoresize/>
  </div>
</template>

<script>
import VChart from 'vue-echarts';

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
        grid: {left: 0, right: 0, top: 0, bottom: 0},
        xAxis: {type: 'category', show: false},
        yAxis: {type: 'value', show: false},
        series: [{
          type: 'line',
          data: this.data,
          smooth: true,
          symbol: 'none',
          lineStyle: {width: 1, color: this.color},
          areaStyle: {color: this.color, opacity: 0.2}
        }]
      };
    }
  }
};
</script>
