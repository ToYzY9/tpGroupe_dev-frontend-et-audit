import { get, ref, runTransaction } from "firebase/database";
import { database } from "./firebase";
import type { TicketFirebase } from "./dashboard.service";
import type { TicketFormData, TicketPriority } from "../components/TicketForm.vue";
import type { Ticket } from "../components/types/ticket";

// Correspondance entre les numéros de la base et les valeurs attendues par l'affichage
const PRIORITY_KEYS: Record<number, Ticket["priority"]> = { 1: "critical", 2: "high", 3: "medium", 4: "low" };
const STATUS_KEYS: Record<number, Ticket["status"]> = { 1: "new", 2: "in_progress", 3: "resolved", 4: "closed" };

// Textes absents du nœud "tickets", retrouvés à partir des numéros qu'il contient
export interface TicketLabels {
  categories: Map<number, string>;
  technicians: Map<number, string>;
  commentCounts: Map<number, number>;
}

export const getTicketLabels = async (): Promise<TicketLabels> => {
  const [categories, profiles, comments] = await Promise.all([
    get(ref(database, "categories")),
    get(ref(database, "profiles")),
    get(ref(database, "comments")),
  ]);

  const labels: TicketLabels = { categories: new Map(), technicians: new Map(), commentCounts: new Map() };

  categories.forEach((category) => {
    labels.categories.set(category.val().id_category, category.val().category_name);
  });
  profiles.forEach((profile) => {
    labels.technicians.set(profile.val().id_profile, profile.val().full_name);
  });
  comments.forEach((comment) => {
    const idTicket = comment.val().id_ticket;
    labels.commentCounts.set(idTicket, (labels.commentCounts.get(idTicket) ?? 0) + 1);
  });

  return labels;
};

// Transforme un ticket de la base en ticket affichable par TicketTable
export const toTicket = (ticket: TicketFirebase, labels: TicketLabels): Ticket => {
  const technicianName = ticket.id_technician ? labels.technicians.get(ticket.id_technician) : undefined;

  return {
    id: ticket.id_ticket,
    title: ticket.title,
    category: labels.categories.get(ticket.id_category) ?? "",
    description: ticket.description,
    commentCount: labels.commentCounts.get(ticket.id_ticket) ?? 0,
    priority: PRIORITY_KEYS[ticket.id_priority] ?? "low",
    status: STATUS_KEYS[ticket.id_status] ?? "new",
    createdAt: new Date(ticket.created_at),
    updatedAt: new Date(ticket.last_update),
    technician: technicianName ? { id: ticket.id_technician!, name: technicianName } : null,
  };
};

// Correspondance entre les choix du formulaire et les tables "priorities" et "categories"
const PRIORITY_IDS: Record<TicketPriority, number> = {
  Critique: 1,
  Haute: 2,
  Moyenne: 3,
  Basse: 4,
};

const CATEGORY_IDS: Record<string, number> = {
  reseau: 1,
  materiel: 2,
  logiciel: 3,
  acces: 4,
};

export const saveTicket = async (ticketData: TicketFormData, userId: number | null = null) => {
  const now = new Date().toISOString();
  let idTicket = 0;

  // "tickets" est une liste : la transaction évite que deux envois prennent le même numéro
  await runTransaction(ref(database, "tickets"), (tickets) => {
    const liste = Object.values(tickets ?? {}) as { id_ticket: number }[];
    idTicket = Math.max(0, ...liste.map((ticket) => ticket.id_ticket)) + 1;

    return [
      ...liste,
      {
        id_ticket: idTicket,
        title: ticketData.title,
        description: ticketData.description,
        created_at: now,
        last_update: now,
        id_priority: PRIORITY_IDS[ticketData.priority],
        id_category: CATEGORY_IDS[ticketData.category],
        id_author: userId,
        id_status: 1,
        id_technician: null,
      },
    ];
  });

  return idTicket;
};
