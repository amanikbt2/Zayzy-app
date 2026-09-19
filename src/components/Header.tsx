import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BackIcon, GamepadIcon, StarIcon, DownloadIcon, SettingsIcon } from './SvgIcons';

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

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <BackIcon size={16} color="#0284C7" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        ) : null}
        <View>
          <View style={styles.titleRow}>
            <GamepadIcon size={22} color="#0284C7" />
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: '#0284C7',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  navIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navText: {
    fontSize: 16,
  },
});
