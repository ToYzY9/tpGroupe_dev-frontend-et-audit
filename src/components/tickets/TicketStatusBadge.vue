<script setup lang="ts">
import { computed } from 'vue'
import type { TicketStatus } from '../types/ticket'
import { STATUS_LABELS } from '../types/ticket'

const props = defineProps<{ status: TicketStatus }>()

const STATUS_STYLE: Record<TicketStatus, { css: string; icon: string }> = {
  new:         { css: 'badge-info',    icon: '○' },
  in_progress: { css: 'badge-warning', icon: '◷' },
  resolved:    { css: 'badge-success', icon: '✓' },
  closed:      { css: 'badge-neutral', icon: '●' }
}

const style = computed(() => STATUS_STYLE[props.status])
</script>

<template>
  <span class="badge badge-soft gap-1 font-semibold" :class="style.css">
    <span aria-hidden="true">{{ style.icon }}</span>
    {{ STATUS_LABELS[status] }}
  </span>
</template>
