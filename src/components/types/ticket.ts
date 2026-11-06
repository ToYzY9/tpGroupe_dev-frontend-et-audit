export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'closed'

export type TicketFilter = 'all' | 'open' | 'closed'
export type TicketSort = 'updatedAt' | 'priority' | 'id'

export interface Technician {
  id: number
  name: string
}

export interface TicketComment {
  id: number | string
  content: string
  author: string
  createdAt: Date
}

export interface Ticket {
  id: number       
  title: string
  category: string
  description: string
  comments: TicketComment[]
  priority: TicketPriority
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
  author: Technician
  technician: Technician | null
}
export interface TicketHistory {
  id: number | string
  ticketId: number
  field: string
  old_value: string | null
  new_value: string | null
  changed_by: Technician
  updated_at: Date
}

export interface TicketCounts {
  all: number
  open: number
  closed: number
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  critical: 'Critique',
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
    new: 'Nouveau',
    in_progress: 'En cours',
    resolved: 'Résolu',
    closed: 'Clôturé',
}

export const PRIORITY_WEIGHT: Record<TicketPriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
}

export const PAGE_SIZE = 10
