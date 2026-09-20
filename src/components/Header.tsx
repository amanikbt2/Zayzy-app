import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { BackIcon, GamepadIcon } from './SvgIcons';
import { UserProfileModal } from './UserProfileModal';
import { getUserProfile } from '../storage/userProfile';
import { UserProfile } from '../types/progress';

interface Props {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export const Header: React.FC<Props> = ({
  title = 'Zayzy Games',
  subtitle = 'Zayzy Games - offline',
  showBack = false,
}) => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <BackIcon size={20} color="#0284C7" />
          </TouchableOpacity>
        ) : null}
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* User Profile Avatar Icon Button */}
      <TouchableOpacity
        style={styles.avatarBtn}
        activeOpacity={0.8}
        onPress={() => setShowModal(true)}
      >
        <Image
          source={{
            uri:
              profile?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          }}
          style={styles.avatarImg}
        />
        {!profile?.isProfileComplete ? <View style={styles.incompleteDot} /> : null}
      </TouchableOpacity>

      <UserProfileModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    backgroundColor: '#F1F5F9',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  avatarBtn: {
    position: 'relative',
    padding: 2,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#0284C7',
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CBD5E1',
  },
  incompleteDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
