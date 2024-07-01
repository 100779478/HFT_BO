export const setLocalCurrentEnv = (state) => {
    const {currentEnv} = state;
    localStorage.currentEnv = JSON.stringify(currentEnv);
};

export const getCurrentEnv = () => {
    // 防止初始化localstorage中currentEnv为undefined
    try {
        return JSON.parse(localStorage.currentEnv);
    } catch (e) {
        return null;
    }
};