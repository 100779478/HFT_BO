<style lang="less">
@import "@/style/manage.less";

.modal {
  height: 650px;
  overflow: scroll;
  overflow-x: unset;
  margin-right: -60px;
  padding-right: 30px;
}

.ivu-modal-body {
  margin: 0 50px;
}


.title-font {
  display: inline;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col>
        <form autocomplete="off">
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
        </form>
      </Col>
      <Col style="position: absolute;right: 25px">
        <Button type="info" @click="modalUser('new')"
                style="margin-right: 5px"
        >
          <Icon type="md-add"/>
          新增角色
        </Button
        >
        <Button type="success" @click="()=>handleExport(URL.roleExport, this.pagination,'角色管理')" class="mr3"
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
            :width="1000"
            :mask-closable="false"
            :title="isNew ? '新增角色' : '编辑角色'"
        >
          <div class="modal">
            <Form
                ref="ruleForm"
                :model="roleInfo"
                :label-width="90"
                label-colon
                autocomplete="off"
                style="margin-left: -5px; font-weight: bold"
            >
              <Col :span="10">
                <FormItem label="角色名称" prop="name">
                  <span slot="label" style="font-size: 16px;">角色名称:</span>
                  <Input
                      v-model="roleInfo.name"
                      placeholder="请输入角色名称"
                      :maxlength="20"
                      show-message="false"
                  ></Input>
                </FormItem>
              </Col>
            </Form>
            <Tabs :animated="false" v-model="activeTab">
              <TabPane label="web管理权限" name="web">
                <RolePermissionComponent v-if="showAddModal" :permissionList="permissionList"
                                         :currentPermissionList="currentPermissionList"/>
              </TabPane>
              <TabPane label="客户端管理权限" name="client">
                <PcRoleManage v-if="showAddModal" :currentPcList="currentPcPermissionList"
                              :currentScenesList="currentScenesList"/>
              </TabPane>
            </Tabs>
          </div>
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
        @on-sort-change="e=>handleSort(e,this.getRoleData)"
    >
      <template v-slot:operator="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => deleteRole(row)" class="table-operate">
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
import {handleExport, handleSort} from "@/common/common";
import RolePermissionComponent from "@/pages/manage/RoleManage/RolePermissionComponent.vue";
import PcRoleManage from "@/pages/manage/RoleManage/PcRoleManage.vue";
import {cancel} from "@/utils/tableUtils";
import {mapState} from "vuex";

export default {
  components: {PcRoleManage, RolePermissionComponent},
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "角色名称",
        key: "name",
        minWidth: 1000,
        resizable: true,
        sortable: 'custom',
        width: null,
      },
      {
        title: "操作", slot: "operator", minWidth: 200,
        resizable: true,
      },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      roleName: "",
      sort: 'asc',
      sortField: ''
    };
    return {
      activeTab: 'web',
      loading: true,
      pagination,
      tableHeight: window.innerHeight - 220,
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
      permissionList: [],
      // 当前用户权限列表
      currentPermissionList: [],
      // 当前选中角色客户端权限列表
      currentPcPermissionList: [],
      // 当前选中角色客户端场景列表
      currentScenesList: []
    };
  },
  computed: {
    ...mapState('role', {
      rolePermissionList: state => state.rolePermissionList,
      pcPermissionList: state => state.pcPermissionList,
      scenesList: state => state.scenesList,
    })
  },
  mounted() {
    // 动态高度
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
    this.getRoleData();
    this.getPermissionData();
  },
  unMounted() {
    window.removeEventListener('resize', () => {
    })
  },
  methods: {
    cancel,
    handleExport,
    handleSort,
    // 获取角色列表
    getRoleData(value) {
      this.pagination.roleName = value || "";
      http.post(URL.roleList, this.pagination, (res) => {
        setTimeout(() => {
          this.loading = false;
          this.pagination.total = res?.data.total;
        }, 200);
        this.tableData = res?.data.dataList || [];
      });
    },
    // 获取所有权限列表
    getPermissionData() {
      http.get(URL.permission, (response) => {
        this.permissionList = response?.data || []
      });
    },
    // 角色名称模糊查询
    handleSearch(e) {
      this.pagination.pageNumber = 1;
      let value = e.target.value;
      this.getRoleData(value);
    },
    // 删除角色
    deleteRole(row) {
      this.$Modal.confirm({
        title: `确认删除角色吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.role}/${row.id}`, {}, (res) => {
            if (res.code === "0") {
              this.$Message.success("删除成功");
            }
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
    // 角色弹窗
    modalUser(type, row) {
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        this.roleInfo = {
          name: "",
          id: null,
          permissions: [],
        };
        this.currentPermissionList = []
        this.currentPcPermissionList = []
        this.currentScenesList = []
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.currentPermissionList = row.permissions || []
        this.currentPcPermissionList = row.clientPermissions || []
        this.currentScenesList = row.scenesWinTypes || []
        this.roleInfo = {...row};
      }
      this.activeTab = 'web'
    },
    // 新增弹窗确认按键
    ok(isNew) {
      this.roleInfo.permissions = this.rolePermissionList || []
      this.roleInfo.clientPermissions = this.pcPermissionList || []
      this.roleInfo.scenesWinTypes = this.scenesList || []
      if (isNew) {
        http.put(URL.role, this.roleInfo, () => {
          this.$Message.success('新增成功')
          this.getRoleData()
          this.cancel();
        });
      } else {
        http.post(`${URL.role}/${this.roleInfo.id}`, this.roleInfo, () => {
          this.$Message.success('修改成功')
          this.getRoleData()
          this.cancel();
        });
      }
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.getRoleData();
    },
  },
};
</script>
