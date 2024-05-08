<template>
  <div>
    <Tabs size="default" value="2">
      <TabPane name="1" label="交易日历" icon="ios-calendar">交易日历</TabPane>
      <TabPane name="2" label="周末工作日配置" icon="ios-hammer">
        <WeeklyOption></WeeklyOption>
      </TabPane>
      <TabPane name="3" label="节假日配置" icon="ios-hammer">节假日配置</TabPane>
    </Tabs>
  </div>
</template>

<script>
import WeeklyOption from "@/pages/systemManage/TradeDateComponents/WeeklyOption.vue";

export default {
  name: "TradeDate",
  components: {WeeklyOption}
}
</script>

<style scoped lang="less">

</style>