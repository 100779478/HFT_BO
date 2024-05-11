<template>
  <div>
    <Tabs size="default" value="1">
      <TabPane name="1" label="交易日历" icon="ios-calendar">
        <Calendar></Calendar>
      </TabPane>
      <TabPane name="2" label="周末工作日配置" icon="ios-hammer">
        <WeeklyOption></WeeklyOption>
      </TabPane>
      <TabPane name="3" label="节假日配置" icon="ios-hammer">
        <HolidayAllocation></HolidayAllocation>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import WeeklyOption from "@/pages/systemManage/TradeDateComponents/WeeklyAllocation.vue";
import HolidayAllocation from "@/pages/systemManage/TradeDateComponents/HolidayAllocation.vue";
import Calendar from "@/pages/systemManage/TradeDateComponents/Calendar.vue";

export default {
  name: "TradeDate",
  components: {Calendar, WeeklyOption, HolidayAllocation}
}
</script>

<style scoped lang="less">

</style>