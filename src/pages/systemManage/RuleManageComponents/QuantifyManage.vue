<template>
  <div class="quantify">
    <div class="quantify-template">
      <div class="quantify-title">策略模板</div>
      <RuleTemplate/>
    </div>
    <div class="quantify-instance">
      <div class="quantify-title" style="margin-top: 15px">策略实例</div>
      <RuleInstance/>
    </div>
  </div>
</template>

<script>
import RuleTemplate from "@/pages/systemManage/RuleManageComponents/RuleTemplate.vue";
import RuleInstance from "@/pages/systemManage/RuleManageComponents/RuleInstance.vue";

export default {
  name: "QuantifyManage",
  components: {RuleInstance, RuleTemplate}
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