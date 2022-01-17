<script context="module" lang="ts">
  export async function load({fetch}) {
      return {
        props: {
          // TODO: When enough projects in staging-api: `(await send('GET', 'search?limit=50&index=downloads')).hits`
          projects: (await (await fetch('https://api.modrinth.com/api/v1/mod?limit=40&index=downloads')).json()).hits,
        },
      }
  }
</script>

<script lang="ts">
  import Meta from '$components/utils/Meta.svelte'
  import Wordmark from '$assets/images/logo/wordmark.svg'
  import IconSearch from 'virtual:icons/heroicons-outline/search'
  import { onMount } from 'svelte'

  export let projects;

  let stacks = [
    // {
    //   row: 8,
    //   color: 'red',
    //   height: 1,
    //   href: '',
    //   matrix: [-320, -256],
    //   pos: [768, 832],
    // },
    {
      row: 8,
      color: 'red',
      height: 1,
      href: '',
      matrix: [-320, -256],
      pos: [896, 960],
    },
    {
      row: 8,
      color: 'red',
      height: 1,
      href: '',
      matrix: [-320, -256],
      pos: [1024, 1088],
    },
    {
      row: 8,
      color: 'red',
      height: 1,
      href: '',
      matrix: [-320, -256],
      pos: [1152, 1216],
    },
    // {
    //   row: 7,
    //   color: 'orange',
    //   height: 1,
    //   href: '',
    //   matrix: [-400, -224],
    //   pos: [768, 832],
    // },
    {
      row: 7,
      color: 'orange',
      height: 1,
      href: '',
      matrix: [-400, -224],
      pos: [896, 960],
    },
    {
      row: 7,
      color: 'orange',
      height: 1,
      href: '',
      matrix: [-400, -224],
      pos: [1024, 1088],
    },
    {
      row: 7,
      color: 'orange',
      height: 1,
      href: '',
      matrix: [-400, -224],
      pos: [1152, 1216],
    },
    {
      row: 7,
      color: 'orange',
      height: 1,
      href: '',
      matrix: [-240, -224],
      pos: [1152, 1216],
    },
    // {
    //   row: 6,
    //   color: 'yellow',
    //   height: 1,
    //   href: '',
    //   matrix: [-320, -192],
    //   pos: [640, 704],
    // },
    {
      row: 6,
      color: 'yellow',
      height: 1,
      href: '',
      matrix: [-320, -192],
      pos: [768, 832],
    },
    {
      row: 6,
      color: 'yellow',
      height: 1,
      href: '',
      matrix: [-320, -192],
      pos: [896, 960],
    },
    {
      row: 6,
      color: 'yellow',
      height: 1,
      href: '',
      matrix: [-320, -192],
      pos: [1024, 1088],
    },
    {
      row: 6,
      color: 'yellow',
      height: 1,
      href: '',
      matrix: [-320, -192],
      pos: [1152, 1216],
    },
    // {
    //   row: 5,
    //   color: 'lime',
    //   height: 1,
    //   href: '',
    //   matrix: [-240, -160],
    //   pos: [512, 576],
    // },
    {
      row: 5,
      color: 'lime',
      height: 1,
      href: '',
      matrix: [-240, -160],
      pos: [640, 704],
    },
    {
      row: 5,
      color: 'lime',
      height: 1,
      href: '',
      matrix: [-240, -160],
      pos: [768, 832],
    },
    {
      row: 5,
      color: 'lime',
      height: 1,
      href: '',
      matrix: [-240, -160],
      pos: [896, 960],
    },
    {
      row: 5,
      color: 'lime',
      height: 1,
      href: '',
      matrix: [-240, -160],
      pos: [1024, 1088],
    },
    {
      row: 5,
      color: 'lime',
      height: 1,
      href: '',
      matrix: [-240, -160],
      pos: [1152, 1216],
    },
    // {
    //   row: 4,
    //   color: 'green',
    //   height: 1,
    //   href: '',
    //   matrix: [-320, -128],
    //   pos: [512, 576],
    // },
    {
      row: 4,
      color: 'green',
      height: 1,
      href: '',
      matrix: [-320, -128],
      pos: [640, 704],
    },
    {
      row: 4,
      color: 'green',
      height: 1,
      href: '',
      matrix: [-320, -128],
      pos: [768, 832],
    },
    {
      row: 4,
      color: 'green',
      height: 1,
      href: '',
      matrix: [-320, -128],
      pos: [896, 960],
    },
    {
      row: 4,
      color: 'green',
      height: 1,
      href: '',
      matrix: [-320, -128],
      pos: [1024, 1088],
    },
    {
      row: 4,
      color: 'green',
      height: 1,
      href: '',
      matrix: [-320, -128],
      pos: [1152, 1216],
    },
    // {
    //   row: 3,
    //   color: 'blue',
    //   height: 1,
    //   href: '',
    //   matrix: [-400, -96],
    //   pos: [512, 576],
    // },
    {
      row: 3,
      color: 'blue',
      height: 1,
      href: '',
      matrix: [-240, -96],
      pos: [640, 704],
    },
    {
      row: 3,
      color: 'blue',
      height: 1,
      href: '',
      matrix: [-240, -96],
      pos: [512, 576],
    },
    {
      row: 3,
      color: 'blue',
      height: 1,
      href: '',
      matrix: [-240, -96],
      pos: [768, 832],
    },
    {
      row: 3,
      color: 'blue',
      height: 1,
      href: '',
      matrix: [-240, -96],
      pos: [896, 960],
    },
    {
      row: 3,
      color: 'blue',
      height: 1,
      href: '',
      matrix: [-240, -96],
      pos: [1024, 1088],
    },
    {
      row: 3,
      color: 'blue',
      height: 1,
      href: '',
      matrix: [-240, -96],
      pos: [1152, 1216],
    },
    // {
    //   row: 2,
    //   color: 'purple',
    //   height: 1,
    //   href: '',
    //   matrix: [-480, -64],
    //   pos: [512, 576],
    // },
    {
      row: 2,
      color: 'purple',
      height: 1,
      href: '',
      matrix: [-320, -64],
      pos: [640, 704],
    },
    {
      row: 2,
      color: 'purple',
      height: 1,
      href: '',
      matrix: [-320, -64],
      pos: [512, 576],
    },
    {
      row: 2,
      color: 'purple',
      height: 1,
      href: '',
      matrix: [-320, -64],
      pos: [768, 832],
    },
    {
      row: 2,
      color: 'purple',
      height: 1,
      href: '',
      matrix: [-320, -64],
      pos: [896, 960],
    },
    {
      row: 2,
      color: 'purple',
      height: 1,
      href: '',
      matrix: [-320, -64],
      pos: [1024, 1088],
    },
    {
      row: 2,
      color: 'purple',
      height: 1,
      href: '',
      matrix: [-320, -64],
      pos: [1152, 1216],
    },
    // {
    //   row: 1,
    //   color: 'pink',
    //   height: 1,
    //   href: '',
    //   matrix: [-560, -32],
    //   pos: [512, 576],
    // },
    {
      row: 1,
      color: 'pink',
      height: 1,
      href: '',
      matrix: [-400, -32],
      pos: [640, 704],
    },
    {
      row: 1,
      color: 'pink',
      height: 1,
      href: '',
      matrix: [-400, -32],
      pos: [512, 576],
    },
    {
      row: 1,
      color: 'pink',
      height: 1,
      href: '',
      matrix: [-400, -32],
      pos: [768, 832],
    },
    {
      row: 1,
      color: 'pink',
      height: 1,
      href: '',
      matrix: [-400, -32],
      pos: [896, 960],
    },
    {
      row: 1,
      color: 'pink',
      height: 1,
      href: '',
      matrix: [-400, -32],
      pos: [1024, 1088],
    },
    {
      row: 1,
      color: 'pink',
      height: 1,
      href: '',
      matrix: [-400, -32],
      pos: [1152, 1216],
    },
    {
      row: 1,
      color: 'pink',
      height: 1,
      href: '',
      matrix: [-239, -32],
      pos: [1152, 1216],
    },
  ]

  let transition = false

  const randomizeHeights = () => stacks = stacks.map(stack => ({...stack, height: Math.random() * 30 + (stack.row - 1) * 55 }))

  randomizeHeights()

  onMount(() => {
    stacks.forEach((stack, index) => {
      console.log(projects[index])
      stacks[index] = {...stack, href: projects[index]?.icon_url, url: `https://modrinth.com/mod/${projects[index].mod_id.replace('local-', '')}` }
    })

    stacks.forEach((stack, index) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d');

      const image = new Image()

      image.crossOrigin = "Anonymous"
      image.src = `https://images.weserv.nl/?url=${stack.href}`;

      image.onload = () => {
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;

        context.drawImage(image, 0, 0);

        const leftColor = { r: 0, g: 0, b: 0};

        const STEPS = 30

        for (let step = 0; step < STEPS; step++) {
          let pos = canvas.width / STEPS * step
          const { data } = context.getImageData(pos, canvas.height - 1, pos + 1, canvas.height);
          leftColor.r += data[0]
          leftColor.g += data[1]
          leftColor.b += data[2]
        }

        leftColor.r = ~~(leftColor.r/STEPS);
        leftColor.g = ~~(leftColor.g/STEPS);
        leftColor.b = ~~(leftColor.b/STEPS);

        const color = `rgb(${leftColor.r}, ${leftColor.g}, ${leftColor.b})`

        if (leftColor.r === 0 && leftColor.g === 0 && leftColor.b === 0) {
          import('node-vibrant/lib/browser').then(Vibrant => {
            Vibrant.from(image.src)
              .getPalette().then(colors => {
              stacks[index] = {...stack, color: colors.LightVibrant.getHex()}
            })
          })
        } else {
          stacks[index] = {...stack, color}
        }
      }

    }, 5000)

    // Animate stacks in Chromium based browsers because they support smooth animations
    if (window.chrome) {
      transition = true
      setInterval(() => {
        randomizeHeights()
      }, 1000 * 5)
    }
  })
</script>

<Meta/>

<div class="home">
  <svg class="background" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" clip-rule="evenodd" viewBox="0 0 1025 720">
    <g transform="scale(.8 1)">
      <path fill="none" d="M0 0h1280v720H0z"/>
      <clipPath id="a">
        <path d="M0 0h1280v720H0z"/>
      </clipPath>
      <g clip-path="url(#a)">
        {#each stacks as stack, index}
          <a href={stack.url}>
          <g style="transform: matrix(1.24999, 0, 0, 1, {stack.matrix[0]},
  {stack.matrix[1] + (-1 * stack.height)})" fill={stack.color} stroke={stack.color} class:transition>
          <path d="m{stack.pos[0]} 704 64 32v704l-64-32z" filter="url(#filter-darken-1)"/>
            <path d="m{stack.pos[1]} 736 64-32v704l-64 32z" filter="url(#filter-darken-2)"/>
            <path d="m{stack.pos[0]} 704 64-32 64 32-64 32z"/>
            <image width="512" height="512" href="{stack.href}" transform="matrix(.125 -.0625 .125 .0625 {stack.pos[0]} 704)"/>
        </g>
            </a>
        {/each}
      </g>
    </g>
      <filter id="filter-darken-1">
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.8"/>
        <feFuncG type="linear" slope="0.8"/>
        <feFuncB type="linear" slope="0.8"/>
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

      @media (width < 1100px) {
        right: -100px;
      }

      @media (width < 950px) {
        right: -10px;
        top: unset;
        bottom: -10rem;
        height: 25rem;
      }

      .transition {
        transition: transform 5s ease-in-out 0s;
      }
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
