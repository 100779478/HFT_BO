<template>
  <div class="quantify">
    <div class="quantify-template">
      <div class="quantify-title">行情数据</div>
      <MarketData/>
    </div>
    <div class="quantify-instance">
      <div class="quantify-title" style="margin-top: 15px">监控进程</div>
      <MonitorProcess/>
    </div>
  </div>
</template>

<script>
import MarketData from "@/pages/systemMonitor/MonitorManage/MarketData.vue";
import MonitorProcess from "@/pages/systemMonitor/MonitorManage/MonitorProcess.vue";

export default {
  name: "MonitorManage",
  components: {MarketData, MonitorProcess}
}
</script>

<style scoped lang="less">
.quantify {
  display: flex;
  flex-direction: column;
  //justify-content: space-between;
  .quantify-title {
    padding: 0 0 10px 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .quantify-template {
    border-bottom: 2px solid black;
    padding-bottom: 10px;
    //width: 49%;
  }

  .quantify-instance {
    //width: 49%;
  }


}
</style>