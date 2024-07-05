import {getLocalDictionaryList, setLocalDictionaryList} from "@/utils/localStorage";


const state = () => ({
    dictionaryList: getLocalDictionaryList(),
})
const mutations = {
    dictionaryList(state, payload) {
        state.dictionaryList = payload;
        setLocalDictionaryList(state);
    },
}
export default {
    namespaced: true,
    state,
    mutations
}
