export default function (context) {
  if (!process.client) {
    return
  }

  if (context.from.path === context.route.path) {
    return
  }

  if (context.$config.analytics.base_url == null) {
    return
  }

  setTimeout(() => {
    context.$axios
      .post(`${context.$config.analytics.base_url}view`, {
        url: process.env.domain + context.route.fullPath,
      })
      .then(() => {})
      .catch((e) => {
        console.error('An error occurred while registering the visit: ', e)
      })
  })
}
