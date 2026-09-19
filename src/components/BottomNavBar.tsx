import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { GamepadIcon, StarIcon, DownloadIcon, SettingsIcon } from './SvgIcons';

export const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/' || pathname === '';
  const isFav = pathname === '/favorites';
  const isDl = pathname === '/downloads';
  const isSet = pathname === '/settings';

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, isHome && styles.activeBtn]}
          activeOpacity={0.7}
          onPress={() => router.push('/')}
        >
          <GamepadIcon size={22} color={isHome ? '#0284C7' : '#64748B'} />
          <Text style={[styles.navLabel, isHome && styles.activeLabel]}>Arcade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, isFav && styles.activeBtn]}
          activeOpacity={0.7}
          onPress={() => router.push('/favorites')}
        >
          <StarIcon size={22} color="#F59E0B" filled={isFav} />
          <Text style={[styles.navLabel, isFav && styles.activeLabel]}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, isDl && styles.activeBtn]}
          activeOpacity={0.7}
          onPress={() => router.push('/downloads')}
        >
          <DownloadIcon size={22} color="#10B981" />
          <Text style={[styles.navLabel, isDl && styles.activeLabel]}>Downloads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, isSet && styles.activeBtn]}
          activeOpacity={0.7}
          onPress={() => router.push('/settings')}
        >
          <SettingsIcon size={22} color="#64748B" />
          <Text style={[styles.navLabel, isSet && styles.activeLabel]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navBtn: {
    width: 68,
    height: 54,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeBtn: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  activeLabel: {
    color: '#0284C7',
    fontWeight: '800',
  },
});
