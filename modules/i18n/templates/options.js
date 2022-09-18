// <%= '\n' %> <% /* */
;(() => {
  /**
   * Defines options that are passed to the template generator.
   *
   * @typedef {object} GeneratorOptions
   * @property {import('../index').Options} options Plugin options.
   */

  const { options: opts } = /** @type {GeneratorOptions} */ (options)

  let syncImportsBlock = ''

  let importMapDefinitionBlock = ''

  for (const locale of opts.locales) {
    const localeFilePath = '../' + relativeToBuild(opts.localesDir, locale.file)

    let localeDeclarationBlock = '{\n'

    if (locale.code === opts.defaultLocale) {
      let syncVarName = `locale${hash(locale.file)}`
      syncImportsBlock += `import ${syncVarName} from "${localeFilePath}";\n`

      if (locale.additionalImports != null) {
        for (const additionalImport of locale.additionalImports) {
          syncImportsBlock += `import "${additionalImport}";\n`
        }
      }

      localeDeclarationBlock += `importFunction: () => Promise.resolve({ default: ${syncVarName} }),\n`
    } else {
      const varName = `locale${hash(locale.file)}`
      const webpackChunkName = `locale-${locale.code}`
      const ext = locale.file.split('.').pop()

      let functionBlock = ''

      functionBlock += `const ${varName} = await import(/* webpackChunkName: "${webpackChunkName}.${ext}", webpackMode: "lazy" */  "${localeFilePath}");\n`

      if (locale.additionalImports != null) {
        for (const additionalImport of locale.additionalImports) {
          functionBlock += `await import("${additionalImport}" /* webpackChunkName: "etc-${webpackChunkName}.js", webpackMode: "lazy" */);\n`
        }
      }

      localeDeclarationBlock += `importFunction: async () => {
        ${functionBlock}
        return ${varName};
      },\n`
    }

    if (locale.data != null) {
      localeDeclarationBlock += `data: ${JSON.stringify(locale.data, 2)},`
    }

    localeDeclarationBlock += '\n},'

    importMapDefinitionBlock += `'${locale.code}': ${localeDeclarationBlock}`
  }

  const code = `${syncImportsBlock}\n
export const localesDefinitions = Object.assign(Object.create(null), {
  ${importMapDefinitionBlock}
});

export const defaultLocale = ${JSON.stringify(opts.defaultLocale)};
`

  print(code)
})()
// %>
