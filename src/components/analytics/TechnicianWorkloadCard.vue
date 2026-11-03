<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
</script>

<template>
  <article class="bg-white border border-gray-200 rounded-lg p-6">
    <header class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-blue-700">Charge par technicien</h2>
      <button class="text-gray-500 hover:text-blue-700 transition-colors" aria-label="Options du graphique">
        <EllipsisVertical class="w-5 h-5" />
      </button>
    </header>

    <ul class="flex flex-col gap-5">

      <li>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-xs font-semibold text-gray-800">Marc Aurele</span>
          <span class="text-[11px] text-gray-500">18 tickets (85%)</span>
        </div>
        <div class="flex h-5 w-full bg-gray-50 border border-gray-200 overflow-hidden">
          <div class="h-full w-[60%] bg-blue-700"></div>
          <div class="h-full w-[25%] bg-indigo-200"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-xs font-semibold text-gray-800">Sophie L.</span>
          <span class="text-[11px] text-gray-500">12 tickets (55%)</span>
        </div>
        <div class="flex h-5 w-full bg-gray-50 border border-gray-200 overflow-hidden">
          <div class="h-full w-[37%] bg-blue-700"></div>
          <div class="h-full w-[18%] bg-indigo-200"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-xs font-semibold text-gray-800">Julien Clerc</span>
          <span class="text-[11px] text-gray-500">22 tickets (98%)</span>
        </div>
        <div class="flex h-5 w-full bg-gray-50 border border-gray-200 overflow-hidden">
          <div class="h-full w-[75%] bg-rose-800"></div>
          <div class="h-full w-[23%] bg-rose-200"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-xs font-semibold text-gray-800">Amine B.</span>
          <span class="text-[11px] text-gray-500">9 tickets (40%)</span>
        </div>
        <div class="flex h-5 w-full bg-gray-50 border border-gray-200 overflow-hidden">
          <div class="h-full w-[27%] bg-blue-700"></div>
          <div class="h-full w-[13%] bg-indigo-200"></div>
        </div>
      </li>

    </ul>

    <footer class="flex gap-6 mt-6 text-[10px] font-medium text-gray-600">
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-blue-700"></span>Incidents Majeurs</span>
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-indigo-200"></span>Demandes Standards</span>
    </footer>
  </article>
</template>
