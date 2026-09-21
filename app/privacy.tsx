import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../src/components/Header';
import { BottomNavBar } from '../src/components/BottomNavBar';
import { useRouter } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Privacy Policy" subtitle="Zayzy Games - Legal & Privacy" showBack={true} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Privacy Policy for Zayzy Games</Text>
          <Text style={styles.date}>Last Updated: September 21, 2026</Text>

          <Text style={styles.paragraph}>
            Welcome to <Text style={styles.bold}>Zayzy Games</Text>. Your privacy is important to us. This Privacy Policy explains how our application operates, how data is handled, and our commitment to protecting your personal information when using our mobile and web applications.
          </Text>

          <Text style={styles.heading}>1. Information We Collect & How It Is Used</Text>
          <Text style={styles.paragraph}>
            Zayzy Games is designed as a privacy-first, offline-capable arcade gaming platform.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Local Gameplay Progress:</Text> Your game scores, unlocked levels, high scores, and audio preferences are stored entirely locally on your device using local storage (`AsyncStorage`).
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>No Personal Data Collection:</Text> We do not collect, request, or store personal identifying information such as your real name, phone number, physical address, or contacts.
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>No Third-Party Data Sharing:</Text> We do not sell, rent, trade, or share any user data with advertisers, third-party brokers, or external analytics platforms.
            </Text>
          </View>

          <Text style={styles.heading}>2. Device Permissions & Offline Storage</Text>
          <Text style={styles.paragraph}>
            The app may request basic device permissions necessary strictly for gameplay functionality:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Storage / Local Cache:</Text> Used solely to download and save offline game packages and preserve level achievements.
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Haptics & Audio:</Text> Used to deliver sound effects and vibration feedback during gameplay.
            </Text>
          </View>

          <Text style={styles.heading}>3. Children's Privacy (COPPA Compliance)</Text>
          <Text style={styles.paragraph}>
            Our games are family-friendly and suitable for all ages. We comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect any personal information from children under the age of 13.
          </Text>

          <Text style={styles.heading}>4. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy periodically. Any updates will be posted directly within this section of the application.
          </Text>

          <Text style={styles.heading}>5. Developer Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions, concerns, or feedback regarding this Privacy Policy or Zayzy Games, please contact the developer at:
          </Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactLabel}>Developer Email:</Text>
            <Text style={styles.contactEmail}>amanikbt1@gmail.com</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>BACK TO APP</Text>
        </TouchableOpacity>
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
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
  },
  heading: {
    color: '#0284C7',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  bulletList: {
    marginVertical: 6,
    paddingLeft: 4,
    gap: 6,
  },
  bulletItem: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 19,
  },
  contactCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  contactLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  contactEmail: {
    color: '#0284C7',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  backBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
