<style lang="less">
.ivu-table-tip {
  font-size: 26px;
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
          ><Icon type="md-add" /> 新建环境</Button
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
          placeholder="环境名称"
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
      <template slot="operator" slot-scope="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteEnvironment(row)" class="table-operate">
            {{ "删除" }}
          </div>
        </div>
      </template>
    </Table>
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
        title: "环境ID",
        key: "id",
        minWidth: 100,
      },
      {
        title: "环境名称",
        key: "name",
        minWidth: 100,
      },
      {
        title: "备注",
        key: "comment",
        minWidth: 100,
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
    this.getEnvironmentData();
  },
  methods: {
    // 获取环境列表
    getEnvironmentData(value) {
      let id = value || "";
      http.get(`${URL.environment}?name=${id}`, (res) => {
        this.tableData = res.data || [];
      });
    },
    // 环境名称模糊查询
    handleSearch(e) {
      let value = e.target.value;
      this.getEnvironmentData(value);
    },
    // 删除环境
    deleteEnvironment(row) {
      console.log(row, 333);
      this.getEnvironmentData();
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
          this.getEnvironmentData(), this.cancel();
        });
      } else {
        http.post(`${URL.user}/${this.userInfo.userId}`, this.userInfo, () => {
          this.getEnvironmentData(), this.cancel();
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 刷新
    refresh() {
      this.pagination = {
        total: 0,
        pageSize: 20,
        pageNumber: 1,
        username: "",
      };
      this.getEnvironmentData();
    },
  },
};
</script>
