<script setup lang="ts">
import { computed } from 'vue'
import { PAGE_SIZE } from '../types/ticket'
import { totalPages } from '../utils/ticketList'

const page = defineModel<number>({ required: true })
const props = withDefaults(defineProps<{ total: number; perPage?: number }>(), {
  perPage: PAGE_SIZE,
})

const pageCount = computed(() => totalPages(props.total, props.perPage))
const first = computed(() => (props.total === 0 ? 0 : (page.value - 1) * props.perPage + 1))
const last = computed(() => Math.min(page.value * props.perPage, props.total))
</script>

<template>
  <nav class="flex justify-between items-center" aria-label="Pagination">
    <p class="text-sm">Tickets {{ first }} à {{ last }} sur {{ total }}</p>

    <div class="flex gap-2">
      <button
        type="button"
        class="btn btn-square bg-base-300/40 border-base-300"
        :disabled="page <= 1"
        aria-label="Page précédente"
        @click="page--"
      >
        ‹
      </button>
      <button
        v-for="n in pageCount"
        :key="n"
        type="button"
        class="btn btn-square"
        :class="n === page ? 'btn-primary' : 'bg-base-300/40 border-base-300'"
        :aria-current="n === page ? 'page' : undefined"
        @click="page = n"
      >
        {{ n }}
      </button>
      <button
        type="button"
        class="btn btn-square bg-base-300/40 border-base-300"
        :disabled="page >= pageCount"
        aria-label="Page suivante"
        @click="page++"
      >
        ›
      </button>
    </div>
  </nav>
</template>
