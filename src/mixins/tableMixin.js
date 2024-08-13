import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

export const tableMixin = {
    data() {
        return {
            pagination: {
                sort: 'asc',
                sortField: '',
                pageNumber: 1,
                pageSize: 20,
                total: 0,
            },
            URL,
            loading: true,
            tableHeight: this.calculateTableHeight(),
            tableData: [],
        };
    },
    mounted() {
        window.addEventListener('resize', this.updateTableHeight);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateTableHeight);
    },
    methods: {
        // 监听窗口
        calculateTableHeight() {
            return window.innerHeight - 210;
        },
        updateTableHeight() {
            this.tableHeight = this.calculateTableHeight();
        },
        // 关闭新增弹窗
        cancel() {
            this.showAddModal = false;
        },
        /**
         * 处理表格分页切换
         *
         * @param {string} type - 分页类型（'pageNumber' 或 'pageSize'）
         * @param {number} value - 分页类型的新值
         * @param {Function} fn - 用于重新获取列表数据的函数
         */
        handleChangePage(type, value, fn) {
            this.pagination[type] = value;
            fn();
        },
        /**
         * 删除行操作
         * @param {string} path - 用于删除请求的API路径
         * @param {number|string} id - 要删除的行的唯一标识符
         * @param {string} name - 要删除的项目名称，用于确认对话框标题和消息
         * @param {Function} fn - 删除成功后的回调函数(重新获取列表)
         */
        deleteRow(path, id, name, fn) {
            this.$Modal.confirm({
                title: `确认删除此${name}吗？`,
                content: "<p>此操作不可逆</p>",
                onOk: () => {
                    http.delete(`${path}/${id}`, {messageType: `${name}删除成功`}, () => {
                        fn()
                    })
                },
                okText: "删除",
            });
        }
    },
}