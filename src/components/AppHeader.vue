<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <header class="app-header">
    <h1 class="app-header__logo">{{ title }}</h1>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  height: var(--header-height);
  padding: 0 var(--space-4);
  background: var(--color-surface-brand);
  color: var(--color-text-on-brand);
}

.app-header__logo {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-tight);
}
</style>
