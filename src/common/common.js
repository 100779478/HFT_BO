import store from "@/store/store";
import md5 from "js-md5";
import {http} from "@/utils/request";
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
    store.state.dictionaryList.ChannelType.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
}

// 接口类型
export function getApiType(code) {
    let result = {};
    store.state.dictionaryList.ApiType.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
}

// 用户类型
export function getUserType(code) {
    let result = {};
    store.state.dictionaryList.UserType.forEach((i) => {
        if (i.code === code) {
            result = i;
        }
    });
    return result;
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

// 策略文件类型
export function getRuleFileType(code) {
    let result = {};

    if (code) {
        store.state.dictionaryList.RuleFileType.forEach((i) => {
            if (i.code === code) {
                result = i;
            }
        });
    } else {
        result = store.state.dictionaryList.RuleFileType;
    }

    return result;
}

// 策略参数类型
export function RulePropType(code) {
    let result = {};

    if (code) {
        store.state.dictionaryList.RulePropType.forEach((i) => {
            if (i.code === code) {
                result = i;
            }
        });
    } else {
        result = store.state.dictionaryList.RulePropType;
    }

    return result;
}

// 策略类型
export function getRuleType(code) {
    let result = {};

    if (code) {
        store.state.dictionaryList.RuleType.forEach((i) => {
            if (i.code === code) {
                result = i;
            }
        });
    } else {
        result = store.state.dictionaryList.RuleType;
    }

    return result;
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

// 自定义密码加密
function str_to_hex3(s) {
    return [...s].map(c => c.charCodeAt(0).toString(16));
}

function encryptPassword(strPlainText) {
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
 * @description: 根据类型加密密码
 * @date: 2024--03--26 15:32:56
 * @param {String} type 当前加密类型
 * @param {String} pwd 密码
 * @returns {String}
 */

export function encryptionModePassword(type, pwd) {
    console.log("当前加密类型为：", type)
    switch (type) {
        case 'MD5':
            return md5(pwd);
        case 'CUSTOMIZE':
            return encryptPassword(pwd);
        default:
            throw new Error('Unsupported encryption type');
    }
}





