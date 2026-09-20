import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Header } from '../src/components/Header';
import { BottomNavBar } from '../src/components/BottomNavBar';
import { getSettings, saveSettings } from '../src/storage/settings';
import { UserSettings } from '../src/types/progress';
import { VolumeIcon, UserIcon, InfoIcon } from '../src/components/SvgIcons';

export default function SettingsScreen() {
  const [settings, setSettingsState] = useState<UserSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettingsState);
  }, []);

  const handleToggleSound = async (val: boolean) => {
    if (!settings) return;
    const updated = await saveSettings({ soundEnabled: val });
    setSettingsState(updated);
  };

  const handleToggleMusic = async (val: boolean) => {
    if (!settings) return;
    const updated = await saveSettings({ musicEnabled: val });
    setSettingsState(updated);
  };

  const handleToggleHaptics = async (val: boolean) => {
    if (!settings) return;
    const updated = await saveSettings({ hapticsEnabled: val });
    setSettingsState(updated);
  };

  if (!settings) return null;

  return (
    <View style={styles.container}>
      <Header title="Settings" subtitle="Audio & App Preferences" showBack={false} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <VolumeIcon size={20} color="#0284C7" />
            <Text style={styles.sectionTitle}>Audio Options</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.rowLabel}>Sound Effects</Text>
                <Text style={styles.rowSub}>Pops, swaps, matching audio feedback</Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={handleToggleSound}
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View>
                <Text style={styles.rowLabel}>Background Music</Text>
                <Text style={styles.rowSub}>In-game background audio tracks</Text>
              </View>
              <Switch
                value={settings.musicEnabled}
                onValueChange={handleToggleMusic}
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View>
                <Text style={styles.rowLabel}>Haptic Feedback</Text>
                <Text style={styles.rowSub}>Vibration on tile moves and matches</Text>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={handleToggleHaptics}
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserIcon size={20} color="#0284C7" />
            <Text style={styles.sectionTitle}>Player Profile</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Player Handle</Text>
              <Text style={styles.valText}>{settings.username}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Device Sync ID</Text>
              <Text style={styles.valText}>{settings.userId}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <InfoIcon size={20} color="#0284C7" />
            <Text style={styles.sectionTitle}>About Zayzy Games</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.infoText}>Platform Version: 1.0.0 (V1 Release)</Text>
            <Text style={styles.infoText}>Target: Android & React Native Web</Text>
            <Text style={styles.infoText}>Architecture: Downloadable Engine-Content Protocol</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rowSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  valText: {
    color: '#0284C7',
    fontWeight: 'bold',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  infoText: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 20,
  },
});
