<style lang="less">
@import "@/style/variables.less";

.bck {
  height: 100%;
  position: relative;
  background-color: var(--background-color);
  overflow: hidden;
  width: 100%;
  user-select: none;
  cursor: default;

  .content-body {
    display: flex;
    justify-content: space-around;
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 10px;
    padding: 0 5px;
    color: var(--text-color);

    .content-body-left,
    .content-body-right {
      white-space: nowrap;
      position: relative;
      background-color: var(--background-color);
      border: 1px solid var(--date-hover-color);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: width 0.5s ease, height 1s ease;
    }

    .content-body-left {
      width: 33%;
    }

    .content-body-right {
      width: 65%;
    }

    .content-body-right .content-body-chart-font {
      flex-direction: column;
      flex-wrap: nowrap; /* 禁止换行 */
    }

    .content-body-left-item,
    .content-body-right-item {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      white-space: nowrap;
    }

    .content-body-chart {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;
      height: 370px;
      margin-top: 5px;
    }

    .content-body-chart-item,
    .content-body-chart-item-right {
      display: flex;
      flex-direction: column;
    }

    .content-body-chart-item {
      width: calc(50% - 10px);
    }

    .content-body-chart-item:nth-child(1) {
      width: calc(63% - 10px);
    }

    .content-body-chart-item:nth-child(2) {
      width: calc(14% - 10px);
    }

    .content-body-chart-item:nth-child(n + 3) {
      width: calc(33.33%);
    }

    .content-body-chart-item-right {
      justify-content: space-evenly;
    }

    .content-body-chart-title {
      font-size: 14px;
      font-weight: bolder;
    }

    .content-body-chart-font {
      font-size: 12px;
      list-style: none;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      height: 72px;
      align-items: flex-start;
      margin: 0 auto;
    }

    .type-left-item {
      flex: 0.3;
      margin-bottom: 10px;
    }

    .type-right-item {
      flex: 0.15;
      margin-bottom: 10px;
    }

    .debt-item {
      font-size: 0.9rem;
      color: var(--text-color);
      background: var(--graph-item-backcolor);
      position: sticky;
      top: 0;
      z-index: 10;

      span {
        display: block;
      }
    }

    .debt-item-value {
      display: flex;
      flex-direction: column;
    }

    .debt-item-self {
      display: flex;
      justify-content: space-around;
      flex-wrap: nowrap;
    }

    .debt-value {
      width: 50%;
      font-size: 0.75rem;
      color: var(--debt-text-color);
      white-space: nowrap;
    }

    .graph-section {
      display: flex;
      font-weight: normal;
    }

    .graph-item {
      color: var(--text-color);
      background-color: var(--graph-item-backcolor);
      width: 100%;
      border-radius: 10px;
      margin-top: 15px;
      box-shadow: 0 0px 4px rgba(179, 179, 179, 0.94);
      overflow-y: scroll;
      padding-bottom: 5px;
      position: relative;
    }

    .graph-item-icon {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 50%;
    }

    .graph-item-inner {
      display: flex;
      justify-content: space-around;
      font-size: 0.8rem;
      height: 34px;
      border-bottom: 1px solid rgba(106, 106, 108, 0.48);
      flex: 1 1 20%;
      align-items: center;
      white-space: nowrap;
    }

    .graph-item-inner:hover {
      background-color: var(--graph-hover-color);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
    }

    .quote-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 5px;
      font-size: 12px;
    }

    .progress-container {
      position: relative;
      width: 28px !important;
      height: 12px;
      box-shadow: 0 0 3px black;
      background-color: #e6e6e6;
      border-radius: 4px;
      overflow: hidden;
      padding: 2px;
    }

    .progress-bar {
      height: 100%;
      border-radius: 1px;
      transition: width 0.3s ease;
    }

    .progress-label {
      font-size: 0.75rem;
      max-width: 28px;
    }
  }

  /* 自定义滚动条 */

  .graph-item::-webkit-scrollbar {
    width: 4px;
    display: none;
  }

  .graph-item::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  .graph-item::-webkit-scrollbar-track {
    background-color: var(--graph-item-backcolor);
    border-radius: 3px;
  }

  @media (max-width: 1600px) {
    .debt-value {
      zoom: 0.8;
    }

    .graph-item-inner {
      zoom: 0.9;
    }
  }
}

/* 模态框内容 */
.ivu-modal-content {
  background-color: var(--modal-backcolor);
}

.modal-content {
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.modal-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  color: var(--text-color);
}

.modal-li {
  color: var(--text-color);
}

.modal-label {
  font-weight: bold;
  margin-right: 10px;
  flex-basis: 170px;
  padding-left: 50px;
  white-space: nowrap;
}

.modal-value {
  flex-grow: 1;
}

</style>
<template>
  <div class="bck">
    <MarketHeader
        :logicDescription="data.logicDescription"
        :madeCount="data.madeCount"
        :successCount="data.successCount"
        :update-time="data.currentTime"
        @marketSetting="marketSetting"
    />

    <div class="content-body">
      <MarketSection
          :sectionTitle="'利率债'"
          :width="getWidth('left')"
          :showSection="showRate"
          :chartItems="data.entries.filter(t => t.securitySuperType === 'InterestRate')"
          :graphItems="data.rates"
          :sectionHeight="`calc(${graphSectionHeight} + ${showRate ? '0px' : '370px'})`"
          :MADE_ICON="MADE_ICON"
          :ICON_LIST="ICON_LIST"
          :onToggleSection="() => showRate = !showRate"
          :onDblClickItem="openModal"
          :showPercentColor="showPercentColor"
          wrapperClass="content-body-left"
          :style="{ opacity: toggle === '1' ? 0 : 1 }"
      />
      <div style="align-self: center">
        <i v-show="toggle==='0'||toggle==='2'" class="icon iconfont icon-zuojiantou"
           @click="toggleVisibility('1')"></i>
        <i v-show="toggle==='0'||toggle==='1'" class="icon iconfont icon-youjiantou"
           @click="toggleVisibility('2')"></i>
      </div>
      <MarketSection
          :sectionTitle="'信用债'"
          :width="getWidth('right')"
          :showSection="showCredit"
          :chartItems="data.entries.filter(t => t.securitySuperType !== 'InterestRate')"
          :graphItems="data.credits"
          :sectionHeight="`calc(${graphSectionHeight} + ${showCredit ? '0px' : '370px'})`"
          :MADE_ICON="MADE_ICON"
          :ICON_LIST="ICON_LIST"
          :onToggleSection="() => showCredit = !showCredit"
          :onDblClickItem="openModal"
          :showPercentColor="showPercentColor"
          wrapperClass="content-body-right"
          :style="{ opacity: toggle === '2' ? 0 : 1 }"
      />
    </div>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {ICON_LIST, MADE_ICON} from "@/common/constant";
import {getSecurityType, secondsToHMS} from "@/common/common";
import MonitorEchart from "@/pages/systemMonitor/MakeMarket-complex/MonitorEchart.vue";
import MarketHeader from "./MakeMarket-complex/MarketHeader.vue"
import MarketSection from "@/pages/systemMonitor/MakeMarket-complex/MarketSection.vue";

export default {
  components: {MarketSection, MonitorEchart, MarketHeader},
  data() {
    const data = {
      logicDescription: "",
      remindMessage: "",
      madeCount: 0,
      successCount: 0,
      entries: [],
      rates: [],
      credits: [],
    }
    const toggle = '0'
    const sysSetting = {
      isFullScreenAlert: this.$store.state.makeStatus.system.isFullScreenAlert,
    }
    return {
      envId: null,
      data,
      toggle,
      sysSetting,
      showRate: true,
      showCredit: true,
      timer: null,
      frequency: 10,
      graphSectionHeight: 'calc(100vh - 200px)', // 默认高度
      ICON_LIST,
      MADE_ICON,
    }
  },
  created() {
  },
  mounted() {
    this.graphSectionHeight = sessionStorage.getItem('isClientPage') ? 'calc(100vh - 410px)' : 'calc(100vh - 500px)';
    this.getMakeMarket()
    this.startTimer()
  },
  computed: {
    isClientPage() {
      return sessionStorage.getItem('isClientPage')
    },
  },
  methods: {
    generateData(count = 5) {
      return Array.from({length: count}, (_, i) => ({
        securityType: 100 + i,
        successCount: 0,
        madeCount: 4,
        items: [
          {
            securityId: 4000000 + i,
            securityName: null,
            makeTime: 160 + i * 5,
            blankTime: i,
            maxBlankTime: 12000 + i * 100,
            makeMarketProgress: 1,
            newBond: false,
            status: 4,
            termToMaturityString: 9.0 + i * 0.1,
            securityTerm: 30
          },
        ]
      }));
    },
    getSecurityType,
    startTimer() {
      clearInterval(this.timer);
      this.timer = setInterval(this.getMakeMarket, this.frequency * 1000);
    },
    getMakeMarket() {
      // 构建请求 URL
      const url = this.isClientPage ? `${URL.makeMarketEnv}?envId=${sessionStorage.getItem('envid')}` : URL.makeMarket;
      http.get(url, (res) => {
        this.data = res.data;
        this.$store.commit('makeStatus/setMakeStatus', this.data.status);
      });
    },
    // 查看消息提醒
    viewRemindMessage() {
      const content = this.data?.remindMessage.split(';');
      content.pop(); // 去掉最后一个空项（由最后一个 ; 产生）
      this.$Modal.info({
        render: h => {
          return h('ol', {style: {fontWeight: 'bolder'}}, content.map(i => {
            const index = i.indexOf('还差');
            if (index !== -1) {
              // 分成“正常部分”和“高亮部分”
              const normal = i.slice(0, index);
              const highlight = i.slice(index); // 从“还差”到末尾

              return h('li', {class: 'modal-li'}, [
                h('span', normal),
                h('span', {style: {color: 'red'}}, highlight)
              ]);
            } else {
              // 没有“还差”的，正常显示
              return h('li', {class: 'modal-li'}, i);
            }
          }));
        }
      });
    },
    showPercentColor(status) {
      const colors = ['#fe5050', '#FEC16E', '#23DA72'];
      let code = null
      if (status === '4') {
        code = colors[0];  // 红色
      } else if (status === '1' || status === '3') {
        code = colors[1];  // 橙色
      } else if (status === '2') {
        code = colors[2];  // 绿色
      }
      return code
    },
    toggleVisibility(type) {
      // 0-->展示全部
      // 1-->展示右侧
      // 2-->展示左侧
      if (this.toggle === '0') {
        this.toggle = type
      } else {
        this.toggle = '0'
      }
    },
    getWidth(type) {
      if (type === 'left') {
        if (this.toggle === '0') return '34%';
        if (this.toggle === '1') return '0%';
        if (this.toggle === '2') return '100%';
      }
      if (type === 'right') {
        if (this.toggle === '0') return '65%';
        if (this.toggle === '1') return '100%';
        if (this.toggle === '2') return '0%';
      }
    },
    marketSetting() {
      this.$Modal.info({
        render: (h) => {
          return h('div', {class: 'modal-content'}, [
            h('div', {class: 'modal-item'}, [
              h('span', {class: 'modal-label'}, '做市监控全屏提醒：'),
              h('i-switch', {
                props: {
                  value: this.$store.state.makeStatus.system.isFullScreenAlert,  // 控制全屏提醒开关
                  size: 'small',
                },
                on: {
                  input: (value) => {
                    this.sysSetting = JSON.parse(JSON.stringify(this.sysSetting));  // 深拷贝
                    this.sysSetting.isFullScreenAlert = value;  // 只修改拷贝后的值
                  },
                },
              }),
            ]),
            h('div', {class: 'modal-item'}, [
              h('span', {class: 'modal-label'}, '做市监控刷新频率：'),
              h('Select', {
                props: {
                  value: this.frequency,  // 控制全屏提醒开关
                  size: 'small',
                },
                style: {width: '80px'},
                on: {
                  input: (value) => {
                    // 处理输入事件
                    this.frequency = value;
                  },
                },
              }, [
                h('Option', {props: {value: 10}}, '10秒'),
                h('Option', {props: {value: 30}}, '30秒'),
                h('Option', {props: {value: 60}}, '60秒'),
              ])
            ]),
          ]);
        },
        onOk: () => {
          this.$store.commit('makeStatus/setSystemSetting', this.sysSetting);
          this.getMakeMarket()
          this.startTimer()
        },
      });
    },
    openModal(item) {
      this.$Modal.info({
        render: (h) => {
          return h('div', {class: 'modal-content'}, [
            this.renderModalItem(h, '债券代码:', item.securityId),
            this.renderModalItem(h, '债券简称:', item.securityName),
            this.renderModalItem(h, '当前进度:', `${item.makeMarketProgress}%`),
            this.renderModalItem(h, '关键期限:', item.securityTerm),
            this.renderModalItem(h, '代偿期:', item.termToMaturityString),
            this.renderModalItem(h, '已报时长:', `${secondsToHMS(item.makeTime)}`),
            this.renderModalItem(h, '空白时长:', `${secondsToHMS(item.blankTime)}`),
            this.renderModalItem(h, '最大空白时长:', `${secondsToHMS(item.maxBlankTime)}`),
          ]);
        },
      });
    },
    renderModalItem(h, label, value) {
      return h('div', {class: 'modal-item'}, [
        h('span', {class: 'modal-label'}, label),
        h('span', {class: 'modal-value'}, value),
      ]);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
;
</script>
