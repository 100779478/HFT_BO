// 转换格式为{'menuId':['permissionId1','permissionId2']}
//         {'1':['1','2','3'],'2':['4','5']}
export function formatRolePermissionList(list) {
    return list.reduce((acc, item) => {
        acc[item.menuId] = item.details.map(detail => detail.permissionId);
        return acc;
    }, {})
}