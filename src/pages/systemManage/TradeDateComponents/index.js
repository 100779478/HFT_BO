import moment from "moment/moment";

/**
 * @description: 展示单元格日期yyyy-mm-dd
 * @date: 2024--05--14 15:02:20
 * @params {h} table中h函数
 * @params {params} table中的params
 * @params {key:Array} [0]日期 [1]拼接dayCount
 * @returns {String} 日期格式 2024-1-1 或 2024-1-1(3)
 */

export function renderDateCell(h, params, key = []) {
    const [firstKey, secondKey] = key
    const {[firstKey]: dateValue, [secondKey]: countValue} = params.row
    const val = moment(dateValue).format('YYYY-MM-DD')
    if (!countValue) {
        return h('span', val)
    }
    return h('span', `${val}(${countValue})`)
}