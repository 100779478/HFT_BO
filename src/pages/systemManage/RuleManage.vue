<template>
  <div style="height: 100%">
    <Tabs size="default" :value="activeTab" :animated="false" @on-click="handleChangeTab" style="height: 49px">
      <TabPane name="1" label="做市策略" icon="ios-calendar"></TabPane>
      <TabPane name="2" label="量化策略" icon="ios-hammer"></TabPane>
    </Tabs>
    <component :is="activeComponent"></component>
  </div>
</template>

<script>
import MarketManage from "@/pages/systemManage/RuleManageComponents/MarketManage.vue";
import QuantifyManage from "@/pages/systemManage/RuleManageComponents/QuantifyManage.vue";

export default {
  name: "RuleManage",
  components: {MarketManage, QuantifyManage},
  data() {
    return {
      activeTab: '1', // 初始时激活的标签页为 "1"
      activeComponent: 'MarketManage' // 初始时激活的组件为 Market
    };
  },
  methods: {
    handleChangeTab(t) {
      this.activeTab = t;
      this.setActiveComponent(); // 切换标签页时更新激活的组件
    },
    setActiveComponent() {
      const tabList = ['MarketManage', 'QuantifyManage']
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
