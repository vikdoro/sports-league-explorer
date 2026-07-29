<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useLeaguesStore } from '../stores/leagues';
import { useLeagueBadges } from '../composables/useLeagueBadges';
import LeagueCard from '../components/LeagueCard.vue';
import ErrorState from '../components/ErrorState.vue';

const store = useLeaguesStore();
const { badges, load: loadBadge, markError } = useLeagueBadges();

// Which league cards are expanded. Multiple may be open at once.
const expanded = reactive(new Set<string>());

function toggle(idLeague: string) {
  if (expanded.has(idLeague)) {
    expanded.delete(idLeague);
  } else {
    expanded.add(idLeague);
    // Fetch the badge lazily on first open; the composable caches it.
    loadBadge(idLeague);
  }
}

onMounted(() => {
  store.load();
});
</script>

<template>
  <section>
    <div class="section-bar">
      <h2 class="section-bar__title">Leagues</h2>
      <span
        v-if="store.status === 'ready'"
        class="section-bar__count"
        aria-live="polite"
      >
        {{ store.filteredLeagues.length }} leagues
      </span>
    </div>

    <div v-if="store.status === 'ready'" class="filters">
      <label class="filters__field filters__field--search">
        <span class="visually-hidden">Search leagues by name</span>
        <input
          v-model="store.query"
          type="search"
          class="filters__input"
          placeholder="Search leagues by name"
          autocomplete="off"
        />
      </label>
      <label class="filters__field">
        <span class="visually-hidden">Filter by sport</span>
        <select v-model="store.sport" class="filters__select">
          <option value="">All sports</option>
          <option v-for="sport in store.sports" :key="sport" :value="sport">
            {{ sport }}
          </option>
        </select>
      </label>
    </div>

    <div
      v-if="store.status === 'loading'"
      class="grid leagues-body"
      aria-hidden="true"
    >
      <div v-for="n in 12" :key="n" class="skeleton placeholder-card" />
    </div>

    <div v-else-if="store.status === 'error'" class="leagues-body">
      <ErrorState :message="store.error ?? undefined" @retry="store.load()" />
    </div>

    <p
      v-else-if="store.filteredLeagues.length === 0"
      class="leagues-body leagues-empty"
    >
      No leagues match your filters.
    </p>

    <ul v-else class="grid leagues-body">
      <li v-for="league in store.filteredLeagues" :key="league.idLeague">
        <LeagueCard
          :name="league.strLeague"
          :sport="league.strSport"
          :alternate-name="league.strLeagueAlternate"
          :expanded="expanded.has(league.idLeague)"
          :badge-status="badges.get(league.idLeague)?.status"
          :badge-url="badges.get(league.idLeague)?.badgeUrl"
          :season="badges.get(league.idLeague)?.season"
          @toggle="toggle(league.idLeague)"
          @badge-error="markError(league.idLeague)"
        />
      </li>
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

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-subtle);
  border-bottom: 1px solid var(--color-border-strong);
}

.filters__field {
  display: block;
}

.filters__field--search {
  flex: 1 1 240px;
}

.filters__input,
.filters__select {
  width: 100%;
  height: var(--control-height-md);
  padding: 0 var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  transition: border-color var(--duration-fast) var(--ease-standard);
}

.filters__input::placeholder {
  color: var(--color-text-muted);
}

.filters__input:hover,
.filters__select:hover {
  border-color: var(--ink-300);
}

.filters__select {
  cursor: pointer;
}

.leagues-body {
  margin-top: var(--space-6);
}

.leagues-empty {
  padding: var(--space-8) var(--space-4);
  text-align: center;
  color: var(--color-text-muted);
}

.placeholder-card {
  height: 88px;
  border-radius: var(--radius-lg);
}
</style>
