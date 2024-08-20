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

/* 针对自动填充样式的选择器 */
input:-webkit-autofill {

  -webkit-box-shadow: 0 0 0 30px white inset !important;
  /* 更多样式设置 */
}

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col>
        <form autocomplete="off">
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
        </form>
      </Col>
      <Col style="position: absolute;right: 25px">
        <Button type="info" @click="modalChannel('new')" style="margin-right: 5px">
          <Icon type="md-add"/>
          新增实体账户
        </Button>
        <Button type="success" @click="handleExportOrders()" class="mr3"
        >
          <Icon type="md-download"/>
          导出
        </Button
        >
      </Col>
      <!--        <Button type="success" @click="refresh()">-->
      <!--          <Icon type="md-refresh"/>-->
      <!--          刷新-->
      <!--        </Button>-->
      <Modal
          v-model="showAddModal"
          draggable
          sticky
          mask
          :width="600"
          :mask-closable="false"
          :title="isNew ? '新增实体账户' : '编辑实体账户'"
      >
        <input type="password" autocomplete="new-password" style="position: absolute; top: -999px;">
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
              <form autocomplete="off">
                <Input
                    v-model="channelInfo.channelId"
                    :disabled="!isNew"
                    placeholder="请输入通道ID"
                    :maxlength="16"
                    show-message="false"
                ></Input>
              </form>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="外部接口类型" prop="apiType">
              <Select
                  v-model="channelInfo.apiType"
                  placeholder="请选择外部接口类型"
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
              <form autocomplete="off">
                <Input
                    v-model="channelInfo.userId"
                    placeholder="请输入交易账号"
                    :maxlength="16"
                    show-message="false"
                ></Input>
              </form>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="密码" prop="password">
              <div style="position: relative; height: 34px; overflow: hidden;">
                <!-- 下面的 Input 覆盖上面的 Input -->
                <form autocomplete="off">
                  <Input
                      @on-focus="handleFocus"
                      @on-blur="handleBlur"
                      ref="password"
                      v-model="channelInfo.password"
                      type="text"
                      placeholder="请输入密码"
                      maxlength="20"
                      :style="{ position: 'absolute', top: '0', left: '0', zIndex: typeInput ? '2' : 'auto', opacity: typeInput ? '1' : '0' }"
                  ></Input>
                </form>

                <!-- 上面的 Input 隐藏 -->
                <Input
                    @on-focus="handleFocus2"
                    v-model="channelInfo.password"
                    type="password"
                    placeholder="请输入密码"
                    maxlength="20"
                    :style="{ position: 'absolute', top: '0', left: '0', zIndex: typeInput ? 'auto' : '1', opacity: typeInput ? '0' : '1' }"
                ></Input>

              </div>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="交易地址" prop="addressList">
              <form autocomplete="off">
                <Input
                    v-model="channelInfo.addressList"
                    placeholder="请输入交易地址"
                    show-message="false"
                ></Input>
              </form>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="收盘时间" prop="closeTimePoint">
              <TimePicker
                  v-model="channelInfo.closeTimePoint"
                  placeholder="请选择收盘时间"
                  format="HH:mm:ss"
                  style="width: 100%;"
                  show-message="false"
              ></TimePicker>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="日志级别" prop="logLevel">
              <Select
                  v-model="channelInfo.logLevel"
                  placeholder="请选择日志级别"
                  :maxlength="32"
              >
                <Option
                    v-for="item in logLevelList"
                    :key="item.code"
                    :value="item.code"
                >{{ item.description }}
                </Option>
              </Select>
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
import {
  decryptPassword,
  encryptPassword,
  getApiType,
  getChannelType,
  getLogLevel,
  getUserType,
  handleSort,
  time
} from "@/common/common";

export default {
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "通道ID",
        key: "channelId",
        minWidth: 100,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "外部接口类型",
        key: "apiTypeName",
        minWidth: 100,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "通道类型",
        key: "terminalTypeName",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "交易地址",
        key: "addressList",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "收盘时间",
        key: "closeTimePoint",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "日志级别",
        key: "logLevel",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
        render: (h, {row}) => {
          const result = getLogLevel(row.logLevel);
          return h("span", result.description);
        },
      },
      {
        title: "是否启用",
        key: "active",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
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
      {
        title: "操作", slot: "operator", resizable: true,
        width: null, minWidth: 80
      },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      channelId: "",
      sort: 'asc',
      sortField: ''
    };
    return {
      typeInput: true,
      loading: true,
      tableHeight: window.innerHeight - 220,
      userValidRules: {
        channelId: [{required: true, message: "请输入通道ID"}],
        apiType: [{required: true, message: "请选择外部接口类型"}],
        terminalType: [{required: true, message: "请选择通道类型"}],
        // userId: [{ required: true, message: "请输入交易账号" }],
        // password: [{ required: true, message: "请输入密码" }],
        // active: [{ required: false, message: "请选择状态" }],
      },
      channelInfo: {
        channelId: "",
        apiType: [],
        terminalType: "",
        active: true,
        password: "",
        userId: "",
        addressList: "",
        closeTimePoint: "",
        logLevel: ""
      },
      tableData: [],
      // 外部接口
      channelType: getApiType(),
      // 通道
      channelTrade: getChannelType(),
      logLevelList: getLogLevel(),
      terminalType: [],
      columns1,
      pagination,
      showAddModal: false,
      isNew: true,
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getChannelData();
  },
  methods: {
    handleSort,
    handleFocus() {
      this.typeInput = true
      // 在第一个输入框获得焦点时将光标移动到输入框末尾
      // this.$nextTick(() => {
      //   console.log(this.$refs.password,3333)
      //   this.$refs.password.focus({
      //     cursor: 'end'
      //   });
      // });
      // this.$nextTick(() => {
      //   const inputElement = this.$refs.password.$el.querySelector('Input');
      //   inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
      //   console.log(inputElement, 333322)
      // });
    },
    handleFocus2() {
      this.typeInput = true
      this.$refs.password.focus();
    },
    handleBlur() {
      this.typeInput = false
    },
    // 获取实体账户列表
    getChannelData(value) {
      this.pagination.channelId = value || "";
      // 实体账户列表
      http.post(URL.channelList, this.pagination, this.getChannelResponse);
    },
    getApiTerminalType(e) {
      // 使用 selectedValue 获取选中项的值
      const selectedItem = this.channelType.find((item) => item.code === e);
      this.terminalType = selectedItem.channelTypes;
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
          addressList: "",
          closeTimePoint: "",
          logLevel: "",
        };
        Object.assign(this.channelInfo, info);
      } else {
        this.isNew = false;
        this.showAddModal = true;
        Object.assign(this.channelInfo, row);
        this.channelInfo.apiType = row.apiType;
        this.channelInfo.terminalType = row.terminalType;
        this.channelInfo.password = decryptPassword(row.password)
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
      const password = encryptPassword(this.channelInfo.password);
      if (isNew) {
        http.put(URL.channel, {...this.channelInfo, password}, () => {
          this.getChannelData();
          this.cancel();
        });
      } else {
        http.post(URL.channel, {...this.channelInfo, password}, () => {
          this.getChannelData();
          this.cancel();
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
          http.delete(`${URL.channel}/${row.channelId}`, {}, () => {
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
      //   channelId: "",
      // };
      this.getChannelData();
    },
    // 导出列表
    handleExportOrders() {
      // 校验策略编号必须为数字类型
      http.postBlob(URL.channelTradeExport, this.pagination, (res) => {
        const blob = res;
        // 创建link标签
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        // 设置链接元素的下载属性，指定文件名
        const dateObj = time.dateToLocaleObject(new Date());
        link.download = `实体账户_${dateObj.year}_${dateObj.month}_${dateObj.date}.xlsx`;
        // 将链接元素添加到文档中
        document.body.appendChild(link);
        // 触发点击事件以开始下载
        link.click();
        // 移除链接元素
        document.body.removeChild(link);
      });
    },
  },
};
</script>
