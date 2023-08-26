const projectTypeMessages = defineMessages({
  datapackProjectType: {
    id: 'project-type.datapack',
    defaultMessage: 'Data Pack',
  },
  datapacksProjectType: {
    id: 'project-type.datapacks',
    defaultMessage: 'Data Packs',
  },
  modProjectType: {
    id: 'project-type.mod',
    defaultMessage: 'Mod',
  },
  modsProjectType: {
    id: 'project-type.mods',
    defaultMessage: 'Mods',
  },
  modpackProjectType: {
    id: 'project-type.modpack',
    defaultMessage: 'Modpack',
  },
  modpacksProjectType: {
    id: 'project-type.modpacks',
    defaultMessage: 'Modpacks',
  },
  pluginProjectType: {
    id: 'project-type.plugin',
    defaultMessage: 'Plugin',
  },
  pluginsProjectType: {
    id: 'project-type.plugins',
    defaultMessage: 'Plugins',
  },
  resourcepackProjectType: {
    id: 'project-type.resourcepack',
    defaultMessage: 'Resource Pack',
  },
  resourcepacksProjectType: {
    id: 'project-type.resourcepacks',
    defaultMessage: 'Resource Packs',
  },
  shaderProjectType: {
    id: 'project-type.shader',
    defaultMessage: 'Shader',
  },
  shadersProjectType: {
    id: 'project-type.shaders',
    defaultMessage: 'Shaders',
  },
})

type MessageKeys = keyof typeof projectTypeMessages

type ExtractSingulars<K extends string> = K extends `${infer T}s` ? T : never

type ProjectType = ExtractSingulars<MessageKeys>

export function getProjectTypeMessage(type: ProjectType, plural = false) {
  return projectTypeMessages[`${type}${plural ? 's' : ''}ProjectType`]
}
