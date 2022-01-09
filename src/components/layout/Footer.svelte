<script lang="ts">
	import { t, locale, locales } from 'svelte-intl-precompile';
	import { theme } from '$stores/app';
	import LogoWordmark from '$assets/images/logo/wordmark.svg?component';
	import Multiselect from '$components/elements/Multiselect.svelte';
	import Button from '$components/elements/Button.svelte';
</script>

<footer class="footer">
	<div class="footer__brand">
		<a href="/" aria-label="Modrinth Home">
			<LogoWordmark height={30} />
		</a>
		<p>
			{$t('footer.description')}
		</p>
		<p>{$t('footer.copyright')}</p>
	</div>
	<div class="footer__list">
		<span class="footer__list__header">{$t('footer.legal.heading')}</span>
		<a href="/legal/terms">{$t('footer.legal.terms')}</a>
		<a href="/legal/privacy">{$t('footer.legal.privacy')}</a>
		<a href="/legal/rules">{$t('footer.legal.rules')}</a>
	</div>
	<div class="footer__list">
		<span class="footer__list__header">{$t('footer.resources.heading')}</span>
		<a href="https://blog.modrinth.com/">{$t('footer.resources.blog')}</a>
		<a href="/discord" target="_blank">{$t('generic.external.discord')}</a>
		<a href="https://github.com/modrinth">{$t('generic.external.github')}</a>
		<a href="https://docs.modrinth.com/">{$t('footer.resources.docs')}</a>
	</div>
	<div class="footer__buttons">
		<Button label={$t('footer.buttons.privacy')} href="/privacy" color="raised" />
		<Multiselect
			label={$t('footer.buttons.theme.label')}
			options={[
				{
					label: $t('footer.buttons.theme.system'),
					value: 'system',
				},
				{
					label: $t('footer.buttons.theme.light'),
					value: 'light',
				},
				{
					label: $t('footer.buttons.theme.dark'),
					value: 'dark',
				},
				{
					label: $t('footer.buttons.theme.oled'),
					value: 'oled',
				},
			]}
			color="raised"
			bind:value={$theme}
		/>
		<Multiselect
			label={$t('footer.buttons.language.label')}
			options={$locales.map((locale) => ({
				label: $t(`footer.buttons.language.${locale}`),
				value: locale,
			}))}
			color="raised"
			bind:value={$locale}
		/>
	</div>
</footer>

<style lang="postcss">
	.footer {
		display: grid;
		grid-gap: 1rem 3rem;
		grid-template-areas: 'brand list-1 list-2 buttons';
		margin-top: auto;
		padding-bottom: 1rem;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;

		> * {
			display: flex;
			flex-direction: column;
			grid-gap: 0.3rem;
		}

		&__brand {
			grid-area: brand;
			flex: 1;
		}

		&__list {
			&__header {
				font-weight: var(--font-weight-medium);
			}
			:nth-child(1) {
				grid-area: list-1;
			}
			:nth-child(2) {
				grid-area: list-2;
			}
		}

		&__buttons {
			grid-area: buttons;
			align-items: flex-end;
			grid-gap: 0.5rem;
		}

		@media (width < 900px) {
			grid-template-areas:
				'brand list-1 list-2'
				'buttons buttons buttons';

			&__buttons {
				flex-direction: row;
				justify-content: center;
			}
		}

		@media (width < 900px) {
			grid-template-areas:
				'brand list-1 list-2'
				'buttons buttons buttons';

			&__buttons {
				flex-direction: row;
				justify-content: center;
			}
		}

		@media (width < 530px) {
			grid-template-areas:
				'brand brand'
				'list-1 list-2'
				'buttons buttons';

			&__buttons {
				flex-direction: column;
				align-items: flex-start;
				flex-wrap: wrap;
			}
		}

		@media (width < 320px) {
			grid-template-areas: 'buttons' 'list-2' 'list-1' 'brand';
		}
	}
</style>
