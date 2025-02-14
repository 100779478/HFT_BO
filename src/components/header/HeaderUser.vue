<style lang="less">
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  height: 50px;
  line-height: 50px;
}

.select-style {
  width: 100px;
  margin-right: 20px;
}

.icon-item {
  margin: 0 5px 0 5px;
  color: #86909c;
  cursor: pointer
}

.rotate-icon {
  transform: rotate(-90deg);
}

.env-area {
  display: inline-block;
  margin-right: 8px;
  height: 32px;
  line-height: 32px
}

.current-time {
  width: 250px;
  display: inline-block;
  font-weight: bolder;
  margin-left: 15px;
}
</style>
<template>
  <div>
    <Header :style="{ padding: 0 }" class="layout-header-bar">
      <div style="margin-left: 20px;display: inline-block">
        <Icon
            @click.native="collapsedSider"
            :class="{'rotate-icon':!showMenu}"
            class="icon-item"
            type="md-menu"
            size="20"
        />
        <Icon type="md-expand" size="20"
              class="icon-item"
              @click="expandScreen"
        />
      </div>
      <div
          :style="{
          float: 'right',
          margin: '0 30px',
        }"
      >
        <div class="env-area"
             id="environmentDropdown"
        >
          <span style="font-size: 17px; font-weight: bold;margin-left: 20px">环境：</span>
          <Select
              :transfer="true"
              class="select-style"
              @on-change="postEnvironmentList"
              v-model="environmentId"
          >
            <Option
                v-for="item in environmentList"
                :key="item.id"
                :value="item.id"
            >{{ item.name }}
            </Option
            >
          </Select>
        </div>
        <Dropdown @on-click="handleClick" :transfer="true">
          <Avatar
              style="background-color: #00abe4; cursor: pointer"
              icon="md-person"
          >
          </Avatar>
          <span style="margin-left: 10px; cursor: pointer">你好, {{ username }}</span>
          <template v-slot:list>
            <DropdownMenu>
              <DropdownItem name="changePassword">修改密码</DropdownItem>
              <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
      </div>
    </Header>
    <Modal v-model="show" draggable
           sticky :mask-closable="false"
           mask title="修改密码" :width="400">
      <ResetPwdModal
          :clear="show"
          :show="true"
          @password-change="onPasswordChange"
          @confirm-password-change="onConfirmPasswordChange"
          @old-password-change="onchangeOldPassword"
          @strength-level="getStrengthLevel"/>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {removeToken} from "@/utils/token";
import introMixin from "@/mixins/introMixin";
import ResetPwdModal from "@/components/ResetPwdModal.vue";
import InputPassword from "@/components/InputPassword.vue";
import {encryptionModePassword} from "@/common/common";
import {ERROR_MSG, SUCCESS_MSG} from "@/common/constant";


export default {
  components: {InputPassword, ResetPwdModal},
  // 引用Home组件中reload方法
  inject: ["reload"],
  props: ["username", "envList", "serverTime"],
  mixins: [introMixin],
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      strength: '0',
      show: false,
      environmentList: [],
      environmentId: "",
      showMenu: true,
      currentTime: "",
    };
  },
  mounted() {
    this.getEnvironmentList();
  },
  watch: {
    envList: function () {
      this.environmentList = this.envList || [];
    },
  },
  methods: {
    onPasswordChange(val) {
      this.newPassword = val;
    },
    onConfirmPasswordChange(val) {
      this.confirmPassword = val;
    },
    onchangeOldPassword(val) {
      this.oldPassword = val;
    },
    getStrengthLevel(e) {
      this.strength = e
    },
    collapsedSider() {
      this.showMenu = !this.showMenu
      this.$emit('showMenu', this.showMenu);
    },
    getCurrentEnv() {
      http.get(URL.environmentCurrent, (res) => {
        if (res.code === '0') {
          this.environmentId = res.data.id;
          // 存储到vuex，在dashboard展示当前环境
          this.$store.commit('environment/getCurrentEnv', res.data.name)
          if (!res.data.id && res.data.enable) {
            // 新手引导执行
            this.startIntro()
          }
        }
      });
    },
    getEnvironmentList() {
      http.get(`${URL.environmentAll}`, (res) => {
        this.environmentList = res.data;
      });
      this.getCurrentEnv()
    },
    postEnvironmentList(val) {
      if (!val) {
        return;
      }
      http.post(`${URL.setEnvironment}/${val}`, {}, (res) => {
        if (res.code === "0") {
          this.getCurrentEnv()
          this.exitIntro()
          this.$Message.success(SUCCESS_MSG.envSetupSuccess);
          // 重载当前路由页面
          this.reload();
        }
      });
    },
    handleClick(name) {
      if (name === "changePassword") {
        this.show = true;
      } else if (name === "logout") {
        this.$Modal.confirm({
          title: `退出登录确认`,
          content: "<p>您确定退出登录当前账户吗？</p>",
          onOk: () => {
            http.delete(URL.logout, {}, removeToken);
            this.$router.push({name: "Login"});
          },
        });
      }
    },
// 全屏
    expandScreen() {
      if (this.isFullScreen()) {
        this.exitFullScreen();
      } else {
        this.requestFullScreen();
      }
    }
    ,
// 判断是否已经是全屏
    isFullScreen() {
      return (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
      );
    }
    ,
// 请求全屏
    requestFullScreen() {
      const docElm = document.documentElement;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.webkitRequestFullscreen) { // Safari
        docElm.webkitRequestFullscreen();
      } else if (docElm.mozRequestFullScreen) { // Firefox
        docElm.mozRequestFullScreen();
      } else if (docElm.msRequestFullscreen) { // IE/Edge
        docElm.msRequestFullscreen();
      }
    }
    ,
// 退出全屏
    exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    },
    modificationPasswordSuccess(res) {
      if (res.code === '0') {
        this.show = false;
        this.$Message.success(SUCCESS_MSG.modifySuccess);
      }
    }
    ,
    ok() {
      if (this.oldPassword === "") {
        this.$Message.error(ERROR_MSG.oldPasswordEmpty);
        return;
      }
      if (this.newPassword === "") {
        this.$Message.error(ERROR_MSG.newPasswordEmpty);
        return;
      }
      if (this.confirmPassword === "") {
        this.$Message.error(ERROR_MSG.confirmPasswordEmpty);
        return;
      }
      if (this.newPassword.includes(' ')) {
        this.$Message.warning(ERROR_MSG.passwordContainsSpace)
        return;
      }
      if (this.strength < 3) {
        this.$Message.error(ERROR_MSG.passwordStrengthInsufficient)
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.$Message.warning(ERROR_MSG.passwordsMismatch);
        return;
      }
      const passType = sessionStorage.getItem('passType')
      const oldPassword = encryptionModePassword(passType, this.oldPassword);
      const newPassword = encryptionModePassword(passType, this.newPassword);
      let params = {
        oldPassword,
        newPassword,
      };
      //修改密码http请求
      http.post(URL.modification, params, this.modificationPasswordSuccess);
    }
    ,
    cancel() {
      this.show = false;
    }
    ,
  },
}
;
</script>