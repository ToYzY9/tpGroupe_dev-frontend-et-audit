<script setup lang="ts">
import { Timer, TrendingUp } from 'lucide-vue-next'
</script>

<template>
  <article class="flex flex-col gap-3 bg-base-200 border border-base-300 rounded-box p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-label font-medium text-info">Temps Moyen de Résolution</h2>
      <Timer class="w-4 h-4 text-info" />
    </header>

    <p class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-info">42m</span>
      <span class="inline-flex items-center gap-0.5 text-mini font-semibold text-error">
        <TrendingUp class="w-3 h-3" />
        +5%
      </span>
    </p>

    <div class="h-1 w-full bg-base-300 rounded-full overflow-hidden">
      <div class="h-full w-[70%] bg-primary rounded-full"></div>
    </div>
  </article>
</template>
