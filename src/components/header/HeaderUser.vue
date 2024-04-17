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

.rotate-icon {
  transform: rotate(-90deg);
}
</style>
<template>
  <div>
    <Header :style="{ padding: 0 }" class="layout-header-bar">
      <Icon
          @click.native="collapsedSider"
          :class="{'rotate-icon':!showMenu}"
          :style="{ margin: '0 5px 0 20px', color: '#86909c',cursor: 'pointer' }"
          type="md-menu"
          size="20"
      ></Icon>
      <Icon
          type="md-refresh"
          size="20"
          :style="{ margin: '0 5px', color: '#86909c', cursor: 'pointer' }"
          @click="refresh"
      >
      </Icon>

      <div
          :style="{
          float: 'right',
          margin: '0 30px',
        }"
      >
        <div style="display: inline-block;margin-right: 8px;height: 32px;line-height: 32px"
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
            <!--            <DropdownItem name="changePassword">修改密码</DropdownItem>-->
            <DropdownItem name="logout">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Header>
    <Modal v-model="show" title="修改密码" @on-ok="ok" @on-cancel="cancel">
      <Row style="justify-content: center">
        <Row style="margin: 10px 0">
          <Col algin="center">
            <label>
              &nbsp;&nbsp;&nbsp;
              <span style="color: red">*</span>原密码：
            </label>
            <Input
                style="width: 200px"
                placeholder="请输入原密码"
                v-model="oldPassword"
                type="password"
                password
            ></Input>
          </Col>
        </Row>
        <Row style="margin: 10px 0">
          <Col>
            <label>
              &nbsp;&nbsp;&nbsp;
              <span style="color: red">*</span>新密码：
            </label>
            <Input
                style="width: 200px"
                placeholder="请输入新密码"
                v-model="newPassword"
                type="password"
                password
            ></Input>
          </Col>
        </Row>
      </Row>
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


export default {
  // 引用Home组件中reload方法
  inject: ["reload"],
  props: ["username", "envList"],
  mixins: [introMixin],
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      show: false,
      environmentList: [],
      environmentId: "",
      showMenu: true,
    };
  },
  mounted() {
    this.getEnvironmentList();
  },
  watch: {
    envList: function (params) {
      this.environmentList = this.envList || [];
    },
  },
  methods: {
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
        } else {
          this.$store.commit('getCurrentEnv', null)
          this.startIntro()
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
    modificationPasswordSuccess() {
      this.show = false;
      this.$Message.success("修改成功");
    },
    ok() {
      if (this.newPassword === "" && this.oldPassword === "") {
        this.$Message.warning("密码不可为空");
        return;
      }
      if (this.newPassword.length < 6) {
        this.$Message.warning("新密码长度不可小于6位");
        return;
      }
      let params = {
        oldPassword: this.$md5(this.oldPassword),
        newPassword: this.$md5(this.newPassword),
      };
      //修改密码http请求
      http.post(URL.modification, params, this.modificationPasswordSuccess);
    },
    cancel() {
      this.show = false;
    },
  },
};
</script>
