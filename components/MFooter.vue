<template>
  <footer :class="{ centered }">
    <span>
      Modrinth is open source software. You may view the source code at our
      GitHub Repository.
    </span>
    <ul>
      <li>
        <nuxt-link to="/legal/terms">Terms</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/legal/privacy">Privacy</nuxt-link>
      </li>
    </ul>
    <span> © Guavy LLC </span>
  </footer>
</template>

<script>
export default {
  props: {
    centered: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.centered {
  align-items: center;
}

footer {
  padding: 2rem 0 5rem 0;
  display: flex;
  flex-direction: column;

  ul {
    list-style: none;
    padding: 0;
    display: flex;

    li {
      a {
        text-decoration: underline;
      }

      &:not(:last-child)::after {
        content: ' • ';
        margin: 0 var(--spacing-card-md) 0 var(--spacing-card-sm);
      }
    }
  }
}
</style>
