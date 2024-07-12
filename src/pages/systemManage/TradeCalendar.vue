<template>
  <div>
    <Tabs size="default" :value="activeTab" :animated="false" @on-click="handleChangeTab" style="height: 49px">
      <TabPane name="1" label="交易日历" icon="ios-calendar"></TabPane>
      <TabPane name="2" label="周末工作日配置" icon="ios-hammer"></TabPane>
      <TabPane name="3" label="节假日配置" icon="ios-hammer"></TabPane>
    </Tabs>
    <component :is="activeComponent"></component>
  </div>
</template>

<script>
import WeeklyOption from "@/pages/systemManage/TradeDateComponents/WeeklyAllocation.vue";
import HolidayAllocation from "@/pages/systemManage/TradeDateComponents/HolidayAllocation.vue";
import Calendar from "@/pages/systemManage/TradeDateComponents/Calendar.vue";

export default {
  name: "TradeDate",
  components: {Calendar, WeeklyOption, HolidayAllocation},
  data() {
    return {
      activeTab: '1', // 初始时激活的标签页为 "1"
      activeComponent: 'Calendar' // 初始时激活的组件为 Calendar
    };
  },
  methods: {
    handleChangeTab(t) {
      this.activeTab = t;
      this.setActiveComponent(); // 切换标签页时更新激活的组件
    },
    setActiveComponent() {
      const tabList = ['Calendar', 'WeeklyOption', 'HolidayAllocation']
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
