import store from "@/store";
import md5 from "js-md5";
import {http} from "@/utils/request";
import moment from "moment/moment";
import router from "@/router";
import {Message} from "view-design";

/**
 * 用0填充数字，使其达到指定的长度
 * @param {number} number - 需要填充的数字
 * @param {number} length - 指定的长度
 * @returns {string} 填充后的数字字符串
 */

export const fillNumber = (number, length) => {
    return (new Array(length).join(0) + number).slice(-length);
};

/**
 * 将日期对象转换为本地化的时间对象
 * @param {Date} date - JavaScript日期对象
 * @returns {Object} 包含本地化时间信息的对象
 *  - year: 年份（四位数）
 *  - month: 月份（两位数，补零）
 *  - date: 日期（两位数，补零）
 *  - hour: 小时（两位数，补零）
 *  - minute: 分钟（两位数，补零）
 *  - second: 秒钟（两位数，补零）
 */

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

/**
 * 时间处理模块，包含日期相关的工具函数
 */

export const time = {
    dateToLocaleObject,
    UTCToLocale: (UTC10) => {
        const _date = new Date(
            UTC10 * 1000 - new Date().getTimezoneOffset() * 60000
        );
        return dateToLocaleObject(_date);
    },
};

/**
 * @description: 查找数据字典对应数据
 * @date: 2024--07--03 16:56:41
 * @param {string} dictionaryKey 数字字典类型
 * @param {string} code
 * @returns {object} 整个类型的数据列表 或 对应code的某条数据
 */

function findDictionaryList(dictionaryKey, code) {
    const dictionaryList = store.state.dictionary.dictionaryList[dictionaryKey] || [];
    if (code) {
        return dictionaryList.find((item) => item.code === code) || {};
    }
    return dictionaryList;
}

// 订单状态枚举
export function getOrderStatus(code) {
    return findDictionaryList('OrderStatus', code)
}

// 方向枚举
export function getDirection(code) {
    return findDictionaryList('Direction', code)
}

// 开平枚举
export function getOffsetType(code) {
    return findDictionaryList('OffsetType', code)
}

// 连接状态枚举
export function getChannelConnectStatus(code) {
    return findDictionaryList('ChannelConnectStatus', code)
}

// 投保套利枚举
export function getHedgeType(code) {
    return findDictionaryList('HedgeType', code)
}

// 接口类型枚举
export function getApiType(code) {
    return findDictionaryList('ApiType', code)
}

// 业务类型枚举
export function getLogicType(code) {
    return findDictionaryList('LogicType', code)
}

// 用户类型枚举
export function getUserType(code) {
    return findDictionaryList('UserType', code)
}

// 持仓方向枚举
export function getPositionDirection(code) {
    return findDictionaryList('PositionDirection', code)
}

// 策略文件类型枚举
export function getRuleFileType(code) {
    return findDictionaryList('RuleFileType', code)
}

// 策略参数类型枚举
export function RulePropType(code) {
    return findDictionaryList('RulePropType', code)
}

// 做市策略类型枚举
export function getRuleMakeMarketType(code) {
    return findDictionaryList('RuleMakeMarketType', code)
}

// 量化策略类型枚举
export function getRuleQuantType(code) {
    return findDictionaryList('RuleQuantType', code)
}

// 交易通道类型枚举
export function getChannelType(code) {
    return findDictionaryList('ChannelType', code)
}

// 操作系统类型枚举
export function getOperatingLogType(code) {
    return findDictionaryList('OperatingLogType', code)
}

// 星期枚举
export function getDayOfWeek(code) {
    return findDictionaryList('DayOfWeek', code)
}

// 交易所类型枚举
export function getTradeExchangeType(code) {
    return findDictionaryList('TradeExchangeType', code)
}

// 策略审批单状态枚举
export function getRuleVettingStatus(code) {
    return findDictionaryList('RuleVettingStatus', code)
}

// 密码强度校验类型枚举
export function getPasswordStrength(code) {
    return findDictionaryList('PasswordStrength', code)
}

// 做市义务监控详情状态枚举
export function getMakeMarketStatisticsItemStatus(code) {
    return findDictionaryList('MakeMarketStatisticsItemStatus', code)
}

// 做市义务监控统计状态枚举
export function getMakeMarketStatisticsStatus(code) {
    return findDictionaryList('MakeMarketStatisticsStatus', code)
}

// 做市义务债券类型枚举
export function getSecurityType(code) {
    return findDictionaryList('SecurityType', code)
}

// 表头排序
export function handleSort(col, func) {
    // 判断排序方式，如果为 'normal'，则设置为 'asc'，否则保持原值
    // 更新排序方式和排序字段
    this.pagination.sort = col.order === 'normal' ? 'asc' : col.order;
    this.pagination.sortField = col.order === 'normal' ? '' : col.key;
    func();
}

// ===============================================自定义密码加密===============================================
function str_to_hex3(s) {
    return [...s].map(c => c.charCodeAt(0).toString(16));
}

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

/**
 * python密码加密
 * @param {String,Number} strPlainText 当前密码
 * @returns {string}
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
 * python密码解密
 * @param {String,Number} strEncrypedText 当前密码
 * @returns {string}
 */

export function decryptPassword(strEncrypedText) {
    let res_list = hex2string(strEncrypedText);
    let pwd_list = [];
    for (let i = 1; i < res_list.length; i += 2) {
        let r1 = res_list[i].charCodeAt(0) ^ 86;
        pwd_list.push(String.fromCharCode(r1));
    }
    return pwd_list.join('');
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

// =========================================================================================================

/**
 * @description: 转换日期类型为20240101
 * @date: 2024--05--09 18:16:46
 * @params {data} 日期
 * @returns {String}
 */
export function formatDate(date) {
    return moment(date).isValid() ? moment(date).format("YYYYMMDD") : "";
}

/**
 * @description: 检查密码是否过期
 * @date: 2024--06--03 10:54:22
 * @params {expiredTime} 过期时间
 * @params {serverTime} 服务器时间
 * @returns {Boolean} 是否过期
 */

export function checkPwdExpiredTime(expiredTime, serverTime) {
    const expiredTimeDate = new Date(expiredTime);
    const serverTimeDate = new Date(serverTime);
    if (expiredTimeDate <= serverTimeDate) {
        Message.warning('密码已过期,请修改')
        router.push({name: 'LoginProtect'})
    }
    return expiredTimeDate <= serverTimeDate
}

/**
 * @description: 导出功能
 * @date: 2024--05--11 13:58:29
 * @params {url} 请求接口
 * @params {params} 请求参数
 * @params {name} 文件名称
 * @returns {File}
 */

export function handleExport(url, params, name) {
    const {sortField, sort, pageNumber, pageSize, total, ...data} = params
    http.post(url, {...data, responseType: "blob"}, (res) => {
        const blob = res;
        // 创建link标签
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        // 设置链接元素的下载属性，指定文件名
        const dateObj = time.dateToLocaleObject(new Date());
        link.download = `${name}_${dateObj.year}_${dateObj.month}_${dateObj.date}.xlsx`;
        // 将链接元素添加到文档中
        document.body.appendChild(link);
        // 触发点击事件以开始下载
        link.click();
        // 移除链接元素
        document.body.removeChild(link);
        Message.success(`导出${name}成功`)
    });
}

/**
 * 时间戳转化为时分秒
 */
export function secondsToHMS(seconds) {
    let h = Math.floor(seconds / 3600);  // 计算小时
    seconds %= 3600;  // 更新剩余秒数
    let m = Math.floor(seconds / 60);  // 计算分钟
    let s = seconds % 60;  // 计算秒数
    return `${h}时${m}分${s}秒`;
}

/**
 * 截取url参数
 */
export function queryParse(url) {
    let paramObj = {};
    if (url.indexOf('?') > -1) {
        let _url = url.split('?')[1].split('#')[0];
        let strArr = _url.split('&');
        strArr.forEach(ele => {
            let key = ele.split('=')[0];
            paramObj[key] = ele.split('=')[1];
        });

    }
    return paramObj;
}
