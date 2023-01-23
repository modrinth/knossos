export const useBaseFetch = (url, options = {}) => $fetch(`https://api.modrinth.com/v2/${url}`, options)
