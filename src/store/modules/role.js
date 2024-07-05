const state = () => ({
    rolePermissionList: [],
    pcPermissionList: [],
    scenesList: [],
});
const setList = (state, key, payload) => {
    state[key] = Array.isArray(payload) ? payload : [];
};
const mutations = {
    setRolePermissionList(state, payload) {
        setList(state, 'rolePermissionList', payload);
    },
    setPcPermissionList(state, payload) {
        setList(state, 'pcPermissionList', payload);
    },
    setPcScenesList(state, payload) {
        setList(state, 'scenesList', payload);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
};
