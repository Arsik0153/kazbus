export type SupportRequesterRole = 'passenger' | 'busDriver' | 'dispatcher';

export type SupportTicketStatus = 'new' | 'inProgress' | 'closed';

export type SupportTicketPriority = 'high' | 'medium' | 'low';

export type SupportMessageAuthor = 'user' | 'support';

export type SupportMessage = {
    author: SupportMessageAuthor;
    text: string;
    time: string;
};

export type SupportTicket = {
    id: string;
    requesterRole: SupportRequesterRole;
    userName: string;
    userPhone: string;
    subject: string;
    preview: string;
    category: string;
    status: SupportTicketStatus;
    priority: SupportTicketPriority;
    createdAt: string;
    lastMessageAt: string;
    assignedTo: string;
    trip: string;
    messages: SupportMessage[];
};

export type SupportRequestTopic = {
    id: string;
    title: string;
    description: string;
    helperText?: string;
    priority: SupportTicketPriority;
};

export type SupportRequestDraft = {
    topicId: string;
    topicTitle: string;
    requesterRole: SupportRequesterRole;
    message: string;
};
