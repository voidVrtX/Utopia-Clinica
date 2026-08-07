import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider } from './src/context/SessionContext';
import RootNavigator from './src/navigation/RootNavigator';
import NotificationsPanel from './src/components/NotificationsPanel';

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NotificationsPanel />
        <StatusBar style="light" />
        <RootNavigator />
      </SessionProvider>
    </SafeAreaProvider>
  );
}
