<style lang="less">
@import url("@/style/manage.less");

</style>
<template>
  <div>
    <Row style="margin: 10px">
      <Col span="">
        <form autocomplete="off">
          <Select v-model="pagination.active" style="width:100px;float: right;margin-left:5px" :clearable="true"
                  @on-change="handleSearch">
            <Option v-for="item in activeList" :value="item.code" :key="item.code">{{
                item.description
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
        <Button type="success" @click="()=>handleExport(URL.userExport, this.pagination,'用户管理')" class="mr-3"
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
              <form autocomplete="off">
                <FormItem label="密码" prop="password" v-show="isNew">
                  <InputPassword v-if="showAddModal" :value="this.userInfo.password"
                                 @inputPass='onchangePassword' @getStrength="getPwdStrength"
                                 :showPwdCheck="true"/>
                </FormItem>
              </form>
            </Col>
            <Col :span="18">
              <FormItem label="用户类型" prop="userType">
                <Select
                    v-model="userInfo.userType"
                    class="mr-3"
                    style="width: 120px"
                    placeholder="用户类型"
                >
                  <Option
                      v-for="item in this.$store.state.dictionary.dictionaryList.UserType"
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
                <Switch v-model="userInfo.active" style="margin-top: 5px"/>
              </FormItem>
            </Col>
            <Col :span="18">
              <FormItem label="用户角色" prop="roles">
                <!-- 下拉框中v-model的数据格式为['测试角色1','测试角色二',....] -->
                <Select multiple :max-tag-count="4" v-model="userInfo.roleStr">
                  <Option
                      v-for="item in allRoleList"
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
    <Modal v-model="showPwdModal" :width="400" :title="'重置密码'" draggable
           sticky :mask-closable="false">
      <ResetPwdModal :clear="showPwdModal" @password-change="onPasswordChange"
                     @confirm-password-change="onConfirmPasswordChange"
                     @strength-level="getStrengthLevel"
      />
      <div slot="footer" align="right">
        <Button class="btn" size="default" type="default" @click="cancelModifyImg">取消</Button>
        <Button class="btn" size="default" type="primary" @click="sureModifyImg">确定</Button>
      </div>
    </Modal>
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
      <template v-slot:operator="{ row }">
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
                @on-click="doOperate($event, row)"
            >
              <a style="color: #02aff1; font-size: 14px">
                {{ "更多" }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="resetPassword">
                  重置密码
                </DropdownItem>
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
            @on-page-size-change="e=>handleChangePage('pageSize', e, getUserData)"
            @on-change="e=>handleChangePage('pageNumber',e,getUserData)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";
import {getUserInfo} from "@/utils/token";
import {encryptionModePassword, getUserType, handleExport, handleSort} from "@/common/common";
import InputPassword from "@/components/InputPassword.vue";
import ResetPwdModal from "@/components/ResetPwdModal.vue";
import {tableMixin} from "@/mixins/tableMixin";
import {ACTIVE_LIST, ERROR_MSG, SUCCESS_MSG} from "@/common/constant";
import showMessage from "@/utils/message";

export default {
  components: {InputPassword, ResetPwdModal},
  props: ["userId"],
  mixins: [tableMixin],
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
        ellipsis: true,
        tooltip: true,
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
      customerName: "",
      active: "",
    };
    return {
      showPwdModal: false,
      row: '',
      strength: '0',
      resetPassword: "",
      confirmPassword: "",
      activeList: ACTIVE_LIST,
      pwdStrengthLevel: '0',
      userValidRules: {
        customerId: [{required: true, message: "请输入用户账号"}],
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
      columns1,
      pagination,
      showAddModal: false,
      allRoleList: [],
      isNew: true,
    };
  },
  mounted() {
    this.getUserData();
    this.getAllRoleData();
  },
  methods: {
    handleExport,
    onchangePassword(e) {
      this.userInfo.password = e
      this.userValidRules.password = e
    },
    getPwdStrength(q) {
      this.pwdStrengthLevel = q
    },
    handleSort,
    // 获取用户列表
    getUserData() {
      this.loading = true;
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
      this.allRoleList = res.data;
    },
    // 修改用户密码获取强度
    getStrengthLevel(e) {
      this.strength = e
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
        Object.assign(this.userInfo, info);
      } else {
        this.isNew = false;
        this.showAddModal = true;
        this.userInfo = {...row};
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
      for (let i = 0; i < this.allRoleList.length; i++) {
        for (let j = 0; j < arr?.length; j++) {
          if (this.allRoleList[i].name === arr[j].name) {
            list.push(this.allRoleList[i].id);
          }
        }
      }
      this.userInfo.roleIds = list;
      delete (this.userInfo.roles)
      if (!this.userInfo.customerId) {
        showMessage(ERROR_MSG.userAccountEmpty, {type: "warning"})
      }
      if (isNew) {
        const passType = sessionStorage.getItem('passType')
        if (this.userInfo.password.includes(' ')) {
          showMessage(ERROR_MSG.passwordContainsSpace, {type: "warning"})
        } else if (this.userInfo.customerId.includes(' ')) {
          showMessage(ERROR_MSG.customerIdContainsSpace, {type: "warning"})
        } else if (!this.userInfo.password) {
          showMessage(ERROR_MSG.passwordEmpty, {type: "warning"})
        } else if (this.pwdStrengthLevel < 3) {
          showMessage(ERROR_MSG.passwordStrengthInsufficient, {type: "error"})
        } else {
          const encryptedPassword = encryptionModePassword(passType, this.userInfo.password);
          http.put(URL.userEdit, {
            ...this.userInfo,
            password: encryptedPassword,
            messageType: SUCCESS_MSG.addSuccess
          }, (res) => {
            if (res.code === '0') {
              this.getUserData()
              this.cancel();
            }
          });
        }
      } else {
        http.post(
            `${URL.userEdit}/${this.userInfo.customerId}`,
            {...this.userInfo, messageType: SUCCESS_MSG.modifySuccess},
            (res) => {
              if (res.code === '0') {
                this.getUserData()
                this.cancel();
              }
            }
        );
      }
    },
    // 启用用户
    handleActiveEnable(res) {
      if (res.code !== "0") {
        // this.$Message.error("启用失败：" + res.msg);
        return;
      }
      showMessage(SUCCESS_MSG.userEnabled)
      this.getUserData();
    },
    // 🈲用用户
    handleActiveDisable(res) {
      if (res.code !== "0") {
        // this.$Message.error("禁用失败：" + res.msg);
        return;
      }
      showMessage(ERROR_MSG.userDisabled, {type: "error"})
      this.getUserData();
    },
    changeUserStatus(row) {
      let data = row.customerId;
      // let customerName = row.customerName;
      let customerId = Number(getUserInfo());
      if (data === customerId) {
        showMessage(ERROR_MSG.unableToDisableYourself, {type: "error"})
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
    onPasswordChange(val) {
      this.resetPassword = val;
    },
    onConfirmPasswordChange(val) {
      this.confirmPassword = val;
    },
    cancelModifyImg() {
      this.showPwdModal = false
    },
    sureModifyImg() {
      if (this.resetPassword === '' || this.confirmPassword === '') {
        showMessage(ERROR_MSG.passwordEmpty, {type: "error"})
      } else if (this.resetPassword !== this.confirmPassword) {
        showMessage(ERROR_MSG.passwordsMismatch, {type: "error"})
      } else if (this.strength < 3) {
        showMessage(ERROR_MSG.passwordStrengthInsufficient, {type: "warning"})
      } else {
        this.moreOperations(this.row, 'resetPassword')
        this.showPwdModal = false
      }
    },
    moreOperations(row, type) {
      const passType = sessionStorage.getItem('passType')
      const password = encryptionModePassword(passType, this.resetPassword);
      if (type === "resetPassword") {
        http.post(URL.userReset, {
          customerId: row.customerId,
          password,
          messageType: SUCCESS_MSG.resetSuccess
        });
      }
      setTimeout(() => {
        this.getUserData();
      }, 200);
    },
    doOperate(name, row) {
      switch (name) {
        case "resetPassword":
          this.showPwdModal = true
          this.resetPassword = ''
          this.confirmPassword = ''
          this.row = row
          break;
        case "dele":
          this.deleteRow(URL.userEdit, row.customerId, '用户', this.getUserData)
          break;
        default:
      }
    },
  },
};
</script>
