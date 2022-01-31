<script lang="ts">
  import Meta from '$components/utils/Meta.svelte'
  import Wordmark from '$assets/images/logo/wordmark.svg'
  import IconSearch from 'virtual:icons/heroicons-outline/search'
  import projects from '$generated/projects.json'
  import { goto } from '$app/navigation'
  import { mulberry32, xmur3 } from '$lib/random'
  import { t } from "svelte-intl-precompile";

  const seed = xmur3(new Date().getMinutes().toString())
  const random = mulberry32(seed())
  const colorsOffset = Math.floor(random() * 60) // 100 (total projects) - 40 (used)

  function search(event: FormDataEvent) {
    const term = event.target.term.value
    goto(`/mods?q=${term}`)
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
</script>

<Meta/>

<div class="home">
  <div class="stacks">
    {#each layout as row, rowIndex}
      <div class="stacks__row">
        {#each row as column, colIndex}
          {@const index = (rowIndex * layout[rowIndex].length) + colIndex + colorsOffset}
          {#if column === 1}
            <a class="stacks__row__column" href="/mod/{projects?.[index]?.[0] || ''}" tabindex="-1" style:--color={projects?.[index]?.[1] || ''} style:--offset="{Math.round(random() * 40 - 20)}px">
              <div class="stacks__row__column__background"/>
              <img class="stacks__row__column__face" src="https://cdn.modrinth.com/data/{projects?.[index]?.[0] || ''}/icon.{projects?.[index]?.[2] || ''}" alt=""/>
            </a>
          {/if}
        {/each}
      </div>
    {/each}
  </div>

  <Wordmark class="home__wordmark"/>
  <h1 class="home__tagline">Discover, Play, & Create Minecraft content</h1>
  <form class="home__search" on:submit|preventDefault={search}>
    <input type="text" placeholder={$t('project.types.mod.search')} name="term" class="home__search__input"/>
    <button type="submit" class="home__search__button">
      <IconSearch/>
    </button>
  </form>
  <p class="home__description">
    Find enjoyable and quality content through our open-source modding platform built for the community. Create stuff,
    get paid*, and deploy your project with our fully documented API!
  </p>
</div>

<style lang="postcss">
  .home {
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

        &__row:nth-child(1), &__row:nth-child(2) {
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
            background: linear-gradient(to right,
            hsla(0deg, 0%, 0%, 0.1), hsla(0deg, 0%, 0%, 0.2) 50%,
            hsla(0deg, 0%, 0%, 0.4) 50%, hsla(0deg, 0%, 0%, 0.5)),
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
            transform: rotate(30deg) skew(-30deg) translate(calc(var(--width) * -0.58), 0) scaleY(0.864);
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
        height: 2.5rem;
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
</style>
