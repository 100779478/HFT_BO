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
        <Button type="info" @click="modalChannel('new')"
          ><Icon type="md-add" /> 新增分帐户</Button
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
          :title="isNew ? '新增分帐户' : '编辑分帐户'"
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
              <FormItem label="用户代码" prop="customerId">
                <Select
                  v-model="channelInfo.customerId"
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
              <FormItem label="交易通道" prop="tradeChannel">
                <Select
                  v-model="channelInfo.tradeChannel"
                  placeholder="请选择交易通道"
                  :maxlength="32"
                  @on-change="getTradeChannelApi"
                >
                  <Option
                    v-for="item in tradeChannel"
                    :key="item.channelId"
                    :value="item.channelId"
                    >{{ item.channelId }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="分帐号代码" prop="accountId">
                <Input
                  v-model="channelInfo.accountId"
                  placeholder="请输入分帐号代码"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="交易接口类型" prop="tradeApiTypeName">
                <Input
                  v-model="channelInfo.tradeApiTypeName"
                  placeholder="请输入交易接口类型"
                  :maxlength="16"
                  show-message="false"
                  :disabled="true"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem :label="assetLabel" prop="assetNo">
                <Input
                  v-model="channelInfo.assetNo"
                  :placeholder="`请输入${this.assetLabel}`"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
              <FormItem :label="positionLabel" prop="combiNo">
                <Input
                  v-model="channelInfo.combiNo"
                  :placeholder="`请输入${this.positionLabel}`"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
              <FormItem
                :label="foundationLabel"
                prop="apiAccountID"
                v-if="showLabel"
              >
                <Input
                  v-model="channelInfo.apiAccountID"
                  :placeholder="`请输入${this.foundationLabel}`"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
              <FormItem
                :label="traderLabel"
                prop="apiInvestorID"
                v-if="showLabel"
              >
                <Input
                  v-model="channelInfo.apiInvestorID"
                  :placeholder="`请输入${this.traderLabel}`"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="备注" prop="reserver5">
                <Input
                  v-model="channelInfo.reserver5"
                  type="textarea"
                  placeholder="请输入备注"
                  show-message="false"
                  :autosize="true"
                ></Input>
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
          v-model="pagination.accountId"
          style="float: right; width: 180px; border-radius: 20px"
          placeholder="分帐号代码"
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
          <Button
            type="info"
            size="small"
            @click="() => modalChannel('modify', row)"
            >编辑</Button
          >
          &nbsp;
          <Button type="error" size="small" @click="() => deleteChannel(row)"
            >删除</Button
          >
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
        key: "customerId",
        minWidth: 100,
      },
      {
        title: "用户名称",
        key: "customName",
        minWidth: 100,
      },
      {
        title: "交易通道",
        key: "tradeChannel",
        minWidth: 150,
      },
      {
        title: "分账号代码",
        key: "accountId",
        minWidth: 150,
      },
      {
        title: "交易接口类型",
        key: "tradeApiTypeName",
        minWidth: 150,
      },
      {
        title: "资产账户",
        key: "assetNo",
        minWidth: 150,
      },
      {
        title: "组合账户",
        key: "combiNo",
        minWidth: 150,
      },
      {
        title: "基金账户",
        key: "apiAccountID",
        minWidth: 150,
      },
      {
        title: "交易员编号",
        key: "apiInvestorID",
        minWidth: 150,
      },
      {
        title: "备注",
        key: "reserver5",
        minWidth: 150,
      },
      { title: "操作", slot: "operator", width: 150 },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      accountId: "",
    };
    return {
      assetLabel: "资产账户",
      positionLabel: "组合帐户",
      foundationLabel: "基金账户",
      traderLabel: "交易员编码",
      loading: true,
      tableHeight: 0,
      userValidRules: {
        // channelId: [{ required: true, message: "请输入通道ID" }],
        // apiType: [{ required: true, message: "请选择外部接口类型" }],
        // terminalType: [{ required: true, message: "请选择通道类型" }],
        // password: [{ required: true, message: "请输入密码" }],
        // userId: [{ required: true, message: "请选择用户角色" }],
        // active: [{ required: false, message: "请选择状态" }],
      },
      channelInfo: {
        customerId: "",
        customName: "",
        tradeChannel: "",
        accountId: "",
        tradeApiTypeName: "",
        assetNo: "",
        combiNo: "",
        apiAccountID: "",
        apiInvestorID: "",
        reserver5: "",
      },
      tableData: [],
      // 交易通道
      tradeChannel: [],
      // 用户列表
      userList: [],
      columns1,
      pagination,
      showAddModal: false,
      isNew: true,
      showLabel: false,
    };
  },
  mounted() {
    // 动态高度
    this.tableHeight = window.innerHeight - 260;
    this.getChannelData();
    // 获取交易通道
    this.getTradeChannel();
    this.getUserData();
  },
  methods: {
    // 获取分帐户列表
    getChannelData(value) {
      this.pagination.accountId = value || "";
      // 分帐户列表
      http.post(URL.channelTrade, this.pagination, this.getChannelResponse);
    },
    getTradeChannel() {
      // 获取交易通道
      http.get(URL.tradeChannel, (res) => {
        // 交易通道数组初始化
        this.tradeChannel = res.data;
      });
    },
    getUserData() {
      let params = {
        pageSize: 500,
        pageNumber: 1,
        username: "",
      };
      http.post(URL.user, params, (res) => {
        this.userList = res.data.dataList;
      });
    },
    getTradeChannelApi(e) {
      this.tradeChannel.map((d) => {
        if (e == d.channelId) {
          this.channelInfo.tradeApiTypeName = d.apiTypeName;
        }
      });
      if (this.channelInfo.tradeApiTypeName == "xQuant") {
        this.showLabel = true;
        this.assetLabel = "资产账户";
        this.positionLabel = "内证";
        this.foundationLabel = "基金账户";
        this.traderLabel = "交易员编码";
      } else if (this.channelInfo.tradeApiTypeName == "UFX") {
        this.showLabel = true;
        this.assetLabel = "资产单元";
        this.positionLabel = "投资组合";
        this.foundationLabel = "基金账户";
        this.traderLabel = "股东帐号";
      } else {
        this.showLabel = false;
        this.assetLabel = "资产账户";
        this.positionLabel = "组合帐户";
        this.foundationLabel = "基金账户";
        this.traderLabel = "交易员编码";
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
          customerId: "",
          tradeChannel: "",
          customName: "",
          accountId: "",
          tradeApiTypeName: "",
          assetNo: "",
          combiNo: "",
          apiAccountID: "",
          apiInvestorID: "",
          reserver5: "",
          id: "",
        };
        this.channelInfo = info;
        Object.assign(this.channelInfo);
      } else {
        this.isNew = false;
        this.showAddModal = true;
        Object.assign(this.channelInfo, row);
        // this.channelInfo.customerId = row.customerId;
        // this.channelInfo.tradeChannel = row.tradeChannel;
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (!this.channelInfo.customerId) {
        this.$Message.error("用户代码不能为空");
        return;
      }
      if (!this.channelInfo.tradeChannel) {
        this.$Message.error("请选择交易通道");
        return;
      }
      if (!this.channelInfo.accountId) {
        this.$Message.error("请填写分帐号代码");
        return;
      }
      if (!this.channelInfo.assetNo) {
        this.$Message.error(`${this.assetLabel}不能为空`);
        return;
      }
      if (!this.channelInfo.combiNo) {
        this.$Message.error(`${this.positionLabel}不能为空`);
        return;
      }
      if (isNew) {
        http.put(URL.customChannel, this.channelInfo, () => {
          this.getChannelData(), this.cancel();
        });
      } else {
        http.post(URL.customChannel, this.channelInfo, () => {
          this.getChannelData(), this.cancel();
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 删除分帐户
    deleteChannel(row) {
      this.$Modal.confirm({
        title: `确认删除分帐户吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.customChannel}/${row.id}`, {}, () => {
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
        accountId: "",
      };
      this.getChannelData();
      this.getTradeChannel();
    },
  },
};
</script>
