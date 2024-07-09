// tableColumnWidthUtil.js
const STORAGE_KEY_PREFIX = 'table-column-width-';

export function saveColumnWidths(tableId, columns) {
    const columnWidths = columns.map(column => ({ key: column.key, width: column.width }));
    localStorage.setItem(STORAGE_KEY_PREFIX + tableId, JSON.stringify(columnWidths));
}

export function loadColumnWidths(tableId) {
    const storedWidths = localStorage.getItem(STORAGE_KEY_PREFIX + tableId);
    if (storedWidths) {
        return JSON.parse(storedWidths);
    }
    return null;
}
