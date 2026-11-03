<script setup lang="ts">
import type { TicketCounts, TicketFilter } from '../types/ticket'

const filter = defineModel<TicketFilter>({ required: true })
defineProps<{ counts: TicketCounts }>()

const TABS: { value: TicketFilter; label: string; count: keyof TicketCounts }[] = [
  { value: 'all',    label: 'Tous',         count: 'all' },
  { value: 'open',   label: 'Non clôturés', count: 'open' },
  { value: 'closed', label: 'Clôturés',     count: 'closed' }
]
</script>

<template>
  <div class="flex gap-2" role="group" aria-label="Filtrer par statut">
    <button
      v-for="tab in TABS"
      :key="tab.value"
      type="button"
      class="btn rounded-full border-2"
      :class="
      tab.value === filter
        ? 'border-primary bg-secondary text-secondary-content'
        : 'bg-transparent border-base-content/30 hover:border-base-content/60'"
      :aria-pressed="tab.value === filter"
      @click="filter = tab.value"
    >
      {{ tab.label }}
      <span class="font-normal opacity-70">{{ counts[tab.count] }}</span>
    </button>
  </div>
</template>
