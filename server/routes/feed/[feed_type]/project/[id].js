import { Feed } from 'feed'
import { renderString } from '~/helpers/parse'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_URL = config.apiBaseUrl
  const WEBSITE_URL = config.public.siteUrl

  const projectInformation = await $fetch(API_URL + 'project/' + event.context.params.id)
  const projectVersions = await $fetch(API_URL + 'project/' + event.context.params.id + '/version')
  const projectTeam = await $fetch(API_URL + 'project/' + event.context.params.id + '/members')

  let featuredImage = projectInformation.gallery.filter((image) => image.featured)[0]

  if (featuredImage) {
    featuredImage = featuredImage.url
  }

  const feed = new Feed({
    title: projectInformation.title,
    id: projectInformation.id,
    description: renderString(projectInformation.description),
    generator: 'Modrinth',
    link: WEBSITE_URL + `/${projectInformation.project_type}/${projectInformation.id}`,
    language: 'en',
    updated: new Date(projectInformation.updated),
    favicon: projectInformation.icon_url ?? 'https://cdn.modrinth.com/placeholder.png',
    image: featuredImage ?? undefined,
  })

  projectVersions.forEach((version) => {
    feed.addItem({
      title: `New Version Released: ${version.name}`,
      id: `release-${version.id}`,
      link:
        WEBSITE_URL +
        `/${projectInformation.project_type}/${projectInformation.id}/version/${version.id}`,
      content:
        `This version is for ${version.game_versions.join(', ')}<br>` +
        // Check for changelog length being greater than 1 to ensure no blank changelog section.
        // Legacy changelog support.
        `<h3>Changelog</h3>${renderString(
          version.changelog.length > 1 ? version.changelog : 'No changelog was specified.'
        )}`,
      author: [
        ...projectTeam.map((member) => {
          return {
            name: member.user.username,
            link: WEBSITE_URL + `/user/${member.user.id}`,
          }
        }),
      ],
      date: new Date(version.date_published),
    })
  })

  switch (event.context.params.feed_type.toLowerCase()) {
    case 'rss':
      setResponseHeader(event, 'Content-Type', 'application/rss+xml')
      return feed.rss2()
    case 'atom':
      setResponseHeader(event, 'Content-Type', 'application/atom+xml')
      return feed.atom1()
    case 'json':
      setResponseHeader(event, 'Content-Type', 'application/feed+json')
      return feed.json1()
    default:
      setResponseStatus(event, 500)
      return 'Invalid Feed Type'
  }
})
