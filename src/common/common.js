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
