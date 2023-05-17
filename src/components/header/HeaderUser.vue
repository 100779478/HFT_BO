<style lang="less">
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
<template>
  <div>
    <Header :style="{ padding: 0 }" class="layout-header-bar">
      <!-- <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            :style="{ margin: '0 20px', color: '#86909c' }"
            type="md-menu"
            size="20"
          ></Icon> -->
      <Icon
        type="md-refresh"
        size="20"
        :style="{ margin: '0 20px', color: '#86909c', cursor: 'pointer' }"
        @click="refresh"
      >
      </Icon>
      <div
        :style="{
          float: 'right',
          margin: '0 30px',
        }"
      >
        <Dropdown @on-click="handleClick">
          <Avatar
            style="background-color: #00abe4; cursor: pointer"
            icon="md-person"
          >
          </Avatar>
          <span style="margin-left: 10px; cursor: pointer">{{ "管理员" }}</span>
          <DropdownMenu slot="list">
            <DropdownItem name="changePassword">修改密码</DropdownItem>
            <DropdownItem name="logOut">退出登录</DropdownItem>
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
            <Input style="width: 200px" placeholder="请输入原密码"></Input>
          </Col>
        </Row>
        <Row style="margin: 10px 0">
          <Col>
            <label>
              &nbsp;&nbsp;&nbsp;
              <span style="color: red">*</span>新密码：
            </label>
            <Input style="width: 200px" placeholder="请输入新密码"></Input>
          </Col>
        </Row>
      </Row>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    handleClick(name) {
      if (name == "changePassword") {
        this.show = true;
      } else {
      }
    },
    refresh() {
      // this.$router.push('/home')
      location.reload();
    },
    ok() {},
    cancel() {},
  },
};
</script>