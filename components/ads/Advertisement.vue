<template>
  <div class="no-content">
    <div class="content">
      <div class="content-1">
        <div class="content-2">
          <a
            href="https://exaroton.com/?utm_source=modrinth&utm_medium=text&utm_campaign=host&utm_content=top"
            rel="noopener noreferrer nofollow sponsored"
            target="_blank"
          >
            <ColorScheme>
              <LightIcon v-if="$colorMode.value === 'light'" class="brand-icon" />
              <DarkIcon v-else class="brand-icon" />
            </ColorScheme>
            <span>
              <span> Host your Minecraft server on </span>
              <strong>exaroton</strong>
              <span> - only pay while the server is running - billed per second. </span>
            </span>
          </a>
        </div>
      </div>
      <div class="content-3">
        <a rel="noopener noreferrer nofollow sponsored" target="_blank" href="https://adrinth.com">
          Ads via Adrinth
        </a>
      </div>
    </div>
  </div>
</template>
<script setup>
import LightIcon from '~/assets/images/external/exaroton-light.svg'
import DarkIcon from '~/assets/images/external/exaroton-dark.svg'
</script>

<style>
.no-content {
  position: relative;
  margin-bottom: var(--spacing-card-md);

  background: var(--color-ad);
  border: 3px solid var(--color-ad-raised);
  border-radius: var(--size-rounded-card);
}

.content {
  font-size: 14px;
  line-height: 1.3em;
}

.content-1 {
  color: var(--color-text);

  padding: 1em;
  text-align: left;
}

.content-2 a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.content-2 a b,
.content-2 a strong {
  color: #088cdb;
}

.brand-icon {
  padding-top: 1px;
  height: 1.2rem;
  width: auto;
}

.content-3 a {
  position: absolute;
  bottom: -2px;
  right: -2px;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8em;
  background: var(--color-ad-raised);
  letter-spacing: 0.1ch;

  margin: 0;
  padding: 2px 10px;
  border-top-left-radius: var(--size-rounded-card);
  border-bottom-right-radius: var(--size-rounded-card);

  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media screen and (max-width: 800px) {
  .content-2 {
    margin-bottom: 0.5rem;
  }

  .content-2 a {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
