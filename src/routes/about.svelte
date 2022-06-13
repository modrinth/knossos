<script lang="ts">
	import { t } from 'svelte-intl-precompile'
	import Meta from '$components/utils/Meta.svelte'
</script>

<Meta
	title={$t('pages.about')}
	description="Founded in 2020, Modrinth was created to provide modders with an open and intuitive platform to publish their projects on." />

<div class="single-layout">
	<h1>{$t('pages.about')}</h1>
	<div class="card markdown">
		<h2>History</h2>
		<p>
			Founded in 2020, Modrinth was created to provide modders with an open and intuitive platform
			to publish their projects on.
		</p>

		<p>
			Our primary goal is to be as open as possible, with all our code being
			<a target="_blank" href="https://github.com/modrinth">open source</a>, while giving back to
			the modding community as much as possible.
		</p>

		<h2>Inner workings</h2>
		<p>
			Modrinth is not just a website: it is made of several different components that all come
			together to make a fast and flexible modding platform.
		</p>

		<p>
			On the technical level, Modrinth is made up of two main components: the Rust-based backend
			named
			<a target="_blank" href="https://github.com/modrinth/labrinth">Labrinth</a>, and the
			Svelte-based frontend named
			<a target="_blank" href="https://github.com/modrinth/knossos">Knossos</a>.
		</p>

		<p>
			Additionally, some other custom-created resources exist, including but not limited to:
			<a target="_blank" href="https://github.com/modrinth/minotaur">Minotaur</a>, a Gradle plugin
			for easily publishing mods to Modrinth, and
			<a target="_blank" href="https://github.com/modrinth/minos">Minos</a>, an authentication
			provider. All of Modrinth's code can be found on
			<a target="_blank" href="https://github.com/modrinth">our GitHub page</a>.
		</p>
	</div>
</div>
