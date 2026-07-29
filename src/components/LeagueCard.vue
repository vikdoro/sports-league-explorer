<script setup lang="ts">
import { ref, watch } from 'vue';
import type { BadgeStatus } from '../composables/useLeagueBadges';

const props = defineProps<{
  name: string;
  sport: string;
  alternateName?: string | null;
  expanded: boolean;
  // Badge data is resolved by the parent; the card only renders it.
  badgeStatus?: BadgeStatus;
  badgeUrl?: string | null;
  season?: string | null;
}>();

defineEmits<{ toggle: []; badgeError: [] }>();

// Whether the badge <img> has finished loading. This is the card's own
// concern — only it owns the element — so the spinner keeps showing until
// the image itself is decoded, on top of the parent's fetch status.
const imgLoaded = ref(false);

// A new badge URL means a fresh image to load; reset the flag so the
// spinner reappears until the new image fires load.
watch(
  () => props.badgeUrl,
  () => {
    imgLoaded.value = false;
  },
);
</script>

<template>
  <article class="card league-card" :class="{ 'league-card--open': expanded }">
    <button
      type="button"
      class="league-card__header"
      :aria-expanded="expanded"
      @click="$emit('toggle')"
    >
      <span class="league-card__body">
        <span class="league-card__name">{{ name }}</span>
        <span v-if="alternateName" class="league-card__alt">{{
          alternateName
        }}</span>
      </span>
      <span class="badge badge--sport">{{ sport }}</span>
    </button>

    <div v-if="expanded" class="league-card__badge">
      <p
        v-if="badgeStatus === 'error'"
        class="league-card__badge-note"
        role="alert"
      >
        Couldn't load the season badge.
      </p>

      <template v-else-if="badgeStatus === 'ready'">
        <template v-if="badgeUrl">
          <div class="league-card__badge-frame">
            <span
              v-if="!imgLoaded"
              class="spinner"
              role="status"
              aria-label="Loading season badge"
            />
            <img
              :src="badgeUrl"
              :alt="`${name} badge${season ? `, ${season} season` : ''}`"
              class="league-card__badge-img"
              :class="{ 'is-loaded': imgLoaded }"
              @load="imgLoaded = true"
              @error="$emit('badgeError')"
            />
          </div>
          <p v-if="imgLoaded && season" class="league-card__season">
            {{ season }} season
          </p>
        </template>
        <div v-else class="league-card__badge-frame">
          <svg
            class="league-card__badge-placeholder"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            role="img"
            aria-label="No season badge available"
          >
            <path d="M20 12h24v10c0 6.6-5.4 12-12 12s-12-5.4-12-12V12Z" />
            <path d="M20 15h-6c0 6 4 11 9 12M44 15h6c0 6-4 11-9 12" />
            <path d="M32 34v8M24 50h16M27 50c0-3 2-8 5-8s5 5 5 8" />
          </svg>
        </div>
      </template>

      <div v-else class="league-card__badge-frame">
        <span class="spinner" role="status" aria-label="Loading season badge" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.league-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.league-card--open {
  border-color: var(--color-border-strong);
  box-shadow:
    var(--shadow-xs),
    0 0 0 1px var(--color-border-strong);
}

/* Clickable header spans the whole top of the card. */
.league-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  background: transparent;
  border: 0;
  border-radius: var(--radius-lg);
  text-align: left;
  cursor: pointer;
}

.league-card__body {
  display: block;
  min-width: 0;
  overflow-wrap: anywhere;
}

.league-card__name {
  display: block;
  font-size: var(--text-md);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-snug);
}

.league-card__alt {
  display: block;
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.badge--sport {
  flex-shrink: 0;
}

.league-card__badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-4) var(--space-4);
}

/* Fixed frame so the spinner and the image occupy the same box. */
.league-card__badge-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
}

.league-card__badge-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  display: none;
}

.league-card__badge-img.is-loaded {
  display: block;
}

.league-card__badge-placeholder {
  width: 72px;
  height: 72px;
  color: var(--color-border-strong);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--color-border-strong);
  border-top-color: var(--color-text-muted);
  border-radius: var(--radius-full);
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.league-card__season {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
}

.league-card__badge-note {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 1.4s;
  }
}
</style>
