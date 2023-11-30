export const acceptFileFromProjectType = (projectType) => {
  switch (projectType) {
    case 'mod':
      return '.jar,.zip,.litemod,application/java-archive,application/x-java-archive,application/zip'
    case 'plugin':
      return '.jar,.zip,application/java-archive,application/x-java-archive,application/zip'
    case 'resourcepack':
      return '.zip,application/zip'
    case 'shader':
      return '.zip,application/zip'
    case 'datapack':
      return '.zip,application/zip'
    case 'modpack':
      return '.mrpack,application/x-modrinth-modpack+zip,application/zip'
    default:
      return '*'
  }
}
