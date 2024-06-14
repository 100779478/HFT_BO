<style scoped lang="less">
.title-font {
  display: inline;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.check-container {
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 6px;
  margin-bottom: 6px;
}

.check-item {
  margin: 5px
}
</style>

<template>
  <div>
    <div
        class="check-container"
        v-for="item in permissionList"
        :key="item.menuId">
      <span class="title-font">{{ item.menuName }}</span>
      <Checkbox
          style="float: right"
          :indeterminate="indeterminate[item.menuId]"
          :value="checkAll[item.menuId]"
          @click.prevent.native="handleCheckAll(item.menuId,item.details)"
      >全选
      </Checkbox>
      <Row type="flex">
        <Col span="6" v-for="itemChild in item.details" :key="itemChild.permissionId">
          <CheckboxGroup v-model="checkAllGroup[item.menuId]"
                         @on-change="(e)=>checkAllGroupChange(e,item.menuId,item.details)">
            <Checkbox
                class="check-item"
                :label="itemChild.permissionId"
            >{{ itemChild.permissionDescription }}
            </Checkbox>
          </CheckboxGroup>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import {formatRolePermissionList} from "@/pages/manage/RoleManage/roleIndex";

export default {
  name: "rolePermissionComponent",
  props: {
    permissionList: {
      type: Array,
      default: () => []
    },
    currentPermissionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      indeterminate: {},
      checkAll: {},
      checkAllGroup: {},
    }
  },
  created() {
    // 初始化渲染选中权限
    this.checkAllGroup = formatRolePermissionList(this.currentPermissionList)
    this.$store.commit('setRolePermissionList', this.checkAllGroup);
    const result = formatRolePermissionList(this.permissionList)
    // menuId对应的全选框初始化渲染
    Object.keys(this.checkAllGroup).forEach(menuId => {
      this.checkAllGroupChange(this.checkAllGroup[menuId], menuId, result[menuId]);
    });
  },
  methods: {
    updatePermissionList() {
      this.$forceUpdate();
      // 平铺选中权限permissionId为['1','2','3']
      const result = Object.values(this.checkAllGroup).flat(1)
      this.$store.commit('setRolePermissionList', result || []);
    },
    handleCheckAll(menuId, list) {
      // 判断是否已经是半选状态，如果是则取消全选，否则取反全选状态
      if (this.indeterminate[menuId]) {
        this.checkAll[menuId] = false;
      } else {
        this.checkAll[menuId] = !this.checkAll[menuId];
      }
      // 取消半选状态
      this.indeterminate[menuId] = false;
      // 根据全选状态设置选中的权限
      if (this.checkAll[menuId]) {
        this.checkAllGroup[menuId] = [...list.map(i => i.permissionId)];
      } else {
        this.checkAllGroup[menuId] = [];
      }
      this.updatePermissionList()
    },
    /**
     * @params {data}  当前menuId选中的权限列表
     * @params {menuId}
     * @params {list} 当前menuId对应的全部权限列表
     */

    checkAllGroupChange(data, menuId, list) {
      // 通过所选check的数组长度判断当前栏是否全部选中，以此改变全选框的状态
      if (data.length === list.length) {
        this.indeterminate[menuId] = false;
        this.checkAll[menuId] = true;
      } else if (data.length > 0) {
        this.indeterminate[menuId] = true;
        this.checkAll[menuId] = false;
      } else {
        this.indeterminate[menuId] = false;
        this.checkAll[menuId] = false;
      }
      this.updatePermissionList()
    }
  }
}
</script>
