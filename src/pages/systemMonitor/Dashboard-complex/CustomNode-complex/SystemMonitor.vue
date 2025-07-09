<template>
  <div style="width: 50%; height: 250px; margin: 20px; position: relative;">
    <v-chart ref="chart" :option="chartOption" autoresize/>
  </div>
</template>


<script>
import ECharts from 'vue-echarts';
import 'echarts';

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
            formatter: function (value) {
              const date = new Date(value);
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              const day = date.getDate();
              const month = date.getMonth() + 1; // getMonth() 返回的月份是从0开始的

              // 如果是当天的0点，显示日期，否则只显示时间
              if (hours === '00' && minutes === '00') {
                return `${month}月${day}日`;
              } else {
                return `${hours}:${minutes}`;
              }
            },
            interval: 'auto', // 自动优化间隔，防止挤爆
            hideOverlap: true, // 隐藏重叠的label
          }
        },
        yAxis: {
          type: 'value',
          // min: 0, // 设置最小值为 0
          // max: 100, // 设置最大值为 100
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
            start: this.getToday8amTimestamp(), // 设置起始位置
            endValue: this.getLatestTimestamp()
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
            start: this.getToday8amTimestamp(),
            endValue: this.getLatestTimestamp()
            // end: 100
          }
        ]
      };
    },
    getToday8amTimestamp(data = this.data) {
      const today = new Date();
      today.setHours(8, 0, 0, 0);
      const today8 = today.getTime();
      const first = data[0]?.[0] ?? today8;
      // 比较第一项的时间与8点钟
      // 第一项可能为空，或者从当日8点后才统计数据(比如8点15、9点等情况)
      return Math.max(today8, first);
    },
    getLatestTimestamp() {
      if (!this.data || this.data.length === 0) return new Date().getTime();
      return Number(this.data[this.data.length - 1][0]);
    },
  },
  watch: {
    data(val) {
      if (!val || val.length === 0) return;

      const formattedData = val.map(item => [Number(item[0]), item[1]]);

      const today8am = this.getToday8amTimestamp(formattedData);
      const latest = formattedData[formattedData.length - 1][0];

      this.chartOption = {
        ...this.chartOption,
        series: [{
          type: 'line',
          showSymbol: false,
          large: true,
          data: formattedData
        }],
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            showDetail: false,
            startValue: today8am,
            endValue: latest
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            startValue: today8am,
            endValue: latest
          }
        ]
      };

      this.$nextTick(() => {
        if (this.$refs.chart) {
          this.$refs.chart.setOption(this.chartOption, true);
        }
      });
    }
  }

};
</script>

<style scoped>
/* 样式保持不变 */
</style>
