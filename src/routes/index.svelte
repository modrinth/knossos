<script lang="ts">
  import Meta from '$components/utils/Meta.svelte'
  import Wordmark from '$assets/images/logo/wordmark.svg'
  import IconSearch from 'virtual:icons/heroicons-outline/search'
  import Background from "$components/elements/Background.svelte";
</script>

<Meta/>

<div class="home">
  <Background />
  <Wordmark class="home__wordmark"/>
  <h1 class="home__tagline">Discover, Play, & Create Minecraft content</h1>
  <div class="home__search">
    <input type="text" placeholder="Search mods..." class="home__search__input"/>
    <IconSearch class="home__search__icon"/>
  </div>
  <p class="home__description">
    Find enjoyable and quality content through our open-source modding platform built for the community. Create stuff,
    get paid*, and deploy your project with our fully documented API!
  </p>
</div>

<style lang="postcss">
  .home {
    width: 100%;
    min-height: calc(100vh - 20rem);

    background-color: var(--color-raised-bg);
    border-radius: 1.5rem;
    overflow: hidden visible;
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

    :global(.background) {
      position: absolute;
      top: 0;
      right: -10px;
      height: 100%;
    }

    :global(&__wordmark) {
      height: 5rem;
      width: auto;

      @media (width < 750px) {
        height: 4rem;
      }

      @media (width < 500px) {
        height: 3rem;
      }
    }

    &__tagline {
      font-weight: 500;
      font-size: 1.8rem;
      width: calc(100% - 18rem);
    }

    &__search {
      width: 50%;
      @media (width < 500px) {
        width: 100%;
      }
      display: flex;
      align-items: center;

      &__input {
        background-color: var(--color-button-bg);
        border-radius: var(--rounded-max);
        box-shadow: var(--shadow-raised), var(--shadow-inset);
        padding: 0.5rem 1.25rem;
        border: none;
        width: 100%;
      }

      :global(&__icon) {
        margin-left: -2.25rem;
      }
    }

    &__description {
      width: calc(100% - 30rem);

      @media (width < 500px) {
        width: 100%;
      }
      font-size: 1.2rem;
      line-height: 140%;
    }
  }
</style>
