<style lang="less">
.menu-item {
  background-color: #09357e;
  color: #9ebdda;
  margin-right: -0.5px;
}
.ivu-menu-item {
  color: #9ebdda;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
  //   width: 100px;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background-color: #3a5d98;
  color: #02aff1;
  border-radius: 5px solid #3a5d98;
  border-radius: 5px;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  display: none;
}
a.ivu-menu-item {
  color: #9ebdda;
}
</style>
<template>
  <div>
    <Menu :class="menuitemClasses" theme="primary" width="auto">
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-paper" />
          <span v-if="!isCollapsed">内容管理</span>
          <span v-else></span>
        </template>
        <MenuItem name="1-1" to="/home/user-manage">文章管理</MenuItem>
        <MenuItem name="1-2" to="/home/role-manage">评论管理</MenuItem>
        <MenuItem name="1-3">举报管理</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-people" />
          <span v-if="!isCollapsed">用户管理</span>
          <span v-else></span>
        </template>
        <MenuItem name="2-1">新增用户</MenuItem>
        <MenuItem name="2-2">活跃用户</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="ios-stats" />
          <span v-if="!isCollapsed">统计分析</span>
          <span v-else></span>
        </template>
        <MenuGroup title="使用">
          <MenuItem name="3-1">新增和启动</MenuItem>
          <MenuItem name="3-2">活跃分析</MenuItem>
          <MenuItem name="3-3">时段分析</MenuItem>
        </MenuGroup>
        <MenuGroup title="留存">
          <MenuItem name="3-4">用户留存</MenuItem>
          <MenuItem name="3-5">流失用户</MenuItem>
        </MenuGroup>
      </Submenu>
    </Menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapsed: false,
    };
  },
  computed: {
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
};
</script>
