<script setup lang="ts">
defineProps<{ message?: string }>()

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="card error-state" role="alert">
    <p class="error-state__title">Couldn't load the leagues</p>
    <p v-if="message" class="error-state__detail">{{ message }}</p>
    <button type="button" class="btn btn--accent" @click="$emit('retry')">
      Try again
    </button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.error-state__title {
  font-size: var(--text-md);
  font-weight: var(--font-weight-bold);
}

.error-state__detail {
  font-size: var(--text-sm);
  color: var(--color-text-danger);
}
</style>
