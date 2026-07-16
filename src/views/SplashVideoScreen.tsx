import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/theme';

export default function SplashVideoScreen({ onFinish }: { onFinish?: () => void }) {
  const video = useRef<any>(null);
  const splashVideo = require('../../assets/splash_video.mp4');
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // safety fallback in case playback events fail
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable style={styles.container} onPress={() => onFinish?.()} accessibilityLabel="Saltar">
      {Platform.OS === 'web' ? (
        // Use native HTML5 video element on web to avoid bundler issues with expo-av
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={splashVideo}
          style={styles.video as any}
          autoPlay
          muted
          playsInline
          onEnded={() => onFinish?.()}
        />
      ) : (
        // load expo-video dynamically on native platforms and guard if not available
        (() => {
          // require inside render to avoid bundling on web
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const expoVideo = (() => {
            try {
              return require('expo-video');
            } catch (e) {
              return null;
            }
          })();
          const VideoView = expoVideo?.VideoView ?? null;
          if (!VideoView) {
            // fallback: show nothing or a static image while video not available
            return <View style={[styles.video, { backgroundColor: colors.primary }]} />;
          }
          return (
            <VideoView
              ref={video}
              source={splashVideo}
              style={styles.video}
              resizeMode="cover"
              allowsFullscreen={false}
              muted
              onStatusUpdate={(status: any) => {
                if (status?.isPlaying === false && status?.didJustFinish) {
                  onFinish?.();
                }
              }}
            />
          );
        })()
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
});