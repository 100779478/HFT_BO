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
        <Button type="info" @click="modalUser('new')"
          ><Icon type="md-add" /> 新增角色</Button
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
          :width="1000"
          :mask-closable="false"
          :title="isNew ? '新增角色' : '编辑角色'"
        >
          <Form
            ref="ruleForm"
            :model="roleInfo"
            :label-width="210"
            label-colon
            autocomplete="off"
          >
            <Col :span="18">
              <FormItem label="角色名称" prop="name">
                <Input
                  v-model="roleInfo.name"
                  placeholder="请输入角色名称"
                  :maxlength="16"
                  show-message="false"
                ></Input>
              </FormItem>
            </Col>
          </Form>
          <!-- 权限复选框 -->
          <div
            style="
              border-bottom: 1px solid #e9e9e9;
              padding-bottom: 6px;
              margin-bottom: 6px;
            "
            v-for="(item, index) in permissionList"
            :key="index"
          >
            <span style="font-size: 15px; font-weight: bold">
              {{ item[0].menuName }}
            </span>
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll(item[0].menuName)"
              style="position: absolute; right: 0"
              >全选</Checkbox
            >
            <Row type="flex" style="">
              <Col span="8" v-for="itemChild in item" :key="itemChild.id">
                <CheckboxGroup
                  v-model="checkAllGroup"
                  @on-change="checkAllGroupChange"
                >
                  <Checkbox :label="itemChild.description"></Checkbox>
                </CheckboxGroup>
              </Col>
            </Row>
          </div>

          <div slot="footer">
            <Button type="text" @click="cancel">取消</Button>
            <Button type="primary" @click="ok(isNew)">确定</Button>
          </div>
        </Modal>
      </Col>
      <Col span="8" offset="8">
        <Input
          style="float: right; width: 160px; border-radius: 20px"
          placeholder="角色名称"
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
          <Button
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
export default {
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "角色名称",
        key: "name",
        minWidth: 100,
      },
      { title: "操作", slot: "operator", minWidth: 150 },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      roleName: "",
    };
    return {
      pagination,
      tableHeight: 0,
      roleInfo: {
        name: "",
        id: null,
        permissions: [],
      },
      tableData: [],
      columns1,
      showAddModal: false,
      isNew: true,

      //权限列表
      permissionInitData: [],
      permissionList: [],
      checkAllGroup: [],
      indeterminate: true,
      checkAll: false,
    };
  },
  mounted() {
    // 动态高度
    this.tableHeight = window.innerHeight - 260;
    this.getRoleData();
    this.getPermissionData();
  },
  methods: {
    handleCheckAll(type) {
      console.log(type,6666)
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = ["香蕉", "苹果", "西瓜"];
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      console.log(data, this.permissionInitData, 333);
      this.roleInfo.permissions = [];
      this.permissionInitData.map((d) => {
        for (let i = 0; i < data.length; i++) {
          if (d.description === data[i]) {
            this.roleInfo.permissions.push(d);
          }
        }
      });
      // 数组去重
      let uniquePermissions = new Set(this.roleInfo.permissions);
      this.roleInfo.permissions = Array.from(uniquePermissions);

      // if (data.length === 3) {
      //   this.indeterminate = false;
      //   this.checkAll = true;
      // } else
      if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },

    // 获取环境列表
    getRoleData(value) {
      this.pagination.roleName = value || "";
      http.post(URL.role, this.pagination, (res) => {
        this.tableData = res.data.dataList || [];
      });
    },
    // 获取所有权限列表
    getPermissionData() {
      http.get(URL.permission, (response) => {
        let dataInit = response.data;
        this.permissionInitData = response.data;
        // 将权限列表中menuName相同的项分别整理到一个数组
        const result = dataInit.reduce((acc, curr) => {
          if (acc[curr.menuName]) {
            acc[curr.menuName].push(curr);
          } else {
            acc[curr.menuName] = [curr];
          }
          return acc;
        }, {});
        this.permissionList = result;
        console.log(this.permissionList);
      });
    },
    // 环境名称模糊查询
    handleSearch(e) {
      this.pagination.pageNumber = 1;
      let value = e.target.value;
      this.getRoleData(value);
    },
    // 删除环境
    deleteEnvironment(row) {
      this.$Modal.confirm({
        title: `确认删除环境吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.deleteEnvironment}/${row.id}`, {}, () => {
            this.getRoleData();
          });
        },
        okText: "删除",
      });
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getUserData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getUserData();
    },
    // 用户弹窗
    modalUser(type, row) {
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          name: "",
          id: null,
          permissions: [],
        };
        this.roleInfo = info;
        this.checkAllGroup = [];
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.roleInfo = { ...row };
        let arr = [];
        row.permissions.forEach((val) => {
          arr.push(val.description);
        });
        this.checkAllGroup = arr;
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      console.log(this.roleInfo);
      // if (isNew) {
      //   http.put(URL.role, this.roleInfo, () => {
      //     this.getRoleData(), this.cancel();
      //   });
      // } else {
      //   http.post(`${URL.modificationEnvironment}`, this.roleInfo, () => {
      //     this.getRoleData(), this.cancel();
      //   });
      // }
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
        roleName: "",
      };
      this.getRoleData();
    },
  },
};
</script>
