<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
</script>

<template>
  <article class="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <h2 class="text-lg font-bold text-blue-700 px-6 py-4">Incidents critiques en cours</h2>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            <th scope="col" class="px-6 py-3">ID</th>
            <th scope="col" class="px-6 py-3">Incident</th>
            <th scope="col" class="px-6 py-3">Priorité</th>
            <th scope="col" class="px-6 py-3">Technicien</th>
            <th scope="col" class="px-6 py-3">Durée</th>
            <th scope="col" class="px-6 py-3"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>

          <tr class="border-t border-gray-200 border-l-4 border-l-rose-700">
            <td class="px-6 py-4 text-xs text-blue-700 whitespace-nowrap">#INC-2024-089</td>
            <td class="px-6 py-4">
              <p class="text-sm font-semibold text-gray-900">Panne Totale DataCenter - Cluster A12</p>
              <p class="text-[10px] text-gray-500">Infrastructure • Paris West</p>
            </td>
            <td class="px-6 py-4">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">CRITICAL</span>
            </td>
            <td class="px-6 py-4">
              <span class="flex items-center gap-2 text-xs text-gray-700">
                <span class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[9px] shrink-0">JC</span>
                Julien Clerc
              </span>
            </td>
            <td class="px-6 py-4 text-xs text-gray-700 whitespace-nowrap">01h 12m</td>
            <td class="px-6 py-4">
              <a href="#" class="text-blue-700 hover:text-blue-900" aria-label="Ouvrir l'incident #INC-2024-089">
                <ExternalLink class="w-4 h-4" />
              </a>
            </td>
          </tr>

          <tr class="border-t border-gray-200 border-l-4 border-l-rose-700">
            <td class="px-6 py-4 text-xs text-blue-700 whitespace-nowrap">#INC-2024-092</td>
            <td class="px-6 py-4">
              <p class="text-sm font-semibold text-gray-900">Brèche de sécurité suspectée - Firewall 04</p>
              <p class="text-[10px] text-gray-500">Sécurité • External</p>
            </td>
            <td class="px-6 py-4">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">CRITICAL</span>
            </td>
            <td class="px-6 py-4">
              <span class="flex items-center gap-2 text-xs text-gray-700">
                <span class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[9px] shrink-0">MA</span>
                Marc Aurele
              </span>
            </td>
            <td class="px-6 py-4 text-xs text-gray-700 whitespace-nowrap">00h 22m</td>
            <td class="px-6 py-4">
              <a href="#" class="text-blue-700 hover:text-blue-900" aria-label="Ouvrir l'incident #INC-2024-092">
                <ExternalLink class="w-4 h-4" />
              </a>
            </td>
          </tr>

          <tr class="border-t border-gray-200 border-l-4 border-l-transparent">
            <td class="px-6 py-4 text-xs text-blue-700 whitespace-nowrap">#INC-2024-095</td>
            <td class="px-6 py-4">
              <p class="text-sm font-semibold text-gray-900">Lenteur Service API Paiement</p>
              <p class="text-[10px] text-gray-500">Application • Cloud Service</p>
            </td>
            <td class="px-6 py-4">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">HIGH</span>
            </td>
            <td class="px-6 py-4">
              <span class="flex items-center gap-2 text-xs text-gray-700">
                <span class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[9px] shrink-0">SL</span>
                Sophie L.
              </span>
            </td>
            <td class="px-6 py-4 text-xs text-gray-700 whitespace-nowrap">01h 12m</td>
            <td class="px-6 py-4">
              <a href="#" class="text-blue-700 hover:text-blue-900" aria-label="Ouvrir l'incident #INC-2024-095">
                <ExternalLink class="w-4 h-4" />
              </a>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <p class="text-center text-[10px] text-gray-500 py-3 border-t border-gray-200">
      Affichage des 3 incidents critiques sur 12 incidents actifs.
    </p>
  </article>
</template>
