<style lang="less">
.bck {
  // background-image: url("../../assets/478096259_20a6a6.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  height: 90%;
  position: relative;
  width: 100%;
}

.title {
  margin: 30px;
}

.curEnv {
  width: 200px;
  font-size: 19px;
  font-weight: bolder
}
</style>
<template>
  <div class="bck">
    <h1 class="title">欢迎使用本系统</h1>
    <div class="curEnv title" id="currentEnv">当前环境为：{{
        this.$store.state.currentEnv || '未选择'
      }}
    </div>
  </div>
</template>
<script>
import introMixin from "@/common/introMixin";

export default {
  mixins: [introMixin],
};
</script>
