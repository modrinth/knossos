<script lang="ts">
	import IconGithub from 'virtual:icons/simple-icons/github'
	import IconTerminal from 'virtual:icons/heroicons-outline/terminal'
	import Meta from '$components/utils/Meta.svelte'
	import Wordmark from '$assets/logo/wordmark.svg'
	import IconSearch from 'virtual:icons/heroicons-outline/search'
	import projectColors from '$generated/projects.json'
	import { mods } from '$generated/landingPage.json'
	import { goto } from '$app/navigation'
	import { t } from 'svelte-intl-precompile'
	import ImageRoadmap from '$assets/landing-page/roadmap.svg'
	import ImageIllustrationUrl from '$assets/landing-page/illustration.svg?url'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { Button } from 'omorphia'
	import { user } from '$stores/account'
	import { browser } from '$app/env'

	let modOffset = -1

	/** Random integer number in a range (inclusive) */
	function randomInt(min: number, max: number) {
		return Math.round(Math.random() * (max - min) + min)
	}

	onMount(() => {
		modOffset = mods.length < 100 ? 0 : randomInt(0, 60) // 100 (total projects) - 40 (used)
	})

	function search(event: Event) {
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

<div class="index-layout">
	<div class="hero">
		<div class="stacks">
			{#if modOffset !== -1}
				{#each layout as row, rowIndex}
					<div class="stacks__row">
						{#each row as column, colIndex}
							{@const index = rowIndex * layout[rowIndex].length + colIndex + modOffset}
							{#if column === 1 && mods?.[index]?.[0]}
								<a
									class="stacks__row__column"
									href="/mod/{mods?.[index]?.[1] || mods?.[index]?.[0]}"
									tabindex="-1"
									style:--color={projectColors[mods[index][0]] || 'grey'}
									style:--offset="{randomInt(-25, 25)}px"
									title={mods?.[index]?.[1]}
									in:fly={{
										delay: randomInt(0, 40) * 40,
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

	<div class="card feature feature--column">
		<div class="feature__content">
			<h3 class="feature__content__title">Constantly evolving and improving</h3>
			<p>
				The Modrinth team and contributors update the platform constantly to ensure sharing and
				finding Minecraft content is as easy and seamless as possible. Modrinth relies on its
				community to steer development and to suggest features. Track our progress on GitHub, and
				get involved via Discord.
			</p>
			<ImageRoadmap />
		</div>
	</div>

	<div class="card feature">
		<div class="feature__content">
			<h3 class="feature__content__title">A growing platform</h3>
			<p>
				Since its start in 2020, Modrinth has experienced rapid growth, in both its functionality
				and selection of mods. With no stopping in sight, Modrinth intends to keep expanding and
				growing to be the best Minecraft content platform it can be.
			</p>
			{#if $user}
				<Button href={`/user/${$user.username}`} color="primary"
					><IconGithub /> Go to your profile</Button>
			{:else}
				<Button
					href={browser
						? `${import.meta.env.VITE_API_URL}auth/init?url=${window.location.href}`
						: ''}
					color="primary">
					<IconGithub />
					{$t('header.github')}
				</Button>
			{/if}
		</div>

		<img
			src={ImageIllustrationUrl}
			alt="A Minecraft village at night with players wrestling to control a dinosaur, fighting one another, and a player riding an ender dragon." />
	</div>

	<div class="card feature theme-dark">
		<div class="feature__content">
			<h3 class="feature__content__title">Open straightforward API</h3>
			<p>
				Modrinth enables rich integration with its free-to-use API. With no restrictions, developers
				are empowered to
			</p>
			<Button href="https://docs.modrinth.com/api-spec" color="tertiary">
				<IconTerminal /> View API documentation
			</Button>
		</div>

		<pre class="hljs-wrapper"><code class="hljs language-js"
				><span class="hljs-keyword">const</span> response = <span class="hljs-keyword"
					>await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string"
					>'https://api.modrinth.com/v2/search'</span
				>)
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword"
					>await</span> response.<span class="hljs-title function_">json</span>()

<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span
				>(results)

<span class="hljs-comment"
					>// hits: Array(10) [ &#123;…&#125;, &#123;…&#125;, &#123;…&#125;, … ]</span>
<span class="hljs-comment">// limit: 10</span>
<span class="hljs-comment">// offset: 0</span>
<span class="hljs-comment">// total_hits: 3232</span>
</code></pre>
	</div>
</div>

<style lang="postcss">
	.index-layout {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
	}

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
		gap: 1.5rem;
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

	.feature {
		padding: 2rem;
		display: grid;
		grid-template-columns: 4fr 5fr;
		gap: 2rem;
		border-radius: 2rem;
		max-height: 24rem;
		color: var(--color-text);

		&--column {
			display: flex;
		}

		&:nth-child(odd) {
			> .feature__content {
				order: 2;
			}
		}

		&__content {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 1.5rem;
			padding: 1rem 0.5rem;

			&__title {
				font-weight: 400;
				font-size: 30px;
				margin: 0;
			}

			:global(.button) {
				margin-top: auto;
			}
		}

		> :global(img) {
			border-radius: var(--rounded);
			height: 100%;
			width: 100%;
			object-fit: cover;
		}

		pre {
			font-size: 14px;
		}

        pre.hljs-wrapper {
            display: block;
            padding: 16px;
            border-radius: 16px;
            background: #0d1117;
        }
	}
</style>
