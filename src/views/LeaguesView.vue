<script setup lang="ts">
import { onMounted } from 'vue'
import { useLeaguesStore } from '../stores/leagues'
import LeagueCard from '../components/LeagueCard.vue'
import ErrorState from '../components/ErrorState.vue'

const store = useLeaguesStore()

onMounted(() => {
  store.load()
})
</script>

<template>
  <section>
    <div class="section-bar">
      <h2 class="section-bar__title">Leagues</h2>
      <span v-if="store.status === 'ready'" class="section-bar__count" aria-live="polite">
        {{ store.leagues.length }} leagues
      </span>
    </div>

    <div v-if="store.status === 'loading'" class="grid leagues-body" aria-hidden="true">
      <div v-for="n in 12" :key="n" class="skeleton placeholder-card" />
    </div>

    <div v-else-if="store.status === 'error'" class="leagues-body">
      <ErrorState :message="store.error ?? undefined" @retry="store.load()" />
    </div>

    <ul v-else class="grid leagues-body">
      <li v-for="league in store.leagues" :key="league.idLeague">
        <LeagueCard
          :name="league.strLeague"
          :sport="league.strSport"
          :alternate-name="league.strLeagueAlternate"
      /></li>
    </ul>
  </section>
</template>

<style scoped>
.section-bar__title {
  font-size: var(--text-base);
  font-weight: var(--font-weight-bold);
}

.section-bar__count {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-muted-inverse);
  font-variant-numeric: tabular-nums;
}

.leagues-body {
  margin-top: var(--space-3);
}

.placeholder-card {
  height: 88px;
  border-radius: var(--radius-lg);
}
</style>
