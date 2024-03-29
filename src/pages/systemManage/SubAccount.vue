<style lang="less" scoped>
@import "@/style/manage.less";
</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col>
        <form autocomplete="off">
          <Input
              v-model="pagination.accountId"
              style="float: right; width: 180px; border-radius: 20px"
              placeholder="分账号代码"
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
        </form>
      </Col>
      <Col style="position: absolute;right: 25px">
        <Button type="info" @click="modalChannel('new')"
                style="margin-right: 5px"
        >
          <Icon type="md-add"/>
          新增分账户
        </Button
        >
        <Button type="success" @click="handleExportOrders()" class="mr3"
        >
          <Icon type="md-download"/>
          导出
        </Button
        >
        <!--        <Button type="success" @click="refresh()"-->
        <!--        >-->
        <!--          <Icon type="md-refresh"/>-->
        <!--          刷新-->
        <!--        </Button-->
        <!--        >-->
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="600"
            :mask-closable="false"
            :title="isNew ? '新增分账户' : '编辑分账户'"
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
                      :key="item.customerId"
                      :value="item.customerId"
                  >{{ item.customerId }}
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
                      v-for="(item,index) in tradeChannel"
                      :key="index"
                      :value="item.channelId"
                  >{{ item.channelId }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="分账号代码" prop="accountId">
                <Input
                    v-model="channelInfo.accountId"
                    placeholder="请输入分账号代码"
                    :maxlength="16"
                    show-message="false"
                    :disabled="!isNew"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="交易接口类型" prop="tdApiType">
                <Input
                    v-model="channelInfo.tdApiTypeName"
                    placeholder="请输入交易接口类型"
                    :maxlength="16"
                    show-message="false"
                    :disabled="true"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="业务类型" prop="logicType">
                <Select
                    v-model="channelInfo.logicType"
                    placeholder="请选择业务类型"
                    :maxlength="32"
                >
                  <Option
                      v-for="item in logicTypeList"
                      :key="item.code"
                      :value="item.code"
                  >{{ item.description }}
                  </Option>
                </Select>
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
                  prop="apiAccountId"
                  v-if="showLabel"
              >
                <Input
                    v-model="channelInfo.apiAccountId"
                    :placeholder="`请输入${this.foundationLabel}`"
                    :maxlength="16"
                    show-message="false"
                ></Input>
              </FormItem>
              <FormItem
                  :label="traderLabel"
                  prop="apiInvestorId"
                  v-if="showLabel"
              >
                <Input
                    v-model="channelInfo.apiInvestorId"
                    :placeholder="`请输入${this.traderLabel}`"
                    :maxlength="16"
                    show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="备注" prop="remark">
                <Input
                    v-model="channelInfo.remark"
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
    </Row>
    <Table
        :columns="columns1"
        size="small"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        ref="table"
        :loading="loading"
        border
        @on-sort-change="e=>handleSort(e,this.getChannelData)"
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
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {getLogicType, handleSort, time} from "@/common/common";

export default {
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "用户代码",
        key: "customerId",
        minWidth: 110,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      // {
      //   title: "用户名称",
      //   key: "customerName",
      //   minWidth: 100,
      // },
      {
        title: "交易通道",
        key: "tradeChannel",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "分账号代码",
        key: "accountId",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "交易接口类型",
        key: "tdApiType",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
        render: this.renderTdApiType
      },
      {
        title: "业务类型",
        key: "logicType",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
        render: this.renderLogicType
      },
      {
        title: "资产账户",
        key: "assetNo",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "组合账户",
        key: "combiNo",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "基金账户",
        key: "apiAccountId",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "交易员编号",
        key: "apiInvestorId",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "备注",
        key: "remark",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "操作", slot: "operator", minWidth: 150, resizable: true,
        width: null,
      },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      accountId: "",
      sort: 'asc',
      sortField: ''
    };
    return {
      assetLabel: "资产账户",
      positionLabel: "组合账户",
      foundationLabel: "基金账户",
      traderLabel: "交易员编码",
      loading: true,
      tableHeight: window.innerHeight - 220,
      userValidRules: {
        customerId: [{required: true, message: "请选择用户代码"}],
        tradeChannel: [{required: true, message: "请选择交易通道"}],
        accountId: [{required: true, message: "请输入分账号代码"}],
        tdApiType: [{required: true, message: "请输入交易接口类型"}],
        assetNo: [{required: true, message: "请输入资产账户"}],
        combiNo: [{required: true, message: "请输入组合账户"}],
        logicType: [{required: true, message: "请选择业务类型"}],
      },
      channelInfo: {
        customerId: "",
        customName: "",
        tradeChannel: "",
        accountId: "",
        tdApiType: "",
        assetNo: "",
        combiNo: "",
        apiAccountId: "",
        apiInvestorId: "",
        remark: "",
        logicType: "",
        tdApiTypeName: "",
      },
      tableData: [],
      // 交易通道
      tradeChannel: [],
      // 用户列表
      userList: [],
      // 业务类型列表
      logicTypeList: [],
      columns1,
      pagination,
      showAddModal: false,
      isNew: true,
      showLabel: false,
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getChannelData();
    // 获取交易通道
    this.getTradeChannel();
    this.getUserData();
    this.getLogicTypeList()
  },
  unMounted() {
    window.removeEventListener('resize', () => {
    })
  },
  methods: {
    handleSort,
    // 获取分账户列表
    getChannelData(value) {
      this.pagination.accountId = value || "";
      // 分账户列表
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
      http.get(URL.userList, (res) => {
        this.userList = res.data;
      });
    },
    getTradeChannelApi(e) {
      // 根据e查找对应的交易通道对象
      const selectedChannel = this.tradeChannel.find(channel => e === channel.channelId);
      if (selectedChannel) {
        // 更新tdApiType和其他相关状态
        this.channelInfo.tdApiType = selectedChannel.apiType;
        this.channelInfo.tdApiTypeName = selectedChannel.apiTypeName;
        this.showLabel = true; // 默认为true，根据后续的条件进一步调整
        switch (this.channelInfo.tdApiType) {
          case '8':
            this.assetLabel = '资产账户';
            this.positionLabel = '内证';
            this.foundationLabel = '基金账户';
            this.traderLabel = '交易员编码';
            break;
          case '5':
            this.assetLabel = '资产单元';
            this.positionLabel = '投资组合';
            this.foundationLabel = '基金账户';
            this.traderLabel = '股东账号';
            break;
          default:
            this.assetLabel = '资产账户';
            this.positionLabel = '组合账户';
            this.foundationLabel = '基金账户';
            this.traderLabel = '交易员编码';
            this.showLabel = false;
            break;
        }
      }
    },
    getLogicTypeList() {
      this.logicTypeList = getLogicType()
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
      this.channelInfo.tdApiTypeName = ""
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        this.channelInfo = {
          customerId: "",
          tradeChannel: "",
          customName: "",
          accountId: "",
          tdApiType: "",
          assetNo: "",
          combiNo: "",
          apiAccountId: "",
          apiInvestorId: "",
          remark: "",
          id: "",
          logicType: "",
        };
        Object.assign(this.channelInfo);
      } else {
        this.isNew = false;
        this.showAddModal = true;
        Object.assign(this.channelInfo, row);
        const selectedChannel = this.tradeChannel.find(channel => row.tdApiType === channel.apiType);
        if (selectedChannel) {
          this.channelInfo.tdApiType = selectedChannel.apiType;
          this.channelInfo.tdApiTypeName = selectedChannel.apiTypeName;
        }
        this.showLabel = true;
        switch (this.channelInfo.tdApiType) {
          case '8':
            this.assetLabel = '资产账户';
            this.positionLabel = '内证';
            this.foundationLabel = '基金账户';
            this.traderLabel = '交易员编码';
            break;
          case '5':
            this.assetLabel = '资产单元';
            this.positionLabel = '投资组合';
            this.foundationLabel = '基金账户';
            this.traderLabel = '股东账号';
            break;
          default:
            this.showLabel = false;
            this.assetLabel = '资产账户';
            this.positionLabel = '组合账户';
            this.foundationLabel = '基金账户';
            this.traderLabel = '交易员编码';
            break;
        }
      }
    },
    // 检查字段是否为空
    checkField(field, message) {
      if (!this.channelInfo[field]) {
        this.$Message.error(message);
        return false;
      }
      return true;
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (
          !this.checkField("customerId", "用户代码不能为空") ||
          !this.checkField("tradeChannel", "请选择交易通道") ||
          !this.checkField("logicType", "请选择业务类型") ||
          !this.checkField("accountId", "请填写分账号代码") ||
          !this.checkField("assetNo", `${this.assetLabel}不能为空`) ||
          !this.checkField("combiNo", `${this.positionLabel}不能为空`)
      ) {
        return;
      }
      if (isNew) {
        http.put(URL.customChannel, this.channelInfo, () => {
          this.getChannelData()
          this.cancel();
        });
      } else {
        http.post(URL.customChannel, this.channelInfo, () => {
          this.getChannelData()
          this.cancel();
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 删除分账户
    deleteChannel(row) {
      this.$Modal.confirm({
        title: `确认删除分账户吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.customChannel}/${row.accountId}`, {}, () => {
            this.$Message.success("删除成功");
            this.getChannelData();
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
      //   accountId: "",
      // };
      this.getChannelData();
      this.getTradeChannel();
    },
    // 导出列表
    handleExportOrders() {
      // 校验策略编号必须为数字类型
      http.postBlob(URL.customChannelExport, this.pagination, (res) => {
        const blob = res;
        // 创建link标签
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        // 设置链接元素的下载属性，指定文件名
        const dateObj = time.dateToLocaleObject(new Date());
        link.download = `分账户管理_${dateObj.year}_${dateObj.month}_${dateObj.date}.xlsx`;
        // 将链接元素添加到文档中
        document.body.appendChild(link);
        // 触发点击事件以开始下载
        link.click();
        // 移除链接元素
        document.body.removeChild(link);
      });
    },
    // 渲染交易员名称
    renderTdApiType(h, params) {
      return h(
          "span",
          params.row.tradeChannel
      );
    },
    // 渲染组合类型
    renderLogicType(h, params) {
      const logicType = this.logicTypeList.find(item => item.code === params.row.logicType);
      return h(
          "span",
          logicType?.description
      );
    },
  },
};
</script>
