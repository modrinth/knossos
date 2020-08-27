<template>
  <div class="result rows">
    <img class="result-icon" :src="iconUrl" />
    <div class="column-grow-3">
      <div class="rows column-grow-2">
        <h2 class="mod-name">{{ name }}</h2>
        <p class="author">by {{ author }}</p>
      </div>
      <p class="column-grow-1">
        {{ description }}
      </p>
      <div class="column-grow-1 columns result-infos">
        <div class="result-image columns">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3cdb36"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <p>{{ downloads }}</p>
        </div>
        <div class="result-image columns">
          <svg viewBox="0 0 16 16" fill="#099fef">
            <path
              fill-rule="evenodd"
              d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
            />
            <path
              fill-rule="evenodd"
              d="M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"
            />
            <path
              fill-rule="evenodd"
              d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"
            />
          </svg>
          <p>{{ createdAt }}</p>
        </div>
        <div class="result-image columns">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e88d0d"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            ></path>
            <path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            ></path>
          </svg>
          <p>{{ updatedAt }}</p>
        </div>
        <div class="result-image columns">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e8200d"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
            ></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <p>{{ latestVersion }}</p>
        </div>
      </div>
    </div>
    <div class="categories">
      <div class="category"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: [
    'id',
    'name',
    'author',
    'description',
    'iconUrl',
    'downloads',
    'createdAt',
    'updatedAt',
    'latestVersion',
  ],
}
</script>

<style>
.results {
  margin-top: 20px;
  margin-bottom: 50px;
}

.result {
  align-items: center;
  margin-bottom: 10px;
  background: var(--color-bg);
  box-shadow: 0 2px 3px 1px var(--color-grey-2);
}

.result * {
  object-fit: contain;
  margin-bottom: 0;
  margin-top: 0;
}

.result-icon {
  width: 90px;
  height: 90px;
  margin: 10px 20px 10px 10px !important;
  border-radius: 0.5rem;
}

.mod-name {
  align-self: flex-end;
}

.author {
  margin-left: 5px;
  margin-bottom: 2px !important;
  align-self: flex-end;
}

.result-infos {
  margin-top: 5px !important;
  align-self: flex-end;
  align-items: center;
}

.result-image svg {
  width: 15px;
  height: 15px;
  align-self: center;
}

.result-image p {
  margin-left: 5px;
  margin-right: 15px;
  font-size: 15px;
  align-self: center;
}

.categories {
  margin-left: auto;
}
</style>
