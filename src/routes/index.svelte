<script lang="ts">
	import Meta from '$components/utils/Meta.svelte'
	import Wordmark from '$assets/images/logo/wordmark.svg'
	import IconSearch from 'virtual:icons/heroicons-outline/search'
	import projectColors from '$generated/projects.json'
	import { mods } from '$generated/landingPage.json'
	import { goto } from '$app/navigation'
	import { t } from 'svelte-intl-precompile'
	import ImageNotebook from '$assets/images/homepage/3dicons/notebook-dynamic-color.webp'
	import ImageDollar from '$assets/images/homepage/3dicons/dollar-dynamic-color.webp'
	import ImageExplorer from '$assets/images/homepage/3dicons/explorer-dynamic-color.webp'
	import ImageChatBubble from '$assets/images/homepage/3dicons/chat-bubble-dynamic-color.webp'
	import ImagePuzzle from '$assets/images/homepage/3dicons/puzzle-dynamic-color.webp'
	import ImageTool from '$assets/images/homepage/3dicons/tool-dynamic-color.webp'
	import Prando from 'prando'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'

	let random
	let modOffset

	onMount(() => {
		random = new Prando()
		modOffset = mods.length < 100 ? 0 : Math.floor(random.nextInt(0, 60)) // 100 (total projects) - 40 (used)
	})

	function search(event: SubmitEvent) {
		const data = new FormData(event.target as HTMLFormElement)
		goto(`/mods?q=${data.get('term')}`)
	}

	const layout = [
		[1, 1],
		[1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1, 1],
		[1, 1, 1, 1],
		[1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1],
	]

	const cdnDomain = `${
		(import.meta.env.VITE_API_URL as string)?.includes('staging') ? 'staging-' : ''
	}cdn.modrinth.com`

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: 'https://modrinth.com/',
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: 'https://modrinth.com/mods?q={search_term_string}',
			},
			'query-input': 'required name=search_term_string',
		},
	}
</script>

<svelte:head>
	<!-- Uses funky formatting because prettier bug https://github.com/sveltejs/prettier-plugin-svelte/issues/290  -->
	{@html `<${'script'} type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<Meta
	fullTitle="Modrinth: Download and publish Minecraft Mods & Modpacks"
	description="Download Minecraft mods and modpacks on Modrinth. Discover and publish projects on Modrinth with a modern, easy to use interface and API." />

<div class="hero">
	<div class="stacks">
		{#if random && modOffset}
			{#each layout as row, rowIndex}
				<div class="stacks__row">
					{#each row as column, colIndex}
						{@const index = rowIndex * layout[rowIndex].length + colIndex + modOffset}
						{#if column === 1 && mods?.[index]?.[0]}
							<a
								class="stacks__row__column"
								href="/mod/{mods?.[index]?.[1] || mods?.[index]?.[0]}"
								tabindex="-1"
								style:--color={projectColors[mods?.[index]?.[0]] || 'grey'}
								style:--offset="{Math.round(random.nextInt(-25, 25))}px"
								title={mods?.[index]?.[1]}
								in:fly={{
									delay: random.nextInt(0, 40) * 70,
									y: 300,
									duration: 700,
								}}>
								<div class="stacks__row__column__background" />
								<img
									class="stacks__row__column__face"
									src="https://{cdnDomain}/data/{mods?.[index]?.[0]}/icon.{mods?.[index]?.[2] ||
										''}"
									alt="" />
							</a>
						{/if}
					{/each}
				</div>
			{/each}
		{/if}
	</div>

	<Wordmark class="hero__wordmark" />
	<h1 class="hero__tagline">{$t('index.tagline')}</h1>
	<form class="hero__search" on:submit|preventDefault={search}>
		<input
			type="text"
			placeholder={$t('project.types.mod.search')}
			name="term"
			class="hero__search__input" />
		<button type="submit" class="hero__search__button" title="Search">
			<IconSearch />
		</button>
	</form>
	<p class="hero__description">{$t('index.description')}</p>
</div>

<div class="features">
	<div class="features__item">
		<img src={ImageNotebook} alt="Book with bookmark" class="features__item__image" />
		<div class="features__item__text">
			<h3 class="title-secondary">{$t('index.features.book.title')}</h3>
			<p class="summary">{$t('index.features.book.description')}</p>
		</div>
	</div>
	<div class="features__item">
		<img src={ImageDollar} alt="Gold coin" class="features__item__image" />
		<div class="features__item__text">
			<h3 class="title-secondary">{$t('index.features.coin.title')}</h3>
			<p class="summary">{$t('index.features.coin.description')}</p>
		</div>
	</div>
	<div class="features__item">
		<img src={ImageExplorer} alt="Speedometer" class="features__item__image" />
		<div class="features__item__text">
			<h3 class="title-secondary">{$t('index.features.speedometer.title')}</h3>
			<p class="summary">{$t('index.features.speedometer.description')}</p>
		</div>
	</div>
	<div class="features__item">
		<img src={ImageChatBubble} alt="Two chat bubbles" class="features__item__image" />
		<div class="features__item__text">
			<h3 class="title-secondary">{$t('index.features.chat.title')}</h3>
			<p class="summary">{$t('index.features.chat.description')}</p>
		</div>
	</div>
	<div class="features__item">
		<img src={ImagePuzzle} alt="Puzzle piece" class="features__item__image" />
		<div class="features__item__text">
			<h3 class="title-secondary">{$t('index.features.puzzle.title')}</h3>
			<p class="summary">{$t('index.features.puzzle.description')}</p>
		</div>
	</div>
	<div class="features__item">
		<img src={ImageTool} alt="Screwdriver and wrench" class="features__item__image" />
		<div class="features__item__text">
			<h3 class="title-secondary">{$t('index.features.tools.title')}</h3>
			<p class="summary">{$t('index.features.tools.description')}</p>
		</div>
	</div>
</div>

<style lang="postcss">
	.hero {
		width: 100%;
		min-height: 32rem;

		background-color: var(--color-raised-bg);
		border-radius: 2rem;
		overflow: hidden;
		box-shadow: var(--shadow-raised), var(--shadow-inset);
		position: relative;
		padding: 4rem;
		display: flex;
		flex-direction: column;
		grid-gap: 1.5rem;
		align-items: flex-start;

		@media (width < 750px) {
			padding: 2rem 2rem 2rem 2rem;
		}

		.stacks {
			--width: 7rem;
			--offset: 0px;
			position: absolute;
			top: 0;
			right: 0;
			height: 100%;
			speak: none;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			margin-top: calc(var(--width) / 1.9);

			@media (width < 950px) {
				top: 10rem;
				--width: 5rem;

				&__row:nth-child(1),
				&__row:nth-child(2) {
					display: none;
				}
			}

			&__row {
				display: flex;
				justify-content: flex-end;

				&:nth-of-type(odd) {
					margin-right: calc(var(--width) * -0.5);
				}

				&__column {
					width: var(--width);
					height: calc(var(--width) * 0.85);
					position: relative;
					cursor: pointer;
					transition: transform 0.2s ease-in-out;
					--color: transparent;
					transform: translateY(var(--offset));

					&:hover {
						transform: translateY(calc(var(--width) / -5 + var(--offset)));
					}

					&__background {
						background: linear-gradient(
								to right,
								hsla(0deg, 0%, 0%, 0.1),
								hsla(0deg, 0%, 0%, 0.2) 50%,
								hsla(0deg, 0%, 0%, 0.4) 50%,
								hsla(0deg, 0%, 0%, 0.5)
							),
							linear-gradient(to right, var(--color), var(--color));
						height: 100vh;
						position: absolute;
						top: 0;
						width: 100%;
					}

					&__face {
						background-color: var(--color);
						position: absolute;
						top: 0;
						width: calc(var(--width) / 1.75);
						aspect-ratio: 1/1;
						transform-origin: var(--width) var(--width);
						/* These decimals aren't ideal, but they provide the correct size & transformation for the given `--width` */
						transform: rotate(30deg) skew(-30deg) translate(calc(var(--width) * -0.58), 0)
							scaleY(0.864);
					}
				}
			}
		}

		:not(.stacks) {
			z-index: 1;
		}

		:global(&__wordmark) {
			height: 5rem;
			width: auto;

			@media (width < 750px) {
				height: 4rem;
			}

			@media (width < 500px) {
				height: auto;
				width: 80%;
			}
		}

		&__tagline {
			font-weight: 500;
			font-size: 1.8rem;
			width: calc(100% - 21rem);
			line-height: 130%;

			@media (width < 950px) {
				width: 100%;
				font-size: 1.5rem;
			}
		}

		&__search {
			width: 50%;
			@media (width < 950px) {
				width: 100%;
			}
			display: flex;
			align-items: center;

			&__input {
				background-color: var(--color-button-bg);
				border-radius: 0.8rem;
				box-shadow: var(--shadow-raised), var(--shadow-inset);
				padding: 0.5rem 1.25rem;
				border: none;
				width: 100%;
			}

			&__button {
				margin-left: -2.25rem;
				z-index: 2;
				display: flex;
			}
		}

		&__description {
			width: calc(100% - 30rem);

			@media (width < 950px) {
				width: 100%;
				margin-bottom: 13.5rem;
				font-size: 1rem;
			}

			font-size: 1.2rem;
			line-height: 130%;
		}
	}

	.features {
		display: flex;
		flex-wrap: wrap;

		&__item {
			display: flex;
			flex-direction: column;
			padding: 1rem;
			align-items: center;
			flex-basis: 33.33%;
			text-align: center;
			grid-gap: 0.75rem;

			&__text {
				display: flex;
				flex-direction: column;
				grid-gap: 0.75rem;
			}

			@media (width <= 820px) {
				flex-basis: 50%;
			}
		}

		@media (width <= 500px) {
			grid-gap: 1rem;

			&__item {
				flex-basis: 100%;
				flex-direction: row;
				grid-gap: 1rem;
				text-align: left;

				&__image {
					width: 6rem;
				}

				&:nth-child(odd) {
					flex-direction: row-reverse;
				}
			}
		}
	}
</style>
