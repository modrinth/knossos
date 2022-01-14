<script lang="ts">
	import IconChevronDown from 'virtual:icons/lucide/chevron-down';
	import FloatingMenu from './FloatingMenu.svelte';
	import IconSettings from 'virtual:icons/lucide/settings';
	import IconLogout from 'virtual:icons/lucide/log-out';
	import IconHeart from 'virtual:icons/lucide/heart';
	import IconModeration from 'virtual:icons/fa-regular/life-ring';
	import { clickOutside } from 'svelte-use-click-outside';
	import { token, user } from '$stores/server';
	import { goto } from '$app/navigation';
  import { page } from '$app/stores'

	let isOpen = false;

	const items = [
		{
			label: '@' + $user.username,
			sublabel: 'Go to my profile',
			href: `/user/${$user.username}`,
		},
		{
			divider: true,
		},
		{
			label: 'Following',
			href: '/following',
			icon: IconHeart,
		},
		{
			label: 'Settings',
			href: '/settings',
			icon: IconSettings,
		},
		{
			divider: true,
		},
		{
			label: 'Log out',
			action: () => {
				$user = null;
				$token = '';
				document.cookie =
					'modrinth-token' + '=test; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // window.location.replace($page.url.toString()); // Reloads page after logout
			},
			icon: IconLogout,
		},
	];

	if (['admin', 'moderator'].includes($user.role)) {
		items.splice(2, 0, {
			label: 'Moderation',
			href: '/moderation',
			icon: IconModeration,
		});
	}
</script>

<div
	class="avatar"
	class:is-open={isOpen}
	use:clickOutside={() => {
		isOpen = false;
	}}
>
	<button
		class="avatar__toggle"
		on:click={() => {
			isOpen = !isOpen;
		}}
	>
		<img class="avatar__toggle__image" src={$user.avatar_url} alt={$user.username} />
		<IconChevronDown />
	</button>

	<FloatingMenu bind:display={isOpen} align="right" {items} />
</div>

<style lang="postcss">
	.avatar {
		position: relative;

		&__toggle {
			&__image {
				width: 2rem;
				border-radius: 100%;
				border: 0.15rem solid transparent;
				transition: border-color 0.2s ease-in-out;
			}
		}
		&.is-open,
		&:hover {
			.avatar__toggle {
				&__image {
					border-color: var(--color-brand);
				}
			}
		}
	}
</style>
