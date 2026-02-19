export interface PetitionViewedEvent {
    eventType: 'petition.viewed';

    sessionId: string;
    userId?: string;
    petitionId: string;

    dwellTimeSeconds: number;
    timestamp: string;
}

export interface PetitionSkippedEvent {
    eventType: 'petition.skipped';

    sessionId: string;
    userId?: string;
    petitionId: string;

    dwellTimeSeconds: number;
    timestamp: string;
}

export interface PetitionInterestedEvent {
    eventType: 'petition.interested';

    sessionId: string;
    userId?: string;
    petitionId: string;

    timestamp: string;
}

export interface PetitionSignedEvent {
    eventType: 'petition.signed';

    sessionId: string;
    userId: string;
    petitionId: string;

    timestamp: string;
}

export interface UserRegisteredEvent {
    eventType: 'user.registered';

    sessionId: string;
    userId: string;

    timestamp: string;
}

export type KafkaEvent =
    | PetitionViewedEvent
    | PetitionSkippedEvent
    | PetitionInterestedEvent
    | PetitionSignedEvent
    | UserRegisteredEvent;
