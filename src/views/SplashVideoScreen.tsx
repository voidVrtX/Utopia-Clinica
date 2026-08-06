import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { colors } from '../theme/theme';

function NativeSplashVideo({ onFinish }: { onFinish?: () => void }) {
  const splashVideo = require('../../assets/splash_video.mp4');
  const { VideoView, useVideoPlayer } = require('expo-video');
  const player = useVideoPlayer(splashVideo, (playerInstance: any) => {
    playerInstance.muted = true;
    playerInstance.loop = false;
    playerInstance.play();
    if (typeof playerInstance.addListener === 'function') {
      playerInstance.addListener('playToEnd', () => onFinish?.());
    }
  });

  return <VideoView player={player} style={styles.video} resizeMode="cover" />;
}

export default function SplashVideoScreen({ onFinish }: { onFinish?: () => void }) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onFinish?.();
    }, 9000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onFinish]);

  return (
    <Pressable style={styles.container} onPress={() => onFinish?.()} accessibilityLabel="Saltar">
      {Platform.OS === 'web' ? (
        // Use native HTML5 video element on web to avoid bundler issues with expo-av
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={require('../../assets/splash_video.mp4')}
          style={styles.video as any}
          autoPlay
          muted
          playsInline
          onEnded={() => onFinish?.()}
        />
      ) : (
        <NativeSplashVideo onFinish={onFinish} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
});