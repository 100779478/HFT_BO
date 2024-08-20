import store from "@/store/store";
// fill number into some length string
export const fillNumber = (number, length) => {
    return (new Array(length).join(0) + number).slice(-length);
};
// timeObject
const dateToLocaleObject = (date) => {
    return {
        year: date.getYear() + 1900,
        month: fillNumber(date.getMonth() + 1, 2),
        date: fillNumber(date.getDate(), 2),
        hour: fillNumber(date.getHours(), 2),
        minute: fillNumber(date.getMinutes(), 2),
        second: fillNumber(date.getSeconds(), 2),
    };
};
export const time = {
    dateToLocaleObject,
    UTCToLocale: (UTC10) => {
        const _date = new Date(
            UTC10 * 1000 - new Date().getTimezoneOffset() * 60000
        );
        return dateToLocaleObject(_date);
    },
};

// 订单状态
export function getOrderStatus(code) {
    let result = {};
    store.state.dictionaryList.OrderStatus.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
}

// 方向
export function getDirection(code) {
    let result = {};
    store.state.dictionaryList.Direction.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
}

// 开平
export function getOffsetType(code) {
    let result = {};
    store.state.dictionaryList.OffsetType.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
}

// 连接状态
export function getChannelConnectStatus(code) {
    let result = {};
    store.state.dictionaryList.ChannelConnectStatus.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
}

// 投保套利
export function getHedgeType(code) {
    let result = {};
    store.state.dictionaryList.HedgeType.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
}

// 交易通道类型
export function getChannelType(code) {
    let result = {};
    if (code) {
        store.state.dictionaryList.ChannelType.forEach((i) => {
            if (i.code === code) {
                result = i;
            }
        });
        return result;
    } else {
        return store.state.dictionaryList.ChannelType;
    }
}

// 接口类型
export function getApiType(code) {
    let result = {};
    if (code) {
        store.state.dictionaryList.ApiType.forEach((i) => {
            if (i.code === code) {
                result = i;
            }
        });
        return result;
    } else {
        return store.state.dictionaryList.ApiType
    }
}

// 用户类型
export function getUserType(code) {
    let result = {};
    store.state.dictionaryList.UserType.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result
}

// 持仓方向
export function getPositionDirection(code) {
    let result = {};
    store.state.dictionaryList.PositionDirection.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
}

// 日志级别
export function getLogLevel(code) {
    let result = {};
    if (code) {
        store.state.dictionaryList.LogLevel.forEach((i) => {
            if (i.code === code) {
                result = i;
            }
        });
        return result;
    } else {
        return store.state.dictionaryList.LogLevel
    }
}

// 表头排序
export function handleSort(col, func) {
    // 判断排序方式，如果为 'normal'，则设置为 'asc'，否则保持原值
    // 更新排序方式和排序字段
    this.pagination.sort = col.order === 'normal' ? 'asc' : col.order;
    this.pagination.sortField = col.order === 'normal' ? '' : col.key;

    // 获取连接状态
    // this.getChannelStatus();
    func();
}


function str_to_hex3(s) {
    return [...s].map(c => c.charCodeAt(0).toString(16));
}

/**
 * 加密
 * @param strPlainText
 * @returns {*}
 */
export function encryptPassword(strPlainText) {
    let temp_str = '';
    for (let i = 0; i < strPlainText.length; i++) {
        let rv = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        let rv_str = String.fromCharCode(rv % 255);
        let iv = strPlainText.charCodeAt(i) ^ 86;
        let ivc = String.fromCharCode(iv);
        temp_str += rv_str + ivc;
    }

    let list_hex3 = str_to_hex3(temp_str);
    for (let i = 0; i < list_hex3.length; i++) {
        if (list_hex3[i].length === 1) {
            list_hex3[i] = '0' + list_hex3[i];
        }
    }
    return list_hex3.join('');
}

/**
 * 解密
 * @param hexstr
 * @returns {*[]}
 */
function hex2string(hexstr) {
    let list = [];
    for (let i = 0; i < hexstr.length; i += 2) {
        let oneValue = (parseInt(hexstr[i], 16) << 4) % 256;
        let towValue = parseInt(hexstr[i + 1], 16) & 0xF;
        let res = oneValue | towValue;
        list.push(String.fromCharCode(res));
    }
    return list;
}

export function decryptPassword(strEncrypedText) {
    let res_list = hex2string(strEncrypedText);
    let pwd_list = [];
    for (let i = 1; i < res_list.length; i += 2) {
        let r1 = res_list[i].charCodeAt(0) ^ 86;
        pwd_list.push(String.fromCharCode(r1));
    }
    return pwd_list.join('');
}