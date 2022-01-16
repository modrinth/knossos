<script lang="ts">
  import { onMount } from 'svelte'

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

  function rand(min, max) {
    return min + Math.random() * (max - min)
  }

  function getRandomColor() {
    const h = rand(1, 360)
    const s = 70
    const l = rand(0, 100)
    return 'hsl(' + h + ',' + s + '%,' + l + '%)'
  }

  console.log(stacks.length)

  onMount(() => {
    //stacks = stacks.map(stack => ({...stack, color: getRandomColor(),  }))
    stacks = stacks.map(stack => ({...stack, height: rand(0, 30) + (stack.row - 1) * 70}))
  })
</script>

<svg class="background" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" clip-rule="evenodd" viewBox="0 0 1025 720">
  <g transform="scale(.8 1)">
    <path fill="none" d="M0 0h1280v720H0z"/>
    <clipPath id="a">
      <path d="M0 0h1280v720H0z"/>
    </clipPath>
    <g clip-path="url(#a)">
      {#each stacks as stack}
        <g style="transform: matrix(1.24999, 0, 0, 1, {stack.matrix[0]},
{stack.matrix[1] + (-1 * stack.height)})" fill={stack.color}>
        <path d="m{stack.pos[0]} 704 64 32v704l-64-32z" style="filter: brightness(0.9)"/>
          <path d="m{stack.pos[1]} 736 64-32v704l-64 32z" style="filter: brightness(0.7)"/>
          <path d="m{stack.pos[0]} 704 64-32 64 32-64 32z" style="filter: brightness(1.2)"/>
          <image width="512" height="512" href={stack.href} transform="matrix(.125 -.0625 .125 .0625 {stack.pos[0]} 704)"/>
      </g>
      {/each}
    </g>
  </g>
</svg>

<style>
  g {
    transition: transform 5s ease-in-out -2s;
  }
</style>
