<style lang="less" scoped>
.ivu-table-tip {
  font-size: 26px;
}

.page-bottom {
  float: right;
  margin-top: 20px;
}

.table-content {
  //border: 1px solid #e8eaec;
  .table-operate {
    font-size: 14px;
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
        >
          <Icon type="md-add"/>
          新增用户策略
        </Button
        >
        &nbsp;
        <Button type="success" @click="refresh()"
        >
          <Icon type="md-refresh"/>
          刷新
        </Button
        >
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="600"
            :mask-closable="false"
            :title="isNew ? '新增用户策略' : '编辑用户策略'"
        >
          <Form
              ref="ruleForm"
              :model="userStrategyInfo"
              :label-width="210"
              label-colon
              :rules="userValidRules"
              autocomplete="off"
          >
            <Col :span="18">
              <FormItem label="策略ID" prop="ruleId">
                <Input
                    v-model="userStrategyInfo.ruleId"
                    :disabled="!isNew"
                    placeholder="请输入策略ID"
                    :maxlength="16"
                    show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="策略Dll存储位置" prop="rulePath">
                <Input
                    v-model="userStrategyInfo.rulePath"
                    placeholder="请输入策略Dll存储位置"
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="策略版本" prop="ruleVersion">
                <Input
                    v-model="userStrategyInfo.ruleVersion"
                    placeholder="请输入策略版本"
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="策略名称" prop="ruleName">
                <Input
                    v-model="userStrategyInfo.ruleName"
                    placeholder="请输入策略名称"
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="策略配置文件存储位置" prop="configPath">
                <Input
                    v-model="userStrategyInfo.configPath"
                    placeholder="请输入策略配置文件存储位置"
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="用户代码" prop="customerId">
                <Select
                    v-model="userStrategyInfo.customerId"
                    placeholder="请选择用户代码"
                    :maxlength="32"
                >
                  <Option
                      v-for="item in userList"
                      :key="item.username"
                      :value="item.username"
                  >{{ item.username }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="策略类型" prop="ruleType">
                <Select
                    v-model="userStrategyInfo.ruleType"
                    placeholder="请选择策略类型"
                    :maxlength="32"
                >
                  <Option
                      v-for="item in strategyTypeList"
                      :key="item.name"
                      :value="item.name"
                  >{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="策略类型名称" prop="ruleTypeName">
                <Input
                    v-model="userStrategyInfo.ruleTypeName"
                    placeholder="请输入策略类型名称"
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="状态" prop="active">
                <i-Switch
                    v-model="userStrategyInfo.active"
                    style="margin-top: 5px"
                />
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
            v-model="pagination.ruleId"
            style="float: right; width: 180px; border-radius: 20px"
            placeholder="策略名称"
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
        :loading="loading"
        @on-sort-change="e=>handleSort(e,this.getUserStrategyData)"
    >
      <template slot="operator" slot-scope="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => changeUserStatus(row)" class="table-operate">
            {{ !row.active ? "启用" : "禁用" }}
          </div>
          <div @click="() => deleteStrategy(row)" class="table-operate">
            删除
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
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {getUserInfo} from "@/utils/token";
import {handleSort} from "@/common/common";

export default {
  data() {
    let columns1 = [
      {
        title: "策略ID",
        key: "ruleId",
        minWidth: 100,
        sortable: 'custom',
      },
      {
        title: "策略Dll存储位置",
        key: "rulePath",
        sortable: 'custom',
        minWidth: 200,
      },
      {
        title: "策略版本",
        key: "ruleVersion",
        sortable: 'custom',
        minWidth: 100,
      },
      {
        title: "策略名称",
        key: "ruleName",
        sortable: 'custom',
        minWidth: 100,
      },
      {
        title: "策略配置文件存储位置",
        key: "configPath",
        sortable: 'custom',
        minWidth: 150,
      },
      {
        title: "用户代码",
        key: "customerId",
        sortable: 'custom',
        minWidth: 100,
      },
      {
        title: "策略类型",
        key: "ruleType",
        sortable: 'custom',
        minWidth: 200,
      },
      {
        title: "策略类型名称",
        key: "ruleTypeName",
        sortable: 'custom',
        minWidth: 150,
      },
      {
        title: "状态",
        key: "active",
        minWidth: 90,
        sortable: 'custom',
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
      {title: "操作", slot: "operator", width: 150},
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      ruleId: "",
      sort: 'asc',
      sortField: ''
    };
    return {
      loading: true,
      tableHeight: window.innerHeight - 220,
      userValidRules: {
        // username: [{ required: true, message: "请输入用户策略账号" }],
        // customerName: [{ required: true, message: "请输入用户策略名称" }],
        // // password: [{ required: true, message: "请输入密码" }],
        // roles: [{ required: false, message: "请选择用户策略角色" }],
        // active: [{ required: false, message: "请选择状态" }],
      },
      userStrategyInfo: {
        ruleId: "",
        rulePath: "",
        ruleVersion: "",
        ruleName: "",
        configPath: "",
        customerId: "",
        ruleType: "",
        ruleTypeName: "",
        active: true,
      },
      tableData: [],
      columns1,
      pagination,
      showAddModal: false,
      isNew: true,
      userList: [],
      strategyTypeList: [],
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getUserStrategyData();
    this.getUserList();
    this.getStrategyType();
  },
  methods: {
    handleSort,
    // 获取用户策略列表
    getUserStrategyData() {
      http.post(URL.ruleList, this.pagination, this.getUserResponse);
    },
    getUserResponse(res) {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      this.pagination.total = res.data.total;
      this.tableData = res.data.dataList || [];
    },
    // 获取用户代码
    getUserList() {
      http.get(URL.userList, (res) => {
        this.userList = res.data;
      });
    },
    // 获取策略类型
    getStrategyType() {
      http.get(URL.ruleType, (res) => {
        this.strategyTypeList = res.data;
      });
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getUserStrategyData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getUserStrategyData();
    },
    // 用户策略代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getUserStrategyData();
    },
    // 用户策略弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          id: "",
          ruleId: "",
          rulePath: "",
          ruleVersion: "",
          ruleName: "",
          configPath: "",
          customerId: "",
          ruleType: "",
          ruleTypeName: "",
          active: true,
        };
        Object.assign(this.userStrategyInfo, info);
      } else {
        this.isNew = false;
        this.showAddModal = true;
        Object.assign(this.userStrategyInfo, row);
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (isNew) {
        http.put(URL.rule, this.userStrategyInfo, () => {
          this.getUserStrategyData(), this.cancel();
        });
      } else {
        http.post(URL.rule, this.userStrategyInfo, () => {
          this.getUserStrategyData(), this.cancel();
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 启用用户策略
    handleActiveEnable(res) {
      if (res.code !== "0") {
        this.$Message.error("启用失败：" + res.msg);
        return;
      }
      this.$Message.success(`用户策略已启用`);
      this.getUserStrategyData();
    },
    // 🈲用用户策略
    handleActiveDisable(res) {
      if (res.code !== "0") {
        this.$Message.error("禁用失败：" + res.msg);
        return;
      }
      this.$Message.error(`用户策略已禁用`);
      this.getUserStrategyData();
    },
    changeUserStatus(row) {
      let data = row.id;
      if (!row.active) {
        http.post(`${URL.rule}/${data}/enable`, {}, this.handleActiveEnable);
      } else {
        http.post(`${URL.rule}/${data}/disable`, {}, this.handleActiveDisable);
      }
    },
    deleteStrategy(row) {
      this.$Modal.confirm({
        title: `确认删除用户策略吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.rule}/${row.id}`, {}, () => {
            this.getUserStrategyData();
          });
        },
        okText: "删除",
      });
    },
    // 刷新
    refresh() {
      this.loading = true;
      // this.pagination = {
      //   total: 0,
      //   pageSize: 20,
      //   pageNumber: 1,
      //   ruleId: "",
      // };
      this.getUserStrategyData();
      this.getUserList();
      this.getStrategyType();
    },
  },
};
</script>
