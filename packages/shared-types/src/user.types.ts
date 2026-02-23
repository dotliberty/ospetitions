export type PetitionInteractionType =
    | 'shown'
    | 'skipped'
    | 'interested'
    | 'link_opened'
    | 'not_interested'
    | 'signed'

export interface PetitionHistoryEntry {
    petitionId: string;
    interactionType: PetitionInteractionType;
    timestamp: string;
}

export interface UserSession {
    sessionId: string;
    userId?: string;

    isAuthenticated: boolean;
}
