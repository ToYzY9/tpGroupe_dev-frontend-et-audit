import type { Ticket, TicketCounts, TicketFilter, TicketSort } from '../types/ticket'
import { PRIORITY_WEIGHT, PAGE_SIZE } from '../types/ticket'

export function isClosed(ticket: Ticket): boolean {
  return ticket.status === 'closed';
}

export function countTickets(tickets: Ticket[]): TicketCounts {
  return {
    all: tickets.length,
    open: tickets.filter(t => !isClosed(t)).length,
    closed: tickets.filter(isClosed).length,
  }
}

export function filterTickets(tickets: Ticket[], filter: TicketFilter): Ticket[] {
  switch (filter) {
    case 'all':
      return tickets;
    case 'open':
      return tickets.filter(t => !isClosed(t));
    case 'closed':
      return tickets.filter(isClosed);
  }
}

export function searchTickets(tickets: Ticket[], query: string): Ticket[] {
  const q = query.trim().toLowerCase().replace(/^#/, '')
  if (q === '') return tickets
  return tickets.filter(t => t.title.toLowerCase().includes(q) || (t.id !== undefined && t.id !== null && String(t.id).includes(q)));
}

export function sortTickets(tickets: Ticket[], sort: TicketSort): Ticket[] {
  const copy = [...tickets]
  switch (sort) {
    case 'updatedAt':
      return copy.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    case 'priority':
      return copy.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority])
    case 'id':
      return copy.sort((a, b) => String(b.id).localeCompare(String(a.id)))
  }
}

export function totalPages(count: number, size: number = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(count / size))
}

export function paginate(tickets: Ticket[], page: number, size: number = PAGE_SIZE): Ticket[] {
  const start = (page - 1) * size;
  const end = start + size;
  return tickets.slice(start, end);
}
