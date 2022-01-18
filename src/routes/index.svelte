<script context="module" lang="ts">
  export const prerender = true
</script>

<script lang="ts">
  import Meta from '$components/utils/Meta.svelte'
  import Wordmark from '$assets/images/logo/wordmark.svg'
  import IconSearch from 'virtual:icons/heroicons-outline/search'
  import generatedStacks from '$generated/stacks.json'
  import { goto } from '$app/navigation'

  let stacks = generatedStacks

  // const varyHeights = () => {
  //   stacks = stacks.map((stack, index) => ({
  //     ...stack,
  //     matrix: [stack.matrix[0], stack.matrix[1] + Math.floor(index / 99 * 100) / 100],
  //   }))
  // }

  function search(event: FormDataEvent) {
    const term = event.target.term.value
    goto(`/mods?q=${term}`)
  }
</script>

<Meta/>

<div class="home">
  <svg class="background" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" clip-rule="evenodd" viewBox="0 0 1025 720" aria-hidden="true">
    <g transform="scale(.8 1)">
      <path fill="none" d="M0 0h1280v720H0z"/>
      <clipPath id="a">
        <path d="M0 0h1280v720H0z"/>
      </clipPath>
      <g clip-path="url(#a)" class="background__stacks">
        {#each stacks as stack, index}
          <a href={stack.project.url} tabindex="-1">
          <g style="transform: matrix(1.24999, 0, 0, 1, {stack.matrix[0]},
  {stack.matrix[1]})" stroke={stack.colors.left} fill={stack.colors.left} stroke-width="2px">
            <path d="m{stack.pos[0]} 704 64-32 64 32-64 32z" />
            <image width="512" height="512" href="{stack.project.iconUrl}" transform="matrix(.125 -.0625 .125 .0625 {stack.pos[0]} 704)"/>
            <path d="m{stack.pos[0]} 704 64 32v704l-64-32z" filter="url(#filter-darken-1)" />
            <path d="m{stack.pos[1]} 736 64-32v704l-64 32z" filter="url(#filter-darken-2)" fill={stack.colors.bottom} stroke={stack.colors.bottom} />
        </g>
            </a>
        {/each}
      </g>
    </g>
      <filter id="filter-darken-1">
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.7"/>
        <feFuncG type="linear" slope="0.7"/>
        <feFuncB type="linear" slope="0.7"/>
      </feComponentTransfer>
    </filter>

    <filter id="filter-darken-2">
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.5"/>
        <feFuncG type="linear" slope="0.5"/>
        <feFuncB type="linear" slope="0.5"/>
      </feComponentTransfer>
    </filter>
  </svg>

  <Wordmark class="home__wordmark"/>
  <h1 class="home__tagline">Discover, Play, & Create Minecraft content</h1>
  <form class="home__search" on:submit|preventDefault={search}>
    <input type="text" placeholder="Search mods..." name="term" class="home__search__input"/>
    <button type="submit" class="home__search__button"><IconSearch/></button>
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
    border-radius: 1.5rem;
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

    .background {
      position: absolute;
      top: -40px;
      right: -10px;
      height: calc(100% + 40px);
      speak: none;

      &__stacks {
        transform: translateY(40px);
        transition: transform 0.2s ease-in-out 0s;
      }

      @media (width < 1100px) {
        right: -100px;
      }

      @media (width < 950px) {
        right: -10px;
        top: unset;
        bottom: -10rem;
        height: 25rem;
        &__stacks {
          transform: none;
        }
      }
    }

    :not(.background) {
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
      width: calc(100% - 19rem);
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
