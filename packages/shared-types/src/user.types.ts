export interface UserSession {
    sessionId: string;
    userId?: string;

    isAuthenticated: boolean
}
