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
          <GamepadIcon size={20} color={isHome ? '#0284C7' : '#64748B'} />
          <Text style={[styles.navLabel, isHome && styles.activeLabel]}>Arcade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, isFav && styles.activeFavBtn]}
          activeOpacity={0.7}
          onPress={() => router.push('/favorites')}
        >
          <StarIcon size={20} color={isFav ? '#D97706' : '#64748B'} filled={isFav} />
          <Text style={[styles.navLabel, isFav && styles.activeFavLabel]}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, isDl && styles.activeDlBtn]}
          activeOpacity={0.7}
          onPress={() => router.push('/downloads')}
        >
          <DownloadIcon size={20} color={isDl ? '#059669' : '#64748B'} />
          <Text style={[styles.navLabel, isDl && styles.activeDlLabel]}>Downloads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, isSet && styles.activeSetBtn]}
          activeOpacity={0.7}
          onPress={() => router.push('/settings')}
        >
          <SettingsIcon size={20} color={isSet ? '#4F46E5' : '#64748B'} />
          <Text style={[styles.navLabel, isSet && styles.activeSetLabel]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 68,
  },
  activeBtn: {
    backgroundColor: '#E0F2FE',
  },
  activeFavBtn: {
    backgroundColor: '#FEF3C7',
  },
  activeDlBtn: {
    backgroundColor: '#ECFDF5',
  },
  activeSetBtn: {
    backgroundColor: '#EEF2FF',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  activeLabel: {
    color: '#0369A1',
    fontWeight: '700',
  },
  activeFavLabel: {
    color: '#B45309',
    fontWeight: '700',
  },
  activeDlLabel: {
    color: '#047857',
    fontWeight: '700',
  },
  activeSetLabel: {
    color: '#4338CA',
    fontWeight: '700',
  },
});
