<style lang="less">
@import url("@/style/manage.less");

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col span="">
        <form autocomplete="off">
          <Input
              v-model="pagination.customerId"
              style="float: right; width: 180px; border-radius: 20px"
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
          <Input
              v-model="pagination.portfolioName"
              style="float: right; width: 180px; border-radius: 20px"
              placeholder="投组名称"
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
        <Button type="info" @click="modalPortfolio('new')" style="margin-right: 5px">
          <Icon type="md-add"/>
          新增投组
        </Button>
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="600"
            :mask-closable="false"
            :title="isNew ? '新增投组' : '编辑投组'"
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
              <FormItem label="投组名称" prop="portfolioName">
                <Input
                    v-model="userInfo.portfolioName"
                    placeholder="请输入投组名称"
                    :maxlength="20"
                    show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="用户代码" prop="customerIds">
                <Select multiple :max-tag-count="4" v-model="userInfo.customerIds">
                  <Option
                      v-for="item in allUserList"
                      :value="item.customerId"
                      :key="item.customerId"
                  >{{ item.customerName }}
                  </Option>
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
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalPortfolio('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deletePortfolio(row)" class="table-operate">
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getPortfolioList)"
            @on-change="e=>handleChangePage('pageNumber',e,getPortfolioList)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {tableMixin} from "@/mixins/tableMixin";
import showMessage from "@/utils/message";

export default {
  props: ["userId"],
  mixins: [tableMixin],
  data() {
    let columns1 = [
      {
        title: "投组名称",
        key: "portfolioName",
        minWidth: 100,
        resizable: true,
        width: null,
      },
      {
        title: "用户代码",
        key: "customerIdsStr",
        minWidth: 100,
        width: null,
        resizable: true,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "创建用户",
        key: "createdBy",
        resizable: true,
        width: 240,
      },
      {
        title: "操作",
        slot: "operator",
        width: 180,
      },
    ];
    let pagination = {
      portfolioName: "",
      customerId: ""
    };
    return {
      userValidRules: {
        portfolioName: [{required: true, message: "请输入投组名称"}],
        customerIds: [{
          required: true, message: "请选择用户代码", trigger: 'change', validator: (rule, value, callback) => {
            if (!value || value.length === 0) {
              callback(new Error("请选择用户代码"));
            } else {
              callback();
            }
          }
        }],
      },
      userInfo: {
        portfolioName: "",
        customerIds: [],
      },
      columns1,
      pagination,
      showAddModal: false,
      allUserList: [],
      isNew: true,
    };
  },
  mounted() {
    this.getPortfolioList();
    this.getAllUserList()
  },
  methods: {
    // 获取投组与用户列表
    getPortfolioList() {
      this.loading = true;
      http.post(URL.portfolioList, this.pagination, res => {
        this.loading = false;
        this.pagination.total = res.data.total;
        this.tableData = (res.data.dataList || []).map(item => {
          const customerIdsStr = item.customerIds.join(',')
          return {...item, customerIdsStr}
        });
      });
    },
    // 获取所有用户列表
    getAllUserList() {
      http.get(URL.userList, res => {
        this.allUserList = res.data
      })
    },
    // 用户代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getPortfolioList();
    },
    // 用户弹窗
    modalPortfolio(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {};
        Object.assign(this.userInfo, info);
        this.userInfo.portfolioId = null
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.userInfo = {...row};
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      this.$refs.ruleForm.validate(valid => {
            if (!valid) return;
            // 校验通过，执行提交逻辑
            const payload = {
              portfolioId: this.userInfo.portfolioId,
              customerIds: this.userInfo.customerIds,
              portfolioName: this.userInfo.portfolioName,
            }
            http.post(URL.portfolio, payload, res => {
              if (res.code === '0') {
                showMessage('操作成功')
                this.showAddModal = false;
                this.getPortfolioList()
              }
            })
          }
      )
      ;
    },
    // 删除用户与投组关系
    deletePortfolio(row) {
      this.$Modal.confirm({
        title: '确认删除',
        content: `确定要删除投组「${row.portfolioName}」吗？删除后不可恢复。`,
        onOk: () => {
          http.delete(`${URL.portfolio}/${row.portfolioId}`, {messageType: '删除成功'}, res => {
            if (res.code === '0') {
              this.getPortfolioList()
            }
          });
        }
      });
    }
  },
};
</script>
