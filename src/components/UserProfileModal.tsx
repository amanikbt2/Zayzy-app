import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { UserProfile } from '../types/progress';
import { getUserProfile, saveUserProfile, signOutUser } from '../storage/userProfile';
import { performGoogleSignIn } from '../services/googleAuth';

interface Props {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: UserProfile) => void;
}

export const UserProfileModal: React.FC<Props> = ({ visible, onClose, onProfileUpdated }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [course, setCourse] = useState('');
  const [campus, setCampus] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (visible) {
      loadProfileData();
    }
  }, [visible]);

  const loadProfileData = async () => {
    const data = await getUserProfile();
    setProfile(data);
    setUsername(data.username || '');
    setPhoneNumber(data.phoneNumber || '');
    setCourse(data.course || '');
    setCampus(data.campus || '');
    setBio(data.bio || '');
    setStatusMsg('');
  };

  const calculateCompletionPercentage = () => {
    let filled = 0;
    if (phoneNumber.trim().length > 3) filled += 33;
    if (course.trim().length > 1) filled += 33;
    if (campus.trim().length > 1) filled += 34;
    return Math.min(100, filled);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setStatusMsg('');
    try {
      const updated = await saveUserProfile({
        username,
        phoneNumber,
        course,
        campus,
        bio,
      });

      setProfile(updated);
      setStatusMsg('✅ Profile saved & synced to MongoDB!');
      if (onProfileUpdated) onProfileUpdated(updated);
    } catch (error) {
      setStatusMsg('❌ Failed to save profile. Check connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleAuth = async () => {
    setSigningIn(true);
    setStatusMsg('');
    try {
      const synced = await performGoogleSignIn();
      setProfile(synced);
      setUsername(synced.username);
      if (synced.phoneNumber) setPhoneNumber(synced.phoneNumber);
      if (synced.course) setCourse(synced.course);
      if (synced.campus) setCampus(synced.campus);
      if (synced.bio) setBio(synced.bio);

      setStatusMsg('🎉 Signed in with Google & synced to MongoDB!');
      if (onProfileUpdated) onProfileUpdated(synced);
    } catch (error) {
      setStatusMsg('❌ Google Sign-In failed.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    const reset = await signOutUser();
    setProfile(reset);
    setUsername(reset.username);
    setPhoneNumber('');
    setCourse('');
    setCampus('');
    setBio('');
    setStatusMsg('Signed out successfully.');
    if (onProfileUpdated) onProfileUpdated(reset);
  };

  if (!profile) return null;

  const completionPct = calculateCompletionPercentage();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header Bar */}
          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>Player Profile & Account</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* User Avatar & Identity Card */}
            <View style={styles.identityCard}>
              <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />

              <View style={styles.identityInfo}>
                <Text style={styles.nameText}>{profile.username}</Text>
                <Text style={styles.emailText}>{profile.email || 'Guest Player (Not Signed In)'}</Text>
                <View style={styles.badgeRow}>
                  {profile.isLoggedIn ? (
                    <View style={styles.googleBadge}>
                      <Text style={styles.googleBadgeText}>G Google Verified</Text>
                    </View>
                  ) : (
                    <View style={styles.guestBadge}>
                      <Text style={styles.guestBadgeText}>Guest Account</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Google Sign-In Button */}
            {!profile.isLoggedIn ? (
              <TouchableOpacity
                style={styles.googleBtn}
                activeOpacity={0.8}
                onPress={handleGoogleAuth}
                disabled={signingIn}
              >
                {signingIn ? (
                  <ActivityIndicator color="#0F172A" />
                ) : (
                  <>
                    <Text style={styles.googleIconText}>G</Text>
                    <Text style={styles.googleBtnText}>Sign In with Google</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            )}

            {/* Profile Completion Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Profile Personalization</Text>
                <Text style={styles.progressPct}>{completionPct}% Complete</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${completionPct}%` }]} />
              </View>

              {completionPct < 100 ? (
                <Text style={styles.incompleteTip}>
                  💡 Please fill in your Phone Number, Course & Campus below to complete your profile!
                </Text>
              ) : (
                <Text style={styles.completeTip}>
                  ✅ Great job! Your profile details are 100% complete and synced.
                </Text>
              )}
            </View>

            {/* Personalization Inputs */}
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Personalization Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Display Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="e.g. Alex Zayzy"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>📞 Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="e.g. +254 712 345 678"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>🎓 Course / Field of Study</Text>
                <TextInput
                  style={styles.textInput}
                  value={course}
                  onChangeText={setCourse}
                  placeholder="e.g. BSc Computer Science / Business"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>🏫 Campus / Institution</Text>
                <TextInput
                  style={styles.textInput}
                  value={campus}
                  onChangeText={setCampus}
                  placeholder="e.g. Nairobi Campus / Main Campus"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>📝 Bio / Gamer Note</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="e.g. Arcade enthusiast & puzzle solver!"
                  multiline
                  numberOfLines={2}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {statusMsg ? <Text style={styles.statusText}>{statusMsg}</Text> : null}

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveBtn}
              activeOpacity={0.85}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save & Sync to MongoDB 💾</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollBody: {
    paddingVertical: 12,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#0284C7',
  },
  identityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nameText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  emailText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 6,
    flexDirection: 'row',
  },
  googleBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  googleBadgeText: {
    color: '#1D4ED8',
    fontSize: 10,
    fontWeight: '800',
  },
  guestBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  guestBadgeText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  googleIconText: {
    color: '#EA4335',
    fontSize: 18,
    fontWeight: '900',
  },
  googleBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  signOutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  progressSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  progressPct: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 4,
  },
  incompleteTip: {
    color: '#D97706',
    fontSize: 11,
    marginTop: 8,
    lineHeight: 16,
    fontWeight: '500',
  },
  completeTip: {
    color: '#059669',
    fontSize: 11,
    marginTop: 8,
    lineHeight: 16,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 14,
  },
  formTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#0F172A',
    fontSize: 13,
  },
  multilineInput: {
    minHeight: 50,
    textAlignVertical: 'top',
  },
  statusText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
