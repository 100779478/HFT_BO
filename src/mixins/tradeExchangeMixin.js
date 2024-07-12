import {mapState} from 'vuex';

export default {
    computed: {
        ...mapState('dictionary', {
            tradeExchangeTypeList: state => state.dictionaryList.TradeExchangeType,
        }),
    },
    watch: {
        // 初始化监听防止data中数据复制为undefined
        tradeExchangeTypeList: {
            handler(newVal) {
                if (newVal.length) {
                    // 初始化监听 赋值交易所类型下拉菜单
                    this.setExchangeCode(newVal[0].code);
                }
            },
            immediate: true,
        },
    },
};
