<style lang="less" scoped>
@import "@/style/manage.less";

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
        <Button type="success" @click="()=>handleExport(URL.channelTradeExport,this.pagination,'实体账户')" class="mr-3"
        >
          <Icon type="md-download"/>
          导出
        </Button
        >
      </Col>
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
                    :maxlength="25"
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
                >{{ item.description }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="通道类型" prop="channelType">
              <Select
                  v-model="channelInfo.channelType"
                  placeholder="请选择通道类型"
                  :maxlength="32"
                  :disabled="!isNew"
              >
                <Option
                    v-for="item in channelTrade"
                    :key="item.code"
                    :value="item.code"
                >{{ item.description }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="通道名称" prop="channelLabel">
              <form autocomplete="off">
                <Input
                    v-model="channelInfo.channelLabel"
                    placeholder="请输入通道名称"
                    :maxlength="25"
                    show-message="false"
                ></Input>
              </form>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="交易账号" prop="userId"
                      v-show="showAccountAndPwd"
            >
              <form autocomplete="off">
                <Input
                    v-model="channelInfo.userId"
                    placeholder="请输入交易账号"
                    :maxlength="25"
                    show-message="false"
                ></Input>
              </form>
            </FormItem>
          </Col>
          <Col :span="20">
            <FormItem label="密码(加密)" prop="password"
                      v-show="showAccountAndPwd"
            >
              <div style="position: relative; height: 34px; overflow: hidden;">
                <!-- 下面的 Input 覆盖上面的 Input -->
                <form autocomplete="off">
                  <Input
                      v-show="showAccountAndPwd"
                      @on-focus="handleFocus"
                      @on-blur="handleBlur"
                      ref="password"
                      v-model="channelInfo.password"
                      type="text"
                      placeholder="若勾选输入原始密码，会自动加密保存"
                      :style="{ position: 'absolute', top: '0', left: '0', zIndex: typeInput ? '2' : 'auto', opacity: typeInput ? '1' : '0' }"
                  ></Input>
                </form>
                <!-- 上面的 Input 隐藏 -->
                <Input
                    @on-focus="handleFocus2"
                    v-model="channelInfo.password"
                    type="password"
                    placeholder="若勾选输入原始密码，会自动加密保存"
                    autocomplete="new-password"
                    :style="{ position: 'absolute', top: '0', left: '0', zIndex: typeInput ? 'auto' : '1', opacity: typeInput ? '0' : '1' }"
                ></Input>
              </div>
              <Checkbox v-model="encryptionPwd">输入原始密码</Checkbox>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="状态" prop="active">
              <Switch
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
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalChannel('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteRow(URL.channel,row.channelId,'实体账户',getChannelData)" class="table-operate">
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getChannelData)"
            @on-change="e=>handleChangePage('pageNumber',e,getChannelData)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {decryptPassword, encryptPassword, getApiType, getChannelType, handleExport, handleSort} from "@/common/common";
import {tableMixin} from "@/mixins/tableMixin";
import {ERROR_MSG, SUCCESS_MSG} from "@/common/constant";

export default {
  props: ["userId"],
  mixins: [tableMixin],
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
        key: "channelTypeName",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "通道名称",
        key: "channelLabel",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "交易账号",
        key: "userId",
        minWidth: 150,
        resizable: true,
        width: null,
        sortable: 'custom',
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
      channelId: "",
    };
    return {
      typeInput: true,
      userValidRules: {
        channelId: [{required: true, message: "请输入通道ID"}],
        apiType: [{required: true, message: ERROR_MSG.externalInterfaceTypeEmpty}],
        channelType: [{required: true, message: ERROR_MSG.channelTypeEmpty}],
        // userId: [{ required: true, message: "请输入交易账号" }],
        // password: [{ required: true, message: "请输入密码" }],
        // active: [{ required: false, message: "请选择状态" }],
      },
      channelInfo: {
        channelId: "",
        apiType: [],
        channelType: "",
        active: true,
        password: "",
        userId: "",
        channelLabel: ""
      },
      // 外部接口
      channelType: [],
      // 通道
      channelTrade: [],
      columns1,
      pagination,
      showAddModal: false,
      isNew: true,
      encryptionPwd: false,
      showAccountAndPwd: true,
    };
  },
  mounted() {
    this.getChannelData();
    // 获取外部接口类型
    this.getAPIType();
    // 获取通道类型
    this.getTerminalType();
  },
  watch: {
    // 如果加密状态发生改变则清空密码，防止重复加密
    encryptionPwd(newValue, oldValue) {
      this.channelInfo.password = null
    }
  },
  methods: {
    handleExport,
    handleSort,
    handleFocus() {
      this.typeInput = true
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
      this.loading = true;
      this.pagination.channelId = value || "";
      // 实体账户列表
      http.post(URL.channelList, this.pagination, this.getChannelResponse);
    },
    getAPIType() {
      // 外部接口类型
      this.channelType = getApiType()
    },
    getTerminalType() {
      this.channelTrade = getChannelType()
    },
    getApiTerminalType(e) {
      this.showAccountAndPwd = e !== 'o'
    },
    getChannelResponse(res) {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      this.pagination.total = res.data.total;
      this.tableData = res.data.dataList || [];
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
        this.isNew = true
        this.showAddModal = true
        this.showAccountAndPwd = true
        this.channelInfo = {
          channelId: "",
          apiType: "",
          channelType: "",
          active: true,
          password: "",
          userId: "",
          id: "",
          channelLabel: "",
        };
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.showAccountAndPwd = row.apiType !== 'o'
        Object.assign(this.channelInfo, row);
        this.channelInfo.apiType = row.apiType;
        this.channelInfo.channelType = row.channelType;
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (!this.channelInfo.channelId) {
        this.$Message.error(ERROR_MSG.channelIdEmpty);
        return;
      }
      if (!this.channelInfo.apiType) {
        this.$Message.error(ERROR_MSG.externalInterfaceTypeEmpty);
        return;
      }
      if (!this.channelInfo.channelType) {
        this.$Message.error(ERROR_MSG.channelTypeEmpty);
        return;
      }
      if (this.encryptionPwd) {
        this.channelInfo.password = encryptPassword(this.channelInfo.password)
      }
      if (isNew) {
        http.put(URL.channel, {...this.channelInfo, messageType: SUCCESS_MSG.addSuccess}, () => {
          this.getChannelData();
          this.cancel();
          // 默认每次新增或编辑加密密码都为空
          this.encryptionPwd = false
        });
      } else {
        http.post(URL.channel, {...this.channelInfo, messageType: SUCCESS_MSG.modifySuccess}, () => {
          this.getChannelData();
          this.cancel();
          // 默认每次新增或编辑加密密码都为空
          this.encryptionPwd = false
        });
      }
    },
  },
};
</script>
