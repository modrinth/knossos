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
    const localeFilePath = JSON.stringify(locale.file)

    const localeHash = hash(locale.file)

    let localeDeclarationBlock = '{\n'

    if (locale.code === opts.defaultLocale) {
      let syncVarName = `locale${localeHash}`

      syncImportsBlock += `import ${syncVarName} from ${localeFilePath};\n`

      let functionBlock = 'const importedData = Object.create(null);\n'

      for (const [key, value] of Object.entries(locale.importedData)) {
        const mapKey = JSON.stringify(key)
        /** @type {string} */
        let importPath
        /** @type {string} */
        let importKey

        if (Array.isArray(value)) {
          importPath = value[0]
          importKey = value[1] ?? 'default'
        } else {
          importPath = value
          importKey = 'default'
        }

        const dataVarName = `locale${localeHash}Data${hash(importPath)}`

        importPath = JSON.stringify(importPath)
        importKey = JSON.stringify(importKey)

        syncImportsBlock += `import * as ${dataVarName} from ${importPath};\n`

        functionBlock += `importedData[${mapKey}] = ${dataVarName}[${importKey}];\n`
      }

      if (locale.additionalImports != null) {
        for (const additionalImport of locale.additionalImports) {
          const importPath = JSON.stringify(additionalImport)
          syncImportsBlock += `import ${importPath};\n`
        }
      }

      localeDeclarationBlock += `importFunction: () => {
        ${functionBlock}
        return Promise.resolve({ messages: ${syncVarName}, importedData });
      },\n`
    } else {
      const varName = `locale${hash(locale.file)}`
      const chunkName = JSON.stringify(`locale-${locale.code}`)
      const dataChunkName = JSON.stringify(`locale-${locale.code}-data`)

      let functionBlock = ''

      functionBlock += `const ${varName} = (await import(/* webpackChunkName: ${chunkName}, webpackMode: "lazy" */  ${localeFilePath}))["default"];\n`

      if (Array.isArray(locale.additionalImports)) {
        for (const additionalImport of locale.additionalImports) {
          let importPath = JSON.stringify(additionalImport)
          functionBlock += `await import(/* webpackChunkName: ${dataChunkName}, webpackMode: "lazy" */ ${importPath});\n`
        }
      }

      functionBlock += 'const importedData = Object.create(null);\n'

      for (const [key, value] of Object.entries(locale.importedData)) {
        const mapKey = JSON.stringify(key)
        /** @type {string} */
        let importPath
        /** @type {string} */
        let importKey

        if (Array.isArray(value)) {
          importPath = value[0]
          importKey = value[1] ?? 'default'
        } else {
          importPath = value
          importKey = 'default'
        }

        importPath = JSON.stringify(importPath)
        importKey = JSON.stringify(importKey)

        functionBlock += `importedData[${mapKey}] = (await import(/* webpackChunkName: ${dataChunkName}, webpackMode: "lazy" */ ${importPath}))[${importKey}];\n`
      }

      localeDeclarationBlock += `importFunction: async () => {
        ${functionBlock}
        return { messages: ${varName}, importedData };
      },\n`
    }

    if (locale.data != null) {
      localeDeclarationBlock += `data: ${JSON.stringify(locale.data, null, 2)},`
    }

    localeDeclarationBlock += '\n},'

    importMapDefinitionBlock += `'${locale.code}': ${localeDeclarationBlock}`
  }

  const code = `${syncImportsBlock}\n
export const localesDefinitions = Object.assign(Object.create(null), {
  ${importMapDefinitionBlock}
});

export const baseURL = ${JSON.stringify(opts.baseURL ?? null)};

export const defaultLocale = ${JSON.stringify(opts.defaultLocale)};
`

  print(code)
})()
// %>
