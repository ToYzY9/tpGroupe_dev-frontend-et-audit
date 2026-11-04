<script setup lang="ts">
import TicketPriorityBadge from '../tickets/TicketPriorityBadge.vue'
import TicketStatusBadge from '../tickets/TicketStatusBadge.vue'
</script>

<template>
  <article class="bg-base-200 border border-base-300 rounded-box overflow-hidden">
    <header class="flex items-center justify-between px-6 py-5">
      <h2 class="text-xl font-bold text-primary">Mes tickets prioritaires</h2>
      <RouterLink to="/page-ticket" class="text-sm text-info hover:underline">Voir tous mes tickets</RouterLink>
    </header>

    <div class="overflow-x-auto">
      <table class="table [&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_tr]:border-base-300">
        <thead>
          <tr class="bg-base-300/40 text-base-content/80">
            <th scope="col">N°</th>
            <th scope="col">Sujet</th>
            <th scope="col">Priorité</th>
            <th scope="col">Statut</th>
            <th scope="col">Mis à jour</th>
          </tr>
        </thead>
        <tbody>

          <tr>
            <td>#148</td>
            <td>
              <RouterLink to="/tickets/148" class="font-semibold hover:text-info">Accès VPN bloqué depuis le télétravail</RouterLink>
              <p class="text-sm opacity-70">Accès · 3 commentaires</p>
            </td>
            <td><TicketPriorityBadge priority="critical" /></td>
            <td class="whitespace-nowrap"><TicketStatusBadge status="in_progress" /></td>
            <td class="whitespace-nowrap">Il y a 2 h</td>
          </tr>

          <tr>
            <td>#145</td>
            <td>
              <RouterLink to="/tickets/145" class="font-semibold hover:text-info">Écran secondaire qui clignote</RouterLink>
              <p class="text-sm opacity-70">Matériel · 1 commentaire</p>
            </td>
            <td><TicketPriorityBadge priority="high" /></td>
            <td class="whitespace-nowrap"><TicketStatusBadge status="in_progress" /></td>
            <td class="whitespace-nowrap">Il y a 4 h</td>
          </tr>

          <tr>
            <td>#150</td>
            <td>
              <p class="font-semibold">Lenteurs sur le serveur de fichiers</p>
              <p class="text-sm opacity-70">Réseau · 2 commentaires</p>
            </td>
            <td><TicketPriorityBadge priority="medium" /></td>
            <td class="whitespace-nowrap"><TicketStatusBadge status="in_progress" /></td>
            <td class="whitespace-nowrap">Hier</td>
          </tr>

        </tbody>
      </table>
    </div>
  </article>
</template>
