<style lang="less">
.ivu-table-tip {
  font-size: 26px;
}
.page-bottom {
  float: right;
  margin-top: 20px;
}
.table-content {
  border: 1px solid #e8eaec;
  .table-operate {
    font-size: 12px;
    color: rgb(2, 175, 241);
    margin-right: 6px;
    cursor: pointer;
  }
}
</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col span="8">
        <Button type="info" @click="modalUser('new')"
          ><Icon type="md-add" /> 新增用户</Button
        >
        &nbsp;
        <Button type="success" @click="refresh()"
          ><Icon type="md-refresh" /> 刷新</Button
        >
        <Modal
          v-model="showAddModal"
          draggable
          sticky
          mask
          :width="600"
          :mask-closable="false"
          :title="isNew ? '新增用户' : '编辑用户'"
        >
          <Form
            ref="ruleForm"
            :model="userInfo"
            :label-width="210"
            label-colon
            :rules="userValidRules"
            autocomplete="off"
          >
            <Col :span="18">
              <FormItem label="用户账号" prop="username">
                <Input
                  v-model="userInfo.username"
                  :disabled="!isNew"
                  placeholder="请输入用户账号"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="用户名称" prop="customerName">
                <Input
                  v-model="userInfo.customerName"
                  placeholder="请输入用户名称"
                  autocomplete="off"
                  :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="密码" prop="password" v-show="isNew">
                <Input
                  v-model="userInfo.password"
                  placeholder="请输入密码"
                  type="password"
                  autocomplete="new-password"
                  maxlength="20"
                  password
                >
                </Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="状态" prop="active">
                <i-Switch v-model="userInfo.active" style="margin-top: 5px" />
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="用户角色" prop="roles">
                <!-- 下拉框中v-model的数据格式为['测试角色1','测试角色二',....] -->
                <Select multiple :max-tag-count="4" v-model="userInfo.roleStr">
                  <Option
                    v-for="item in userInfo.roles"
                    :value="item.name"
                    :key="item.id"
                    >{{ item.name }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
          </Form>
          <div slot="footer">
            <Button type="text" @click="cancel">取消</Button>
            <Button type="primary" @click="ok(isNew)">确定</Button>
          </div>
        </Modal>
      </Col>
      <Col span="8" offset="8">
        <Input
          v-model="pagination.username"
          style="float: right; width: 160px; border-radius: 20px"
          placeholder="用户代码"
          @on-keydown.enter="handleSearch"
          @on-change="handleSearch"
        >
          <Icon
            type="ios-search"
            slot="suffix"
            size="19"
            @click.native="handleSearch"
            style="cursor: pointer"
          />
        </Input>
      </Col>
    </Row>
    <Table
      :columns="columns1"
      :data="tableData"
      class="table-content"
      :height="tableHeight"
      ref="table"
    >
      <template slot="operator" slot-scope="{ row, index }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => changeUserStatus(row)" class="table-operate">
            {{ !row.active ? "启用" : "禁用" }}
          </div>
          <div class="table-operate">
            <Dropdown
              trigger="hover"
              transfer
              @on-click="doOperate($event, row, index)"
            >
              <a style="color: #02aff1; font-size: 12px">
                {{ "更多" }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="resetPassword">重置密码</DropdownItem>
                <DropdownItem name="dele" style="color: #ed4014"
                  >删除用户</DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </template>
    </Table>
    <template>
      <div class="page-bottom">
        <Page
          :total="pagination.total"
          :current="pagination.pageNumber"
          :page-size="pagination.pageSize"
          :page-size-opts="[20, 50, 100, 200]"
          show-sizer
          show-total
          @on-page-size-change="handleChangeSize"
          @on-change="handleChangePage"
        />
      </div>
    </template>
  </div>
</template>
<script>
import { http } from "@/utils/request";
import { URL } from "@/api/serverApi";
import { getUserInfo } from "@/utils/token";
export default {
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "用户代码",
        key: "username",
        minWidth: 100,
      },
      {
        title: "用户名称",
        key: "customerName",
        minWidth: 100,
      },
      {
        title: "角色名称",
        key: "roleName",
        width: 240,
        render: (h, params) => {
          const roleName = h(
            "Tooltip",
            {
              attrs: {
                content: params.row.roleName,
              },
            },
            [params.row.roleName]
          );
          return roleName;
        },
      },
      {
        title: "状态",
        key: "active",
        minWidth: 90,
        render: (h, params) => {
          const iconOpen = h("Icon", {
            props: {
              type: "ios-radio-button-on",
              color: "#19be6b",
            },
          });
          const iconClose = h("Icon", {
            props: {
              type: "ios-radio-button-on",
              color: "#ed4014",
            },
          });
          return h("span", [
            params.row.active ? iconOpen : iconClose,
            params.row.active ? "  已启用" : "  已禁用",
          ]);
        },
      },
      {
        title: "创建时间",
        key: "createTime",
        minWidth: 150,
      },
      {
        title: "更新时间",
        key: "updateTime",
        minWidth: 150,
      },
      { title: "操作", slot: "operator", width: 150 },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      username: "",
    };
    return {
      tableHeight: 0,
      userValidRules: {
        username: [{ required: true, message: "请输入用户账号" }],
        customerName: [{ required: true, message: "请输入用户名称" }],
        // password: [{ required: true, message: "请输入密码" }],
        roles: [{ required: false, message: "请选择用户角色" }],
        active: [{ required: false, message: "请选择状态" }],
      },
      userInfo: {
        username: "",
        customerName: "",
        password: "",
        roles: [],
        active: true,
        roleStr: "",
      },
      tableData: [],
      columns1,
      pagination,
      showAddModal: false,
      allRoleList: [],
      isNew: true,
    };
  },
  mounted() {
    // 动态高度
    this.tableHeight = window.innerHeight - 260;
    this.getUserData();
    this.getAllRoleData();
  },
  methods: {
    // 获取用户列表
    getUserData() {
      http.post(URL.user, this.pagination, this.getUserResponse);
    },
    // 获取所有角色列表
    getAllRoleData() {
      http.get(URL.role, this.getAllRoleResponse);
    },
    getUserResponse(res) {
      this.pagination.total = res.data.total;
      this.tableData = res.data.dataList || [];
      // 合并角色名称为一个字符串，用","分隔
      this.tableData.forEach((el) => {
        let roles = [];
        if (el.roles) {
          roles = el.roles;
        }
        let roleName = [];
        roles.forEach((item) => {
          roleName.push(item.name);
        });
        el.roleName = roleName.join(",");
      });
    },
    getAllRoleResponse(res) {
      this.userInfo.roles = res.data;
      this.allRoleList = res.data;
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getUserData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getUserData();
    },
    // 用户代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getUserData();
    },
    // 用户弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          username: "",
          customerName: "",
          password: "",
          active: true,
          roleStr: "",
        };
        Object.assign(this.userInfo, info, { roles: this.allRoleList });
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.userInfo = { ...row, roles: this.allRoleList };
        this.userInfo.roleStr = row.roleName.split(",");
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      let arr = (this.userInfo.roleStr || []).map((item, index) => ({
        id: "",
        name: item || "",
      }));
      for (let i = 0; i < this.userInfo.roles.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (this.userInfo.roles[i].name == arr[j].name) {
            arr[j].id = this.userInfo.roles[i].id;
          }
        }
      }
      this.userInfo.roles = arr;
      if (isNew) {
        this.userInfo.password = this.$md5(this.userInfo.password);
        http.put(URL.user, this.userInfo, () => {
          this.getUserData(), this.cancel();
        });
      } else {
        http.post(`${URL.user}/${this.userInfo.userId}`, this.userInfo, () => {
          this.getUserData(), this.cancel();
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 启用用户
    handleActiveEnable(res) {
      if (res.code !== "0") {
        this.$Message.error("启用失败：" + res.msg);
        return;
      }
      this.$Message.success(`用户已启用`);
      this.getUserData();
    },
    // 🈲用用户
    handleActiveDisable(res) {
      if (res.code !== "0") {
        this.$Message.error("禁用失败：" + res.msg);
        return;
      }
      this.$Message.error(`用户已禁用`);
      this.getUserData();
    },
    changeUserStatus(row) {
      let data = row.userId;
      // let customerName = row.customerName;
      let userId = Number(getUserInfo());
      if (data === userId) {
        this.$Message.error("无法禁用自己");
        return;
      }
      if (!row.active) {
        http.post(`${URL.user}/${data}/enable`, data, this.handleActiveEnable);
      } else {
        http.post(
          `${URL.user}/${data}/disable`,
          data,
          this.handleActiveDisable
        );
      }
    },
    // 更多操作
    moreOperations(row, type) {
      const password = this.$md5("123456");
      if (type === "resetPassword") {
        http.post(`${URL.user}/${row.userId}/reset`, {
          password,
        });
      }
      if (type === "delete") {
        http.delete(`${URL.user}/${row.userId}`);
      }
      setTimeout(() => {
        this.getUserData();
      }, 200);
    },
    doOperate(name, row, index) {
      switch (name) {
        case "resetPassword":
          this.$Modal.confirm({
            title: `确认重置密码吗？`,
            // content: "<p>此操作不可逆</p>",
            onOk: () => {
              this.moreOperations(row, "resetPassword");
            },
            okText: "确认",
          });
          break;
        case "dele":
          this.$Modal.confirm({
            title: `确认删除用户吗？`,
            content: "<p>此操作不可逆</p>",
            onOk: () => {
              this.moreOperations(row, "delete");
            },
            okText: "删除",
          });
          break;
        default:
      }
    },
    // 刷新
    refresh() {
      this.pagination = {
        total: 0,
        pageSize: 20,
        pageNumber: 1,
        username: "",
      };
      this.getUserData();
    },
  },
};
</script>
