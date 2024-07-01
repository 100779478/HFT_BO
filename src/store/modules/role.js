const state = () => ({
    rolePermissionList: [],
    pcPermissionList: [],
    scenesList: [],
});

const mutations = {
    setRolePermissionList(state, payload) {
        if (Array.isArray(payload)) {
            state.rolePermissionList = payload;
        } else {
            state.rolePermissionList = [];
        }
    },
    setPcPermissionList(state, payload) {
        if (Array.isArray(payload)) {
            state.pcPermissionList = payload;
        } else {
            state.pcPermissionList = [];
        }
    },
    setPcScenesList(state, payload) {
        if (Array.isArray(payload)) {
            state.scenesList = payload;
        } else {
            state.scenesList = [];
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
};
