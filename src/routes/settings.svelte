<script lang="ts">
  import { t } from 'svelte-intl-precompile'
  import Meta from '$components/utils/Meta.svelte'
  import Button from '$components/elements/Button.svelte'
  import { token, user } from '$stores/server'
  import { popups } from '$stores/app'
  import { goto } from '$app/navigation'
  import { send } from '$lib/api'

  let copiedToken = false

  function deleteAccount() {
    $popups = [{
      title: 'Are you sure you want to do this?',
      type: {
        deletion: {
          key: $user.username,
        },
      },
      body: `
We will **immediately delete all of your projects** and follows. Deleting your account cannot be reversed.

If you need help with your account, get support on the [Modrinth Discord](/discord).`,
      button: {
        label: 'Delete my account',
        click: async () => {
          await send('DELETE', `user/${$user.id}`)
          await logOut()
        }
      },
      style: {
        wide: true,
      }
    }, ...$popups]
  }

  function revokeToken() {
    $popups = [{
      title: 'Revoke your Modrinth token',
      body: `
Revoking your Modrinth token can have unintended consequences. Please be aware that the following could break:
 - Any application that uses your token to access the API.
 - Gradle - if Minotaur is given a incorrect token, your Gradle builds could fail.
 - GitHub - if you use a GitHub action that uses the Modrinth API, it will cause errors.

If you are willing to continue, complete the following steps:

 1. Head to the [Modrinth Application page on GitHub](https://github.com/settings/connections/applications/3acffb2e808d16d4b226). Make sure to be logged into the GitHub account you used for Modrinth!
 2. Press the big red "Revoke Access" button next to the "Permissions" header.

Once you have completed those steps, press the continue button below.

**This will log you out of Modrinth, however, when you log back in, your token will be regenerated.**`,
      button: {
        click: async () => {
          await logOut();
        }
      },
      style: {
        wide: true,
      }
    }, ...$popups]
  }

  async function logOut() {
    $user = null;
    $token = '';
    document.cookie =
      'modrinth-token' + '=test; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    await goto('/')
  }
</script>

<Meta title={$t('pages.settings')}/>

<div class="single-layout">
  <h1>{$t('pages.settings')}</h1>
  <div class="card card--text">
    <h3>Authorization token</h3>
    <p>
      Your authorization token can be used with the Modrinth API, the Minotaur Gradle plugin, and other applications
      that interact with Modrinth's API. Be sure to keep this secret!
    </p>
    <div class="button-group">
      <Button label="{copiedToken ? 'Copied' : 'Copy' } token to clipboard" on:click={async () => {
        await navigator.clipboard.writeText($token)
        copiedToken = true
        }}/>
      <Button label="Revoke token" on:click={revokeToken}/>
    </div>
  </div>
  <div class="card card--text">
    <h3>Delete account</h3>
    <p>
      Once you delete your account, there is no going back. Deleting your account will remove all attached data,
      including projects, from our servers.
    </p>
    <div class="button-group">
      <Button label="Delete account" color="red" on:click={deleteAccount} />
    </div>
  </div>
</div>

<style lang="postcss">

</style>
