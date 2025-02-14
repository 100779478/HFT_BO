import Vue from 'vue';
import Vuex from 'vuex';
import dictionary from './modules/dictionary';
import role from './modules/role';
import environment from "@/store/modules/environment";
import rule from "@/store/modules/rule";
import makeStatus from "@/store/modules/makeStatus";
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        dictionary,
        environment,
        role,
        rule,
        makeStatus,
    },
});
