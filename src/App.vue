<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import LeaguesView from './views/LeaguesView.vue'
</script>

<template>
  <AppHeader title="Sports League Explorer" />
  <main class="container">
    <LeaguesView />
  </main>
</template>

<style scoped>
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
}
</style>
