<script setup lang="ts">
import type { TicketSort } from '../types/ticket'

const search = defineModel<string>({ required: true })
const sort = defineModel<TicketSort>('sort', { required: true })

const SORT_OPTIONS: { value: TicketSort; label: string }[] = [
  { value: 'updatedAt', label: 'Dernière mise à jour' },
  { value: 'priority',  label: 'Priorité' },
  { value: 'id',        label: 'Numéro' },
]
</script>

<template>
  <div class="flex gap-3 items-end">
    <label class="flex flex-col gap-1">
      <span class="text-sm font-semibold">Rechercher</span>
      <input
        v-model="search"
        type="search"
        class="input"
        placeholder="Titre ou n° de ticket"
      />
    </label>

    <label class="flex flex-col gap-1">
      <span class="text-sm font-semibold">Trier par</span>
      <select v-model="sort" class="select">
        <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>
