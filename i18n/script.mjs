import fs from 'fs'
import path from 'path'

const locales = [
  ['be', 'беларуская'],
  ['ca', 'català'],
  ['cs', 'čeština'],
  ['da', 'dansk'],
  ['de-CH', 'Schweizer Hochdeutsch'],
  ['de', 'Deutsch'],
  ['el', 'Ελληνικά'],
  ['en-GB', 'British English'],
  ['en-x-lolcat', 'LOLCAT'],
  ['en-x-pirate', 'Pirate English'],
  ['en-x-updown', 'ɥsᴉlƃuƎ uʍop ǝpᴉsdn'],
  ['en-x-uwu', 'English (UwU)'],
  ['eo', 'esperanto'],
  ['es', 'español'],
  ['et', 'eesti'],
  ['fi', 'suomi'],
  ['fr-BE', 'français (Belgique)'],
  ['fr-CA', 'français canadien'],
  ['fr', 'français'],
  ['he', 'עברית'],
  ['hi', 'हिन्दी'],
  ['hu', 'magyar'],
  ['it', 'italiano'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['lt', 'lietuvių'],
  ['lv', 'latviešu'],
  ['nb', 'norsk bokmål'],
  ['nl', 'Nederlands'],
  ['nn', 'norsk nynorsk'],
  ['pl', 'polski'],
  ['pt-BR', 'português (Brasil)'],
  ['pt', 'português'],
  ['ru-x-bandit', 'русский'],
  ['ru', 'русский'],
  ['sv', 'svenska'],
  ['tr', 'Türkçe'],
  ['uk', 'українська'],
  ['vi', 'Tiếng Việt'],
  ['zh-Hans', '简体中文'],
  ['zh-Hant', '繁體中文'],
]

for (const [locale, metaName] of locales) {
  const dir = path.join(process.cwd(), locale)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs.writeFileSync(path.join(dir, 'index.toml'), '', { encoding: 'utf8' })
  fs.writeFileSync(
    path.join(dir, 'meta.json'),
    JSON.stringify(
      {
        name: {
          message: metaName,
          description:
            "Name of the language in ‘dialect’ form, to be displayed in the language selector.\n\n⚠ DO NOT translate ‘American English’: it supposed to be translation for your target language; the one you're translating Modrinth to. E.g. if you're translating Modrinth to French, please translate this to ‘Français’, NOT ‘Anglais américain’.\n\nHere are some examples:\n• British English ⇒ British English\n• Portuguese ⇒ Português\n• Brazilian Portuguese ⇒ Português brasileiro\n• German ⇒ Deutsch\n• Swiss High German ⇒ Schweizer Hochdeutsch\n• Simplified Chinese ⇒ 简体中文\n• Traditional Chinese ⇒ 繁體中文.",
        },
      },
      null,
      2
    ),
    { encoding: 'utf8' }
  )
}
