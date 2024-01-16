// store/index.js

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const setLocalDictionaryList = (state) => {
  const { dictionaryList } = state;
  localStorage.dictionaryList = JSON.stringify(dictionaryList);
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
    };
  }
};
export default new Vuex.Store({
  state: {
    // 在这里定义你的状态
    dictionaryList: getLocalDictionaryList(),
  },
  mutations: {
    // 在这里定义修改状态的方法
    dictionaryList(state, payload) {
      state.dictionaryList = payload;
      setLocalDictionaryList(state);
    },
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
