import {getRuleVettingStatus} from "@/common/common";

/**
 * 渲染策略审批状态列
 * @param h Table表格渲染函数
 * @param params 当前行数据
 * @return {*} 渲染
 */
export function renderRuleApprovalStatus(h, params) {
    const colorList = ["#dcba0e", "#19be6b", "#ed4014", "#616261"]
    const statusInfo = getRuleVettingStatus(params.row.ruleVettingStatus)
    const createIcon = (code) => {
        return h("Icon", {
            props: {
                type: "ios-radio-button-on",
                color: colorList[code],
            },
        });
    };
    return h("span", [
        createIcon(statusInfo.code - 1),
        statusInfo.description,
    ]);
}