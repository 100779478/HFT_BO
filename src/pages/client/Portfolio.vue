<template>
  <div class="custom-tabs">
    <!--    <Tabs v-model="active" class="button-tabs">-->
    <!--      <TabPane label="我的" name="MyPortfolio"></TabPane>-->
    <!--      <TabPane label="全部" name="AllPortfolio"></TabPane>-->
    <!--    </Tabs>-->
    <div class="tab-content">
      <MyPortfolio/>
    </div>
  </div>
</template>

<script>
import MyPortfolio from "@/pages/client/Portfolio-complex/MyPortfolio.vue";
import ConfirmDialog from "@/pages/client/client-complex/ConfirmDialog.vue";

export default {
  name: "PortfolioClient",
  components: {
    ConfirmDialog,
    MyPortfolio,
  },
}
;
</script>


<style scoped lang="less">
@import url("@/style/manage.less");
@import url("@/style/client.less");

.custom-tabs {
  background-color: #0C1A36;
  padding: 20px;
  height: 100vh;
  -webkit-user-select: none; /* Chrome / Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE / Edge */
  user-select: none; /* 标准语法 */
}

.tab-content {
  padding: 12px;
  background: transparent;
  border-top: none;
  height: calc(100vh - 62px);
}
</style>
