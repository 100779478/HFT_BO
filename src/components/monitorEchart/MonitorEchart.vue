<template>
  <div class="chart">
    <div ref="chart" class="system-status-chart">
    </div>
    <div class="chart-center">{{ total }}</div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MonitorEchart',
  props: {
    normal: {
      type: Number,
      required: true
    },
    warning: {
      type: Number,
      required: true
    },
    danger: {
      type: Number,
      required: true
    },
    target: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  computed: {
    total() {
      return this.normal + this.warning;
    },
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    this.setOption();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
    this.chart && this.chart.dispose();
  },
  methods: {
    getPieData() {
      const max = this.target;
      const segments = [];
      let used = 0;

      const push = (value, name, colorStops) => {
        const val = Math.min(value, max - used);
        if (val > 0) {
          segments.push({
            value: val,
            name,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops
              }
            }
          });
          used += val;
        }
      };

      push(this.normal, '正常', [
        {offset: 0, color: '#00c97d'},
        {offset: 1, color: '#4fffa1'}
      ]);

      push(this.warning, '警告', [
        {offset: 0, color: '#f7b500'},
        {offset: 1, color: '#ffe566'}
      ]);

      push(this.danger, '危险', [
        {offset: 0, color: '#e84c3d'},
        {offset: 1, color: '#ff7875'}
      ]);

      // 剩余为“未报”
      const remaining = max - used;
      if (remaining > 0) {
        segments.push({
          value: remaining,
          name: '未报',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                {offset: 0, color: '#4B5A78'},
                {offset: 1, color: '#4B5A78'}
              ]
            }
          }
        });
      }
      return segments;
    },
    setOption() {
      const option = {
        backgroundColor: 'transparent',
        series: [
          {
            name: '系统状态',
            type: 'pie',
            radius: ['58%', '75%'],
            avoidLabelOverlap: false,
            label: {show: false},
            labelLine: {show: false},
            itemStyle: {
              borderWidth: 0,
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            data: this.getPieData()
            // data: [
            //   {
            //     value: this.normal,
            //     name: '正常',
            //     itemStyle: {
            //       color: {
            //         type: 'linear',
            //         x: 0,
            //         y: 0,
            //         x2: 1,
            //         y2: 1,
            //         colorStops: [
            //           {offset: 0, color: '#00c97d'},
            //           {offset: 1, color: '#4fffa1'}
            //         ]
            //       }
            //     }
            //   },
            //   {
            //     value: this.warning,
            //     name: '警告',
            //     itemStyle: {
            //       color: {
            //         type: 'linear',
            //         x: 0,
            //         y: 0,
            //         x2: 1,
            //         y2: 1,
            //         colorStops: [
            //           {offset: 0, color: '#f7b500'},
            //           {offset: 1, color: '#ffe566'}
            //         ]
            //       }
            //     }
            //   },
            //   {
            //     value: this.danger,
            //     name: '危险',
            //     itemStyle: {
            //       color: {
            //         type: 'linear',
            //         x: 0,
            //         y: 0,
            //         x2: 1,
            //         y2: 1,
            //         colorStops: [
            //           {offset: 0, color: '#e84c3d'},
            //           {offset: 1, color: '#ff7875'}
            //         ]
            //       }
            //     }
            //   },
            //   {
            //     value: 10,
            //     name: '未报',
            //     itemStyle: {
            //       color: {
            //         type: 'linear',
            //         x: 0,
            //         y: 0,
            //         x2: 1,
            //         y2: 1,
            //         colorStops: [
            //           {offset: 0, color: '#4B5A78'},
            //           {offset: 1, color: '#4B5A78'}
            //         ]
            //       }
            //     }
            //   }
            // ]
          }
        ]
      };

      this.chart.setOption(option);
    },
    resizeChart() {
      this.chart && this.chart.resize();
    }
  }
};
</script>

<style scoped>
.chart {
  position: relative;
  margin: 0 auto
}

.system-status-chart {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: inset -5px 0 10px rgb(69, 86, 108, 0.6);
  position: relative;
}


.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 15px;
  font-weight: bold;
  pointer-events: none;
}
</style>
