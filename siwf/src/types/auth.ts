export interface AuthState {
  isAuthenticated: boolean;
  accessToken?: string;
  msaId?: string;
  error?: string;
}

export interface SIWFResponse {
  signedRequest: string;
  frequencyRpcUrl: string;
  redirectUrl: string;
}