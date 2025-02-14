const state = () => ({
    status: null,
    system: {
        isFullScreenAlert: true,
    },
})
const mutations = {
    // 获取当前环境信息
    setMakeStatus(state, payload) {
        state.status = payload
    },
    setSystemSetting(state, payload) {
        state.system = payload
    }
}
export default {
    namespaced: true,
    state,
    mutations
}

