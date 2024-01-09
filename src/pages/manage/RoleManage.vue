<style lang="less">
.ivu-table-tip {
  font-size: 26px;
}

.modal {
  height: 650px;
  overflow: scroll;
  overflow-x: unset;
  margin-right: -60px;
  padding-right: 30px;
}

.ivu-modal-body {
  margin: 0 50px;
  // margin: 0 10px 0 50px;
  // height: 650px;
  // overflow: scroll;
  // overflow-x: unset;
}

.page-bottom {
  float: right;
  margin-top: 20px;
}

.title-font {
  display: inline;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
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
        >
          <Icon type="md-add"/>
          新增角色
        </Button
        >
        &nbsp;
        <Button type="success" @click="refresh()"
        >
          <Icon type="md-refresh"/>
          刷新
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
                :label-width="80"
                label-colon
                autocomplete="off"
                style="margin-left: -5px; font-weight: bold"
            >
              <Col :span="10">
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
            <!--            <Checkbox-->
            <!--                :value="checkALot"-->
            <!--                @click.prevent.native="handleCheckboxClick"-->
            <!--            >全选-->
            <!--            </Checkbox-->
            <!--            >-->
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
              <span class="title-font">
                {{ item[0].menuName }}
              </span>
              <!-- :value="checkAll" -->
              <Checkbox
                  :indeterminate="indeterminate[item[0].menuName]"
                  :value="checkAll[item[0].menuName]"
                  @click.prevent.native="handleCheckAll(item[0].menuName)"
                  style="float: right"
              >全选
              </Checkbox
              >
              <Row type="flex">
                <Col span="8" v-for="itemChild in item" :key="itemChild.id">
                  <CheckboxGroup
                      v-model="checkAllGroup"
                      @on-change="
                      checkAllGroupChange(
                        $event,
                        itemChild.menuName,
                        itemChild.description
                      )
                    "
                  >
                    <Checkbox
                        :label="itemChild.description"
                        style="margin: 5px"
                    ></Checkbox>
                  </CheckboxGroup>
                </Col>
              </Row>
            </div>
          </div>
          <div slot="footer">
            <Button type="text" @click="cancel">取消</Button>
            <Button type="primary" @click="ok(isNew)">确定</Button>
          </div>
        </Modal>
      </Col>
      <Col span="8" offset="8">
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
    </Row>
    <Table
        :columns="columns1"
        :data="tableData"
        class="table-content"
        :height="tableHeight"
        ref="table"
        :loading="loading"
        border
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

export default {
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "角色名称",
        key: "name",
        minWidth: 1000,
        resizable: true,
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
    };
    return {
      loading: true,
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
      // indeterminate: true,
      // checkAll: false,
      // checkAllGroup: [],
      indeterminate: {},
      checkAll: {},
      checkAllGroup: [],
      dataList: {},
      typeArr: {},
      // checkALot: false
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
      if (this.indeterminate[type]) {
        this.checkAll[type] = false;
      } else {
        this.checkAll[type] = !this.checkAll[type];
      }
      this.indeterminate[type] = false;
      if (!Array.isArray(this.typeArr[type])) {
        this.typeArr[type] = [];
      }
      if (this.checkAll[type]) {
        this.permissionInitData.map((d) => {
          if (d.menuName == type) {
            this.typeArr[type].push(d.description);
          }
        });
      } else {
        this.typeArr[type] = [];
      }

      this.checkAllGroup = Object.values(this.typeArr).flat();
      this.roleInfo.permissions = [];
      this.permissionInitData.map((d) => {
        for (let i = 0; i < this.checkAllGroup.length; i++) {
          if (d.description === this.checkAllGroup[i]) {
            this.roleInfo.permissions.push(d);
          }
        }
      });
      // 数组去重
      let uniquePermissions = new Set(this.roleInfo.permissions);
      this.roleInfo.permissions = Array.from(uniquePermissions);
    },
    checkAllGroupChange(data, type, opt) {
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
      // this.roleInfo.permissions.map((d) => {
      //   if (!Array.isArray(this.typeArr[type])) {
      //     this.typeArr[type] = [];
      //   }
      //   for (let i = 0; i < data.length; i++) {}
      //   if (d.description == opt) {
      //     this.typeArr[type].push(d.description);
      //   }
      // });
      // roleInfo.permissions为最新的选中数据，每次修改时,转化格式后,赋值给typeArr
      let result = this.roleInfo.permissions.reduce((acc, curr) => {
        if (acc[curr.menuName]) {
          acc[curr.menuName].push(curr);
        } else {
          acc[curr.menuName] = [curr];
        }
        return acc;
      }, {});
      let newObj = {};
      for (const k in result) {
        newObj[k] = Object.keys(result[k])
            .map((key) => result[k][key].description)
            .concat();
      }
      this.typeArr = newObj;
      let newObjLength = newObj[type] ? newObj[type].length : 0;
      if (newObjLength === this.permissionList[type].length) {
        this.indeterminate[type] = false;
        this.checkAll[type] = true;
      } else if (newObjLength > 0) {
        this.indeterminate[type] = true;
        this.checkAll[type] = false;
      } else {
        this.indeterminate[type] = false;
        this.checkAll[type] = false;
      }
    },

    // 获取环境列表
    getRoleData(value) {
      this.pagination.roleName = value || "";
      http.post(URL.role, this.pagination, (res) => {
        setTimeout(() => {
          this.loading = false;
        }, 200);
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
      });

      // });
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
        title: `确认删除角色吗？`,
        content: "<p>此操作不可逆</p>",
        onOk: () => {
          http.delete(`${URL.role}/${row.id}`, {}, () => {
            this.$Message.success("删除成功");
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
        this.checkAll = {};
        this.indeterminate = {};
        this.typeArr = {};
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.roleInfo = {...row};
        let arr = [];
        row.permissions.forEach((val) => {
          arr.push(val.description);
        });
        let arrList = {};
        for (const k in this.permissionList) {
          if (!Array.isArray(arrList[k])) {
            arrList[k] = [];
          }
          row.permissions.map((d) => {
            if (d.menuName == k) {
              arrList[k].push(d.description);
            }
          });
          if (arrList[k].length == this.permissionList[k].length) {
            this.checkAll[k] = true;
            this.indeterminate[k] = false;
          } else if (arrList[k].length > 0) {
            this.checkAll[k] = false;
            this.indeterminate[k] = true;
          } else {
            this.checkAll[k] = false;
            this.indeterminate[k] = false;
          }
        }
        // 编辑时row.permissions转换格式赋值给typeArr{}
        this.typeArr = arrList;
        this.checkAllGroup = arr;
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      if (isNew) {
        http.put(URL.role, this.roleInfo, () => {
          this.getRoleData(), this.cancel();
        });
      } else {
        http.post(`${URL.role}/${this.roleInfo.id}`, this.roleInfo, () => {
          this.getRoleData(), this.cancel();
        });
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 刷新
    refresh() {
      this.loading = true;
      this.pagination = {
        total: 0,
        pageSize: 20,
        pageNumber: 1,
        roleName: "",
      };
      this.getRoleData();
    },
    // 其他处理逻辑...
    // handleCheckboxClick() {
    //   this.checkALot = !this.checkALot
    //   for (const permissionListKey in this.permissionList) {
    //     this.handleCheckAll(this.permissionList[permissionListKey][0].menuName)
    //     console.log(this.permissionList, 222)
    //   }
    // },
  },
};
</script>
