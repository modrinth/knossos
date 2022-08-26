<template>
  <div class="info-wrapper">
    <div ref="adBanner" class="adBanner"><div></div></div>
    <div v-if="isBlocked" id="info-popup">
      <span>
        <span class="info-popup-wrap">
          <span class="info-popup-img">
            <img
              src="https://cdn.modrinth.com/barrier_fixes.png"
              alt="ads via Carbon"
            />
          </span>
          <span class="info-popup-text">
            Please disable your adblocker. Advertisments support this site and
            its creators.
          </span>
        </span>
        <a
          href="http://carbonads.net/?utm_source=modrinthcom&amp;utm_medium=ad_via_link&amp;utm_campaign=in_unit&amp;utm_term=carbon"
          class="info-popup-poweredby"
          target="_blank"
          rel="noopener sponsored"
          >ads via Carbon
        </a>
      </span>
    </div>
    <script
      v-else
      id="_carbonads_js"
      async
      type="text/javascript"
      src="//cdn.carbonads.com/carbon.js?serve=CEAIKK3N&placement=modrinthcom"
    ></script>
  </div>
</template>

<script>
export default {
  name: 'Advertisement',
  data() {
    return {
      isBlocked: false,
    }
  },
  mounted() {
    if (this.$refs.adBanner.clientHeight !== 2) {
      this.isBlocked = true
    }
  },
}
</script>

<style lang="scss">
.adBanner {
  position: absolute;

  top: 0;
  left: 0;
  height: 2px;
  width: 2px;
}

.info-wrapper {
  min-height: 114px;
  color: var(--color-text);
  background: var(--color-ad);
  border-radius: var(--size-rounded-card);
  margin-bottom: var(--spacing-card-md);
}

#carbonads,
#info-popup {
  overflow: hidden;
  max-width: 100%;
  position: relative;

  padding: var(--spacing-card-md) var(--spacing-card-md);

  font-size: 22px;
  box-sizing: content-box;

  > span {
    display: block;
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: inherit;
    }
  }
}

.carbon-wrap,
.info-popup-wrap {
  display: flex;
  align-items: center;
}

.carbon-img,
.info-popup-img {
  display: block;
  margin: 0;
  line-height: 1;

  img {
    display: block;
    height: 90px;
    width: auto;
    border-radius: var(--size-rounded-card);
  }
}

.carbon-text,
.info-popup-text {
  display: block;
  padding: 0 1em;
  line-height: 1.35;
  text-align: left;
}

.carbon-poweredby,
.info-popup-poweredby {
  display: block;
  padding: 6px 8px;
  background: var(--color-ad-raised);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1ch;
  font-weight: 600;
  font-size: 0.5em;
  line-height: 1;
  border-top-left-radius: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
}

@media only screen and (min-width: 320px) and (max-width: 759px) {
  .carbon-text,
  info-popup-text {
    font-size: 14px;
  }
}
</style>
