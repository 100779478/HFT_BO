<template>
  <div>
    <Breadcrumb style="padding: '20px 0 0 20px'">
      <BreadcrumbItem>{{ this.routeList.meta.title }}</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
export default {
  data() {
    return {
      routeList: [],
    };
  },
  mounted() {},
  watch: {
    // 监听 $route 对象的变化
    $route: {
      handler(to, from) {
        this.routeList = to;
      },
      immediate: true,
    },
  },
};
</script>
<style lang="less">
.ivu-breadcrumb {
  margin: 20px 0 0 20px;
}
</style>