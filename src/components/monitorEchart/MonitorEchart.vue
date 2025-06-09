<template>
  <div class="chart">
    <div ref="chart" class="system-status-chart">
    </div>
    <div class="chart-center" :style="{color:displayColor}">{{ total }}</div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MonitorEchart',
  props: {
    value: {
      type: [String, Number],
      required: true
    },
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
    }
  },
  data() {
    return {
      chart: null
    };
  },
  computed: {
    total() {
      return this.normal + this.warning + this.danger;
    },
    displayColor() {
      if (this.danger > 0) {
        return '#ff7875'; // danger 末尾色
      } else if (this.warning > 0) {
        return '#ffe566'; // warning 末尾色
      } else {
        return '#4fffa1'; // normal 末尾色
      }
    }
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
            data: [
              {
                value: this.normal,
                name: '正常',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [
                      {offset: 0, color: '#00c97d'},
                      {offset: 1, color: '#4fffa1'}
                    ]
                  }
                }
              },
              {
                value: this.warning,
                name: '警告',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [
                      {offset: 0, color: '#f7b500'},
                      {offset: 1, color: '#ffe566'}
                    ]
                  }
                }
              },
              {
                value: this.danger,
                name: '危险',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [
                      {offset: 0, color: '#e84c3d'},
                      {offset: 1, color: '#ff7875'}
                    ]
                  }
                }
              }
            ]
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
