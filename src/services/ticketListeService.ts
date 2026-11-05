import { equalTo, orderByChild, query, update, get, push, ref, runTransaction, serverTimestamp, set } from "firebase/database";
import { auth, database } from "./firebase";
import type { TicketFirebase } from "./dashboard.service";
import type { TicketFormData, TicketPriority } from "../components/TicketForm.vue";
import type { Ticket, TicketComment, TicketHistory } from "../components/types/ticket";

// numéro de la base → valeur de l'affichage
const PRIORITY_KEYS: Record<number, Ticket["priority"]> = { 1: "critical", 2: "high", 3: "medium", 4: "low" };
const STATUS_KEYS: Record<number, Ticket["status"]> = { 1: "new", 2: "in_progress", 3: "resolved", 4: "closed" };
// valeur de l'affichage → numéro de la base
const PRIORITY_NUMBERS: Record<Ticket["priority"], number> = { critical: 1, high: 2, medium: 3, low: 4 };
const STATUS_NUMBERS: Record<Ticket["status"], number> = { new: 1, in_progress: 2, resolved: 3, closed: 4 };


// Textes absents du nœud "tickets", retrouvés à partir des numéros qu'il contient
export interface TicketLabels {
  categories: Map<number, string>;
  profiles: Map<number, string>;
  comments: Map<number, TicketComment[]>;
}

export const getTicketLabels = async (): Promise<TicketLabels> => {
  const [categories, profiles, comments] = await Promise.all([
    get(ref(database, "categories")),
    get(ref(database, "profiles")),
    get(ref(database, "comments")),
  ]);

  const labels: TicketLabels = { categories: new Map(), profiles: new Map(), comments: new Map() };

  categories.forEach((category) => {
    labels.categories.set(category.val().id_category, category.val().category_name);
  });
  profiles.forEach((profile) => {
    labels.profiles.set(profile.val().id_profile, profile.val().full_name);
  });
  comments.forEach((comment) => {
    const { id_comment, id_ticket, id_profile, content, created_at } = comment.val();
    const ticketComments = labels.comments.get(id_ticket) ?? [];
    ticketComments.push({
      id: id_comment,
      content,
      author: labels.profiles.get(id_profile) ?? "Inconnu",
      createdAt: new Date(created_at),
    });
    labels.comments.set(id_ticket, ticketComments);
  });

  return labels;
};

// Transforme un ticket de la base en ticket affichable par TicketTable
export const toTicket = (ticket: TicketFirebase, labels: TicketLabels): Ticket => {
  const technicianName = ticket.id_technician ? labels.profiles.get(ticket.id_technician) : undefined;

  return {
    id: ticket.id_ticket,
    title: ticket.title,
    category: labels.categories.get(ticket.id_category) ?? "",
    description: ticket.description,
    comments: labels.comments.get(ticket.id_ticket) ?? [],
    priority: PRIORITY_KEYS[ticket.id_priority] ?? "low",
    status: STATUS_KEYS[ticket.id_status] ?? "new",
    createdAt: new Date(ticket.created_at),
    updatedAt: new Date(ticket.last_update),
    author: {
      id: ticket.id_author ?? 0,
      name: (ticket.id_author && labels.profiles.get(ticket.id_author)) || "Inconnu",
    },
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

// Rôles autorisés à créer un ticket : 1 = Collaborateur, 3 = Responsable, 4 = Administrateur
const TICKET_CREATOR_ROLES = [1, 3, 4];

// Vérifie qu'un utilisateur est connecté et que son profil a un rôle autorisé à créer un ticket
export const canCreateTicket = async () => {
  const user = auth.currentUser;
  if (!user) return false;
  const snapshot = await get(ref(database, `profiles/${user.uid}/role`));
  return TICKET_CREATOR_ROLES.includes(snapshot.val());
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

export const saveComment = async (ticketId: number, content: string, author: string) => {
  const commentRef = push(ref(database, `comment/${ticketId}`));
  if (!commentRef.key) {
    throw new Error("Impossible de générer une référence pour le commentaire.");
  }
  await set(commentRef, { content, author, created_at: serverTimestamp() });
  return commentRef.key;
};

export const getTicketHistory = async (ticketId: number): Promise<TicketHistory[]> => {
  const snapshot = await get(ref(database, `history/${ticketId}`));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val() as Record<string, { field: string; old_value: string | null; new_value: string | null; changed_by: { id: number; name: string }; updated_at: number }>)
    .map(([key, h]) => ({
      id: key,
      ticketId,
      field: h.field,
      old_value: h.old_value,
      new_value: h.new_value,
      changed_by: {
        id: h.changed_by.id,
        name: h.changed_by.name,
      },
      updated_at: new Date(h.updated_at),
    }));
};

export const getComments = async (ticketId: number): Promise<TicketComment[]> => {
  const snapshot = await get(ref(database, `comment/${ticketId}`));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val() as Record<string, { content: string; author: string; created_at: number }>)
    .map(([key, c]) => ({
      id: key,
      content: c.content,
      author: c.author,
      createdAt: new Date(c.created_at),
    }));
};
export const saveTicketHistory = async (entry: Omit<TicketHistory, "id" | "updated_at">) => {
  const historyRef = push(ref(database, `history/${entry.ticketId}`));
  if (!historyRef.key) {
    throw new Error("Impossible de générer une référence pour l'historique.");
  }
  await set(historyRef, {
    field: entry.field,
    old_value: entry.old_value,
    new_value: entry.new_value,
    changed_by: entry.changed_by,
    updated_at: serverTimestamp(),
  });
  return historyRef.key;
};
const findTicket = async (idTicket: number) => {
  const snapshot = await get(query(ref(database, "tickets"), orderByChild("id_ticket"), equalTo(idTicket)));
  const matches: { key: string; ticket: TicketFirebase }[] = [];
  snapshot.forEach((child) => {
    matches.push({ key: child.key!, ticket: child.val() });
  });
  return matches[0];
};

export const getTicketById = async (idTicket: number, labels: TicketLabels): Promise<Ticket | undefined> => {
  const found = await findTicket(idTicket);
  if (!found) return undefined;
  return toTicket(found.ticket, labels);
};

export const updateTicketFields = async (
  idTicket: number,    
  status: Ticket["status"], 
  priority: Ticket["priority"],
  idTechnician: number | null,   
) => {
  const found =  await findTicket(idTicket);
  if (!found) {
    throw new Error(`Ticket ${idTicket} introuvable.`);
  }

  await update(ref(database, `tickets/${found.key}`), {
    id_status: STATUS_NUMBERS[status],
    id_priority: PRIORITY_NUMBERS[priority],
    id_technician: idTechnician,
    last_update: new Date().toISOString(),
  });
};
