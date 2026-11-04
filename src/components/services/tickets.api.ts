import type { Ticket, TicketHistory } from '../types/ticket'

// Données factices : à remplacer par Firebase à la fin du projet
const MOCK_TICKETS: Ticket[] = [
  {
    id: 148,
    title: 'Accès VPN bloqué depuis le télétravail',
    category: 'Accès',
    description: 'Bonjour, je n’arrive plus à me connecter au VPN depuis mon domicile. J’ai besoin d’accéder aux ressources internes de l’entreprise.',
    comments: [
      { id: 1, content: 'Bonjour, pouvez-vous me donner le message d’erreur affiché par le client VPN ?', author: 'Sarah Koné', createdAt: new Date('2026-11-01T10:15') },
      { id: 2, content: 'Le message indique « Échec de l’authentification ».', author: 'John Doe', createdAt: new Date('2026-11-01T11:02') },
      { id: 3, content: 'Votre certificat a expiré, je le régénère et je reviens vers vous.', author: 'Sarah Koné', createdAt: new Date('2026-11-02T19:05') },
    ],
    priority: 'critical',
    status: 'in_progress',
    createdAt: new Date('2026-11-01T09:00'),
    updatedAt: new Date('2026-11-02T19:05'),
    technician: { id: 1, name: 'Sarah Koné' },
    author: { id: 1, name: 'John Doe' },
  },
  {
    id: 151,
    title: 'Installer le logiciel de retouche photo',
    category: 'Logiciel',
    description: '',
    comments: [],
    priority: 'medium',
    status: 'new',
    createdAt: new Date('2026-11-01T09:00'),
    updatedAt: new Date('2026-11-02T16:05'),
    technician: null,
    author: { id: 2, name: 'Jane Smith' },
  },
  {
    id: 145,
    title: 'Écran secondaire qui clignote',
    category: 'Matériel',
    description: '',
    comments: [
      { id: 4, content: 'J’ai changé le câble HDMI, pouvez-vous me dire si le problème persiste ?', author: 'Jean Petit', createdAt: new Date('2026-11-02T17:15') },
    ],
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2026-11-01T06:00'),
    updatedAt: new Date('2026-11-02T17:15'),
    technician: { id: 2, name: 'Jean Petit' },
    author: { id: 3, name: 'Alice Johnson' },
  },
  {
    id: 139,
    title: 'Mot de passe de messagerie expiré',
    category: 'Accès',
    description: '',
    comments: [
      { id: 5, content: 'Votre mot de passe a été réinitialisé, un lien vous a été envoyé par SMS.', author: 'Amine Benali', createdAt: new Date('2026-11-02T14:30') },
      { id: 6, content: 'C’est bon, j’ai pu me reconnecter. Merci !', author: 'Bob Brown', createdAt: new Date('2026-11-02T16:40') },
    ],
    priority: 'medium',
    status: 'resolved',
    createdAt: new Date('2026-11-01T06:00'),
    updatedAt: new Date('2026-11-02T16:40'),
    technician: { id: 3, name: 'Amine Benali' },
    author: { id: 4, name: 'Bob Brown' },
  },
     {
    id: 101,
    title: 'Clavier qui ne répond plus',
    category: 'Matériel',
    description: 'Plusieurs touches du clavier ne réagissent plus depuis ce matin.',
    comments: [
      { id: 7, content: 'Je passe à votre poste dans la matinée avec un clavier de remplacement.', author: 'Jean Petit', createdAt: new Date('2026-09-02T09:30') },
      { id: 8, content: 'Clavier remplacé, je clôture le ticket.', author: 'Jean Petit', createdAt: new Date('2026-09-03T11:20') },
    ],
    priority: 'medium',
    status: 'closed',
    createdAt: new Date('2026-09-02T08:45'),
    updatedAt: new Date('2026-09-03T11:20'),
    technician: { id: 2, name: 'Jean Petit' },
    author: { id: 5, name: 'Charlie Davis' }
  },
  {
    id: 104,
    title: 'Impossible d’imprimer sur l’imprimante du 2e étage',
    category: 'Matériel',
    description: 'Les documents restent bloqués dans la file d’attente d’impression.',
    comments: [
      { id: 9, content: 'La file d’impression était bloquée, je l’ai vidée.', author: 'Jean Petit', createdAt: new Date('2026-09-08T16:00') },
      { id: 10, content: 'Ça imprime de nouveau, mais très lentement.', author: 'Diana Evans', createdAt: new Date('2026-09-09T10:12') },
      { id: 11, content: 'Pilote mis à jour, la vitesse est revenue à la normale.', author: 'Jean Petit', createdAt: new Date('2026-09-10T09:05') },
    ],
    priority: 'low',
    status: 'closed',
    createdAt: new Date('2026-09-08T14:10'),
    updatedAt: new Date('2026-09-10T09:05'),
    technician: { id: 2, name: 'Jean Petit' },
    author: { id: 6, name: 'Diana Evans' }
  },
  {
    id: 107,
    title: 'Compte bloqué après trois tentatives',
    category: 'Accès',
    description: 'Mon compte Windows est verrouillé après des erreurs de mot de passe.',
    comments: [
      { id: 12, content: 'Compte déverrouillé, pensez à changer votre mot de passe.', author: 'Amine Benali', createdAt: new Date('2026-09-12T09:30') },
    ],
    priority: 'high',
    status: 'closed',
    createdAt: new Date('2026-09-12T08:05'),
    updatedAt: new Date('2026-09-12T09:30'),
    technician: { id: 3, name: 'Amine Benali' },
    author: { id: 7, name: 'Ethan Foster' }
  },
  {
    id: 110,
    title: 'Wi-Fi instable en salle de réunion',
    category: 'Réseau',
    description: 'La connexion se coupe toutes les dix minutes pendant les visioconférences.',
    comments: [
      { id: 13, content: 'À quelle heure les coupures se produisent-elles le plus souvent ?', author: 'Sarah Koné', createdAt: new Date('2026-09-16T11:00') },
      { id: 14, content: 'Surtout l’après-midi, quand la salle est pleine.', author: 'Fiona Green', createdAt: new Date('2026-09-16T14:20') },
      { id: 15, content: 'La borne Wi-Fi est saturée, j’en ajoute une seconde.', author: 'Sarah Koné', createdAt: new Date('2026-09-18T09:45') },
      { id: 16, content: 'Nouvelle borne installée, plus aucune coupure constatée.', author: 'Sarah Koné', createdAt: new Date('2026-09-19T16:00') },
    ],
    priority: 'medium',
    status: 'closed',
    createdAt: new Date('2026-09-16T10:30'),
    updatedAt: new Date('2026-09-19T16:00'),
    technician: { id: 1, name: 'Sarah Koné' },
    author: { id: 8, name: 'Fiona Green' }
  },
  {
    id: 113,
    title: 'Mise à jour du navigateur impossible',
    category: 'Logiciel',
    description: 'Le navigateur affiche une erreur de droits lors de la mise à jour.',
    comments: [],
    priority: 'low',
    status: 'closed',
    createdAt: new Date('2026-09-22T13:15'),
    updatedAt: new Date('2026-09-23T10:40'),
    technician: { id: 3, name: 'Amine Benali' },
    author: { id: 3, name: 'Amine Benali' },
  },
  {
    id: 116,
    title: 'Serveur de fichiers inaccessible',
    category: 'Réseau',
    description: 'Le lecteur réseau partagé n’apparaît plus dans l’explorateur.',
    comments: [
      { id: 17, content: 'Incident en cours d’analyse, plusieurs services sont touchés.', author: 'Sarah Koné', createdAt: new Date('2026-09-25T08:05') },
      { id: 18, content: 'Toute l’équipe comptable est bloquée, c’est urgent.', author: 'George Harris', createdAt: new Date('2026-09-25T08:20') },
      { id: 19, content: 'Le disque principal du serveur est plein, nettoyage en cours.', author: 'Sarah Koné', createdAt: new Date('2026-09-25T09:40') },
      { id: 20, content: 'Espace libéré, le lecteur réseau est de nouveau accessible.', author: 'Sarah Koné', createdAt: new Date('2026-09-25T11:50') },
      { id: 21, content: 'Confirmé, tout fonctionne. Merci pour la réactivité.', author: 'George Harris', createdAt: new Date('2026-09-25T12:15') },
    ],
    priority: 'critical',
    status: 'closed',
    createdAt: new Date('2026-09-25T07:50'),
    updatedAt: new Date('2026-09-25T12:15'),
    technician: { id: 1, name: 'Sarah Koné' },
   author: { id: 9, name: 'George Harris' }
  },
  {
    id: 119,
    title: 'Licence du tableur expirée',
    category: 'Logiciel',
    description: 'Le tableur passe en mode lecture seule et demande une licence.',
    comments: [
      { id: 22, content: 'La licence a été renouvelée par le service achats.', author: 'Amine Benali', createdAt: new Date('2026-10-01T10:00') },
      { id: 23, content: 'Licence réactivée sur votre poste, il suffit de redémarrer le tableur.', author: 'Amine Benali', createdAt: new Date('2026-10-01T14:25') },
    ],
    priority: 'high',
    status: 'closed',
    createdAt: new Date('2026-09-30T09:00'),
    updatedAt: new Date('2026-10-01T14:25'),
    technician: { id: 3, name: 'Amine Benali' },
    author: { id: 10, name: 'Hannah Irving' }
  },
  {
    id: 122,
    title: 'Batterie de l’ordinateur portable qui ne charge plus',
    category: 'Matériel',
    description: 'L’ordinateur reste à 0 % même branché sur le secteur.',
    comments: [
      { id: 24, content: 'Avez-vous essayé avec un autre chargeur ?', author: 'Jean Petit', createdAt: new Date('2026-10-05T14:00') },
      { id: 25, content: 'Oui, même résultat avec le chargeur d’un collègue.', author: 'Ian Jackson', createdAt: new Date('2026-10-06T09:15') },
      { id: 26, content: 'Batterie défectueuse remplacée.', author: 'Jean Petit', createdAt: new Date('2026-10-08T15:10') },
    ],
    priority: 'medium',
    status: 'closed',
    createdAt: new Date('2026-10-05T11:40'),
    updatedAt: new Date('2026-10-08T15:10'),
    technician: { id: 2, name: 'Jean Petit' },
    author: { id: 11, name: 'Ian Jackson' }
  },
  {
    id: 125,
    title: 'Accès refusé au dossier Comptabilité',
    category: 'Accès',
    description: 'Je n’ai plus accès au dossier partagé depuis mon changement de service.',
    comments: [
      { id: 27, content: 'Droits mis à jour selon votre nouveau service.', author: 'Amine Benali', createdAt: new Date('2026-10-09T17:45') },
    ],
    priority: 'medium',
    status: 'closed',
    createdAt: new Date('2026-10-09T08:20'),
    updatedAt: new Date('2026-10-09T17:45'),
    technician: { id: 3, name: 'Amine Benali' },
    author: { id: 12, name: 'Jackie King' }
  },
  {
    id: 128,
    title: 'Messagerie qui ne synchronise plus sur le téléphone',
    category: 'Logiciel',
    description: 'Les nouveaux mails n’arrivent plus sur l’application mobile.',
    comments: [
      { id: 28, content: 'Pouvez-vous supprimer puis rajouter le compte dans l’application ?', author: 'Sarah Koné', createdAt: new Date('2026-10-15T10:30') },
      { id: 29, content: 'C’est fait, les mails arrivent de nouveau.', author: 'Karen Lee', createdAt: new Date('2026-10-16T09:30') },
    ],
    priority: 'low',
    status: 'closed',
    createdAt: new Date('2026-10-14T16:05'),
    updatedAt: new Date('2026-10-16T09:30'),
    technician: { id: 1, name: 'Sarah Koné' },
    author: { id: 13, name: 'Karen Lee' }
  },
  {
    id: 131,
    title: 'Coupure réseau sur tout l’open space',
    category: 'Réseau',
    description: 'Aucun poste de l’open space n’a accès à internet ni au réseau interne.',
    comments: [
      { id: 30, content: 'Coupure confirmée, intervention en cours dans la baie réseau.', author: 'Sarah Koné', createdAt: new Date('2026-10-20T09:20') },
      { id: 31, content: 'Est-ce qu’on a une estimation du délai ?', author: 'Liam Martin', createdAt: new Date('2026-10-20T09:45') },
      { id: 32, content: 'Le switch principal est hors service, remplacement prévu sous une heure.', author: 'Sarah Koné', createdAt: new Date('2026-10-20T10:05') },
      { id: 33, content: 'Switch remplacé, redémarrage des équipements en cours.', author: 'Sarah Koné', createdAt: new Date('2026-10-20T11:15') },
      { id: 34, content: 'Le réseau revient sur nos postes.', author: 'Liam Martin', createdAt: new Date('2026-10-20T11:40') },
      { id: 35, content: 'Tout est rétabli, je clôture l’incident.', author: 'Sarah Koné', createdAt: new Date('2026-10-20T11:55') },
    ],
    priority: 'critical',
    status: 'closed',
    createdAt: new Date('2026-10-20T09:10'),
    updatedAt: new Date('2026-10-20T11:55'),
    technician: { id: 1, name: 'Sarah Koné' },
    author: { id: 14, name: 'Liam Martin' }
  },
  {
    id: 134,
    title: 'Souris sans fil qui se déconnecte',
    category: 'Matériel',
    description: 'La souris perd la connexion plusieurs fois par heure.',
    comments: [],
    priority: 'low',
    status: 'closed',
    createdAt: new Date('2026-10-26T10:00'),
    updatedAt: new Date('2026-10-27T08:35'),
    technician: { id: 2, name: 'Jean Petit' },
    author: { id: 15, name: 'Mia Nelson' }
  },
  {
    id: 137,
    title: 'Logiciel de visioconférence qui plante',
    category: 'Logiciel',
    description: 'L’application se ferme dès que je partage mon écran.',
    comments: [
      { id: 36, content: 'Mise à jour de l’application installée, pouvez-vous réessayer ?', author: 'Amine Benali', createdAt: new Date('2026-10-29T10:00') },
      { id: 37, content: 'Le partage d’écran fonctionne maintenant.', author: 'Noah Owens', createdAt: new Date('2026-10-29T14:10') },
    ],
    priority: 'high',
    status: 'closed',
    createdAt: new Date('2026-10-28T09:30'),
    updatedAt: new Date('2026-10-29T14:10'),
    technician: { id: 3, name: 'Amine Benali' },
    author: { id: 16, name: 'Noah Owens' }
  },
  {
    id: 140,
    title: 'Demande d’un second écran',
    category: 'Matériel',
    description: 'Besoin d’un second écran pour le poste de travail.',
    comments: [
      { id: 38, content: 'Second écran installé et configuré sur votre poste.', author: 'Jean Petit', createdAt: new Date('2026-10-31T10:20') },
    ],
    priority: 'low',
    status: 'closed',
    createdAt: new Date('2026-10-30T11:00'),
    updatedAt: new Date('2026-10-31T10:20'),
    technician: { id: 2, name: 'Jean Petit' },
    author: { id: 17, name: 'Olivia Parker' }
  },
]

const MOCK_HISTORY: TicketHistory[] = [
  // #148 - Accès VPN bloqué
  { id: 1, ticketId: 148, field: 'Technicien', old_value: null, new_value: 'Sarah Koné', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-11-01T10:10') },
  { id: 2, ticketId: 148, field: 'Statut', old_value: 'Nouveau', new_value: 'En cours', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-11-01T10:12') },
  { id: 3, ticketId: 148, field: 'Priorité', old_value: 'Haute', new_value: 'Critique', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-11-01T11:05') },
  // #139 - Mot de passe de messagerie expiré
  { id: 4, ticketId: 139, field: 'Technicien', old_value: null, new_value: 'Amine Benali', changed_by: { id: 3, name: 'Amine Benali' }, updated_at: new Date('2026-11-01T08:30') },
  { id: 5, ticketId: 139, field: 'Statut', old_value: 'Nouveau', new_value: 'En cours', changed_by: { id: 3, name: 'Amine Benali' }, updated_at: new Date('2026-11-01T08:31') },
  { id: 6, ticketId: 139, field: 'Statut', old_value: 'En cours', new_value: 'Résolu', changed_by: { id: 3, name: 'Amine Benali' }, updated_at: new Date('2026-11-02T16:40') },
  // #110 - Wi-Fi instable en salle de réunion
  { id: 7, ticketId: 110, field: 'Technicien', old_value: null, new_value: 'Sarah Koné', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-09-16T10:50') },
  { id: 8, ticketId: 110, field: 'Statut', old_value: 'Nouveau', new_value: 'En cours', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-09-16T11:00') },
  { id: 9, ticketId: 110, field: 'Statut', old_value: 'En cours', new_value: 'Résolu', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-09-19T16:00') },
  { id: 10, ticketId: 110, field: 'Statut', old_value: 'Résolu', new_value: 'Clôturé', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-09-19T16:05') },
  // #116 - Serveur de fichiers inaccessible
  { id: 11, ticketId: 116, field: 'Priorité', old_value: 'Haute', new_value: 'Critique', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-09-25T08:00') },
  { id: 12, ticketId: 116, field: 'Technicien', old_value: null, new_value: 'Sarah Koné', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-09-25T08:02') },
  { id: 13, ticketId: 116, field: 'Statut', old_value: 'Nouveau', new_value: 'Clôturé', changed_by: { id: 1, name: 'Sarah Koné' }, updated_at: new Date('2026-09-25T12:15') },
  // #145 - Écran secondaire qui clignote
  { id: 14, ticketId: 145, field: 'Technicien', old_value: null, new_value: 'Amine Benali', changed_by: { id: 3, name: 'Amine Benali' }, updated_at: new Date('2026-11-01T07:00') },
  { id: 15, ticketId: 145, field: 'Technicien', old_value: 'Amine Benali', new_value: 'Jean Petit', changed_by: { id: 3, name: 'Amine Benali' }, updated_at: new Date('2026-11-02T09:30') },
]

export async function getTickets(): Promise<Ticket[]> {
  return [...MOCK_TICKETS];
}

export async function getHistory(ticketId: number): Promise<TicketHistory[]> {
  return MOCK_HISTORY.filter((h) => h.ticketId === ticketId);
}
