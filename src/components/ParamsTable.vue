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
      default: 'false'
    }
  },
  data() {
    let columns2 = [
      {
        title: "参数名",
        key: "name",
        width: 150,
        render: this.renderEditable,
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
          ]);
        }
      },
      {
        title: "参数范围",
        key: "range",
        width: 220,
        renderHeader: (h, params) => {
          return h('span', [
            params.column.title,
            h('Tooltip', {
              props: {
                content: '参数类型为整数、小数时，输入格式：\n' +
                    '1、使用英文的小括号或中括号包裹数字范围：( ) 、 [ ]或 [ )\n' +
                    '2、数字间用英文逗号分隔，支持单数字，如：(2,)\n' +
                    '3、示例：整数：(0,10)； 小数：[2.902,8.987)\n' +
                    '参数类型为枚举时，录入枚举值后点击回车即可添加',
                transfer: true,
                maxWidth: 300,
              }
            }, [
              h('Icon', {props: {type: 'md-alert'}})
            ])
          ])
        },
        render: (h, params) => {
          const {row} = params;
          // type 为 4 时使用特殊渲染
          if (row.type === '4') {
            return this.renderRangeCell(h, params);
          }
          return this.renderEditable(h, params);
        }
      },
      {
        title: "参数默认值",
        key: "value",
        width: 150,
        render: (h, params) => {
          const {row} = params
          if (row.type === "0" || row.type === "4") {
            // type 为 0 或 4 时使用下拉框
            return this.renderSelectCell(h, params);
          } else {
            // 其他类型使用普通输入框
            return this.renderEditable(h, params);
          }
        }
      },
      {
        title: "只读",
        key: "readOnly",
        width: 70,
        render: this.renderCheckbox
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
      const allFields = ['name', 'description', 'type', 'range', 'value', 'readOnly'];
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
      const value = (row[column.key] !== undefined && row[column.key] !== null)
          ? row[column.key].toString()
          : '';
      if (this.readOnly) {
        // 只渲染 span 标签
        return h("span", value);
      }

      // 只针对 range 字段特殊处理
      if (column.key === 'range') {
        // 字符串和布尔类型禁用编辑
        if (row.type === '0' || row.type === '3') {
          // 只读显示span，不允许编辑
          return h('span', value);
        }
      }

      // 渲染输入框
      return h('Tooltip', {
        props: {
          maxWidth: 200,
          disabled: !this.paramList[rowIndex][column.key],
          content: value, // Poptip 显示的提示内容
        },
      }, [h("Input", {
        props: {
          value: value,
          disabled: this.readOnly,
        },
        on: {
          input: (event) => {
            this.paramList[rowIndex][column.key] = event;
            this.$forceUpdate();
          },
        },
        nativeOn: {
          keydown: (e) => {
            // 如果是整数类型，去掉输入中的所有小数点
            if (row.type === '1' && e.key === '.') {
              e.preventDefault(); // 阻止输入小数点
            }
          }
        }
      })]);
    },
    renderSelectCell(h, params) {
      const {row, column} = params;
      const rowIndex = row._index;
      const value = (row[column.key] !== undefined && row[column.key] !== null)
          ? row[column.key].toString()
          : '';
      if (this.readOnly) {
        // 只渲染 span 标签，同时判断展示
        let options
        switch (column.key) {
          case "type":
            options = RulePropType();
            break
          case "read":
            options = [
              {code: "true", description: "是"},
              {code: "false", description: "否"},
            ];
            break
          case "value" :
            if (row.type !== '4') {
              options = [
                {code: "1", description: "是"},
                {code: "0", description: "否"},
              ]
            } else {
              // 这里处理 row.range，为字符串时转为数组
              let rangeArray = [];
              if (typeof row.range === 'string') {
                rangeArray = row.range.split(',').map(item => item.trim()).filter(Boolean);
                row.range = rangeArray; // 保证之后都是数组形式
              } else if (Array.isArray(row.range)) {
                rangeArray = row.range;
              }

              options = rangeArray.map(val => ({
                code: val,
                description: val
              }));
            }
            break
        }
        const displayValue = options.find(option => option.code === value)?.description || value;
        return h("span", displayValue);
      }
      // 渲染下拉框
      return h(
          "Select",
          {
            props: {
              value: value,
              disabled: this.readOnly,
              clearable: row.type === '4' && column.key === 'value'
            },
            on: {
              input: (event) => {
                this.paramList[rowIndex][column.key] = event;
              },
            },
          },
          this.renderSelectOptions(h, column.key, row)
      );
    },
    renderSelectOptions(h, column, row) {
      const readList = [
        {code: "true", description: "是"},
        {code: "false", description: "否"},
      ];
      let options
      switch (column) {
        case "type":
          options = RulePropType();
          break
        case "read":
          options = readList;
          break
        case "value" :
          if (row.type !== '4') {
            options = [
              {code: "1", description: "是"},
              {code: "0", description: "否"},
            ]
          } else {
            // 这里处理 row.range，为字符串时转为数组
            let rangeArray = [];
            if (typeof row.range === 'string') {
              rangeArray = row.range.split(',').map(item => item.trim()).filter(Boolean);
              row.range = rangeArray; // 保证之后都是数组形式
            } else if (Array.isArray(row.range)) {
              rangeArray = row.range;
            }

            options = rangeArray.map(val => ({
              code: val,
              description: val
            }));
          }
          break
      }
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
    renderCheckbox(h, params) {
      const {row, column} = params;
      const rowIndex = row._index;
      const key = column.key;
      const value = row[key]; // 例如是 "true" 字符串
      return h("Checkbox", {
        props: {
          value: String(value) === 'true',
          disabled: this.readOnly
        },
        on: {
          input: (val) => {
            this.paramList[rowIndex][key] = val
            row[key] = val ? 'true' : 'false';
            this.$forceUpdate();
          },
        },
      });
    },
    renderRangeCell(h, params) {
      const {row} = params;
      const rowIndex = row._index;

      // 如果当前行未初始化 range 为数组，默认初始化
      if (!Array.isArray(row.range)) {
        if (typeof row.range === 'string') {
          row.range = row.range.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          row.range = [];
        }
      }

      return h('Select', {
        props: {
          value: row.range,
          filterable: true,
          multiple: true,
          allowCreate: true,
          maxTagCount: 1,
        },
        on: {
          'on-create': (val) => {
            if (!row.range.includes(val)) {
              row.range.push(val);
            }
          },
          input: (val) => {
            // 当选中项减少时，清除无效项（只保留选中的）
            row.range = val
            this.paramList[rowIndex].range = val.join(',');
            this.$forceUpdate();
          },
        }
      }, row.range.map(item =>
          h('Option', {
            props: {
              value: item,
              label: item,
            },
            key: item
          })
      ));
    },
  }
}
</script>

<template>
  <Table
      :columns="dynamicColumns"
      :data="paramList"
      :width="!this.readOnly?665:590"
      class="table-content"
      style="position: unset"
      :height="450"
      size="small"
      ref="table2"
  >
    <template v-slot:operator="{ row }">
      <div @click.stop style="display: flex; justify-content: flex-start">
        <div @click="() => deleteParams(row)" class="table-operate">
          删除
        </div>
      </div>
    </template>
  </Table>
</template>

<style scoped lang="less">
::v-deep .ivu-poptip-inner {
  background-color: #515a6e !important;

  .ivu-poptip-body-content-inner {
    color: white !important;
  }
}

::v-deep .ivu-poptip-popper[x-placement^=top] .ivu-poptip-arrow:after {
  border-top-color: #515a6e;
}

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

::v-deep .ivu-select-multiple .ivu-select-item-selected:after {
  font-size: 14px;
  content: '\00D7';
  color: rgba(221, 17, 24, 0.9);
  top: 7px;
}

</style>