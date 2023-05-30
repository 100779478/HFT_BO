<style scoped lang='less'>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}

.ivu-layout {
  height: 100%;
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}

.ivu-layout-sider {
  .ivu-layout-sider-collapsed {
    width: 100px !important;
  }
}

.menu-icon {
  transition: all 0.3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Sider ref="side" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" width="260px"
        style="background-color: #09357e">
        <div style="margin: 15px 30px" v-if="!isCollapsed">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAASCAYAAADhc3ZwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEASURBVHgB7ZeNDYIwEIUfxgFwAnET3UAnMG6gE8AIbqAj6AS4gW4gTqAb1KspCTlAIF4pol/ywk9Lw+Ou7QGVZ4yaUN+IPbsr6OOTQtKZdFf1ic3zHzOERWj8gA76ZQM4xJrJNwYfRlWkfZKSdt+oetyC6Iqkqz5nbTpV5xBC1ZgqKQPYY8quN57nHeAAKyZNqgbZe2RwD0fYjGRn+JvsC62ZVM2JIcRPRNJqxcM4oRkXCKFN6iohWzmMSDcIQ1vIDI7Q6cq/2BI9Q5s8sntrmvQhesSA0miLfDQjU2teSyRWg7ZBuvAskP9j4FU+WNvX8NpCKJoJaUKnKwiual3hCWhuZ7lJSEETAAAAAElFTkSuQmCC"
            alt="" style="-webkit-user-drag: none" width="57px" height="18px" />
          <span style="
              display: inline-block;
              width: 1px;
              height: 20px;
              background: rgba(255, 255, 255, 0.7);
              margin: 0px 12.5px;
            "></span>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAWCAYAAAA2CDmeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATdSURBVHgB7VnLdeJAEGz8fIQAIAARAHtfAjAB4L3b98V3FIAdAA4A7sb3le8QwBIABAB3tktUo/asAAHy2vse9d6g0Wimp+bT8ylkvV63pQA0X13DYMe3QYHy4wPfaxpaBfLUpCBP2NMQM97WcCMlogifY3GloSfn40nOR1XD3YE8kZzO97eGNykXbQ1dKRHXeYk66qiko2GpYVapVKzDMfse9dnQMHXp6MgHlsX3mpXVkGi+Gb+hMyOWedD05Y76b1iHeQxsjFgPZmWs7/EennmAvbqGVy0XSTb44BZp2QfO9kdX5gncWU/DcYe3Y3C75Fs7UHdxhEsJXf7Fvffp+mm6uSiWBTZsa0OfHXa6ufMvW4b0OYENxu/YyLDegfseezuMt4J0z8fzzFuywO2O8RfHpRXw7zo+Q8ZjVzZy6VubZSHPQzATFqwIjW1K5uoLN6sX/O6Bzk8QQT614ZcIlF24snXZj4mzk+dJmAwrDV0OCnhONczlMCrGRZ9TLe/5C9veCMpMmX9W9r7hkTcg1vgxCaSuaDOqAKo74mXjHU/FMwevKM8UOZ2LiWCdv5B/jCuSalmQbPaC6OrQySdAoqFNt0a5hpQLDEKdnQieVeOpIXKd6zu5mtPpcyxNHDx/8sJANO2lYNsbZXrMNUl0+L6kC99LdppZMM+KTwPiNksT/GjZhORuZXOq8ctH4uJzV9bg7c+C72+0j+UCeXrc1EOe2Nix3CY8GLwxvRXUGZPjPXnNaX+MfYE2V47zNOCTuKcdEMrZ1MsGvaNOjzt4P/ksOJ69sjfmc3At5QMubzMyli8IejE8Ac+JesarXHDBBf8BKtzEDEtuzNjUxnbDPgW8kMHG1KWlp7dz7JYNXm6bQfLklCMvLpharsPTWUvjz3IksIf81DDiu90bhh90Bv8mmyP1lxkQ2ewj4IRONLnHjtWnYi4nthEDssoZyVvKA5g5dehInN0d5KW80JZMQ0rLBzrWXtBGap9lYh5r8R67rHHwBEb05HQmSqZ5wRsx43H/SRyvXL4APXjKk9YcGzxlmR65zdjmWDJ1IebxGu898vdXgho5vQbtBJ55tfDttMEbpm7mLoamTQ14JASxoek67jj76Dp2wHw7dSyX1+tJsdONtjapSYU6V5/3incaFu3FTI9Yp2lUlmerZzF9mHeRW2/0M6sD7dxqb0G+rmuD1/O8JtYK2ul1MGtnb/1eN0v1NXhIVbIZNhPnapQintKR24wsZsU3a4Bk7m42xq5cEanb6ppLdrvG7A49tmlptG23dCtrl8ZVoJdVaa/q+FYZDnnx1GxxYtlei/aaN0S2H3LW77Jp+ZeStRMDaf21YJt2LlkeEQ2C1MgZDrUukUCykK+Dv/gWBb2pr+GeHYeB2aWXHSOh5A7elewnY/sG/usAmbZsJJGmZFqX/UeAQWtzmbB1/BTAzi3tmG6VyEbqsFNR/YhDx3wH32OwYt2w8d2lz9yyc+wfVfCszjrT/dJVCgOS5GROSAKZTCuCF7XoovZnUd8MQQeSzWAhrc084Szwpw+vD3kdy8phrb33aZRibl16eJpJwjZw0za+PcmW5xCwswj58O8GlI9pY+TqRFqD+8LWC4u0k6vSjO2xZXAlF3we1pmedrPmn4IfoWVdUBzwViynWFl+IOEPTjgaNuzpi28AAAAASUVORK5CYII="
            alt="" style="-webkit-user-drag: none" />
        </div>
        <div style="margin: 18px 20px" v-else>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAASCAYAAADhc3ZwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEASURBVHgB7ZeNDYIwEIUfxgFwAnET3UAnMG6gE8AIbqAj6AS4gW4gTqAb1KspCTlAIF4pol/ywk9Lw+Ou7QGVZ4yaUN+IPbsr6OOTQtKZdFf1ic3zHzOERWj8gA76ZQM4xJrJNwYfRlWkfZKSdt+oetyC6Iqkqz5nbTpV5xBC1ZgqKQPYY8quN57nHeAAKyZNqgbZe2RwD0fYjGRn+JvsC62ZVM2JIcRPRNJqxcM4oRkXCKFN6iohWzmMSDcIQ1vIDI7Q6cq/2BI9Q5s8sntrmvQhesSA0miLfDQjU2teSyRWg7ZBuvAskP9j4FU+WNvX8NpCKJoJaUKnKwiual3hCWhuZ7lJSEETAAAAAElFTkSuQmCC"
            alt="" style="-webkit-user-drag: none" width="40px" height="14px" />
        </div>
        <MenuList />
        <div style="position: absolute; bottom: 20%; right: 30px" v-if="!isCollapsed">
          <img src="../../assets/menu_side_bg.png" style="-webkit-user-drag: none" alt="" />
        </div>
      </Sider>
      <Layout>
        <HeaderUser :username="currentUser.customerName"></HeaderUser>
        <Bread></Bread>
        <Content :style="{ margin: '20px', background: '#fff' }">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import UserManage from "../userManage/UserManage.vue";
import Bread from "../../components/breadCrumb/Bread.vue";
import MenuList from "@/components/menu/MenuList.vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import { http } from "@/utils/request";
import { URL } from "@/api/serverApi"
export default {
  components: { UserManage, Bread, MenuList, HeaderUser },
  data() {
    return {
      currentUser: {},
      isCollapsed: false,
    };
  },
  created() {
    console.log(this.$router.options.routes);
    // 加载当前用户信息
    this.currentUserInfo()
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
  },
  methods: {
    collapsedSider() {
      this.$refs.side.toggleCollapse();
    },
    currentUserInfo() {
      http.get(URL.current, (response) => {
        this.currentUser = response.data
      })
    }
  },
};
</script>
