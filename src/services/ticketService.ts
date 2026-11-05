import { get, push, ref, serverTimestamp, set, update } from "firebase/database";
import { database } from "./firebase";
import type { TicketFormData } from "../components/TicketForm.vue";
import type { Ticket, TicketComment, TicketHistory, TicketPriority, TicketStatus } from "../components/types/ticket";

interface DbTicket {
  title: string;
  description: string;
  created_at: number;
  last_update: number | null;
  id_priority: string;
  id_category: string;
  id_author: string | null;
  id_status: string;
  id_technician: string | null;
}

const STATUS_FROM_DB: Record<string, TicketStatus> = {
  Nouveau: "new",
  "En cours": "in_progress",
  Résolu: "resolved",
  Clôturé: "closed",
};

const PRIORITY_FROM_DB: Record<string, TicketPriority> = {
  Basse: "low",
  Moyenne: "medium",
  Haute: "high",
  Critique: "critical",
};

const CATEGORY_FROM_DB: Record<string, string> = {
  materiel: "Matériel",
  logiciel: "Logiciel",
  reseau: "Réseau",
  acces: "Accès",
};

const toTicket = (key: string, t: DbTicket): Ticket => ({
  id: key,
  title: t.title,
  description: t.description,
  category: CATEGORY_FROM_DB[t.id_category] ?? t.id_category,
  status: STATUS_FROM_DB[t.id_status] ?? "new",
  priority: PRIORITY_FROM_DB[t.id_priority] ?? "medium",
  createdAt: new Date(t.created_at),
  updatedAt: new Date(t.last_update ?? t.created_at),
  author: { id: 0, name: t.id_author ?? "Inconnu" },
  technician: t.id_technician ? { id: 0, name: t.id_technician } : null,
  comments: [],
});

export const saveTicket = async (ticketData: TicketFormData, userId: string | null = null) => {
  const ticket = {
    title: ticketData.title,
    description: ticketData.description,
    created_at: serverTimestamp(),
    last_update: null,
    id_priority: ticketData.priority,
    id_category: ticketData.category,
    id_author: userId,
    id_status: "Nouveau",
    id_technician: null,
  };

  const ticketRef = push(ref(database, "ticket"));
  if (!ticketRef.key) {
    throw new Error("Impossible de générer une référence pour le ticket.");
  }
  await set(ticketRef, ticket);
  return ticketRef.key;
};

export const getTickets = async (): Promise<Ticket[]> => {
  const snapshot = await get(ref(database, "ticket"));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val() as Record<string, DbTicket>)
    .map(([key, t]) => toTicket(key, t));
};

export const getTicket = async (id: string): Promise<Ticket | undefined> => {
  const snapshot = await get(ref(database, `ticket/${id}`));
  return snapshot.exists() ? toTicket(id, snapshot.val() as DbTicket) : undefined;
};

export const updateTicketFields = async (id: string, status: string, priority: string, technician: string | null) => {
  await update(ref(database, `ticket/${id}`), {
    id_status: status,
    id_priority: priority,
    id_technician: technician,
    last_update: serverTimestamp(),
  });
};

export const saveComment = async (ticketId: string, content: string, author: string) => {
  const commentRef = push(ref(database, `comment/${ticketId}`));
  if (!commentRef.key) {
    throw new Error("Impossible de générer une référence pour le commentaire.");
  }
  await set(commentRef, { content, author, created_at: serverTimestamp() });
  return commentRef.key;
};

export const getTicketHistory = async (ticketId: string): Promise<TicketHistory[]> => {
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

export const getComments = async (ticketId: string): Promise<TicketComment[]> => {
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
