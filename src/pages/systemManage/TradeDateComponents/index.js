import moment from "moment/moment";

export function renderDateCell(h, params, key = []) {
    const [firstKey, secondKey] = key
    const {[firstKey]: dateValue, [secondKey]: countValue} = params.row
    const val = moment(dateValue).format('YYYY-MM-DD')
    if (!countValue) {
        return h('span', val)
    }
    return h('span', `${val}(${countValue})`)
}