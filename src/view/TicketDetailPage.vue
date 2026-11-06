<template>
  <section v-if="ticket" class="flex flex-col gap-6">
    <header>
      <div class="flex items-center gap-2">
        <router-link
          :to="{ name: 'tickets' }"
          class="hover:text-secondary-content"
          >Mes tickets assignés ></router-link
        >
        <p>Ticket #{{ ticket.id }}</p>
      </div>
      <div class="flex items-center gap-2 p-4 bg-base-200 rounded-lg">
        <p class="text-sm text-base-content/60">Ticket #{{ ticket.id }}</p>
        <p>- {{ ticket.category }}</p>
        <ticket-status-badge :status="ticket.status" />
        <ticket-priority-badge :priority="ticket.priority" />
      </div>
      <h1 class="text-3xl font-bold text-info">{{ ticket.title }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2 p-4 bg-base-200 rounded-lg">
            <h3 class="font-semibold text-2xl text-secondary-content">
              Description
            </h3>
            <p>{{ ticket.description }}</p>
            <div class="flex items-center gap-2 text-base-content/60">
              <p class="text-sm text-base-content/60">
                Déclareé par {{ ticket.author?.name || "Inconnu" }}
              </p>
              <p class="text-sm text-base-content/60">
                le {{ new Date(ticket.createdAt).toLocaleDateString() }}
              </p>
              <p class="text-sm text-base-content/60">
                Assigné à
                {{ ticket.technician?.name || "Personne pour l'instant" }}
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-2 p-4 bg-base-200 rounded-lg">
            <h3 class="font-semibold text-2xl text-secondary-content">
              Commentaires {{ ticket.comments.length }}
            </h3>
            <p v-if="ticket.comments.length === 0">
              Aucun commentaire pour le moment.
            </p>
            <div
              v-for="c in ticket.comments"
              :key="c.id"
              class="flex flex-col gap-2"
            >
              <p class="p-2 bg-base-300 rounded-lg">{{ c.content }}</p>
              <p class="text-sm text-base-content/60">
                Posté le {{ c.createdAt.toLocaleDateString() }}
              </p>
              <p class="text-sm text-base-content/60">Par {{ c.author }}</p>
            </div>
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              class="input input-bordered w-full"
              v-model="comment"
            />
            <button class="btn btn-primary" @click="addComment">
              Publier le commentaire
            </button>
          </div>
          <div class="flex flex-col gap-2 p-4 bg-base-200 rounded-lg">
            <h3 class="font-semibold text-2xl text-secondary-content">
              Historique
            </h3>
            <p v-if="ticketHistory.length === 0">
              Aucun historique pour le moment.
            </p>
            <div
              v-for="h in ticketHistory"
              :key="h.id"
              class="flex flex-col gap-2"
            >
              <p class="p-2 bg-base-300 rounded-lg">
                {{ h.field }} : {{ h.old_value ?? "—" }} →
                {{ h.new_value ?? "—" }}
              </p>
              <p class="text-sm text-base-content/60">
                Modifié le {{ h.updated_at.toLocaleDateString() }} par
                {{ h.changed_by.name }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-4 p-4 bg-base-200 rounded-lg">
            <h3 class="font-semibold text-2xl text-secondary-content">
              Traiter le ticket
            </h3>
            <p v-if="ticket.status === 'closed'">
              Ce ticket est clôturé et ne peut plus être modifié.
            </p>
            <div v-else>
              <h4 class="font-semibold text-secondary-content">
                Nouveau statut
              </h4>
              <select v-model="newStatus" class="select select-bordered w-full">
                <option value="new">Nouveau</option>
                <option value="in_progress">En cours</option>
                <option value="resolved">Résolu</option>
                <option value="closed">Clôturé</option>
              </select>
              <h4 class="font-semibold text-secondary-content mt-4">
                Nouvelle priorité
              </h4>
              <select
                v-model="newPriority"
                class="select select-bordered w-full"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="critical">Critique</option>
              </select>
              <h4 class="font-semibold text-secondary-content mt-4">
                Assigner un technicien
              </h4>
              <select
                v-model="newTechnician"
                class="select select-bordered w-full"
              >
                <option :value="null">Non affecté</option>
                <option v-for="[id, name] in profiles" :key="id" :value="id">
                  {{ name }}
                </option>
              </select>
              <button class="btn btn-primary mt-4" @click="updateTicket">
                Mettre à jour le ticket
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-4 p-4 bg-base-200 rounded-lg">
            <h3 class="font-semibold text-2xl text-secondary-content">
              Informations du ticket
            </h3>
            <p><strong>Catégorie :</strong> {{ ticket.category }}</p>
            <p>
              <strong>Priorité :</strong> {{ PRIORITY_LABELS[ticket.priority] }}
            </p>
            <p><strong>Statut :</strong> {{ STATUS_LABELS[ticket.status] }}</p>
            <p>
              <strong>Date de création :</strong>
              {{ new Date(ticket.createdAt).toLocaleDateString() }}
            </p>
            <p>
              <strong>Date de mise à jour :</strong>
              {{ new Date(ticket.updatedAt).toLocaleDateString() }}
            </p>
            <p v-if="ticket.technician">
              <strong>Technicien assigné :</strong> {{ ticket.technician.name }}
            </p>
          </div>
        </div>
      </div>
    </header>
  </section>
  <p v-else>Ticket introuvable.</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import type {
  Ticket,
  TicketHistory,
  TicketPriority,
  TicketStatus,
} from "../components/types/ticket";
import { PRIORITY_LABELS, STATUS_LABELS } from "../components/types/ticket";
import TicketStatusBadge from "../components/tickets/TicketStatusBadge.vue";
import TicketPriorityBadge from "../components/tickets/TicketPriorityBadge.vue";
import { useAuthStore } from "../stores/authStore";
import {
  getComments,
  getTicketById,
  getTicketHistory,
  getTicketLabels,
  saveComment,
  saveTicketHistory,
  updateTicketFields,
} from "../services/ticketListeService";

const route = useRoute();
const authStore = useAuthStore();
const ticket = ref<Ticket | undefined>();
const ticketHistory = ref<TicketHistory[]>([]);
const profiles = ref<Map<number, string>>(new Map());

onMounted(async () => {
  const labels = await getTicketLabels();
  profiles.value = labels.profiles;

  const found = await getTicketById(Number(route.params.id), labels);
  if (!found) return;
  try {
    found.comments.push(...(await getComments(found.id)));
  } catch (error) {
    console.error("Impossible de charger les commentaires :", error);
  }
  ticket.value = found;
  newStatus.value = found.status;
  newPriority.value = found.priority;
  newTechnician.value = found.technician?.id ?? null;
  try {
    ticketHistory.value = await getTicketHistory(found.id);
  } catch (error) {
    console.error("Impossible de charger l'historique :", error);
  }
});
const comment = ref<string>("");

const addComment = async () => {
  if (ticket.value && comment.value.trim() !== "") {
    const content = comment.value.trim();
    const author =
      authStore.user?.displayName ?? authStore.user?.email ?? "Inconnu";
    const id = await saveComment(ticket.value.id, content, author);
    ticket.value.comments.push({ id, content, author, createdAt: new Date() });
    comment.value = "";
  }
};

const newStatus = ref<TicketStatus>("new");
const newPriority = ref<TicketPriority>("low");
const newTechnician = ref<number | null>(null);

const updateTicket = async () => {
  if (!ticket.value) return;
  const changedBy = {
    id: 0,
    name: authStore.user?.displayName ?? authStore.user?.email ?? "Inconnu",
  };
  const changes = [];
  if (newStatus.value !== ticket.value.status) {
    changes.push({
      field: "Statut",
      old_value: STATUS_LABELS[ticket.value.status],
      new_value: STATUS_LABELS[newStatus.value],
    });
  }
  if (newPriority.value !== ticket.value.priority) {
    changes.push({
      field: "Priorité",
      old_value: PRIORITY_LABELS[ticket.value.priority],
      new_value: PRIORITY_LABELS[newPriority.value],
    });
  }
  if (newTechnician.value !== (ticket.value.technician?.id ?? null)) {
    changes.push({
      field: "Technicien",
      old_value: ticket.value.technician?.name ?? "Non affecté",
      new_value: newTechnician.value !== null ? profiles.value.get(newTechnician.value) ?? "Inconnu" : "Non affecté",
    });
  }
  if (changes.length === 0) return;
    await updateTicketFields(ticket.value.id, newStatus.value, newPriority.value, newTechnician.value);
  for (const change of changes) {
    const entry = {
      ticketId: ticket.value.id,
      changed_by: changedBy,
      ...change,
    };
    const id = await saveTicketHistory(entry);
    ticketHistory.value.push({ ...entry, id, updated_at: new Date() });
  }
    ticket.value.status = newStatus.value;
    ticket.value.priority = newPriority.value;
  ticket.value.technician = newTechnician.value !== null
    ? { id: newTechnician.value, name: profiles.value.get(newTechnician.value) ?? "Inconnu" }
    : null;
  ticket.value.updatedAt = new Date();
};
</script>
