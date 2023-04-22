<template>
  <div v-if="count > 1" class="columns paginates">
    <a
      :class="{ disabled: page === 1 }"
      :tabindex="page === 1 ? -1 : 0"
      class="left-arrow paginate has-icon"
      aria-label="Previous Page"
      :href="linkFunction(page - 1)"
      @click.prevent="page !== 1 ? switchPage(page - 1) : null"
    >
      <LeftArrowIcon />
    </a>
    <div
      v-for="(item, index) in pages"
      :key="'page-' + item + '-' + index"
      :class="{
        'page-number': page !== item,
        shrink: item > 99,
      }"
      class="page-number-container"
    >
      <div v-if="item === '-'" class="has-icon">
        <GapIcon />
      </div>
      <a
        v-else
        :class="{
          'page-number current': page === item,
          shrink: item > 99,
        }"
        :href="linkFunction(item)"
        @click.prevent="page !== item ? switchPage(item) : null"
      >
        {{ item }}
      </a>
    </div>

    <a
      :class="{
        disabled: page === pages[pages.length - 1],
      }"
      :tabindex="page === pages[pages.length - 1] ? -1 : 0"
      class="right-arrow paginate has-icon"
      aria-label="Next Page"
      :href="linkFunction(page + 1)"
      @click.prevent="page !== pages[pages.length - 1] ? switchPage(page + 1) : null"
    >
      <RightArrowIcon />
    </a>
  </div>
</template>

<script lang="ts" setup>
import GapIcon from "~/assets/images/utils/gap.svg";
import LeftArrowIcon from "~/assets/images/utils/left-arrow.svg";
import RightArrowIcon from "~/assets/images/utils/right-arrow.svg";

const props = withDefaults(defineProps<{
  page: number,
  count: number,
  linkFunction: (page: number) => string
}>(), {
  page: 1,
  count: 1,
  linkFunction: (_: number) => "/"
});

const pages = computed((): any[] => {
  if (props.count <= 4) {
    return Array.from({ length: props.count }, (_, i) => i + 1);
  }

  if (props.page + 3 >= props.count) {
    return [
      1,
      "-",
      props.count - 4,
      props.count - 3,
      props.count - 2,
      props.count - 1,
      props.count
    ];
  }

  if (props.page > 4) {
    return [1, "-", props.page - 1, props.page, props.page + 1, "-", props.count];
  }

  return [1, 2, 3, 4, 5, "-", props.count];
});


const emits = defineEmits(["switch-page"]);

function switchPage(newPage: number) {
  emits("switch-page", Math.min(Math.max(newPage, 1), props.count));
}
</script>

<style scoped>
a {
  color: var(--color-button-text);
  box-shadow: var(--shadow-raised), var(--shadow-inset);

  padding: 0.5rem 1rem;
  margin: 0;
  border-radius: 2rem;
  background: var(--color-raised-bg);

  transition: opacity 0.5s ease-in-out,
  filter 0.2s ease-in-out,
  transform 0.05s ease-in-out,
  outline 0.2s ease-in-out;
}

a.page-number.current {
  background: var(--color-brand);
  color: var(--color-brand-inverted);
  cursor: default;
}

a.paginate.disabled {
  background-color: transparent;
  cursor: not-allowed;
  filter: grayscale(50%);
  opacity: 0.5;
}

a:hover:not(:disabled) {
  filter: brightness(0.85);
}

a:active:not(:disabled) {
  transform: scale(0.95);
  filter: brightness(0.8);
}

.has-icon {
  display: flex;
  align-items: center;
}

.has-icon svg {
  width: 1em;
}

.page-number-container,
a,
.has-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.paginates {
  height: 2em;
  margin: 0.5rem 0;
}

.paginates > div,
.paginates .has-icon {
  margin: 0 0.3em;
}

.left-arrow {
  margin-left: auto !important;
}

.right-arrow {
  margin-right: auto !important;
}

@media screen and (max-width: 400px) {
  .paginates {
    font-size: 80%;
  }
}

@media screen and (max-width: 530px) {
  a {
    width: 2.5rem;
    padding: 0.5rem 0;
  }
}
</style>
