<template>
  <div class="contain">
    <div class="not-found"></div>
    <div class="text">
      <div>404</div>
      <span class="font"> 抱歉你访问的页面不存在</span>
      <div>
        <Button type="info" style="height: 40px; border-radius: 0"
          ><router-link to="/" style="font-size: 16px; color: white"
            >返回首页</router-link
          ></Button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang='less'>
.contain {
  display: flex;
  align-items: center;
  height: 80%;
  min-height: 500px;
  margin-left: 500px;
  padding-bottom: 300px;
}
.not-found {
  flex: 0 0 42.5%;
  width: 30.5%;
  height: 100%;
  padding-right: 152px;
  background-image: url("https://file.iviewui.com/iview-pro/icon-404-color.svg");
  background-repeat: no-repeat, repeat;
  /* width: 100%; */
  /* max-width: 430px; */
  float: right;
  height: 360px;
  background-position: 50% 50%;
  background-size: contain;
}
.text {
  flex: auto;
  margin-left: 50px;
  div {
    margin-bottom: 24px;
    color: #515a6e;
    font-weight: 600;
    font-size: 72px;
    line-height: 72px;
  }
  .font {
    font-size: 22px;
    color: #808695;
  }
}
</style>