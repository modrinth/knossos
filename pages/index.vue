<template>
  <div>
    <div class="landing-hero">
      <ModrinthIcon />
      <h1>
        Level up with the <br />
        <strong>best Minecraft mods</strong>
      </h1>
      <h2>
        Find quality mods, plugins, modpacks, and resources through <br />
        our open-source platform built for the community.
      </h2>
      <div class="button-group">
        <nuxt-link to="/mods" class="iconified-button brand-button">
          Discover mods
        </nuxt-link>
        <nuxt-link to="/mods" class="iconified-button outline-button">
          Sign up as creator
        </nuxt-link>
      </div>
    </div>
    <div class="projects-transition"></div>
    <div class="top-gradient"></div>
    <div class="users-section"></div>
    <div class="creator-section"></div>
  </div>
</template>

<script>
import ModrinthIcon from '~/assets/images/logo.svg?inline'

export default {
  components: { ModrinthIcon },
  auth: false,
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.navbar {
  background: none;
  box-shadow: none;
}

.landing-hero {
  width: 100%;
  background-image: url('~assets/images/landing.png');
  height: 1106px;
  object-fit: contain;
  margin-top: calc(-68px - (2 * var(--spacing-card-md)));

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;

  svg {
    width: 210px;
    height: 210px;
    margin-bottom: 46px;
  }

  h1 {
    font-size: 84px;
    font-weight: 600;
    line-height: 100%;
    margin: 0 0 11px;

    strong {
      font-weight: 600;
      background-color: #00bd3c;
      background-image: linear-gradient(
        180deg,
        #a7d0ff 0%,
        var(--color-brand) 60%
      );
      background-size: 100%;

      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
    }
  }

  h2 {
    font-size: 26px;
    line-height: 32.5px;
    margin: 0 0 26px;
    font-weight: 400;
    color: #afb6be;
  }

  .button-group {
    justify-content: center;
    gap: 20px;
    margin-bottom: 150px;

    .iconified-button {
      font-weight: 600;
      min-height: 50px;
    }

    // TODO: work for both themes and move to components.scss
    .outline-button {
      color: #fff;
      background: none;
      border: 1px #fff solid;
    }
  }
}

.projects-transition {
  width: 100%;
  height: 313px;
  margin-top: -313px;
  background: linear-gradient(0deg, #0e1020 0%, rgba(14, 16, 32, 0) 100%);
}
.top-gradient {
  display: none;
  margin-top: -64px;
  background: linear-gradient(180deg, #101321 0%, rgba(14, 16, 32, 0) 100%);
  transform: matrix(-1, 0, 0, 1, 0, 0);
  height: 375px;
}

.users-section {
  width: 100%;
  height: 2474px;

  background: url('~assets/images/landing-lower.png');
  opacity: 0.4;
}

.creator-section {
  width: 100%;
  height: 1510px;
  background: linear-gradient(180deg, #000000 0%, #0e101d 100%);
}
</style>
