<template>
  <div class="monitor">
    <div class="monitor-item">
      <div class="monitor-title">监控进程</div>
      <MonitorProcess/>
    </div>
    <div class="monitor-item">
      <div class="monitor-title">行情数据</div>
      <MarketData/>
    </div>
    <div class="monitor-item">
      <div class="monitor-title">监控日志</div>
      <MonitorProcessLogs/>
    </div>
  </div>
</template>

<script>
import MarketData from "@/pages/systemMonitor/MonitorManage/MarketData.vue";
import MonitorProcess from "@/pages/systemMonitor/MonitorManage/MonitorProcess.vue";
import MonitorProcessLogs from "@/pages/systemMonitor/MonitorManage/MonitorProcessLogs.vue";

export default {
  name: "MonitorManage",
  components: {MonitorProcessLogs, MarketData, MonitorProcess}
}
</script>

<style scoped lang="less">
.monitor {
  display: flex;
  flex-direction: column;
  //justify-content: space-between;
  .monitor-title {
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .monitor-item {
    //border-bottom: 2px solid black;
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    margin-bottom: 10px;
    //width: 49%;
  }

  .quantify-instance {
    //width: 49%;
  }


}
</style>