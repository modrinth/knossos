// imagine nuxt team actually used correct moduleResolution, that'd be so cool haha
// anyway..... https://github.com/nuxt/nuxt/issues/19606

declare module '@vintl/vintl/controller' {
  export * from '@vintl/vintl/dist/controller'
}

declare module '@vintl/compact-number' {
  export * from '@vintl/compact-number/dist/index.mjs'
}

declare module '@vintl/how-ago' {
  export * from '@vintl/how-ago/dist/index.mjs'
}
