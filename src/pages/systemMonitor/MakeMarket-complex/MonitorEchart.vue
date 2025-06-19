<template>
  <div class="chart">
    <div ref="chart" class="system-status-chart"></div>
    <div class="chart-center">{{ total }}</div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MonitorEchart',
  props: {
    normal: {type: Number, required: true},
    warning: {type: Number, required: true},
    danger: {type: Number, required: true},
    target: {type: Number, required: true}
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    normal: 'setOption',
    warning: 'setOption',
    danger: 'setOption',
    target: 'setOption'
  },
  computed: {
    total() {
      // 展示已达标+可达标数量
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
        {offset: 0, color: '#00a86b'},
        {offset: 0.5, color: '#00c97d'},
        {offset: 1, color: '#4fffa1'}
      ]);

      push(this.warning, '警告', [
        {offset: 0, color: '#cc9900'},
        {offset: 1, color: '#ffe566'}
      ]);

      push(this.danger, '危险', [
        {offset: 0, color: '#c0392b'},
        {offset: 1, color: '#ff7875'}
      ]);

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
                {offset: 0, color: '#3a3f51'},
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
          // 立体高光环（背景环）
          {
            type: 'pie',
            radius: ['58%', '90%'],
            silent: true,
            label: {show: false},
            labelLine: {show: false},
            data: [{
              value: 1,
              itemStyle: {
                color: {
                  type: 'radial',
                  x: 0.3,
                  y: 0.3,
                  r: 1,
                  colorStops: [
                    {offset: 0, color: 'rgba(255,255,255,0.25)'},
                    {offset: 0.5, color: 'rgba(255,255,255,0.05)'},
                    {offset: 1, color: 'rgba(0,0,0,0.15)'}
                  ]
                }
              }
            }]
          },

          // 主数据环
          {
            name: '系统状态',
            type: 'pie',
            radius: ['58%', '90%'],
            avoidLabelOverlap: false,
            label: {show: false},
            labelLine: {show: false},
            itemStyle: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowColor: 'rgba(90,90,90,0.76)'
            },
            emphasis: {
              scale: true,
              scaleSize: 2,
              itemStyle: {}
            },
            data: this.getPieData()
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
  margin: 0 auto;
}

.system-status-chart {
  width: 7.2vh;
  height: 7.2vh;
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
