import { syncGoogleUser, getUserProfile } from '../storage/userProfile';
import { UserProfile } from '../types/progress';

// Replace with your Google OAuth 2.0 Web Client ID from Google Cloud Console
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  '123456789000-exampleclientid.apps.googleusercontent.com';

export interface GoogleAuthResult {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  idToken?: string;
}

/**
 * Perform Google Auth Sign-In and sync user to MongoDB backend
 */
export async function performGoogleSignIn(mockPayload?: Partial<GoogleAuthResult>): Promise<UserProfile> {
  // If mock payload is provided (e.g. One-Tap / Dev Google Auth)
  const authData: GoogleAuthResult = {
    googleId: mockPayload?.googleId || `g_id_${Math.floor(100000 + Math.random() * 900000)}`,
    email: mockPayload?.email || 'user.zayzy@gmail.com',
    name: mockPayload?.name || 'Alex Zayzy',
    avatar: mockPayload?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    idToken: mockPayload?.idToken,
  };

  // Sync with MongoDB backend
  return await syncGoogleUser(authData);
}
