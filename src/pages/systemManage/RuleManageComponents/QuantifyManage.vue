<template>
  <div class="quantify">
    <div class="quantify-template">
      <div class="quantify-title">策略模板</div>
      <RuleTemplate :visible="showTemplate"/>
    </div>
    <div class="quantify-instance">
      <div class="quantify-title" style="margin-top: 0">
        策略实例
        <Button @click="toggleTemplate" style="width: 30px" size="small">
          <template v-if="showTemplate">
            <Icon type="ios-arrow-down"/>
          </template>
          <template v-else>
            <Icon type="ios-arrow-up"/>
          </template>
        </Button>
      </div>
      <RuleInstance v-show="showTemplate" :templateVisible="showTemplate"/>
    </div>
  </div>
</template>
<script>
import RuleTemplate from "@/pages/systemManage/RuleManageComponents/QuantifyManage-complex/RuleTemplate.vue";
import RuleInstance from "@/pages/systemManage/RuleManageComponents/QuantifyManage-complex/RuleInstance.vue";

export default {
  name: "QuantifyManage",
  components: {RuleInstance, RuleTemplate},
  data() {
    return {
      showTemplate: true // 控制是否展示策略模板
    };
  },
  methods: {
    toggleTemplate() {
      this.showTemplate = !this.showTemplate;
    }
  }
}
</script>

<style scoped lang="less">
.quantify {
  display: flex;
  flex-direction: column;
  height: calc(100% - 49px);

  .quantify-title {
    margin-top: -10px;
    padding: 0 0 10px 10px;
    font-size: 17px;
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