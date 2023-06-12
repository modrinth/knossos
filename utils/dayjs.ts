import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function fromNow(date: string | Date) {
  return dayjs(date).from(Date.now())
}

export default dayjs
