<template>
  <footer class="footer wide-page">
    <!-- This wrapper is neccessary because flexbox doesn't account for padding in its calculations. Hence we have to use margin with flexbox, unfortunately -->
    <div class="footer__wrapper">
      <p class="footer__info-line">
        Modrinth is open source software. You may view the source code at
        <a
          target="_blank"
          href="https://github.com/modrinth/knossos"
          class="text-link"
        >
          our GitHub page
        </a>
      </p>
      <ul class="footer__info-line footer-links">
        <li class="footer-links__item">
          <NuxtLink class="footer-links__link" to="/legal/terms">
            Terms and Conditions
          </NuxtLink>
        </li>
        <li class="footer-links__item">
          <NuxtLink class="footer-links__link" to="/legal/privacy">
            Privacy Policy
          </NuxtLink>
        </li>
        <li class="footer-links__item">
          <NuxtLink class="footer-links__link" to="/legal/rules">
            Project Rules
          </NuxtLink>
        </li>
        <li class="footer-links__item">
          <a
            class="footer-links__link"
            target="_blank"
            href="https://github.com/modrinth/knossos/blob/master/LICENSE.md"
          >
            License
          </a>
        </li>
      </ul>
      <ul class="footer__info-line footer-links">
        <li class="footer-links__item">
          <a
            class="footer-links__link"
            target="_blank"
            href="https://blog.modrinth.com"
          >
            Blog
          </a>
        </li>
        <li class="footer-links__item">
          <a
            class="footer-links__link"
            target="_blank"
            href="https://discord.gg/EUHuJHt"
          >
            Discord
          </a>
        </li>
        <li class="footer-links__item">
          <a
            class="footer-links__link"
            target="_blank"
            href="https://github.com/modrinth/knossos"
          >
            GitHub
          </a>
        </li>
        <li class="footer-links__item">
          <a
            class="footer-links__link"
            target="_blank"
            href="https://docs.modrinth.com"
          >
            Docs
          </a>
        </li>
        <li class="footer-links__item">
          <NuxtLink class="footer-links__link" to="/settings/privacy">
            Privacy settings
          </NuxtLink>
        </li>
      </ul>
      <p class="footer__info-line">
        modrinth/knossos {{ version }} © Guavy LLC
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      version: process.env.version || 'unknown',
    }
  },
}
</script>

<style scoped>
.footer {
  color: var(--color-text-secondary);
}

.footer__wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 2rem 1rem;
}

.footer__info-line {
  margin: 0.5rem 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-left: 0;
  /* This is so wrapped items have margin, but don't increase overall height of the block */
  margin-top: 0;
  padding: 0;
}
.footer-links__item:not(:last-child)::after {
  content: '\2022';
  margin: 0.5rem;
}

.footer-links__link {
  display: inline-block;
  margin-top: 0.5rem;
  text-decoration: underline;
  white-space: nowrap;
}
</style>
