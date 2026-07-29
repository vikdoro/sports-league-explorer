<script setup lang="ts">
defineProps<{
  name: string
  sport: string
  alternateName?: string | null
}>()
</script>

<template>
  <article class="card league-card">
    <div class="league-card__body">
      <h3 class="league-card__name">{{ name }}</h3>
      <p v-if="alternateName" class="league-card__alt">{{ alternateName }}</p>
    </div>
    <span class="badge badge--sport">{{ sport }}</span>
  </article>
</template>

<style scoped>
.league-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  height: 100%;
}

.league-card__body {
  min-width: 0;
  overflow-wrap: anywhere;
}

.league-card__name {
  font-size: var(--text-md);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-snug);
}

.league-card__alt {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.badge--sport {
  flex-shrink: 0;
}
</style>
