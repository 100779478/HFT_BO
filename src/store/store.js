// store/index.js

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const setLocalDictionaryList = (state) => {
    const {dictionaryList} = state;
    localStorage.dictionaryList = JSON.stringify(dictionaryList);
};
const setLocalCurrentEnv = (state) => {
    const {currentEnv} = state;
    localStorage.currentEnv = JSON.stringify(currentEnv);
};
const getLocalDictionaryList = () => {
    // 防止初始化localstorage中dictionaryList为undefined
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
            RuleType: [],
            LogicType: [],
            PasswordStrength: [],
            OperatingLogType: [],
            DayOfWeek: [],
            TradeExchangeType: [],
        };
    }
};
const getCurrentEnv = () => {
    // 防止初始化localstorage中dictionaryList为undefined
    try {
        return JSON.parse(localStorage.currentEnv);
    } catch (e) {
        return {
            currentEnv: null
        };
    }
};

export default new Vuex.Store({
    state: {
        // 在这里定义你的状态
        dictionaryList: getLocalDictionaryList(),
        currentEnv: getCurrentEnv(),
    },
    mutations: {
        // 在这里定义修改状态的方法
        dictionaryList(state, payload) {
            state.dictionaryList = payload;
            setLocalDictionaryList(state);
        },
        getCurrentEnv(state, payload) {
            state.currentEnv = payload
            setLocalCurrentEnv(state)
        }
    },
    //   actions: {
    //     // 在这里定义触发mutations的方法
    //     incrementAsync({ commit }) {
    //       setTimeout(() => {
    //         commit("increment");
    //       }, 1000);
    //     },
    //   },
    //   getters: {
    //     // 在这里定义获取状态的方法
    //     getCounter: (state) => {
    //       return state.counter;
    //     },
    //   },
});
