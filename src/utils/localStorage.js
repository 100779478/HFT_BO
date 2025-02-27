export const setLocalDictionaryList = (state) => {
    const {dictionaryList} = state;
    localStorage.dictionaryList = JSON.stringify(dictionaryList);
};


export const getLocalDictionaryList = () => {
    try {
        return JSON.parse(localStorage.dictionaryList);
    } catch (e) {
        return {
            ChannelConnectStatus: [],
            Direction: [],
            HedgeType: [],
            OffsetType: [],
            OrderStatus: [],
            ChannelType: [],
            ApiType: [],
            PositionDirection: [],
            UserType: [],
            RuleFileType: [],
            RulePropType: [],
            RuleMakeMarketType: [],
            RuleQuantType: [],
            LogicType: [],
            PasswordStrength: [],
            OperatingLogType: [],
            DayOfWeek: [],
            TradeExchangeType: [],
            RuleVettingStatus: [],
            MarketMonitorType: [],
        };
    }
};
