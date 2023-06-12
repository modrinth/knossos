export const useLoading = () => useState('loading', () => false)

export function startLoading() {
  const loading = useLoading()

  loading.value = true
}

export function stopLoading() {
  const loading = useLoading()

  loading.value = false
}
