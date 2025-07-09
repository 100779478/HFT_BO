import ParamsTable from "@/components/ParamsTable.vue";

/**
 * 展示策略参数列表
 * @param row
 */
export function showParamList(row) {
    this.paramList = JSON.parse(JSON.stringify(row.ruleParams))
    this.$Modal.info({
        render: (h) => h(ParamsTable, {props: {paramList: this.paramList, readOnly: true}}),
        width: 950, // 设置宽度
        okText: "确认",
    })
}