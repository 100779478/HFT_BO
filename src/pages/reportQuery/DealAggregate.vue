<template>
  <div>
    <Tabs size="default" :value="activeTab" :animated="false" @on-click="handleChangeTab"
          style="height: 49px;z-index:999">
      <TabPane name="1" label="成交汇总" icon="ios-calendar"></TabPane>
      <TabPane name="2" label="分策略成交汇总" icon="ios-hammer"></TabPane>
    </Tabs>
    <keep-alive>
      <component :is="activeComponent"></component>
    </keep-alive>
  </div>
</template>

<script>

import SubRuleTransactionSummary from "@/pages/reportQuery/DealAggregate/SubRuleTransactionSummary.vue";
import TransactionSummary from "@/pages/reportQuery/DealAggregate/TransactionSummary.vue";

export default {
  name: "DealAggregate",
  components: {TransactionSummary, SubRuleTransactionSummary},
  data() {
    return {
      activeTab: '1', // 初始时激活的标签页为 "1"
      activeComponent: 'TransactionSummary' // 初始时激活的组件为 Calendar
    };
  },
  methods: {
    handleChangeTab(t) {
      this.activeTab = t;
      this.setActiveComponent(); // 切换标签页时更新激活的组件
    },
    setActiveComponent() {
      const tabList = ['TransactionSummary', 'SubRuleTransactionSummary']
      this.activeComponent = tabList[this.activeTab - 1]
    }
  },
  mounted() {
    this.setActiveComponent(); // 初始加载页面时设置激活的组件
  }
}
</script>

<style scoped lang="less">

</style>
