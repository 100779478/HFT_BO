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
  margin: 0 5px 0 20px;
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
      <Icon
          @click.native="collapsedSider"
          :class="{'rotate-icon':!showMenu}"
          class="icon-item"
          type="md-menu"
          size="20"
      ></Icon>
      <Icon
          type="md-refresh"
          size="20"
          class="icon-item"
          @click="refresh"
      >
      </Icon>
      <div class="current-time">当前时间：{{ currentTimeText }}</div>
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
        <Dropdown @on-click="handleClick">
          <Avatar
              style="background-color: #00abe4; cursor: pointer"
              icon="md-person"
          >
          </Avatar>
          <span style="margin-left: 10px; cursor: pointer"
          >你好, {{ username }}</span
          >
          <DropdownMenu slot="list">
            <DropdownItem name="changePassword">修改密码</DropdownItem>
            <DropdownItem name="logout">退出登录</DropdownItem>
          </DropdownMenu>
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
import introMixin from "@/common/introMixin";
import ResetPwdModal from "@/components/ResetPwdModal.vue";
import InputPassword from "@/components/InputPassword.vue";
import {encryptionModePassword} from "@/common/common";
import moment from "moment";


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
      currentTimeText: ""
    };
  },
  mounted() {
    this.getEnvironmentList();
    this.updateElapsedTime(); // 初始化显示
    this.timer = setInterval(() => {
      this.updateElapsedTime();
    }, 1000);
  },
  watch: {
    envList: function () {
      this.environmentList = this.envList || [];
    },
  },
  methods: {
    updateElapsedTime() {
      if (this.currentTime === "") {
        this.currentTime = this.serverTime ? new Date(this.serverTime).getTime() : ''
      } else {
        this.currentTime += 1000;
      }
      this.currentTimeText = this.currentTime ? moment(new Date(this.currentTime + 1000)).format("yyyy-MM-DD HH:mm:ss") : ''
    },
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
          this.$store.commit('getCurrentEnv', res.data.name)
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
          this.$Message.success("环境设置成功");
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
    //页面刷新
    refresh() {
      location.reload();
      // this.$router.push("/refresh");
    },
    modificationPasswordSuccess(res) {
      if (res.code === '0') {
        this.show = false;
        this.$Message.success("修改成功");
      }
    },
    ok() {
      if (this.oldPassword === "") {
        this.$Message.error("请输入旧密码");
        return;
      }
      if (this.newPassword === "") {
        this.$Message.error("请输入新密码");
        return;
      }
      if (this.confirmPassword === "") {
        this.$Message.error("请输入确认密码");
        return;
      }
      if (this.newPassword.includes(' ')) {
        this.$Message.warning('密码不允许包含空格')
        return;
      }
      if (this.strength < 3) {
        this.$Message.error("密码强度不足")
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.$Message.warning("两次密码输入不一致");
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
    },
    cancel() {
      this.show = false;
    },
  },
  beforeDestroy() {
    // 组件销毁时清除定时器
    clearInterval(this.timer);
  }
};
</script>
