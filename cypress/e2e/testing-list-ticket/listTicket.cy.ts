/// <reference types="cypress" />
type Ticket = {
    id: number
    title: string
    category: string
    description: string
    comments: { id: number; content: string; author: string; createdAt: Date }[]
    priority: 'low' | 'medium' | 'high' | 'critical'
    status: 'new' | 'in_progress' | 'resolved' | 'closed'
    createdAt: Date
    updatedAt: Date
    author: { id: number; name: string }
    history: { id: number; field: string; old_value: string | null; new_value: string | null; updated_at: Date; changed_by: { id: number; name: string } }[]
}
// Affichage de la liste des tickets
