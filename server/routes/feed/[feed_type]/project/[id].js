import { Feed } from 'feed'
import { renderString } from 'omorphia'

const capitalizeString = (name) => {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : name
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_URL = config.apiBaseUrl
  const WEBSITE_URL = config.public.siteUrl

  const projectInformation = await $fetch(API_URL + 'project/' + event.context.params.id)
  const projectVersions = await $fetch(API_URL + 'project/' + event.context.params.id + '/version')
  const projectTeam = await $fetch(API_URL + 'project/' + event.context.params.id + '/members')

  const slugOrId = projectInformation.slug ?? projectInformation.id
  const projectUrl = WEBSITE_URL + `/${projectInformation.project_type}/${projectInformation.id}`

  const feed = new Feed({
    title: projectInformation.title,
    id: projectUrl,
    description: projectInformation.description,
    feedLinks: {
      json: WEBSITE_URL + `/feed/json/project/${projectInformation.id}`,
      atom: WEBSITE_URL + `/feed/atom/project/${projectInformation.id}`,
      rss: WEBSITE_URL + `/feed/rss/project/${projectInformation.id}`,
    },
    generator: 'Modrinth',
    link: WEBSITE_URL + `/${projectInformation.project_type}/${slugOrId}`,
    language: 'en',
    updated: new Date(projectInformation.updated),
    favicon: projectInformation.icon_url ?? 'https://cdn.modrinth.com/placeholder.png',
    image: projectInformation.icon_url ?? 'https://cdn.modrinth.com/placeholder.png',
  })

  for (const category of projectInformation.categories) {
    feed.addCategory(category)
  }

  for (const member of projectTeam) {
    feed.addContributor({
      name: member.user.username,
      link: WEBSITE_URL + `/user/${member.user.id}`,
    })
  }

  for (const version of projectVersions) {
    /**
     * @type {Array<import('feed/lib/typings').Category>}
     */
    const categories = [...version.loaders, ...version.game_versions].map((x) => {
      return {
        name: capitalizeString(x),
        term: x,
      }
    })

    const author =
      projectTeam.find((member) => member.user.id === version.author_id)?.user ??
      (await $fetch(API_URL + 'user/' + version.author_id))

    const loadersPretty = version.loaders.map(capitalizeString).join(', ')
    const gameVersionsPretty = version.game_versions.join(', ')

    feed.addItem({
      title: `${version.name}`,
      id: `${projectUrl}/version/${version.id}`,
      link: `${projectUrl}/version/${version.id}`,
      description: `Loaders: ${loadersPretty}, Minecraft versions: ${gameVersionsPretty}`,
      content:
        // Check for changelog length being greater than 1 to ensure no blank changelog section.
      renderString(
          version.changelog.length > 1 ? version.changelog : 'No changelog was specified.'
        ),
      author: [
        {
          name: author.username,
          link: WEBSITE_URL + `/user/${author.id}`,
        },
      ],
      category: categories,
      date: new Date(version.date_published),
    })
  }

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
      setResponseStatus(event, 400)
      return `'${event.context.params.feed_type}' is an invalid feed type, only 'rss', 'atom' and 'json' are supported`
  }
})
