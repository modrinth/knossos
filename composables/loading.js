export const useLoading = () => useState('loading', () => ({
  loading: false,
}))

export const startLoading = () => {
  const cosmetics = useLoading()

  cosmetics.value.loading = true
}

export const stopLoading = () => {
  const cosmetics = useLoading()

  cosmetics.value.loading = false
}
