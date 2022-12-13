import JSZip from 'jszip'
import TOML from '@iarna/toml'
import yaml from 'js-yaml'
import { formatBytes } from '~/plugins/shorthands'

/**
 * @param {File | Blob} file the file to validate
 * @param {{ maxSize: number, alertOnInvalid: boolean }} validationOptions the
 * constraints to validate the file against
 * @param validationOptions.maxSize the max file size in bytes
 * @param validationOptions.alertOnInvalid if an alert should pop up describing
 * each validation error
 * @returns `true` if the file is valid; `false` otherwise
 */
export const fileIsValid = (file, validationOptions) => {
  const { maxSize, alertOnInvalid } = validationOptions
  if (maxSize !== null && maxSize !== undefined && file.size > maxSize) {
    console.log(`File size: ${file.size}, max size: ${maxSize}`)
    if (alertOnInvalid) {
      alert(
        `File ${file.name} is too big! Must be less than ${formatBytes(
          maxSize
        )}`
      )
    }
    return false
  }

  return true
}

export const acceptFileFromProjectType = (projectType) => {
  switch (projectType) {
    case 'mod':
      return '.jar,.zip,.litemod,application/java-archive,application/zip'
    case 'plugin':
      return '.jar,.zip,application/java-archive,application/zip'
    case 'resourcepack':
      return '.zip,application/zip'
    case 'shader':
      return '.zip,application/zip'
    case 'modpack':
      return '.mrpack,application/x-modrinth-modpack+zip'
    default:
      return '*'
  }
}

export const inferVersionInfo = async function (
  rawFile,
  project,
  gameVersions
) {
  function versionType(number) {
    if (number.includes('alpha')) {
      return 'alpha'
    } else if (
      number.includes('beta') ||
      number.match(/[^A-z](rc)[^A-z]/) || // includes `rc`
      number.match(/[^A-z](pre)[^A-z]/) // includes `pre`
    ) {
      return 'beta'
    } else {
      return 'release'
    }
  }

  // TODO: This func does not handle accurate semver parsing. We should eventually
  function gameVersionRange(gameVersionString, gameVersions) {
    if (!gameVersionString) {
      return []
    }

    // Truncate characters after `-` & `+`
    const gameString = gameVersionString.replace(/-|\+.*$/g, '')

    let prefix = ''
    if (gameString.includes('~')) {
      // Include minor versions
      // ~1.2.3 -> 1.2
      prefix = gameString.replace('~', '').split('.').slice(0, 2).join('.')
    } else if (gameString.includes('>=')) {
      // Include minor versions
      // >=1.2.3 -> 1.2
      prefix = gameString.replace('>=', '').split('.').slice(0, 2).join('.')
    } else if (gameString.includes('^')) {
      // Include major versions
      // ^1.2.3 -> 1
      prefix = gameString.replace('^', '').split('.')[0]
    } else if (gameString.includes('x')) {
      // Include versions that match `x.x.x`
      // 1.2.x -> 1.2
      prefix = gameString.replace(/\.x$/, '')
    } else {
      // Include exact version
      // 1.2.3 -> 1.2.3
      prefix = gameString
    }

    const simplified = gameVersions
      .filter((it) => it.version_type === 'release')
      .map((it) => it.version)
    return simplified.filter((version) => version.startsWith(prefix))
  }

  const inferFunctions = {
    // Forge 1.13+
    'META-INF/mods.toml': (file, zip) => {
      const metadata = TOML.parse(file)

      console.log(JSON.stringify(metadata))

      // TODO: Parse minecraft version ranges, handle if version is set to value from manifest
      if (metadata.mods && metadata.mods.length > 0) {
        return {
          name: `${project.title} ${metadata.mods[0].version}`,
          version_number: metadata.mods[0].version,
          version_type: versionType(metadata.mods[0].version),
          loaders: ['forge'],
        }
      } else {
        return {}
      }
    },
    // Old Forge
    'mcmod.info': (file) => {
      const metadata = JSON.parse(file)

      return {
        name: metadata.version ? `${project.title} ${metadata.version}` : '',
        version_number: metadata.version,
        version_type: versionType(metadata.version),
        loaders: ['forge'],
        game_versions: gameVersions
          .filter(
            (x) =>
              x.version.startsWith(metadata.mcversion) &&
              x.version_type === 'release'
          )
          .map((x) => x.version),
      }
    },
    // Fabric
    'fabric.mod.json': (file) => {
      const metadata = JSON.parse(file)

      return {
        name: `${project.title} ${metadata.version}`,
        version_number: metadata.version,
        loaders: ['fabric'],
        version_type: versionType(metadata.version),
        game_versions: metadata.depends
          ? gameVersionRange(metadata.depends.minecraft, gameVersions)
          : [],
      }
    },
    // Quilt
    'quilt.mod.json': (file) => {
      const metadata = JSON.parse(file)

      return {
        name: `${project.title} ${metadata.quilt_loader.version}`,
        version_number: metadata.quilt_loader.version,
        loaders: ['quilt'],
        version_type: versionType(metadata.quilt_loader.version),
        game_versions: metadata.quilt_loader.depends
          ? gameVersionRange(
              metadata.depends.find((x) => x.id === 'minecraft')
                ? metadata.depends.find((x) => x.id === 'minecraft').versions
                : [],
              gameVersions
            )
          : [],
      }
    },
    // Bukkit + Other Forks
    'plugin.yml': (file) => {
      const metadata = yaml.load(file)

      return {
        name: `${project.title} ${metadata.version}`,
        version_number: metadata.version,
        version_type: versionType(metadata.version),
        loaders: ['bukkit'],
        game_versions: gameVersions
          .filter(
            (x) =>
              x.version.startsWith(metadata['api-version']) &&
              x.version_type === 'release'
          )
          .map((x) => x.version),
      }
    },
    // Bungeecord + Waterfall
    'bungee.yml': (file) => {
      const metadata = yaml.load(file)

      return {
        name: `${project.title} ${metadata.version}`,
        version_number: metadata.version,
        version_type: versionType(metadata.version),
        loaders: ['bungeecord'],
      }
    },
    // Modpacks
    'modrinth.index.json': (file) => {
      const metadata = JSON.parse(file)

      const loaders = []
      if ('forge' in metadata.dependencies) loaders.push('forge')
      if ('fabric-loader' in metadata.dependencies) loaders.push('fabric')
      if ('quilt-loader' in metadata.dependencies) loaders.push('quilt')

      return {
        name: `${project.title} ${metadata.versionId}`,
        version_number: metadata.versionId,
        version_type: versionType(metadata.versionId),
        loaders,
        game_versions: gameVersions
          .filter((x) => x.version === metadata.dependencies.minecraft)
          .map((x) => x.version),
      }
    },
  }

  const zipReader = new JSZip()

  const zip = await zipReader.loadAsync(rawFile)

  for (const fileName in inferFunctions) {
    const file = zip.file(fileName)

    if (file !== null) {
      const text = await file.async('text')
      return inferFunctions[fileName](text, zip)
    }
  }
}
