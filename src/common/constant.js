/**
 * @property {number} code - 状态码
 * @property {string} description - 状态描述
 */
const ACTIVE_LIST = [
    {
        code: 1,
        description: '已启用'
    },
    {
        code: 0,
        description: '已禁用'
    },
]

/**
 * 错误消息对象
 * 这里定义了各种错误情况下的提示消息。
 */
const ERROR_MSG = {
    oldPasswordEmpty: "请输入旧密码",
    newPasswordEmpty: "请输入新密码",
    confirmPasswordEmpty: "请输入确认密码",
    passwordContainsSpace: "密码不允许包含空格",
    passwordStrengthInsufficient: "密码强度不足",
    passwordsMismatch: "两次密码输入不一致",
    passwordEmpty: "密码不能为空",
    channelIdEmpty: "通道ID不能为空",
    fileNotJson: "选择的文件不是 JSON 文件",
    filePathEmpty: "策略文件路径不能为空",
    fileTypeCPlusPlus: "策略文件类型为C++时，策略文件名称需要以.so结尾",
    userCodeEmpty: "用户代码不能为空",
    userAccountEmpty: "请填写用户账号",
    storagePathEmpty: "策略存储路径不能为空",
    startDateInvalid: "起始日期不能大于结束日期",
    enableFail: "启用失败：",
    userDisabled: "用户已禁用",
    ruleDisabled: "策略已禁用",
    tradeChannelEmpty: "请选择交易通道",
    logicTypeEmpty: "请选择业务类型",
    accountIdEmpty: "请填写分账号代码",
    unableToDisableYourself: "无法禁用自己",
    externalInterfaceTypeEmpty: "请选择外部接口类型",
    channelTypeEmpty: "请选择通道类型",
    adminUserEmpty: "请选择管理用户",
    traderEmpty: "请选择交易员",
    fileExceedsLimit: "策略文件大小超过最大限制"
};

/**
 * 成功消息对象
 * 这里定义了各种操作成功后的提示消息。
 */
const SUCCESS_MSG = {
    enableSuccess: "启用成功",
    uploadSuccess: "上传成功",
    importSuccess: "导入参数列表成功",
    modifySuccess: "修改成功",
    addSuccess: "新增成功",
    envSetupSuccess: "环境设置成功",
    userEnabled: "用户已启用",
    downloadSuccess: "下载成功",
    resetSuccess: "重置成功",
    revokeSuccess: "撤销成功",
    approved: "通过",
    rejected: "拒绝",
    ruleIsActive: "策略已启用",
    calculationSuccess: "计算成功",
}

export {ACTIVE_LIST, ERROR_MSG, SUCCESS_MSG}
