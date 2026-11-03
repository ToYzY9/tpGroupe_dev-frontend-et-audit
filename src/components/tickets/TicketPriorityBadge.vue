<script setup lang="ts">
import { computed } from 'vue'
import type { TicketPriority } from '../types/ticket'
import { PRIORITY_LABELS, PRIORITY_WEIGHT } from '../types/ticket'

const props = defineProps<{ priority: TicketPriority }>()

const PRIORITY_COLOR: Record<TicketPriority, string> = {
  low:      '',
  medium:   '',
  high:     '',
  critical: 'text-error',
}

const label = computed(() => PRIORITY_LABELS[props.priority])
const level = computed(() => PRIORITY_WEIGHT[props.priority])
const color = computed(() => PRIORITY_COLOR[props.priority])
</script>

<template>
  <span class="inline-flex items-center gap-2" :class="color">
    <!-- 4 barres de hauteur croissante -->
    <span class="flex items-end gap-0.5 h-3.5" aria-hidden="true">
      <span
        v-for="n in 4"
        :key="n"
        class="w-0.75 rounded-sm"
        :style="{ height: `${n * 25}%` }"
        :class="n <= level ? 'bg-current' : 'bg-base-content/20'"
      />
    </span>
    {{ label }}
  </span>
</template>
