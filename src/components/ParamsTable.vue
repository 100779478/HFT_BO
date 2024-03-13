<script>
import {RulePropType} from "@/common/common";

export default {
  name: "ParamsTable",
  props: {
    paramList: {
      type: Array,
      default: []
    },
    readOnly: {
      type: Boolean,
    }
  },
  data() {
    let columns2 = [
      {
        title: "参数名",
        key: "name",
        width: 150,
        render: this.renderEditable
      },
      {
        title: "参数描述",
        key: "description",
        width: 130,
        render: this.renderEditable
      },
      {
        title: "参数类型",
        key: "type",
        width: 150,
        className: 'col',
        render: this.renderSelectCell,
        renderHeader: (h, params) => {
          return h('span', [
            params.column.title,
            h('Tooltip', {
              props: {
                content: 'tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent',
                transfer: true,
                maxWidth: 300,
              }
            }, [
              h('Icon', {props: {type: 'md-alert'}})
            ])
          ]);
        }
      },
      {
        title: "参数默认值",
        key: "value",
        width: 150,
        render: this.renderEditable
      },
      {
        title: "参数分组",
        key: "group",
        width: 150,
        render: this.renderEditable
      },
      {
        title: "输入值范围",
        key: "range",
        width: 110,
        render: this.renderEditable,
        renderHeader: (h, params) => {
          return h('span', [
            params.column.title,
            h('Tooltip', {
              props: {
                content: 'tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent,tooltipContent,',
                transfer: true,
                maxWidth: 300,
              },
            }, [
              h('Icon', {props: {type: 'md-alert'}})
            ])
          ]);
        },
      },
      {
        title: "只读",
        key: "readOnly",
        width: 100,
        render: this.renderSelectCell
      },
      {
        title: "操作",
        slot: "operator",
        width: 80,
      },
    ]
    return {
      columns2
    }
  },
  computed: {
    dynamicColumns() {
      // 根据 readOnly 决定是否包含操作列
      return this.readOnly ? this.columns2.filter(column => column.slot !== 'operator') : this.columns2;
    },
  },
  watch: {
    paramList: 'normalizeParamList',
  },
  methods: {
    // 补全字段
    normalizeParamList() {
      // 定义所有可能的字段
      const allFields = ['name', 'description', 'type', 'value', 'group', 'range', 'readOnly'];
      // 遍历 paramList，确保每一行都包含完整的字段
      this.paramList.forEach((param) => {
        // 使用 Object.assign 为缺失的字段添加默认值
        Object.assign(param, ...allFields.map((field) => ({[field]: param[field] || ''})));
      });
    },
    // 删除参数列表
    deleteParams(row) {
      // 获取点击行的索引
      const rowIndex = row._index;
      // 根据点击行的索引找到 paramList 中对应索引的元素
      const paramIndex = rowIndex >= 0 && rowIndex < this.paramList.length ? rowIndex : -1;
      if (paramIndex !== -1) {
        // 如果找到匹配的元素，则执行删除操作
        this.paramList.splice(paramIndex, 1);
      }
    },
// 渲染table列表
    renderEditable(h, params) {
      const {row, column} = params;
      const rowIndex = row._index;
      if (this.readOnly) {
        // 只渲染 span 标签
        return h("span", row[column.key].toString());
      }
      // 渲染输入框
      return h("Input", {
        props: {
          value: row[column.key].toString(),
          disabled: this.readOnly,
        },
        on: {
          input: (event) => {
            this.paramList[rowIndex][column.key] = event;
          },
        },
      });
    },
    renderSelectCell(h, params) {
      const {row, column} = params;
      const rowIndex = row._index;
      if (this.readOnly) {
        // 只渲染 span 标签，同时判断展示
        const value = row[column.key].toString();
        const options = column.key === "type" ? RulePropType() : [
          {code: "true", description: "是"},
          {code: "false", description: "否"},
        ];
        const displayValue = options.find(option => option.code === value)?.description || value;
        return h("span", displayValue);
      }
      // 渲染下拉框
      return h(
          "Select",
          {
            props: {
              value: row[column.key].toString(),
              disabled: this.readOnly,
            },
            on: {
              input: (event) => {
                this.paramList[rowIndex][column.key] = event;
              },
            },
          },
          this.renderSelectOptions(h, column.key)
      );
    },
    renderSelectOptions(h, column) {
      const readList = [
        {code: "true", description: "是"},
        {code: "false", description: "否"},
      ];
      const options = column === "type" ? RulePropType() : readList;

      // 这里你可以根据需要动态生成 Options，例如从数据中获取选项列表
      return options.map((option) => {
        return h("Option", {
          props: {
            value: option.code,
            label: option.description,
          },
        });
      });
    },


  }
}
</script>

<template>
  <Table
      :columns="dynamicColumns"
      :data="paramList"
      :width="1027"
      class="table-content"
      style="position: unset"
      :height="450"
      size="small"
      ref="table2"
  >
    <template slot="operator" slot-scope="{ row }">
      <div @click.stop style="display: flex; justify-content: flex-start">
        <div @click="() => deleteParams(row)" class="table-operate">
          删除
        </div>
      </div>
    </template>
  </Table>
</template>

<style scoped lang="less">
.ivu-table-tip {
  font-size: 26px;
}

.page-bottom {
  float: right;
  margin-top: 20px;
}

.modal__content {
  display: flex;
}

.modal__content-left {
  flex-grow: 0.5; /* 占据60%的空间 */
  /* 其他样式，如宽度、背景等 */
}

.ivu-select-dropdown {
  z-index: 1000; /* 调整为合适的层叠顺序值 */
}

.modal__content-right {
  //flex-grow: 0.4; /* 占据40%的空间，但这不是必需的，因为默认就是剩余空间 */
  /* 其他样式，如宽度、背景等 */

  .btn {
    color: white;
    font-weight: bold;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}

.table-content {
  //border: -5px solid #e8eaec;

  .table-operate {
    font-size: 14px;
    color: rgb(2, 175, 241);
    margin-right: 6px;
    cursor: pointer;
  }
}
</style>