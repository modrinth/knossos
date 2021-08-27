// Remember: special characters like quote marks (") must be escaped with a backslash (\)
export default {
  generic: {
    types: {
      mod: "Mod",
      mods: "Mods",
      modpack: "Modpack",
      modpacks: "Modpacks",
    },
    projects: "Projects",
    open: "Open",
    close: "Close",
    categories: "Categories",
    loaders: "Mod loaders",
    environments: "Environments",
    server: "Server",
    client: "Client",
    mcVersions: "Minecraft versions",
    license: "License",
    licenses: "Licenses",
    loading: "Loading...",
    recentlyCreated: "Recently created",
    recentlyUpdated: "Recently updated",
    selectOne: "Select one",
    cancel: "Cancel",
    proceed: "Proceed",
    name: "Name",
    number: "Number",
    channel: "Release channel",
    files: "Files",
    changelog: "Changelog",
    unknown: "Unknown",
    created: "Created",
    createdOn: "[Created on] YYYY-MM-DD [at] HH:mm A", // Keep the brackets around the parts that aren't the date itself
    updatedOn: "[Updated on] YYYY-MM-DD [at] HH:mm A", // ditto "
    joined: "[Joined] YYYY-MM-DD [at] HH:mm A",        // ditto "
    downloads: "Downloads",
    download: "Download",
    report: "Report",
    delete: "Delete",
    edit: "Edit",
    published: "Published",
    discard: "Discard",
    back: "Back",
    save: "Save",
    description: "Description",
    slug: "Vanity URL (slug)",
    icon: "Icon",
    body: "Body",
    externalResources: "External resources",
    issueTracker: "Issue tracker",
    sourceCode: "Source code",
    wikiPage: "Wiki page",
    discord: "Discord invite",
    addLink: "Add a link",
    removeLink: "Remove link",
    donationLinks: "Donation links",
    link: "Link",
    platform: "Platform",
    actions: "Actions",
    version: "Version",
    continue: "Continue",
    upToDate: "You are up-to-date!",
    notified: "Notified",
  },
  creation: {
    filesSelected: "{0} file selected | {0} files selected", // 1 file selected | 2+ files selected
    selectFile: "Select files or drag them here",
    areYouSure: "Are you sure that you want to leave without saving?",
    version: {
      create: "Create a version",
      add: "Add a version", // This is necessary to be separate because it's used in a different context
      edit: "Edit version",
      nameDescription: "This is what users will see first. If not specified, this will default to the version number.",
      numberDescription: "This is how your version will appear in project lists and URLs.",
      channelDescription: "It is important to notify everyone whether the version is stable or if it's still in development.",
      loaderDescription: "Mark all mod loaders this version works with.",
      mcVersionDescription: "Mark all Minecraft version this version supports.",
      fileDescription: "You must upload at least one file, however, you are allowed to upload multiple files.",
      changelogDescription: "Tell everyone what's new. It supports the same Markdown formatting as the description, but the changelogs don't need to be too creative.",
      save: "Save version",
    },
    project: {
      create: "Create a project",
      saveDraft: "Save draft",
      nameDescription: "Be creative! Generic project names will be harder to search for.",
      descriptionDescription: "Give a short description to your project which will appear in search.",
      categoriesDescription: "Select up to 3 categories that will help others find your project.",
      slugDescription: "Set this to something that will looks nice in your project's URL.",
      typeDescription: "The project type of your project.",
      environmentDescription: "Let others know what environments your project supports.",
      optional: "— this section is optional",
      submit: "Submit for review",
      icon: {
        square: "Must be a square",
        minimumSize: "Minimum size is 100x100 pixels",
        formats: "Acceptable formats are PNG, JPEG, GIF, and WEBP",
        reset: "Reset icon",
      },
      bodyDescription: {
        preLink: "You can type an extended description of your project here. This editor supports Markdown. Its syntax can be found ",
        link: "here",
        postLink: ". HTML can also be used inside your description, excluding scripts and iframes.",
      },
      licenseDescription: {
        description: "It is very important to choose a proper license for your mod. You may choose one from our list or provide a URL to a custom license.",
        preLink: "Confused? See our ",
        link: "licensing guide",
        postLink: " for more information.",
      },
    },
  },
  userControls: {
    myProjects: "My projects",
    profile: "Profile",
    notifications: "Notifications",
    myNotifications: "My notifications",
    settings: "Settings",
    followedProjects: "Followed projects",
    moderation: "Moderation",
    logOut: "Log out",
    gitHub: "Sign in with GitHub",
    loggedOut: "Logged out",
    loggedOutSuccessfully: "You have logged out successfully!",
    preferencesSaved: "Preferences saved",
    preferencesSavedSuccessfully: "Your preferences have been saved successfully.",
    confirmAction: {
      preName: "To confirm your action, please type ",
      postName: " to continue.",
    },
  },
  privacy: {
    settings: "Privacy settings",
    description: "Modrinth relies on both external providers and in-house tools to allow us to provide custom-tailored experiences and personalized advertising. You can change your privacy settings at any time by going to this settings page, accessible in the footer of any page.",
    cookie: {
      line1: "Modrinth uses cookies for various purposes, including advertising.",
      line2: "We encourage you to review your privacy settings by clicking on the button below:",
      review: "Review",
      accept: "Accept all",
      refuse: "Refuse all",
      confirm: "Confirm my choices",
    },
  },
  homepage: {
    top: {
      typewriter1: "Open source",
      typewriter2: "Easy to use",
      typewriter3: "Developer focused",
      typewriter4: "API based",
      afterTypewriter: "modding platform",
    },
    section1: {
      heading: "Conveniently modern",
      subheading: "A redefined search interface",
      preSpan: "We've implemented ",
      spanText: "fast and adaptable",
      postSpan: " search algorithms so you don't have to wait, while creating a responsive interface that makes sense. Modrinth is full of elegant project discovery and is a platform which just works.",
    },
    section2: {
      heading: "Built for developers",
      subheading: "The world's most modder-friendly platform",
      preSpan: "Modrinth intends to give back to the community, not leech from it. That's why we plan to give creators ",
      spanText: "one hundred percent",
      postSpan: " of the ad revenue earned on their project pages back to them, while creating easy to use tools for every modder to publish their mods on the Modrinth platform.",
      secondSpan: "Note: This is currently not implemented.",
      secondBody: " There is no ETA for when it will be.",
      rightHeading1: "Code",
      rightHeading2: "Build",
      rightHeading3: "Publish",
      rightHeading4: "Earn",
    },
    section3: {
      heading: "Easy to implement",
      subheading: "Backed by an open source API",
      preSpan: "Modrinth's code is fully open source licensed under the GNU AGPL. We've created a high-performance Rust-based backend that is ",
      spanText: "fully documented",
      postSpan: " for all kinds of tools to use. Our team is dedicated to maintaining an open source ecosystem for all Modrinth applications.",
    }
  },
  search: {
    filters: "Filters",
    clearFilters: "Clear filters",
    includeSnapshots: "Include snapshots",
    chooseLicense: "Choose licenses...",
    searchDotDotDot: "Search...",
    sortBy: "Sort by",
    perPage: "Per page",
    noResults: "No results found for your query!",
    sortTypes: {
      relevance: "Relevance",
      downloadCount: "Download count",
      followCount: "Follow count",
    }
  },
  error: {
    error: "An error occurred!",
    errorLong: "An error occurred! Click this text to go back home, and find your way back!",
    unknown: "Unknown error",
    noTitle: "No title defined",
    noDescription: "No description defined",
  },
  status: {
    status: "Status",
    approve: "Approve",
    approved: "Approved",
    reject: "Reject",
    rejected: "Rejected",
    draft: "Draft",
    processing: "Under review",
    unlist: "Unlist",
    unlisted: "Unlisted",
  },
  version: {
    backToList: "Back to list",
    featured: "Featured",
    noChangelog: "No changelog provided.",
    unknownDependency: "Unknown dependency",
    primary: "Primary",
  },
  project: {
    type: "Project type",
    channel: {
      release: "Release",
      beta: "Beta",
      alpha: "Alpha",
    },
  },
  report: {
    reports: "Reports",
    file: "File a report",
    create: "Create the report",
    itemId: "Item ID",
    itemIdDescription: "The ID of the item you are reporting. For example, the item ID of a user would be their user ID, found on the left side of their profile page.",
    type: "Item type",
    typeDescription: "The type of the item that is being reported.",
    category: "Category",
    categoryDescription: "The category that the report falls under, so that it can be routed appropriately.",
    description: "Description",
    descriptionDescription: {
      preLink: "You can type the description of your report here. This editor supports Markdown. Its syntax can be found ",
      link: "here",
      postLink: ". HTML can also be used inside your report, excluding scripts and iframes.",
    },
  },
  revokeToken: {
    title: "Revoke your Modrinth token",
    description: "Revoking your Modrinth token can have unintended consequences. Please be aware that the following could break:",
    desc: {
      bullet1: "Any application that uses your token to access the API.",
      bullet2: "Gradle - if Minotaur is given a incorrect token, your Gradle builds could fail.",
      bullet3: "GitHub - if you use a GitHub action that uses the Modrinth API, it will cause errors.",
    },
    instructions: "If you are willing to continue, complete the following steps:",
    inst: {
      bullet1Url: "Head to the Modrinth Application page on GitHub.",
      bullet1Desc: "Make sure to be logged into the GitHub account you used for Modrinth!",
      bullet2: "Press the big red \"Revoke Access\" button next to the \"Permissions\" header.",
    },
    continue: "Once you have completed those steps, press the continue button below.",
    continueWarning: "This will log you out of Modrinth, however, when you log back in, your token will be regenerated.",
  },
  follow: {
    follow: "Follow",
    unfollow: "Unfollow",
    projects: "Followed projects",
    noFollowed: "You don't have any followed projects.",
    find: {
      preSpan: "Why don't you ",
      spanText: "search",
      postSpan: " for new ones?",
    },
  },
  dashboard: {
    noProjects: "You don't have any projects.",
    create: {
      preSpan: "Would you like to ",
      spanText: "create one",
      postText: "?",
    },
  },
  settings: {
    settings: "Settings",
    username: "Username",
    usernameDescription: "The username used on Modrinth to identify yourself. This must be unique.",
    nameDescription: "Your display name on your Modrinth profile. This does not have to be unique, can be set to anything, and is optional.",
    email: "Email",
    emailDescription: "The email for your account. This is private information which is not exposed in any API routes or on your profile. It is also optional.",
    bio: "Bio",
    bioDescription: "A description of yourself which other users can see on your profile.",
    theme: "Site theme",
    themeDescription: "Change the global site theme of Modrinth. You can choose between light mode, dark mode, and OLED mode. You can cycle between the three options using this button, or you can toggle between light and dark mode at any time in the navigation bar at the top of the page.",
    token: "Authorization token",
    tokenDescription: "Your authorization token can be used with the Modrinth API and for the Minotaur Gradle plugin. However, it must be kept secret!",
    revokeToken: "Revoke your token",
    revokeTokenDescription: "This will log you out of Modrinth, and you will have to log in again to access Modrinth with a new token.",
    delete: "Delete your account",
    deleteDescription: "Clicking on this WILL delete your account. Do not click on this unless you want your account deleted. If you delete your account, all attached data, including projects, will be removed from our servers. This cannot be reversed, so be careful!",
    copied: "Copied to clipboard.",
    copiedDescription: "Copied your Modrinth token to the clipboard.",
  },
  user: {
    role: {
      admin: "Administrator",
      mod: "Moderator",
      dev: "Developer",
    },
  },
  notFound: "User not found",
  joined: "Joined",
};
