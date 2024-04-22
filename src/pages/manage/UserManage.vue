<style lang="less">
@import url("@/style/manage.less");

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col span="">
        <form autocomplete="off">
          <Select v-model="pagination.actives" multiple style="width:180px;float: right;margin-left:5px"
                  @on-change="handleSearch">
            <Option v-for="item in activeList" :value="item.value" :key="item.value">{{
                item.label
              }}
            </Option>
          </Select>
          <Input
              v-model="pagination.customerName"
              style="float: right; width: 180px; border-radius: 20px"
              placeholder="用户名称"
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
        <Button type="info" @click="modalUser('new')" style="margin-right: 5px">
          <Icon type="md-add"/>
          新增用户
        </Button>
        <!--        <Button type="success" @click="refresh()">-->
        <!--          <Icon type="md-refresh"/>-->
        <!--          刷新-->
        <!--        </Button>-->
        <!--        <Button type="info" @click="handleSearch()" style="margin-right: 5px">-->
        <!--          <Icon type="md-search"/>-->
        <!--          查询-->
        <!--        </Button>-->
        <Button type="success" @click="handleExportOrders()" class="mr3"
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
            :title="isNew ? '新增用户' : '编辑用户'"
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
              <FormItem label="用户账号" prop="customerId">
                <Input
                    v-model="userInfo.customerId"
                    :disabled="!isNew"
                    placeholder="请输入用户账号"
                    :maxlength="20"
                    show-message="false"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="用户名称" prop="customerName">
                <Input
                    v-model="userInfo.customerName"
                    placeholder="请输入用户名称"
                    autocomplete="off"
                    :maxlength="32"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="18">
              <form autocomplete="off" id="122">
                <FormItem label="密码" prop="password" v-show="isNew">
                  <!--                  <Input-->
                  <!--                      v-model="userInfo.password"-->
                  <!--                      placeholder="请输入密码"-->
                  <!--                      type="password"-->
                  <!--                      autocomplete="off"-->
                  <!--                      maxlength="20"-->
                  <!--                  >-->
                  <!--                  </Input>-->
                  <InputPassword @inputPass='onchangePassword' v-if="showAddModal"/>
                </FormItem>
              </form>
            </Col>
            <Col :span="18">
              <FormItem label="用户类型" prop="userType">
                <Select
                    v-model="userInfo.userType"
                    class="mr3"
                    style="width: 120px"
                    placeholder="用户类型"
                >
                  <Option
                      v-for="item in this.$store.state.dictionaryList.UserType"
                      :value="item.code"
                      :key="item.code"
                  >{{ item.description }}
                  </Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="状态" prop="active">
                <i-Switch v-model="userInfo.active" style="margin-top: 5px"/>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="用户角色" prop="roles">
                <!-- 下拉框中v-model的数据格式为['测试角色1','测试角色二',....] -->
                <Select multiple :max-tag-count="4" v-model="userInfo.roleStr">
                  <Option
                      v-for="item in userInfo.roles"
                      :value="item.name"
                      :key="item.id"
                  >{{ item.name }}
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
        @on-sort-change="e=>handleSort(e,this.getUserData)"
    >
      <template slot="operator" slot-scope="{ row }">
        <div @click.stop style="display: flex; justify-content: flex-start">
          <div @click="() => modalUser('modify', row)" class="table-operate">
            编辑
          </div>
          <div @click="() => changeUserStatus(row)" class="table-operate">
            {{ !row.active ? "启用" : "禁用" }}
          </div>
          <div class="table-operate">
            <Dropdown
                trigger="hover"
                transfer
                @on-click="doOperate($event, row, index)"
            >
              <a style="color: #02aff1; font-size: 14px">
                {{ "更多" }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <!--                          <DropdownItem name="resetPassword">重置密码</DropdownItem>-->
                <DropdownItem name="dele" style="color: #ed4014"
                >删除用户
                </DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
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
import {getUserInfo} from "@/utils/token";
import {encryptionModePassword, getUserType, handleSort, time} from "@/common/common";
import InputPassword from "@/components/InputPassword.vue";

export default {
  components: {InputPassword},
  props: ["userId"],
  data() {
    let columns1 = [
      {
        title: "用户代码",
        key: "customerId",
        minWidth: 100,
        width: null,
        resizable: true,
        sortable: 'custom'
      },
      {
        title: "用户名称",
        key: "customerName",
        minWidth: 100,
        resizable: true,
        width: null,
        sortable: 'custom',
      },
      {
        title: "用户类型",
        key: "userType",
        minWidth: 100,
        resizable: true,
        width: null,
        sortable: 'custom',
        render: (h, {row}) => {
          const result = getUserType(row.userType);
          return h("span", result.description);
        },
      },
      {
        title: "角色名称",
        key: "roleName",
        resizable: true,
        width: 240,
        render: (h, params) => {
          return h(
              "Tooltip",
              {
                attrs: {
                  content: params.row.roleName,
                  maxWidth: 200,
                },
                style: {
                  whiteSpace: "nowrap",
                },
              },
              [
                // 省略号展示
                params.row.roleName.length > 30
                    ? params.row.roleName.slice(0, 15) + "..."
                    : params.row.roleName,
              ]
          );
        },
      },
      {
        title: "状态",
        key: "active",
        resizable: true,
        width: null,
        minWidth: 90,
        sortable: 'custom',
        render: (h, params) => {
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
        title: "创建时间",
        key: "createTime",
        resizable: true,
        width: null,
        sortable: 'custom',
        minWidth: 150,
      },
      {
        title: "更新时间",
        key: "updateTime",
        resizable: true,
        width: null,
        sortable: 'custom',
        minWidth: 150,
      },
      {
        title: "操作",
        slot: "operator",
        width: 180,
      },
    ];
    let pagination = {
      total: 0,
      pageSize: 20,
      pageNumber: 1,
      customerName: "",
      actives: [],
      sort: 'asc',
      sortField: ''
    };
    const activeList = [
      {
        value: true,
        label: '已启用'
      },
      {
        value: false,
        label: '已禁用'
      },
    ]
    return {
      activeList,
      loading: true,
      tableHeight: window.innerHeight - 220,
      userValidRules: {
        customerId: [{required: true, message: "请输入用户账号"}],
        // customerName: [{required: true, message: "请输入用户名称"}],
        password: [{required: true, message: "请输入密码"}],
        userType: [{required: true, message: "请选择用户类型"}],
        roles: [{required: false, message: "请选择用户角色"}],
        active: [{required: false, message: "请选择状态"}],
      },
      userInfo: {
        customerId: "",
        customerName: "",
        password: "",
        roles: [],
        active: true,
        roleStr: "",
        userType: "",
      },
      tableData: [],
      columns1,
      pagination,
      showAddModal: false,
      allRoleList: [],
      isNew: true,
    };
  },
  mounted() {
    // 动态高度
    this.getUserData();
    this.getAllRoleData();
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  unMounted() {
    window.removeEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    onchangePassword(e) {
      console.log(e, 433344444)
      this.userInfo.password = e
    },
    handleSort,
    // 获取用户列表
    getUserData() {
      http.post(URL.user, this.pagination, this.getUserResponse);
    },
    // 获取所有角色列表
    getAllRoleData() {
      http.get(URL.role, this.getAllRoleResponse);
    },
    getUserResponse(res) {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      this.pagination.total = res.data.total;
      this.tableData = res.data.dataList || [];
      // 合并角色名称为一个字符串，用","分隔
      this.tableData.forEach((el) => {
        let roles = [];
        if (el.roles) {
          roles = el.roles;
        }
        let roleName = [];
        roles.forEach((item) => {
          roleName.push(item.name);
        });
        el.roleName = roleName.join(",");
      });
    },
    getAllRoleResponse(res) {
      this.userInfo.roles = res.data;
      this.allRoleList = res.data;
    },
    handleChangePage(page) {
      this.pagination.pageNumber = page;
      this.getUserData();
    },
    handleChangeSize(size) {
      this.pagination.pageSize = size;
      this.getUserData();
    },
    // 用户代码模糊查询
    handleSearch() {
      this.pagination.pageNumber = 1;
      this.getUserData();
    },
    // 用户弹窗
    modalUser(type, row) {
      // 清除表单验证信息（初始化）
      this.$refs.ruleForm.resetFields();
      if (type === "new") {
        this.isNew = true;
        this.showAddModal = true;
        const info = {
          customerId: "",
          customerName: "",
          password: "",
          active: true,
          roleStr: "",
          userType: "",
        };
        Object.assign(this.userInfo, info, {roles: this.allRoleList});
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.userInfo = {...row, roles: this.allRoleList};
        this.userInfo.roleStr = row.roleName.split(",");
      }
    },
    // 新增弹窗确认按键
    ok(isNew) {
      let arr = (this.userInfo.roleStr || []).map((item) => ({
        id: "",
        name: item || "",
      }));
      let list = [];
      for (let i = 0; i < this.userInfo?.roles?.length; i++) {
        for (let j = 0; j < arr?.length; j++) {
          if (this.userInfo.roles[i].name === arr[j].name) {
            list.push(this.userInfo.roles[i].id);
          }
        }
      }
      this.userInfo.roleIds = list;
      delete (this.userInfo.roles)
      // if (!this.userInfo.userType) {
      //   this.userInfo.userType = null
      // }
      if (isNew) {
        const passType = sessionStorage.getItem('passType')
        if (!this.userInfo.password) {
          this.$Message.warning('请填写密码')
        } else {
          this.userInfo.password = encryptionModePassword(passType, this.userInfo.password);
          http.put(URL.userEdit, this.userInfo, () => {
            this.getUserData()
            this.cancel();
          });
        }
      } else {
        http.post(
            `${URL.userEdit}/${this.userInfo.customerId}`,
            this.userInfo,
            () => {
              this.getUserData()
              this.cancel();
            }
        );
      }
    },
    // 新增弹窗关闭
    cancel() {
      this.showAddModal = false;
    },
    // 启用用户
    handleActiveEnable(res) {
      if (res.code !== "0") {
        // this.$Message.error("启用失败：" + res.msg);
        return;
      }
      this.$Message.success(`用户已启用`);
      this.getUserData();
    },
    // 🈲用用户
    handleActiveDisable(res) {
      if (res.code !== "0") {
        // this.$Message.error("禁用失败：" + res.msg);
        return;
      }
      this.$Message.error(`用户已禁用`);
      this.getUserData();
    },
    changeUserStatus(row) {
      let data = row.customerId;
      // let customerName = row.customerName;
      let customerId = Number(getUserInfo());
      if (data === customerId) {
        this.$Message.error("无法禁用自己");
        return;
      }
      if (!row.active) {
        http.post(`${URL.userEdit}/${data}/enable`, data, this.handleActiveEnable);
      } else {
        http.post(
            `${URL.userEdit}/${data}/disable`,
            data,
            this.handleActiveDisable
        );
      }
    },
    // 更多操作
    moreOperations(row, type) {
      const passType = sessionStorage.getItem('passType')
      const password = encryptionModePassword(passType, '123456');
      if (type === "resetPassword") {
        http.post(`${URL.userEdit}/${row.userId}/reset`, {
          password,
        });
      }
      if (type === "delete") {
        http.delete(`${URL.userEdit}/${row.customerId}`);
      }
      setTimeout(() => {
        this.getUserData();
      }, 200);
    },
    doOperate(name, row) {
      switch (name) {
        case "resetPassword":
          this.$Modal.confirm({
            title: `确认重置密码吗？`,
            // content: "<p>此操作不可逆</p>",
            onOk: () => {
              this.moreOperations(row, "resetPassword");
            },
            okText: "确认",
          });
          break;
        case "dele":
          this.$Modal.confirm({
            title: `确认删除用户吗？`,
            content: "<p>此操作不可逆</p>",
            onOk: () => {
              this.moreOperations(row, "delete");
            },
            okText: "删除",
          });
          break;
        default:
      }
    },
    // 刷新
    refresh() {
      this.loading = true;
      // this.pagination = {
      //   total: 0,
      //   pageSize: 20,
      //   pageNumber: 1,
      //   customerId: "",
      //   actives: this.pagination.actives
      // };
      this.getUserData();
    },
    // 导出列表
    handleExportOrders() {
      // 校验策略编号必须为数字类型
      http.postBlob(URL.userExport, this.pagination, (res) => {
        const blob = res;
        // 创建link标签
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        // 设置链接元素的下载属性，指定文件名
        const dateObj = time.dateToLocaleObject(new Date());
        link.download = `用户管理_${dateObj.year}_${dateObj.month}_${dateObj.date}.xlsx`;
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
