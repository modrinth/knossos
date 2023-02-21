export const useCurrentDate = () => useState('currentDate', () => Date.now())

export const updateCurrentDate = () => {
  const currentDate = useCurrentDate()

  currentDate.value = Date.now()
}

export const fromNow = (date) => {
  const currentDate = useCurrentDate()
  const nuxtApp = useNuxtApp()

  return nuxtApp.$dayjs(date).from(currentDate.value)
}
