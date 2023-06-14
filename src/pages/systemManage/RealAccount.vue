<style lang="less" scoped>
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
        <Button type="info" @click="modalChannel('new')"
          ><Icon type="md-add" /> 新增实体账户</Button
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
          :title="isNew ? '新增实体账户' : '编辑实体账户'"
        >
          <Form
            ref="ruleForm"
            :model="channelInfo"
            :label-width="210"
            label-colon
            :rules="userValidRules"
            autocomplete="off"
          >
            <Col :span="18">
              <FormItem label="通道ID" prop="channelId">
                <Input
                  v-model="channelInfo.channelId"
                  :disabled="!isNew"
                  placeholder="请输入通道ID"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="外部接口类型" prop="apiType">
                <Select
                  v-model="channelInfo.apiType"
                  placeholder="请选择通道类型"
                  :maxlength="32"
                  @on-change="getApiTerminalType"
                  :disabled="!isNew"
                >
                  <Option
                    v-for="item in channelType"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="通道类型" prop="terminalType">
                <Select
                  v-model="channelInfo.terminalType"
                  placeholder="请选择通道类型"
                  :maxlength="32"
                  :disabled="!isNew"
                  v-if="isNew"
                >
                  <Option
                    v-for="item in terminalType"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.name }}
                  </Option>
                </Select>
                <Select
                  v-model="channelInfo.terminalType"
                  placeholder="请选择通道类型"
                  :maxlength="32"
                  :disabled="!isNew"
                  v-else
                >
                  <Option
                    v-for="item in channelTrade"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="交易账号" prop="userId">
                <Input
                  v-model="channelInfo.userId"
                  placeholder="请输入交易账号"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="密码" prop="password">
                <Input
                  v-model="channelInfo.password"
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
                <i-Switch
                  v-model="channelInfo.active"
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
          v-model="pagination.channelId"
          style="float: right; width: 180px; border-radius: 20px"
          placeholder="通道ID"
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
    >
      <template slot="operator" slot-scope="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalChannel('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteChannel(row)" class="table-operate">
            删除
          </div>
          <!-- <Button
            type="info"
            size="small"
            @click="() => modalChannel('modify', row)"
            >编辑</Button
          >
          &nbsp;
          <Button type="error" size="small" @click="() => deleteChannel(row)"
            >删除</Button
          > -->
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
        title: "通道ID",
        key: "channelId",
        minWidth: 100,
      },
      {
        title: "外部接口类型",
        key: "apiTypeName",
        minWidth: 100,
      },
      {
        title: "通道类型",
        key: "terminalName",
        minWidth: 150,
      },
      {
        title: "交易账号",
        key: "userId",
        minWidth: 150,
      },
      {
        title: "是否启用",
        key: "active",
        minWidth: 150,
        render(h, params) {
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
      { title: "操作", slot: "operator", width: 150 },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      channelId: "",
    };
    return {
      loading: true,
      tableHeight: 0,
      userValidRules: {
        channelId: [{ required: true, message: "请输入通道ID" }],
        apiType: [{ required: true, message: "请选择外部接口类型" }],
        terminalType: [{ required: true, message: "请选择通道类型" }],
        // password: [{ required: true, message: "请输入密码" }],
        // userId: [{ required: true, message: "请选择用户角色" }],
        // active: [{ required: false, message: "请选择状态" }],
      },
      channelInfo: {
        channelId: "",
        apiType: [],
        terminalType: "",
        active: true,
        password: "",
        userId: "",
      },
      tableData: [],
      // 通道
      channelTrade: [],
      // 外部接口
      channelType: [],
      terminalType: [],
      columns1,
      pagination,
      showAddModal: false,
      isNew: true,
    };
  },
  mounted() {
    // 动态高度
    this.tableHeight = window.innerHeight - 260;
    this.getChannelData();
    // 获取外部接口类型
    this.getAPIType();
    // 获取通道类型
    this.getTerminalType();
  },
  methods: {
    // 获取实体帐户列表
    getChannelData(value) {
      this.pagination.channelId = value || "";
      // 实体账户列表
      http.post(URL.channelList, this.pagination, this.getChannelResponse);
    },
    getAPIType() {
      // 外部接口类型
      http.get(URL.apiType, (res) => {
        this.channelType = res.data;
      });
    },
    getTerminalType() {
      http.get(URL.channelType, (res) => {
        this.channelTrade = res.data;
      });
    },
    getApiTerminalType(e) {
      // 通道类型
      this.terminalType = [];
      if (this.isNew && e) {
        http.get(`${URL.inApiType}?code=${e}`, (res) => {
          this.terminalType = res.data;
        });
      }
    },
    getChannelResponse(res) {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      this.pagination.total = res.data.total;
      this.tableData = res.data.dataList || [];
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getChannelData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getChannelData();
    },
    // 用户代码模糊查询
    handleSearch(e) {
      let value = e.target.value;
      this.pagination.pageNumber = 1;
      this.getChannelData(value);
    },
    // 用户弹窗
    modalChannel(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          channelId: "",
          apiType: "",
          terminalType: "",
          active: true,
          password: "",
          userId: "",
          id: "",
        };
        Object.assign(this.channelInfo, info);
      } else {
        this.isNew = false;
        this.showAddModal = true;
        Object.assign(this.channelInfo, row);
        this.channelInfo.apiType = row.apiType;
        this.channelInfo.terminalType = row.terminalType;
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (!this.channelInfo.channelId) {
        this.$Message.error("通道ID不能为空");
        return;
      }
      if (!this.channelInfo.apiType) {
        this.$Message.error("请选择外部接口类型");
        return;
      }
      if (!this.channelInfo.terminalType) {
        this.$Message.error("请选择通道类型");
        return;
      }
      if (isNew) {
        http.put(URL.channel, this.channelInfo, () => {
          this.getChannelData(), this.cancel();
        });
      } else {
        http.post(URL.channel, this.channelInfo, () => {
          this.getChannelData(), this.cancel();
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 删除实体账户
    deleteChannel(row) {
      this.$Modal.confirm({
        title: `确认删除实体账户吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.channel}/${row.id}`, {}, () => {
            this.getChannelData();
          });
        },
        okText: "删除",
      });
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.pagination = {
        total: 0,
        pageSize: 20,
        pageNumber: 1,
        channelId: "",
      };
      this.getChannelData();
      this.getAPIType();
      this.getTerminalType();
    },
  },
};
</script>
