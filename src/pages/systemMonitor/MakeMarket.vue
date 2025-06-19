<style lang="less">
@import "@/style/variables.less";

.bck {
  height: 100%;
  position: relative;
  background-color: var(--background-color);
  overflow: hidden;
  width: 100%;
  user-select: none;
  cursor: default; /* 始终显示箭头光标 */

  .content-body {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 10px;
    padding: 0 5px;
    color: var(--text-color);

    .content-body-left {
      width: 33%;

      .content-body-left-item {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        white-space: nowrap;
      }

    }

    .content-body-right {
      width: 65%;

      .content-body-right-item {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        white-space: nowrap;
      }
    }

    .content-body-left, .content-body-right {
      position: relative;
      //background-color: #f1f1f5;
      //background-color: var(--content-background-color);
      background-color: var(--background-color);
      border: 1px solid var(--date-hover-color);
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      transition: width 0.5s ease, height 1s ease;
      overflow: hidden;
    }
  }

  .content-body-chart {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    height: 340px;
    margin-top: 5px;

    .content-body-chart-item {
      //flex: 0 0 33%;
      width: calc(50% - 10px); /* 第一行两个 */
      display: flex;
      flex-direction: column;

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
        align-items: flex-start; /* 确保每一项左对齐 */
        margin: 0 auto; /* 水平居中 */
      }
    }

    .content-body-chart-item:nth-child(1) {
      width: calc(63% - 10px);
    }

    .content-body-chart-item:nth-child(2) {
      width: calc(14% - 10px);
    }

    .content-body-chart-item:nth-child(n + 3) {
      width: calc(33.33%); /* 从第三项起三个一行 */
    }

    .content-body-chart-item-right {
      //flex: 0 0 33%;
      display: flex;
      flex-direction: column;

      .content-body-chart-title {
        font-size: 14px;
        font-weight: bolder;
      }

      .content-body-chart-font {
        font-size: 12px;
        list-style: none;
        display: flex;
        flex-direction: column;
        height: 72px;
        align-items: flex-start; /* 确保每一项左对齐 */
        margin: 0 auto; /* 水平居中 */
      }
    }
  }

  .type-left-item {
    flex: 0.3;
    margin-bottom: 10px
  }

  //.type-left-item:nth-child(2) {
  //  flex: 0.3;
  //  margin-bottom: 10px
  //}

  .type-right-item {
    flex: 0.15;
    margin-bottom: 10px
  }

  .header-content {
    display: flex;
    font-size: 14px;
    align-items: center;
    font-weight: bolder;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  .market-info {
    font-size: 14px;
    width: 120px;
    white-space: nowrap;
    padding-right: 15px;
    z-index: 999;
    text-align: center;
    background-color: var(--background-color);
  }

  @keyframes init-scroll {
    0% {
      transform: translateX(100%); /* 瞬间跳到100%（右侧外部） */
    }
    100% {
      transform: translateX(-100%); /* 从100%位置开始，继续向左移动到-600px */
    }
  }

  @keyframes scroll {
    0% {
      transform: translateX(100%); /* 瞬间跳到100%（右侧外部） */
    }
    100% {
      transform: translateX(-100%); /* 从100%位置开始，继续向左移动到-600px */
    }
  }

  .title-info {
    //overflow: hidden;
    will-change: transform;
    font-weight: bolder;
    width: auto;
    color: red;
    display: inline-block; /* 确保文字在一行内 */
    white-space: nowrap; /* 确保文字不换行 */
    animation: init-scroll 50s linear, scroll 50s linear 5s infinite;
    margin-left: 30px;
  }

  .market-data {
    position: absolute;
    right: 0;
    font-size: 14px;
    min-width: 170px; /* 最小宽度 */
    width: auto; /* 宽度自适应 */
    font-weight: normal; /* 默认字体不加粗 */
    z-index: 999;
    white-space: nowrap;
    text-align: right;
    padding: 0 10px 0 30px;
    background-color: var(--background-color);

    .market-data-value {
      font-weight: bold; /* 数据加粗 */
    }
  }

  .title-info:hover {
    animation-play-state: paused;
  }

  .color-info {
    //color: black;
    color: var(--text-color);
    margin-top: 10px;
  }

  .color-box {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border-radius: 50%;
  }

  .debt-item {
    font-size: 0.9rem;
    color: var(--text-color);
  }

  .debt-item span {
    display: block;
  }

  .debt-item-value {
    display: flex;
    //flex-wrap: wrap;
    //justify-content: space-around;
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

  @media (max-width: 1600px) {


    .debt-value {
      zoom: 0.8;
    }

    .graph-item-inner {
      zoom: 0.9;
    }
  }

  .graph-section {
    display: flex;
    font-weight: normal;
  }

  .graph-item {
    //background-color: #f4f7fa;
    color: var(--text-color);
    background-color: var(--graph-item-backcolor);
    width: 100%;
    border-radius: 10px;
    margin-top: 15px;
    //box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
    box-shadow: 0 0px 4px rgba(179, 179, 179, 0.94);
    overflow-y: scroll;
    padding-bottom: 5px;
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

  /* 定制滚动条样式 */

  .graph-item::-webkit-scrollbar {
    width: 4px; /* 设置滚动条的宽度 */
    display: none;
  }

  .graph-item::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* 设置滚动条滑块的颜色 */
    border-radius: 3px; /* 设置滑块圆角 */
  }

  .graph-item::-webkit-scrollbar-track {
    //display: none;
    //background-color: #faf4f6; /* 设置滚动条轨道的颜色 */
    background-color: var(--graph-item-backcolor); /* 设置滚动条轨道的颜色 */
    border-radius: 3px; /* 设置轨道圆角 */
  }

  .quote-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 5px;
    font-size: 12px
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

.ivu-modal-content {
  //--modal-backcolor: #f4f7fa;
  //top: 15vh;
  background-color: var(--modal-backcolor);
}

/* 模态框的内容 */
.modal-content {
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
}

/* 每一行信息的样式 */
.modal-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-evenly;
  color: var(--text-color);
}

.modal-li {
  color: var(--text-color);
}

/* 标签部分样式 */
.modal-label {
  font-weight: bold;
  margin-right: 10px;
  flex-basis: 170px;
  padding-left: 50px;
  white-space: nowrap;
}

/* 值部分样式 */
.modal-value {
  flex-grow: 1;
}

</style>
<template>
  <div class="bck">
    <div class="header-content">
      <div class="market-info">
        <Tooltip theme="light" max-width="800" :transfer="true" placement="right">
          <Icon type="md-settings" size="18" style="margin-right: 5px;cursor: pointer" @click="showWarning"/>
          <Icon type="md-alert" size="18"/>
          <span style="font-weight: normal">做市说明</span>
          <div slot="content">
            <div class="color-info">
              <p><strong>图标说明：</strong></p>
              <ol style="margin-left: 20px;">
                <li><i class="icon iconfont icon-NEW-copy"/>今日新上市的债券</li>
                <li><i class="icon iconfont icon-yk_yuanquan_fill"/>当前债券做市情况为：未报</li>
                <li><i class="icon iconfont icon-shibai"/>当前债券做市情况为：失败</li>
                <li><i class="icon iconfont icon-warn"/>当前债券做市情况为：警告</li>
                <li><i class="icon iconfont icon-kedabiao"/>当前债券做市情况为：已报</li>
                <li><i class="icon iconfont icon-chenggong"/>当前债券做市情况为：已达标</li>
              </ol>
              <p><strong>操作说明：</strong></p>
              <ol style="margin-left: 20px;">
                <li>双击滚动提醒可查看详细内容。</li>
                <li>双击债券可查看详细信息。</li>
                <li>点击标题旁的
                  <Icon type='ios-arrow-down'/>
                  可收缩或展开做市面板。
                </li>
              </ol>
              <p><strong v-show="data?.logicDescription">业务说明：</strong></p>
              <div>
                {{ data?.logicDescription }}
                <br>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
      <!--      <div class="title-info" @dblclick="viewRemindMessage">-->
      <!--        {{ data?.remindMessage }}-->
      <!--      </div>-->
      <div class="market-data">
        已报：<span class="market-data-value">{{ data?.madeCount ?? '--' }}</span>
        已达标：<span class="market-data-value">{{ data?.successCount ?? '--' }}</span>
      </div>
    </div>
    <div class="content-body">
      <div class="content-body-left"
           :style="{ width: getWidth('left')}">
        <div style="white-space: nowrap;font-weight: bolder;position: absolute;left: 10px">利率债
          <Icon :type="showRate?'ios-arrow-down':'ios-arrow-up'" @click="showRate=!showRate"/>
        </div>
        <div class="content-body-left-item">
          <div class="content-body-chart" v-if="showRate">
            <div class="content-body-chart-item"
                 v-for="chartItem in data.entries.filter(t=>t.securitySuperType==='InterestRate')"
                 :key="chartItem.title">
              <div class="content-body-chart-title">{{ chartItem.title }}</div>
              <MonitorEchart
                  :target="chartItem.targetCount??0"
                  :normal="chartItem.successCount"
                  :warning="chartItem.reachableCount"
                  :danger="chartItem.failedCount"
              />
              <ul class="content-body-chart-font">
                <li v-for="(i,key) in chartItem.items" :key="key">
                  <i v-if="i.name" :class="['icon','iconfont',MADE_ICON[i.status]]"/>{{ i.name }}
                </li>
              </ul>
            </div>
          </div>
          <div style="display: flex;justify-content: space-around">
            <div class="type-left-item" v-for="item in data?.rates" :key="item.securityType">
              <div style="display: flex;flex-direction: column">
                <div class="graph-section"
                     :style="{ height: `calc(${graphSectionHeight} + ${showRate ? '0px' : '340px'})` }">
                  <div class="graph-item">
                    <div class="debt-item">
                      <span> {{ item.securityType }}</span>
                      <div class="debt-item-value">
                        <div class="debt-item-self">
                          <span class="debt-value">已报:{{ item?.madeCount }}</span>
                          <span class="debt-value">已达标:{{ item?.successCount }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="graph-item-inner" v-for="itemChild in item.items" :key="itemChild?.securityId"
                         @dblclick="openModal(itemChild)">
                      <div class="graph-item-icon">
                        <i :style="{ visibility: itemChild?.status ? 'visible' : 'hidden' ,width:'20px'}"
                           :class="['icon','iconfont',ICON_LIST[itemChild.status]]"
                        ></i>
                        <div class="quote-item">
                          <i v-show="itemChild.newBond"
                             class="icon iconfont icon-NEW-copy"/>
                          <Tooltip theme="light" :width="100" :content="itemChild.securityName" :transfer="true"
                                   placement="right-start">
                            <span class="graph-item-inner-font">{{ itemChild?.securityId }}</span>
                          </Tooltip>
                        </div>
                      </div>
                      <div style="display: flex;flex-direction: column;align-items: center;">
                        <div class="progress-label" :style="{color:showPercentColor(itemChild?.makeMarketProgress)}">{{
                            Math.min(itemChild?.makeMarketProgress, 100)
                          }}%
                        </div>
                        <div class="progress-container">
                          <div class="progress-bar"
                               :style="{ width: Math.min(itemChild?.makeMarketProgress,100) + '%',backgroundColor:showPercentColor(itemChild?.makeMarketProgress) }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="align-self: center">
        <i v-show="toggle==='0'||toggle==='2'" class="icon iconfont icon-zuojiantou"
           @click="toggleVisibility('1')"></i>
        <i v-show="toggle==='0'||toggle==='1'" class="icon iconfont icon-youjiantou"
           @click="toggleVisibility('2')"></i>
      </div>
      <div class="content-body-right"
           :style="{ width: getWidth('right')}">
        <div style="white-space: nowrap;font-weight: bolder;position: absolute;left: 10px">信用债
          <Icon :type="showCredit?'ios-arrow-down':'ios-arrow-up'" @click="showCredit=!showCredit"/>
        </div>
        <div class="content-body-right-item">
          <div class="content-body-chart" style="justify-content: space-evenly" v-if="showCredit">
            <div class="content-body-chart-item-right"
                 v-for="chartItem in data.entries.filter(t=>t.securitySuperType!=='InterestRate')"
                 :key="chartItem.title">
              <div class="content-body-chart-title">{{ chartItem.title }}</div>
              <MonitorEchart
                  :target="chartItem.targetCount??0"
                  :normal="chartItem.successCount"
                  :warning="chartItem.reachableCount"
                  :danger="chartItem.failedCount"/>
              <ul class="content-body-chart-font">
                <li v-for="(i,key) in chartItem.items" :key="key">
                  <i :class="['icon','iconfont',MADE_ICON[i.status]]"/>{{ i.name }}
                </li>
              </ul>
            </div>
          </div>
          <div style="display: flex;justify-content: space-around">
            <div class="type-right-item" v-for="item in data?.credits" :key="item.type">
              <div style="display: flex;flex-direction: column">
                <div class="graph-section"
                     :style="{ height: `calc(${graphSectionHeight} + ${showCredit ? '0px' : '340px'})` }">
                  <div class="graph-item">
                    <div class="debt-item">
                      <span> {{ item.securityType }}</span>
                      <div class="debt-item-value">
                        <div class="debt-item-self">
                          <span class="debt-value">已报:{{ item?.madeCount }}</span>
                          <span class="debt-value">已达标:{{ item?.successCount }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="graph-item-inner" v-for="(itemChild,index) in item.items" :key="item.securityId"
                         @dblclick="openModal(itemChild)">
                      <div class="graph-item-icon">
                        <i :style="{ visibility: itemChild.status ? 'visible' : 'hidden' ,width:'20px'}"
                           :class="['icon','iconfont',ICON_LIST[itemChild.status]]"
                        ></i>
                        <div class="quote-item">
                          <i v-show="itemChild.newBond"
                             class="icon iconfont icon-NEW-copy"/>
                          <Tooltip theme="light" :width="100" :content="itemChild.securityName" :transfer="true"
                                   placement="right-start">
                            <span class="graph-item-inner-font">{{ itemChild?.securityId }}</span>
                          </Tooltip>
                        </div>
                      </div>
                      <div style="display: flex;flex-direction: column;align-items: center;">
                        <div class="progress-label" :style="{color:showPercentColor(itemChild?.makeMarketProgress)}">{{
                            Math.min(itemChild?.makeMarketProgress, 100)
                          }}%
                        </div>
                        <div class="progress-container">
                          <div class="progress-bar"
                               :style="{ width: Math.min(itemChild?.makeMarketProgress,100) + '%',backgroundColor:showPercentColor(itemChild?.makeMarketProgress) }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {ICON_LIST, MADE_ICON} from "@/common/constant";
import {getSecurityType, secondsToHMS} from "@/common/common";
import MonitorEchart from "@/components/monitorEchart/MonitorEchart.vue";

export default {
  components: {MonitorEchart},
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
      graphSectionHeight: 'calc(100vh - 200px)', // 默认高度
    }
  },
  created() {
  },
  mounted() {
    this.graphSectionHeight = sessionStorage.getItem('isClientPage') ? 'calc(100vh - 380px)' : 'calc(100vh - 480px)';
    this.getMakeMarket()
    this.timer = setInterval(this.getMakeMarket, 30000)
  },
  computed: {
    ICON_LIST() {
      return ICON_LIST
    },
    MADE_ICON() {
      return MADE_ICON
    },
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
          }
        ]
      }));
    },
    getSecurityType,
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
    showPercentColor(progress) {
      const colors = ['red', 'orange', '#0CBB18'];
      let code = null
      if (progress >= 0 && progress < 50) {
        code = colors[0];  // 红色
      } else if (progress >= 50 && progress < 100) {
        code = colors[1];  // 橙色
      } else if (progress >= 100) {
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
    showWarning() {
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
          ]);
        },
        onOk: () => {
          this.$store.commit('makeStatus/setSystemSetting', this.sysSetting);
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
