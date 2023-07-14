<template>
  <div class="placeholder-base placeholder-project-card">
    <div class="icon"></div>
    <div class="title text"></div>
    <div class="description text"></div>
    <section class="stats">
      <div class="text downloads"></div>
      <div class="text followers"></div>
      <div class="text date"></div>
    </section>
    <section class="tags">
      <div class="text tag1"></div>
      <div class="text tag1"></div>
      <div class="text tag1"></div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>
<style lang="scss">
.placeholder-base {
  background-color: var(--color-raised-bg);
  border-radius: var(--size-rounded-card);

  div {
    background-color: var(--color-button-bg);
    border-radius: var(--size-rounded-sm);

    &.text {
      height: 1.25rem;
    }
  }
}

.placeholder-base.placeholder-project-card {
  padding: var(--spacing-card-bg);
  display: grid;
  grid-template:
    'icon title stats'
    'icon description stats'
    'icon tags stats';
  grid-template-columns: min-content 1fr auto;
  grid-template-rows: min-content 1fr min-content;
  column-gap: var(--spacing-card-md);
  row-gap: var(--spacing-card-sm);
  width: 100%;

  .icon {
    height: 6rem;
    width: 6rem;
    border-radius: var(--size-rounded-lg);
    grid-area: icon;
  }

  .title {
    grid-area: title;
    width: min(15rem, 70%);
  }

  .description {
    grid-area: description;
    width: min(33rem, 100%);
  }

  .tags {
    grid-area: tags;
    display: flex;
    flex-direction: row;
    gap: var(--spacing-card-sm);

    .tag1 {
      width: min(6rem, 100%);
    }

    .tag2 {
      width: min(8rem, 100%);
    }

    .tag3 {
      width: min(4rem, 100%);
    }
  }

  .stats {
    grid-area: stats;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-card-sm);
    align-items: flex-end;

    .downloads {
      width: 10rem;
    }

    :nth-child(2) {
      width: 8rem;
    }

    :nth-child(3) {
      width: 14rem;
      margin-top: auto;
    }
  }
}
</style>
