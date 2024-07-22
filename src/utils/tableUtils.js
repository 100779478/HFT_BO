
export function handleChangePage(type, value, fn) {
    this.pagination[type] = value;
    fn();
}

// 关闭新增弹窗
export function cancel() {
    this.showAddModal = false;
}