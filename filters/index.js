import moment from 'moment';

/**
 * "Fri Dec 10 2021 01:01:49 GMT+0800 (China Standard Time)" => "2021年12月10日凌晨1点01分"
 * @param {number} num
 */
export function dateFormat(value) {
  moment.locale('zh-cn');
  return moment(value).format('LLL');
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function thousandFormat(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}