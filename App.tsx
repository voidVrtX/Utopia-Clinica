import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider } from './src/context/SessionContext';
import RootNavigator from './src/navigation/RootNavigator';
import IntroVideoScreen from './src/components/IntroVideoScreen';

export default function App() {
  const [mostrarIntro, setMostrarIntro] = useState(true);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {mostrarIntro ? (
        <IntroVideoScreen onFinish={() => setMostrarIntro(false)} />
      ) : (
        <SessionProvider>
          <RootNavigator />
        </SessionProvider>
      )}
    </SafeAreaProvider>
  );
}
