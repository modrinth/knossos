<template>
  <NuxtPage class="auth-container universal-card" />
</template>

<style>
.auth-container {
  width: 25rem;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: var(--gap-xl);
}

.auth-container h1 {
  font-size: var(--font-size-xl);
  margin: 0;
  color: var(--color-contrast);
}

.auth-container p {
  margin: 0;
}

.auth-container .btn {
  font-weight: 700;
  min-height: 2.5rem;
  text-decoration: none;
}

.auth-container input {
  width: 100%;
  border: none;
  outline: none;
}

.continue-btn svg {
  margin: 0 0 0 0.5rem;
}

.third-party {
  display: grid;
  gap: var(--gap-md);
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
}

.third-party .btn {
  width: 100%;
  vertical-align: middle;
}

.third-party .btn svg {
  margin-right: var(--gap-sm);
  width: 1.25rem;
  height: 1.25rem;
}

@media screen and (max-width: 25.5rem) {
  .third-party .btn {
    grid-column: 1 / 3;
  }
}

.turnstile {
  display: none;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.auth-form__continue--space-around {
  margin: var(--gap-md) 0;
}
</style>
