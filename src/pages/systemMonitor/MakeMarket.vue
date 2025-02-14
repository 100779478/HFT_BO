<style lang="less">
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
    font-weight: bolder;
    justify-content: space-around;
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: var(--text-color);

    .content-body-left {
      width: 33%;

      .content-body-left-item {
        display: flex;
        justify-content: space-around;
      }

    }

    .content-body-right {
      width: 65%;

      .content-body-right-item {
        display: flex;
        justify-content: space-around;
      }
    }

    .content-body-left, .content-body-right {
      //background-color: #f1f1f5;
      background-color: var(--content-background-color);
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      transition: width 0.5s ease, height 1s ease;
      overflow: hidden;
    }
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
    font-weight: bolder;
    width: auto;
    color: red;
    display: inline-block; /* 确保文字在一行内 */
    white-space: nowrap; /* 确保文字不换行 */
    animation: init-scroll 40s linear, scroll 40s linear 5s infinite;
    margin-left: 30px;
  }

  .market-data {
    position: absolute;
    right: 0;
    font-size: 14px;
    min-width: 170px; /* 最小宽度 */
    width: auto; /* 宽度自适应 */
    z-index: 999;
    white-space: nowrap;
    text-align: right;
    padding: 0 10px 0 30px;
    background-color: var(--background-color);
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

  .type-left-item {
    flex: 0.3;
    margin-bottom: 10px
  }

  .type-right-item {
    flex: 0.15;
    margin-bottom: 10px
  }

  .debt-info {
    margin-top: 5px;
    margin-bottom: 10px;
    font-weight: normal;
  }

  .debt-item {
    background-color: var(--debt-backcolor);
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    font-size: 0.8rem;
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
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    overflow-y: scroll;
    padding-bottom: 5px;
  }

  .graph-item-icon {
    display: flex;
    align-items: center;
  }

  .graph-item-inner {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    padding: 0 5px;
    height: 22px;
    flex: 1 1 20%;
    align-items: center;
    margin-top: 5px;
    white-space: nowrap;
  }

  .graph-item-inner:hover {
    //background-color: #ceced0;
    background-color: var(--graph-hover-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-weight: bolder;
    //font-size: 0.8rem;
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

  .progress-container {
    position: relative;
    width: 35px !important;
    height: 16px;
    box-shadow: 0 0 3px black;
    background-color: #e6e6e6;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    transition: width 0.3s ease;
  }

  .progress-label {
    position: absolute;
    font-size: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    font-weight: bold;
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
  flex-basis: 120px;
  white-space: nowrap;
}

/* 值部分样式 */
.modal-value {
  flex-grow: 1;
}

</style>

<template>
  <div class="bck" :style="rootStyle">
    <div class="header-content">
      <div class="market-info">
        <Tooltip theme="light" max-width="800" :transfer="true" placement="right">
          <Icon type="md-settings" size="18" style="margin-right: 5px;cursor: pointer" @click="showWarning"/>
          <Icon type="md-alert" size="18"/>
          做市说明
          <div slot="content">
            <div class="color-info">
              <p><strong>图标说明：</strong></p>
              <ol style="margin-left: 20px">
                <li><i class="icon iconfont icon-new"></i>今日新上市的债券</li>
                <li><i class="icon iconfont icon-warn"></i>当前债券做市情况为：失败</li>
                <li><i class="icon iconfont icon-tishi"></i>当前债券做市情况为：警告</li>
                <li><i class="icon iconfont icon-yidu"></i>当前债券做市情况为：已报</li>
                <li><i class="icon iconfont icon-chenggong"></i>当前债券做市情况为：已达标</li>
              </ol>
              <p><strong>操作说明：</strong></p>
              <ol style="margin-left: 20px">
                <li>双击滚动提醒可查看详细内容。</li>
                <li>双击债券可查看详细信息。</li>
              </ol>
              <p><strong v-show="data.logicDescription">业务说明：</strong></p>
              <div>
                {{ data.logicDescription }}
                <br>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
      <div class="title-info" @dblclick="viewRemindMessage">
        {{ data.remindMessage }}
      </div>
      <div class="market-data">
        已报：{{ data.madeCount ? data.madeCount : '--' }}
        已达标：{{ data.successCount ? data.successCount : '--' }}
      </div>
    </div>
    <div class="content-body">
      <div class="content-body-left"
           :style="{ width: getWidth('left')}">
        <div style="white-space: nowrap">利率债
        </div>
        <div class="content-body-left-item">
          <div class="type-left-item" v-for="item in data.rates" :key="item.securityType">
            <div style="display: flex;flex-direction: column">
              <div class="debt-info">
                <div class="debt-item">
                  <span> {{ getSecurityType(item.securityType).description }}</span>
                  <div class="debt-item-value">
                    <div class="debt-item-self">
                      <span class="debt-value">已报:{{ item.madeCount }}</span>
                      <span class="debt-value">已达标:{{ item.successCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="graph-section" :style="{ height: graphSectionHeight }">
                <div class="graph-item">
                  <div class="graph-item-inner" v-for="itemChild in item.items" :key="itemChild.securityId"
                       @dblclick="openModal(itemChild)">
                    <div class="graph-item-icon">
                      <i :style="{ visibility: itemChild.status ? 'visible' : 'hidden' ,width:'20px'}"
                         :class="['icon','iconfont',ICON_LIST[itemChild.status]]"
                      ></i>
                      <!--                      <div style=" position: relative;margin-right: 25px">-->
                      <!--                        <i :style="{ visibility: 1 ? 'visible' : 'hidden' , position: 'absolute',top: '-18px',left: '6px',zIndex:999}"-->
                      <!--                           :class="['icon','iconfont',iconList[1]]"-->
                      <!--                        ></i>-->
                      <!--                        <i :style="{ visibility: 1 ? 'visible' : 'hidden' , position: 'absolute',top: '-12px',left: '5px'}"-->
                      <!--                           :class="['icon','iconfont',iconList[2]]"-->
                      <!--                        ></i>-->
                      <!--                      </div>-->
                      <Tooltip theme="light" :width="100" :content="itemChild.securityName" :transfer="true"
                               placement="right-start">
                        <span class="graph-item-inner-font">{{ itemChild.securityId }}</span>
                      </Tooltip>
                    </div>
                    <div class="progress-container">
                      <div class="progress-bar"
                           :style="{ width: itemChild.makeMarketProgress + '%',backgroundColor:showPercentColor(itemChild.makeMarketProgress) }"></div>
                      <span class="progress-label">{{ itemChild.makeMarketProgress }}</span>
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
        <div style="white-space: nowrap">信用债</div>
        <div class="content-body-right-item">
          <div class="type-right-item" v-for="item in data.credits" :key="item.type">
            <div style="display: flex;flex-direction: column">
              <div class="debt-info">
                <div class="debt-item">
                  <span> {{ getSecurityType(item.securityType).description }}</span>
                  <div class="debt-item-value">
                    <div class="debt-item-self">
                      <span class="debt-value">已报:{{ item.madeCount }}</span>
                      <span class="debt-value">已达标:{{ item.successCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="graph-section" :style="{ height: graphSectionHeight }">
                <div class="graph-item">
                  <div class="graph-item-inner" v-for="(itemChild,index) in item.items" :key="item.securityId"
                       @dblclick="openModal(itemChild)">
                    <div class="graph-item-icon">
                      <i :style="{ visibility: itemChild.status ? 'visible' : 'hidden' ,width:'20px'}"
                         :class="['icon','iconfont',ICON_LIST[itemChild.status]]"
                      ></i>
                      <Tooltip theme="light" :width="100" :content="itemChild.securityName" :transfer="true"
                               placement="right-start">
                        <span class="graph-item-inner-font">{{ itemChild.securityId }}</span>
                      </Tooltip>
                    </div>
                    <div class="progress-container">
                      <div class="progress-bar"
                           :style="{ width: itemChild.makeMarketProgress + '%',backgroundColor:showPercentColor(itemChild.makeMarketProgress) }"></div>
                      <span class="progress-label">{{ itemChild.makeMarketProgress }}</span>
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
import {ICON_LIST} from "@/common/constant";
import {getSecurityType, secondsToHMS} from "@/common/common";

export default {
  data() {
    const data = {
      logicDescription: "",
      remindMessage: "",
      madeCount: 0,
      successCount: 0,
      rates: [],
      credits: [],
    }
    const toggle = '0'
    const sysSetting = {
      isFullScreenAlert: this.$store.state.makeStatus.system.isFullScreenAlert,
    }
    return {
      data,
      toggle,
      sysSetting,
      timer: null,
      graphSectionHeight: 'calc(100vh - 240px)', // 默认高度
    }
  },
  mounted() {
    const {name} = this.$route;
    this.graphSectionHeight = name === 'Monitor' ? 'calc(100vh - 135px)' : 'calc(100vh - 240px)';
    this.getMakeMarket()
    this.timer = setInterval(this.getMakeMarket, 30000)
  },
  computed: {
    ICON_LIST() {
      return ICON_LIST
    },
    rootStyle() {
      const style = this.$route.name === 'Monitor'
          ? {
            '--background-color': '#0C1A36',
            '--content-background-color': '#233450',
            '--modal-backcolor': '#17315d',
            '--text-color': '#fff',
            '--primary-color': '#ce1d6d',
            '--graph-item-backcolor': '#0C1A36',
            '--debt-backcolor': '#0C1A36',
            '--debt-text-color': '#fff',
            '--graph-hover-color': '#4e5363',
          }
          : {
            '--background-color': '#fff',
            '--content-background-color': '#f4f7fa',
            '--modal-backcolor': '#FFFFFF',
            '--text-color': '#515a6e',
            '--primary-color': '#007BFF',
            '--graph-item-backcolor': '#f4f7fa',
            '--debt-backcolor': '#f4f7fa',
            '--debt-text-color': '#133685',
            '--graph-hover-color': '#ceced0',
          };
      // 动态修改 :root 中的 CSS 变量
      Object.keys(style).forEach(key => {
        document.documentElement.style.setProperty(key, style[key]);
      });

      // 返回空对象，根样式不再传递给具体组件
      return {};
    },
  },
  methods: {
    getSecurityType,
    // 查看消息提醒
    viewRemindMessage() {
      const content = this.data.remindMessage.split(';')
      content.pop()
      this.$Modal.info({
        render: h => {
          return h('ul', {style: {fontWeight: 'bolder'}}, content.map(i => {
            return h('li', {class: 'modal-li'}, i)
          }))
        }
      })
    },
    getMakeMarket() {
      http.get(URL.makeMarket, (res) => {
        this.data = res.data
        this.$store.commit('makeStatus/setMakeStatus', this.data.status)
      })
    },
    showPercentColor(progress) {
      const colors = ['red', 'orange', '#0cbb18'];
      let code = null
      if (progress >= 0 && progress < 50) {
        code = colors[0];  // 红色
      } else if (progress >= 50 && progress < 100) {
        code = colors[1];  // 橙色
      } else if (progress === 100) {
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
        if (this.toggle === '0') return '32%';
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
    // if (this.$route.name === 'Monitor') {
    //   document.documentElement.style.setProperty('--modal-backcolor', '#f4f7fa')
    //   document.documentElement.style.setProperty('--text-color', '#fff')
    // }
  }
}
;
</script>
