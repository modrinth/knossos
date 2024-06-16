<template>
  <div class="card-container">
    <div class="header-container">
      <div>Logo</div>
      <div>
        <Button color="primary" outline>
          <DownloadIcon />
          Get Modrinth App
        </Button>
      </div>
    </div>
    <div class="card-margin">
      <Card>
        <h1>Invite</h1>
        TODO: Content
      </Card>
    </div>
    <div>
      <div class="warning-section">
        <div>
          <strong class="warning-heading">
            <WarningIcon />
            Only install instances from people you trust!
          </strong>
          <p>
            This instance has not been reviewed by Modrinth staff and may include inappropriate or
            malicious content.
          </p>
        </div>
        <Button transparent>
          <ReportIcon />
          Report Instance
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, DownloadIcon, ReportIcon } from 'omorphia'

definePageMeta({
  layout: false,
})
</script>

<style scoped lang="scss">
@import '~/assets/styles/global.scss';
@import 'omorphia/dist/style.css';

* {
  --max-w-sm: 36rem;
}

.card-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;

  max-width: var(--max-w-sm);
  margin-left: auto;
  margin-right: auto;

  padding: var(--gap-sm);
}

.card-margin {
  margin-top: var(--gap-sm);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: var(--gap-sm);
  text-align: center;
}

.warning-heading {
  color: var(--color-special-red);
}

@media (max-width: 36rem) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-md);
  }
}
</style>
