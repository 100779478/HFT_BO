<template>
  <div style="width: 50%; height: 250px; margin: 20px; position: relative;">
    <v-chart ref="chart" :option="chartOption" autoresize/>
  </div>
</template>


<script>
import ECharts from 'vue-echarts';
import 'echarts';
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

export default {
  name: 'SystemMonitor',
  components: {
    'v-chart': ECharts
  },
  props: {
    title: {
      type: String,
    },
    data: {
      type: Array,
    }
  },
  data() {
    return {
      chartOption: {} // 初始空的，下面填充
    };
  },
  mounted() {
    this.initChartOption();
  },
  methods: {
    initChartOption() {
      this.chartOption = {
        visualMap: {
          show: false,
          type: 'continuous',
          min: 0,
          max: 100,
          inRange: {
            color: ['#0d7a20', '#eac763', '#ea0821']
          },
          seriesIndex: 0
        },
        title: {
          left: 'center',
          // text: this.title + '{small|(' + (this.status === 0 ? '7天' : '当日') + ')}',
          text: this.title + '{small|(7天)}',
          textStyle: {
            fontSize: 18,
            rich: {
              small: {
                fontSize: 12,
                color: '#666',
                padding: [0, 0, 0, 4]
              }
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            if (!params || !params[0] || !params[0].value) {
              return 'No data available';
            }
            const time = new Date(params[0].value[0]);
            const value = params[0].value[1];
            const color = params[0].color;
            return `
              <div>${time.toLocaleString()}<br>
                <span style="display:inline-block;margin-right:8px;width:10px;height:10px;border-radius:50%;background:${color}"></span>
                ${value}%
              </div>
            `;
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            // formatter: function (value) {
            //   const date = new Date(value);
            //   const hours = date.getHours().toString().padStart(2, '0');
            //   const minutes = date.getMinutes().toString().padStart(2, '0');
            //   return `${hours}:${minutes}`; // 只显示到分钟
            // },
            interval: 'auto', // 自动优化间隔，防止挤爆
            hideOverlap: true, // 隐藏重叠的label
          }
        },
        yAxis: {
          type: 'value',
          min: 0, // 设置最小值为 0
          max: 100, // 设置最大值为 100
          axisLabel: {
            formatter: '{value}%' // 在刻度标签后添加百分号
          }
        },
        series: [{
          type: 'line',
          showSymbol: false,
          large: true,
          data: this.data
        }],
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            showDetail: false, // <<< 关掉顶部那个小提示框
            // start: 92, // 起始位置（百分比）
            // end: 100, // 每次显示10%的数据（比如，显示1万个数据点）
            // startValue: '2024-01-01',
            // endValue: '2024-02-01'
            // handleSize: '8%',
            // minSpan: 0, // 用于限制窗口大小的最小值（百分比值），取值范围是 0 ~ 100。
            // maxSpan: 20,
            // minValueSpan: 1000, // 设置最小的可视区域
            // maxValueSpan: 6000 // 设置最大可视区域
          },
          {
            type: 'inside', // 支持通过鼠标滚轮缩放
            xAxisIndex: [0],
            // start: 92,
            // end: 100
          }
        ]
      };
    },
  },
  watch: {
    data(val) {
      // 确保数据格式：每个数据点应该是 [时间戳, 数值]
      const formattedData = val.map(item => {
        if (Array.isArray(item) && item.length === 2) {
          // 将时间戳从字符串转换为数字
          return [Number(item[0]), item[1]]; // 时间戳（数字）和数值
        }
        return item; // 如果格式不对，则不做处理
      });

      if (this.chartOption.series && this.chartOption.series.length > 0) {
        // 更新数据
        this.chartOption.series[0].data = formattedData;
      } else {
        // 如果chartOption没有series，重新初始化
        this.initChartOption(formattedData);
      }

      // 手动刷新echarts
      // this.$nextTick(() => {
      //   if (this.$refs.chart) {
      //     this.$refs.chart.setOption(this.chartOption, true);
      //   }
      // });
    }
  },
};
</script>

<style scoped>
/* 样式保持不变 */
</style>
