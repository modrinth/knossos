export const getLocaleFromAcceptLanguageHeader = (
	header: string | null,
	availableLocales?: string[]
): string | undefined => {
	// If header is null (i.e. does not exist) the fallbackLocale should be used
	if (!header) return undefined

	// Parse Accept-Language header
	const locales = header
		.split(',')
		.map((locale) => locale.trim())
		.map((locale) => {
			const directives = locale.split(';q=')
			return {
				locale: directives[0],
				quality: parseFloat(directives[1]) || 1.0,
			}
		})
		.sort((a, b) => b.quality - a.quality)

	// If availableLocales is not defined return the first language from header
	if (!availableLocales || availableLocales.length === 0) return locales[0].locale

	if (availableLocales.includes(locales[0].locale)) {
		return locales[0].locale
	}

	for (const available of availableLocales) {
		if (available.split('-')[0] === locales[0].locale) {
			return available
		}
	}

	availableLocales = availableLocales.map((l) => l.toLowerCase())

	// Check full match
	for (const locale of locales) {
		if (availableLocales.includes(locale.locale.toLowerCase())) return locale.locale
	}

	// Check base language match
	for (const locale of locales.filter((l) => l.locale.includes('-'))) {
		const base = locale.locale.split('-')[0]
		if (availableLocales.includes(base.toLowerCase())) return base
	}

	// If no match found use fallbackLocale
	return undefined
}
