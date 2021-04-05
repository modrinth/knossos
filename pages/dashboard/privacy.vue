<template>
  <div class="popup card">
    <div class="consent-container">
      <div class="h1">Tweak your privacy settings</div>
      <div>
        Modrinth relies on different providers and in-house tools to allow us to
        provide custom-tailored experiences, and personalized advertising. You
        can at any moment change your privacy settings by going to the setting
        page, or at the footer of any page.
      </div>
      <br class="divider" />
      <div class="toggles">
        <div class="toggle">
          <div class="toggle-text">
            <div class="title">Allow personalized ads</div>
            <div class="contents">
              Marketing/target cookies are usually used to show you
              advertisements that meet your interests. When you visit another
              website, your browser's cookie is recognized and selected ads are
              displayed to you based on the information stored in this cookie.
            </div>
          </div>
          <div class="spacer"></div>
          <div class="toggle-action">
            <label for="toggle-ads"></label>
            <input
              id="toggle-ads"
              type="checkbox"
              class="switch stylized-toggle"
            />
          </div>
        </div>
        <div class="spacer" />
        <div class="toggle">
          <div class="toggle-text">
            <div class="title">Analytics</div>
            <div class="contents">
              Modrinth uses in-house tools that allows us to get insights on how
              each user is using the platform, to improve the experience for
              everyone.
            </div>
          </div>
          <div class="spacer"></div>
          <div class="toggle-action">
            <label for="toggle-analytics"></label>
            <input
              id="toggle-analytics"
              type="checkbox"
              class="switch stylized-toggle"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="btn button" @click="hide">Refuse All</button>
      <button class="btn button" @click="hide">Accept All</button>
      <button class="btn brand-button" @click="hide">Confirm my choices</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Privacy',
  options: {
    auth: false,
  },
}
</script>

<style scoped lang="scss">
.card {
  @extend %card;
  padding: var(--spacing-card-lg);
}
.popup {
  display: flex;
  flex-direction: column;
}
.spacer {
  margin-top: 1rem;
}
.actions {
  margin-top: 1.5rem;
  margin-right: -0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .btn {
    margin-right: 0.5rem;
  }
}
.consent-container {
  overflow-x: auto;
  max-height: 90vh;

  @media screen and (min-width: 900px) {
    max-height: 50vh;
  }
  .h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.6rem;
  }
  .divider {
    margin-top: 1rem;
  }
  .toggles {
    display: flex;
    flex-direction: column;
    width: 100%;
    .toggle {
      display: flex;
      flex-direction: row;
      .toggle-text {
        .title {
          color: var(--color-text-dark);
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .contents {
          color: var(--color-text);
        }
      }
      .spacer {
        flex-grow: 1;
      }
      .toggle-action {
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 1rem;
      }
    }
  }
}
</style>
