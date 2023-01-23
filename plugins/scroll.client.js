export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  nuxtApp.hooks.hook('page:transition:finish', async () => {
    document.querySelector('[data-scroll]')?.scrollTo({ top: 9 })
  })
})
