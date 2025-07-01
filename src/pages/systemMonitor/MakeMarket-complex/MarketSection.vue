<template>
  <div :class="wrapperClass" :style="{ width }">
    <div class="section-title">
      {{ sectionTitle }}
      <Icon :type="showSection ? 'ios-arrow-down' : 'ios-arrow-up'" @click="onToggleSection"/>
    </div>
    <div class="section-content">
      <div class="content-body-chart" v-if="showSection">
        <div
            v-for="chart in chartItems"
            :key="chart.title"
            class="content-body-chart-item"
        >
          <div class="content-body-chart-title">{{ chart.title }}</div>
          <MonitorEchart
              :target="chart.targetCount ?? 0"
              :normal="chart.successCount"
              :warning="chart.reachableCount"
              :danger="chart.failedCount"
          />
          <ul class="content-body-chart-font">
            <li v-for="(i, key) in chart.items" :key="key">
              <i v-if="i.name" :class="['icon', 'iconfont', MADE_ICON[i.status]]"/> {{ i.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="graph-list" :style="{ height: sectionHeight }">
        <div
            v-for="group in graphItems"
            :key="group.securityType"
            class="graph-section"
        >
          <div class="graph-item">
            <div class="debt-item">
              <span>{{ group.securityType }}</span>
              <div class="debt-item-value">
                <div class="debt-item-self">
                  <span class="debt-value">已报:{{ group.madeCount }}</span>
                  <span class="debt-value">已达标:{{ group.successCount }}</span>
                </div>
              </div>
            </div>
            <div
                class="graph-item-inner"
                v-for="bond in group.items"
                :key="bond.securityId"
                @dblclick="onDblClickItem(bond)"
            >
              <div class="graph-item-icon">
                <i
                    :style="{ visibility: bond.status ? 'visible' : 'hidden', width: '20px' }"
                    :class="['icon', 'iconfont', ICON_LIST[bond.status]]"
                />
                <div class="quote-item">
                  <i v-show="bond.newBond" class="icon iconfont icon-NEW-copy"/>
                  <Tooltip
                      theme="light"
                      :content="`债券简称：${bond.securityName || ''}\n已报时长：${secondsToHMS(bond.makeTime)}\n最大空白时长：${secondsToHMS(bond.maxBlankTime)}`"
                      :transfer="true"
                      placement="right-start"
                      :max-width="220"
                  >
                    <span class="graph-item-inner-font">{{ bond.securityId }}</span>
                  </Tooltip>
                </div>
              </div>
              <div class="progress-section">
                <div
                    class="progress-label"
                    :style="{ color: showPercentColor(bond.status) }"
                >
                  {{ Math.min(bond.makeMarketProgress, 100) }}%
                </div>
                <div class="progress-container">
                  <div
                      class="progress-bar"
                      :style="{
                      width: Math.min(bond.makeMarketProgress, 100) + '%',
                      backgroundColor: showPercentColor(bond.status),
                    }"
                  />
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
import MonitorEchart from "@/pages/systemMonitor/MakeMarket-complex/MonitorEchart.vue";
import {secondsToHMS} from "@/common/common";

export default {
  name: "MarketSection",
  methods: {secondsToHMS},
  components: {MonitorEchart},
  props: {
    sectionTitle: String,
    width: String,
    showSection: Boolean,
    chartItems: Array,
    graphItems: Array,
    sectionHeight: String,
    MADE_ICON: Object,
    ICON_LIST: Object,
    onToggleSection: Function,
    onDblClickItem: Function,
    showPercentColor: Function,
    wrapperClass: String,
  },
};
</script>

<style scoped>
.section-title {
  white-space: nowrap;
  font-weight: bolder;
  position: absolute;
  left: 10px;
}

.section-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-body-chart {
  flex: 0 0 auto; /* 固定高度 */
  padding: 10px;
}

.content-body-chart-item {
  margin-bottom: 16px;
}

.content-body-chart-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.content-body-chart-font {
  padding-left: 10px;
  list-style: none;
  margin-top: 6px;
}

.graph-list {
  flex: 1 1 auto; /* 剩余空间自动填满 */
  overflow-y: auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  white-space: nowrap;
  padding: 10px 0;
  overflow-x: hidden;
}

.graph-section {
  flex-shrink: 0;
}

/* 利率债对应content-body-left，信用债对应content-body-right */
.content-body-left .graph-section {
  width: 30%; /* 相当于flex: 0.3 */
}

.content-body-right .graph-section {
  width: 15%; /* 相当于flex: 0.15 */
}

.progress-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
}

.progress-label {
  margin-bottom: -1px;
}

.progress-container {
  width: 100px;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
}
</style>
