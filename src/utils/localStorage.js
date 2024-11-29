// 将字典列表存储到本地存储
export const setLocalDictionaryList = (state) => {
    const {dictionaryList} = state;
    // 将字典列表转换为 JSON 字符串并存入 localStorage
    localStorage.dictionaryList = JSON.stringify(dictionaryList);
};

// 从本地存储中获取字典列表
export const getLocalDictionaryList = () => {
    try {
        // 尝试从 localStorage 获取字典列表并解析为对象
        return JSON.parse(localStorage.dictionaryList);
    } catch (e) {
        // 如果获取或解析失败，返回默认的字典列表对象
        return {
            // 连接状态枚举：描述连接的状态，如已连接、未连接等
            ChannelConnectStatus: [],
            // 方向枚举：例如买入和卖出的方向
            Direction: [],
            // 投保套利类型枚举：涉及投保套利操作的不同类型
            HedgeType: [],
            // 开平枚举：描述交易的开仓和平仓类型
            OffsetType: [],
            // 订单状态枚举：订单的各种状态，如已完成、待处理等
            OrderStatus: [],
            // 交易通道类型枚举：表示交易通道的类型，如API通道等
            ChannelType: [],
            // 接口类型枚举：定义不同的API接口类型
            ApiType: [],
            // 持仓方向枚举：描述持仓的方向，如多头和空头
            PositionDirection: [],
            // 用户类型枚举：描述不同类型的用户，如管理员、普通用户等
            UserType: [],
            // 策略文件类型枚举：定义不同的策略文件格式类型
            RuleFileType: [],
            // 策略参数类型枚举：描述策略参数的类型
            RulePropType: [],
            // 做市策略类型枚举：用于表示不同的做市策略
            RuleMakeMarketType: [],
            // 量化策略类型枚举：涉及量化交易的策略类型
            RuleQuantType: [],
            // 业务类型枚举：业务分类，如买卖、结算等
            LogicType: [],
            // 密码强度校验类型枚举：定义密码的强度验证规则
            PasswordStrength: [],
            // 操作系统类型枚举：列举系统类型，如Windows、Linux等
            OperatingLogType: [],
            // 星期枚举：描述一周七天的枚举值
            DayOfWeek: [],
            // 交易所类型枚举：列举不同的交易所类型，如股票、期货等
            TradeExchangeType: [],
            // 策略审批单状态枚举：描述策略审批单的不同状态，如待审核、已通过等
            RuleVettingStatus: []
        };
    }
};
