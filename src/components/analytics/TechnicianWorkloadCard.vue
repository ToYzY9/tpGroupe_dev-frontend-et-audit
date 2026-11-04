<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
</script>

<template>
  <article class="bg-base-200 border border-base-300 rounded-box p-6">
    <header class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-blue-700">Charge par technicien</h2>
      <button class="text-base-content/70 hover:text-blue-500 transition-colors" aria-label="Options du graphique">
        <EllipsisVertical class="w-5 h-5" />
      </button>
    </header>

    <ul class="flex flex-col gap-5">

      <li>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-xs font-semibold">Marc Aurele</span>
          <span class="text-[11px] opacity-70">18 tickets (85%)</span>
        </div>
        <div class="flex h-5 w-full bg-base-100 border border-base-300 overflow-hidden">
          <div class="h-full w-[60%] bg-info"></div>
          <div class="h-full w-[25%] bg-info/40"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-xs font-semibold">Sophie L.</span>
          <span class="text-[11px] opacity-70">12 tickets (55%)</span>
        </div>
        <div class="flex h-5 w-full bg-base-100 border border-base-300 overflow-hidden">
          <div class="h-full w-[37%] bg-info"></div>
          <div class="h-full w-[18%] bg-info/40"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-xs font-semibold">Julien Clerc</span>
          <span class="text-[11px] opacity-70">22 tickets (98%)</span>
        </div>
        <div class="flex h-5 w-full bg-base-100 border border-base-300 overflow-hidden">
          <div class="h-full w-[75%] bg-error"></div>
          <div class="h-full w-[23%] bg-red-500/40"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-xs font-semibold">Amine B.</span>
          <span class="text-[11px] opacity-70">9 tickets (40%)</span>
        </div>
        <div class="flex h-5 w-full bg-base-100 border border-base-300 overflow-hidden">
          <div class="h-full w-[27%] bg-info"></div>
          <div class="h-full w-[13%] bg-info/40"></div>
        </div>
      </li>

    </ul>

    <footer class="flex gap-6 mt-6 text-[10px] font-medium text-base-content/70">
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-info"></span>Incidents Majeurs</span>
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-info/40"></span>Demandes Standards</span>
    </footer>
  </article>
</template>
