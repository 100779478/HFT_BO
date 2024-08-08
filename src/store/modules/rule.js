import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

const state = () => ({
    ruleId: null,
});
const setId = (state, payload) => {
    state.ruleId = payload.ruleId
};
const mutations = {
    setRuleId(state, payload) {
        setId(state, payload);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
};