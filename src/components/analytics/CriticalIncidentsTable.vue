<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
</script>

<template>
  <article class="bg-base-200 border border-base-300 rounded-box overflow-hidden">
    <h2 class="px-6 py-5 text-xl font-bold text-primary">Incidents critiques en cours</h2>

    <div class="overflow-x-auto">
      <table class="table [&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_tr]:border-base-300">
        <thead>
          <tr class="bg-base-300/40 text-base-content/80">
            <th scope="col">ID</th>
            <th scope="col">Incident</th>
            <th scope="col">Priorité</th>
            <th scope="col">Technicien</th>
            <th scope="col">Durée</th>
            <th scope="col"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>

          <tr>
            <td class="whitespace-nowrap border-l-4 border-l-error">#INC-2024-089</td>
            <td>
              <p class="font-semibold">Panne Totale DataCenter - Cluster A12</p>
              <p class="text-sm opacity-70">Infrastructure • Paris West</p>
            </td>
            <td><span class="badge bg-error/15 border-transparent text-error font-semibold">CRITICAL</span></td>
            <td>
              <span class="flex items-center gap-2 whitespace-nowrap">
                <span class="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-content text-mini shrink-0">JC</span>
                Julien Clerc
              </span>
            </td>
            <td class="whitespace-nowrap">01h 12m</td>
            <td>
              <a href="#" class="text-info hover:text-info/80" aria-label="Ouvrir l'incident #INC-2024-089">
                <ExternalLink class="w-4 h-4" />
              </a>
            </td>
          </tr>

          <tr>
            <td class="whitespace-nowrap border-l-4 border-l-error">#INC-2024-092</td>
            <td>
              <p class="font-semibold">Brèche de sécurité suspectée - Firewall 04</p>
              <p class="text-sm opacity-70">Sécurité • External</p>
            </td>
            <td><span class="badge bg-error/15 border-transparent text-error font-semibold">CRITICAL</span></td>
            <td>
              <span class="flex items-center gap-2 whitespace-nowrap">
                <span class="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-content text-mini shrink-0">MA</span>
                Marc Aurele
              </span>
            </td>
            <td class="whitespace-nowrap">00h 22m</td>
            <td>
              <a href="#" class="text-info hover:text-info/80" aria-label="Ouvrir l'incident #INC-2024-092">
                <ExternalLink class="w-4 h-4" />
              </a>
            </td>
          </tr>

          <tr>
            <td class="whitespace-nowrap border-l-4 border-l-transparent">#INC-2024-095</td>
            <td>
              <p class="font-semibold">Lenteur Service API Paiement</p>
              <p class="text-sm opacity-70">Application • Cloud Service</p>
            </td>
            <td><span class="badge badge-soft badge-warning font-semibold">HIGH</span></td>
            <td>
              <span class="flex items-center gap-2 whitespace-nowrap">
                <span class="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-content text-mini shrink-0">SL</span>
                Sophie L.
              </span>
            </td>
            <td class="whitespace-nowrap">01h 12m</td>
            <td>
              <a href="#" class="text-info hover:text-info/80" aria-label="Ouvrir l'incident #INC-2024-095">
                <ExternalLink class="w-4 h-4" />
              </a>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <p class="px-6 py-4 text-center text-sm opacity-70 border-t border-base-300">
      Affichage des 3 incidents critiques sur 12 incidents actifs.
    </p>
  </article>
</template>
