/**
 * @description: table组件高度监听
 * @date: 2024--06--28 10:10:42
 */

export function updateTableHeight() {
    this.tableHeight = window.innerHeight - 220;
}

// 新增弹窗关闭
export function cancel() {
    this.showAddModal = false;
}