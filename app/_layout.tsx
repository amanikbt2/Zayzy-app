import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game/[id]" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="downloads" />
        <Stack.Screen name="settings" />
      </Stack>
    </SafeAreaProvider>
  );
}
