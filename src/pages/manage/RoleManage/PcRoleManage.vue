<style scoped lang="less">
.pc-container {
  display: flex;
  justify-content: space-between;

  .left-container {
    flex: 2;
    display: flex;
    flex-direction: column;

    .pc-scenes-title {
      font-size: 15px;
      margin-bottom: 3px;
    }
  }

  .pc-title {
    display: block;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
  }

  .pc-item-right {
    flex: 9;

    .pc-item-title {
      width: 100%;
      font-size: 16px;
      font-weight: bold
    }


    .pc-item-container {
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 6px;
      margin-bottom: 6px;
      margin-left: 5px;

      .pc-item-detail {
        margin: 6px 0;
      }

      .pc-item-readonly {
        //float: right;
        font-size: 12px;
        transform: scale(0.9);
      }
    }
  }
}
</style>

<template>
  <div class="pc-container">
    <div class="left-container">
      <span class="pc-title" style="width: 80%;">场景</span>
      <Checkbox v-for="item in scenesList" :key="item.winType" v-model="item.checked"
                :value="item.winType" class="pc-scenes-title"
                @click.prevent.native="()=>checkAllGroupChange(item)">{{ item.description }}
      </Checkbox>
    </div>
    <div class="pc-item-right">
      <span class="pc-title">菜单页面</span>
      <Row type="flex" class="pc-item-container" v-for="item in pcPermissionList" :key="item.menuId">
        <div class="pc-item-title">{{ item.menuName }}</div>
        <Col class="pc-item-detail" span=8 v-for="itemChild in item.details" :key="itemChild.menuId">
          <Checkbox class="pc-item-readonly" v-if="itemChild.readonlyShow"
                    v-model="itemChild.readonly"
                    @click.prevent.native="()=>handleCheckPermission(itemChild,'readonly')">
            只读
          </Checkbox>
          <Checkbox
              v-model="itemChild.checked"
              @click.prevent.native="()=>handleCheckPermission(itemChild,'permission')"
          >{{ itemChild.description }}
          </Checkbox>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

export default {
  name: "PcRoleManage",
  props: {
    currentPcList: {
      type: Array,
      default: () => []
    },
    currentScenesList: {
      type: Array,
      default: () => []
    },

  },
  data() {
    return {
      scenesList: [],
      pcPermissionList: [],
      formData: [],
      manuallyCheckedPermissions: new Set(),
    };
  },
  watch: {
    pcPermissionList: {
      handler() {
        let arr = this.formData.filter(i => i.checked === true).map(i => ({
          winType: i.winType,
          readonly: i.readonly
        }));
        this.$store.commit('role/setRolePermissionList', arr)
      },
      deep: true,
    },
    scenesList: {
      handler(list) {
        const checkedArr = [];
        const uncheckedArr = [];
        const allPermissions = [];
        const formScenes = []
        list.forEach(d => {
          if (d.checked) {
            checkedArr.push(...d.clientPermissionWinTypes);
            formScenes.push(d.winType)
          } else {
            uncheckedArr.push(...d.clientPermissionWinTypes);
          }
          allPermissions.push(...d.clientPermissionWinTypes);
        });
        this.$store.commit('role/setPcScenesList', formScenes) // 存储当前选中场景
        const uniqueCheckedArr = [...new Set(checkedArr)]; // 用于存储所有选中场景的权限ID
        const uniqueUncheckedArr = [...new Set(uncheckedArr)]; // 用于存储所有未选中场景的权限ID
        const uniqueAllPermissions = [...new Set(allPermissions)]; // 用于存储所有场景的权限ID
        // 添加新的权限 找到场景对应的权限勾选更改为true
        uniqueCheckedArr.forEach(permissionId => {
          this.pcPermissionList.forEach(item => {
            item.details.forEach(childItem => {
              if (childItem.winType === permissionId) {
                childItem.checked = true;
              }
            });
          });
        });
        // 如果当前选中的场景中包含了所有场景的权限，此时在更新场景时会取消所选场景的对应权限，如果标记一直存在则无法取消勾选,所以需要删除手动勾选的标记
        uniqueAllPermissions.forEach(i => {
          if (uniqueCheckedArr.includes(i)) {
            this.manuallyCheckedPermissions.delete(i);
          }
        })
        // 移除取消的权限，如果所有场景中均未选中该权限时移除
        uniqueUncheckedArr.forEach(permissionId => {
          // 判断该权限是否在其他选中场景中存在
          const isInOtherScenes = list.some(d => d.checked && d.clientPermissionWinTypes.includes(permissionId));
          // 如果权限不在uniqueCheckedArr中且不在其他场景中被选中，并且不在手动选中的权限中，则取消选中
          if (!uniqueCheckedArr.includes(permissionId) && !isInOtherScenes && !this.manuallyCheckedPermissions.has(permissionId)) {
            this.pcPermissionList.forEach(item => {
              item.details.forEach(childItem => {
                if (childItem.winType === permissionId) {
                  childItem.checked = false;
                }
              });
            });
          }
        });
      },
      deep: true,
    }
  },
  mounted() {
    this.getClientPermissionList()
    this.getScenesList()
  },
  methods: {
    setScenes(res) {
      // 初始化场景列表，并设置默认checked为false
      this.scenesList = (res.data || []).map(i => ({
        ...i,
        checked: false
      }));
      // 场景初始化选择
      this.currentScenesList.forEach(d => {
        this.scenesList.forEach(i => {
          if (i.winType === d) {
            i.checked = true
          }
        })
      })
    },
    // 设置权限列表
    setPermissions(res) {
      // 初始化场景列表，并设置默认checked为false
      this.pcPermissionList = (res.data || []).map(item => ({
            ...item,
            details: item.details.map(childItem => ({
                  ...childItem,
                  checked: false
                }
            ))
          })
      )
      // 合并平铺为[{permissionId:1,readonly:true,....}]格式
      this.formData = this.pcPermissionList.map(item => item.details).flat(1) || []
      let list = this.currentPcList || []
      this.formData.map(item => {
        list.map(d => {
          if (item.winType === d.winType) {
            item.readonly = d.readonly
            item.checked = true
          }
        })
      })
    },
    // 场景勾选联动
    checkAllGroupChange(item) {
      item.checked = !item.checked
    },
    // 菜单勾选
    handleCheckPermission(e, type) {
      if (type === 'readonly') {
        e.readonly = !e.readonly
      }
      if (type === 'permission') {
        e.checked = !e.checked
        if (e.checked) {
          this.manuallyCheckedPermissions.add(e.winType);
        } else {
          this.manuallyCheckedPermissions.delete(e.winType);
        }
      }
    },
    // 获取场景列表添加checked属性
    getScenesList() {
      http.get(URL.scenes, (res) => {
        this.setScenes(res)
      })
    },
    // 获取菜单列表添加checked属性
    getClientPermissionList() {
      http.get(URL.clientPermission, (res) => {
        this.setPermissions(res)
      })
    }
  }
};
</script>





