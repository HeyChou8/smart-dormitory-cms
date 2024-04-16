import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
export function  formatUTC(
  utcStr,
  format = 'YYYY/MM/DD HH:mm:ss'
) {
  const resultTime = dayjs.utc(utcStr).utcOffset(8).format(format)
  return resultTime
}
