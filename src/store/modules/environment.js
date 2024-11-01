import {getCurrentEnv, setLocalCurrentEnv} from '@/utils/environment'

const state = () => ({
    currentEnv: getCurrentEnv(),
})
const mutations = {
    // 获取当前环境信息
    getCurrentEnv(state, payload) {
        state.currentEnv = payload
        setLocalCurrentEnv(state)
    },
}
export default {
    namespaced: true,
    state,
    mutations
}

