<style lang="less" scoped>
@import "@/style/manage.less";
</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col>
        <form autocomplete="off">
          <Input
              v-model="pagination.environmentName"
              style="float: right; width: 180px; border-radius: 20px"
              placeholder="环境名称"
              @on-keydown.enter="handleSearch"
              @on-change="handleSearch"
          >
            <Icon
                type="ios-search"
                slot="suffix"
                size="19"
                style="cursor: pointer"
                @click.native="handleSearch"
            />
          </Input>
        </form>
      </Col>
      <Col style="position: absolute;right: 25px">
        <Button type="info" @click="modalUser('new')"
                style="margin-right: 5px"
        >
          <Icon type="md-add"/>
          新增环境
        </Button
        >
        <Button type="success" @click="()=>handleExport(URL.environmentExport, this.pagination,'环境管理')" class="mr3"
        >
          <Icon type="md-download"/>
          导出
        </Button
        >
        <Modal
            v-model="showAddModal"
            draggable
            sticky
            mask
            :width="600"
            :mask-closable="false"
            :title="isNew ? '新增环境' : '编辑环境'"
            :loading="loading"
        >
          <Form
              ref="ruleForm"
              :model="environmentInfo"
              :label-width="210"
              label-colon
              autocomplete="off"
          >
            <Col :span="18">
              <FormItem label="环境名称" prop="name">
                <Input
                    v-model="environmentInfo.name"
                    placeholder="请输入环境名称"
                    :maxlength="20"
                    show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="备注" prop="name">
                <Input
                    v-model="environmentInfo.comment"
                    placeholder="请输入备注"
                    autocomplete="off"
                    :maxlength="32"
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
        :data="tableData"
        size="small"
        class="table-content"
        :height="tableHeight"
        ref="table"
        border
        @on-sort-change="e=>handleSort(e,this.getEnvironmentData)"
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteEnvironment(row)" class="table-operate">
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
            @on-sort-change="e=>handleSort(e,this.getEnvironmentData)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {handleExport, handleSort} from "@/common/common";
import {cancel} from "@/utils/tableUtils";

export default {
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "环境ID",
        key: "id",
        minWidth: 80,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "环境名称",
        key: "name",
        minWidth: 300,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "备注",
        key: "comment",
        minWidth: 300,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {title: "操作", slot: "operator", width: null, minWidth: 100,},
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      environmentName: "",
      sort: 'asc',
      sortField: ''
    };
    return {
      loading: true,
      tableHeight: window.innerHeight - 220,
      environmentInfo: {
        name: "",
        comment: "",
      },
      tableData: [],
      columns1,
      showAddModal: false,
      isNew: true,
      pagination
    };
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getEnvironmentData();
  },
  unMounted() {
    window.removeEventListener('resize', () => {
    })
  },
  methods: {
    cancel,
    handleExport,
    handleSort,
    // 获取环境列表
    getEnvironmentData() {
      // let id = value || "";
      http.post(`${URL.environment}`, this.pagination, (res) => {
        this.$emit("child-event", res.data.dataList);
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.pagination.total = res.data.total;
        this.tableData = res.data.dataList || [];
      });
    },
    // 删除环境
    deleteEnvironment(row) {
      this.$Modal.confirm({
        title: `确认删除环境吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.deleteEnvironment}/${row.id}`, {messageType:'删除环境成功'}, () => {
            this.getEnvironmentData();
          });
        },
        okText: "删除",
      });
    },
    // 用户弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        this.environmentInfo = {
          name: "",
          comment: "",
        };
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.environmentInfo = {...row};
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (isNew) {
        http.put(URL.addEnvironment, {...this.environmentInfo,messageType:'新增成功'}, () => {
          this.getEnvironmentData()
          this.cancel();
        });
      } else {
        http.post(
            `${URL.modificationEnvironment}`,
            {...this.environmentInfo,messageType:'修改成功'},
            () => {
              this.getEnvironmentData()
              this.cancel();
            }
        );
      }
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.getEnvironmentData();
    },
    handleSearch() {
      this.getEnvironmentData()
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getEnvironmentData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getEnvironmentData();
    },
  },
};
</script>
