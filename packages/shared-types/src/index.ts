export interface PetitionCard {
    id: string;
    slug: string;

    title: string;
    description: string;

    category: string;
    tags: string[]

    signaturesCount: number;
    goalCount: number;

    authorName: string;
    createdAt: string;

    relevanceScore?: number;
}

export interface UserSession {
    sessionId: string;
    userId?: string;

    isAuthenticated: boolean
}
