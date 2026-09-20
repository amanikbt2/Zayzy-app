import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/progress';
import { fetchApi } from '../services/api';

const USER_PROFILE_KEY = '@zayzy_user_profile_v1';

export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: 'usr_guest_101',
  username: 'Guest Player',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  phoneNumber: '',
  course: '',
  campus: '',
  bio: '',
  isProfileComplete: false,
  isLoggedIn: false,
};

/**
 * Get current user profile from local storage
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Error reading UserProfile from storage:', error);
    return DEFAULT_USER_PROFILE;
  }
}

/**
 * Save user profile locally and sync to MongoDB backend
 */
export async function saveUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const current = await getUserProfile();
    const merged: UserProfile = { ...current, ...updated };

    // Compute profile completeness
    const isComplete = Boolean(
      merged.phoneNumber &&
      merged.phoneNumber.trim().length > 3 &&
      merged.course &&
      merged.course.trim().length > 1 &&
      merged.campus &&
      merged.campus.trim().length > 1
    );

    merged.isProfileComplete = isComplete;

    // Save locally to AsyncStorage
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(merged));

    // Async sync to MongoDB backend
    fetchApi('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({
        userId: merged.userId,
        username: merged.username,
        phoneNumber: merged.phoneNumber,
        course: merged.course,
        campus: merged.campus,
        bio: merged.bio,
        avatar: merged.avatar,
      }),
    }).catch((err) => console.warn('Offline or failed to sync user profile to backend:', err));

    return merged;
  } catch (error) {
    console.error('Error saving UserProfile:', error);
    throw error;
  }
}

/**
 * Sync Google Authenticated User (creates/logs in user & syncs to MongoDB)
 */
export async function syncGoogleUser(googleData: {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
}): Promise<UserProfile> {
  try {
    const current = await getUserProfile();
    const userId = current.userId && current.userId !== 'usr_guest_101' ? current.userId : `usr_g_${Date.now()}`;

    const newProfile: UserProfile = {
      ...current,
      userId,
      googleId: googleData.googleId,
      email: googleData.email,
      username: googleData.name,
      avatar: googleData.avatar || current.avatar,
      isLoggedIn: true,
    };

    // Save locally
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));

    // Sync to MongoDB backend
    const res = await fetchApi('/users/google-sync', {
      method: 'POST',
      body: JSON.stringify({
        userId: newProfile.userId,
        googleId: newProfile.googleId,
        email: newProfile.email,
        name: newProfile.username,
        avatar: newProfile.avatar,
      }),
    });

    if (res && res.success && res.data) {
      const backendUser = res.data;
      const synced: UserProfile = {
        ...newProfile,
        phoneNumber: backendUser.phoneNumber || newProfile.phoneNumber,
        course: backendUser.course || newProfile.course,
        campus: backendUser.campus || newProfile.campus,
        bio: backendUser.bio || newProfile.bio,
        isProfileComplete: backendUser.isProfileComplete ?? newProfile.isProfileComplete,
      };
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(synced));
      return synced;
    }

    return newProfile;
  } catch (error) {
    console.error('Error syncing Google user:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<UserProfile> {
  const reset: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    userId: `usr_guest_${Date.now()}`,
    isLoggedIn: false,
  };
  await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(reset));
  return reset;
}
