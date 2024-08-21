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
  width: 0; /* 收起时的宽度 */
  transition: width 0.3s ease;
}

.collapsed-menu i {
  //transform: translateX(5px);
  transition: font-size 0.3s ease, transform 0.3s ease;
  vertical-align: middle;
  font-size: 22px; /* 图标大小 */
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background-color: #3a5d98;
  color: #02aff1;
  border-radius: 5px;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  display: none;
}

a.ivu-menu-item {
  color: #9ebdda;
}

.menu-item span {
  text-overflow: unset;
  overflow: unset;
}

.ivu-menu {
  padding: 2px;
  margin: -1px;
}

.menu-container {
  overflow-y: auto;
  max-height: 92vh;
}

.menu-container::-webkit-scrollbar {
  display: none; /* 隐藏 WebKit 浏览器中的滚动条 */
}

</style>
<template>
  <div>
    <Menu
        :class="[menuitemClasses,'menu-container']"
        theme="primary"
        width="auto"
        accordion
        active-name="Dashboard"
    >
      <MenuItem name="Dashboard" :to="{ name: 'Dashboard' }">
        <Icon type="md-home"/>
        首页
      </MenuItem>
      <template v-for="item in menuList">
        <Submenu :name="item.title" :key="item.title">
            <template slot="title">
              <Icon :type="item.icon"/>
              <span>{{ item.title }}</span>
            </template>
            <template
                v-for="itemChild in item.children">
              <MenuItem
                  :name="itemChild.title"
                  :to="{ name: itemChild.path }"
                  :key="itemChild.title"
              >
                <Icon :type="itemChild.icon"/>
                {{ itemChild.title }}
              </MenuItem>
            </template>
        </Submenu>
      </template>
    </Menu>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

export default {
  // props: ['isCollapsed'],
  data() {
    return {
      menuList: [],
    };
  },
  computed: {
    menuitemClasses() {
      // return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
      return ["menu-item", !this.isCollapsed ? "" : ""];
    },
  },
  mounted() {
    this.$router.push({name: "Dashboard"});
    http.get(URL.menus, this.getMenuList);
  },
  methods: {
    getMenuList(res) {
      let dataInit = res.data;
      const data = [];
      dataInit.forEach((item) => {
        if (item.parentId === null) {
          data.push({
            id: item.id,
            icon: item.icon,
            title: item.name,
            path: item.code,
            children: [],
          });
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === item.parentId) {
              data[i].children.push({
                id: item.id,
                icon: item.icon,
                title: item.name,
                path: item.code,
                parentId: item.parentId,
              });
            }
          }
        }
      });
      this.menuList = data;
    },
  },
};
</script>
