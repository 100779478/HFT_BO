import {getCurrentEnv, setLocalCurrentEnv} from '@/utils/environment'

const state = () => ({
    currentEnv: getCurrentEnv(),
})
const mutations = {
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

