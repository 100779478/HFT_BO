<style lang="less" scoped>
.ivu-table-tip {
  font-size: 26px;
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
        <Button type="info" @click="modalUser('new')"
          ><Icon type="md-add" /> 新增环境</Button
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
                  :maxlength="16"
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
      <Col span="8" offset="8">
        <Input
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
            删除
          </div>
          <!-- <Button
            type="info"
            size="small"
            @click="() => modalUser('modify', row)"
            >编辑</Button
          >
          &nbsp;
          <Button
            type="error"
            size="small"
            @click="() => deleteEnvironment(row)"
            >删除</Button
          > -->
          <!-- <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteEnvironment(row)" class="table-operate">
            {{ "删除" }}
          </div> -->
        </div>
      </template>
    </Table>
  </div>
</template>
<script>
import { http } from "@/utils/request";
import { URL } from "@/api/serverApi";
export default {
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "环境ID",
        key: "id",
        minWidth: 80,
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
    return {
      loading: true,
      tableHeight: 0,
      environmentInfo: {
        name: "",
        comment: "",
      },
      tableData: [],
      columns1,
      showAddModal: false,
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
        this.$emit("child-event", res.data);
        setTimeout(() => {
          this.loading = false;
        }, 200);
        this.tableData = res.data || [];
      });
      // 传值给header组件
      // http.get(`${URL.environment}?name`, (res) => {
      //   this.$emit("child-event", res.data);
      // });
    },
    // 环境名称模糊查询r
    handleSearch(e) {
      let value = e.target.value;
      this.getEnvironmentData(value);
    },
    // 删除环境
    deleteEnvironment(row) {
      this.$Modal.confirm({
        title: `确认删除环境吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.deleteEnvironment}/${row.id}`, {}, () => {
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
        const info = {
          name: "",
          comment: "",
        };
        this.environmentInfo = info;
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.environmentInfo = { ...row };
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (isNew) {
        http.put(URL.addEnvironment, this.environmentInfo, () => {
          this.getEnvironmentData(), this.cancel();
        });
      } else {
        http.post(
          `${URL.modificationEnvironment}`,
          this.environmentInfo,
          () => {
            this.getEnvironmentData(), this.cancel();
          }
        );
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.getEnvironmentData();
    },
  },
};
</script>
