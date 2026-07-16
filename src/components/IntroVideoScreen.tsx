import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors } from '../theme/theme';

interface Props {
  onFinish: () => void;
}

export default function IntroVideoScreen({ onFinish }: Props) {
  const player = useVideoPlayer(require('../../assets/brand/intro-video.mp4'), (p) => {
    p.loop = false;
    p.muted = false;
    p.play();
  });

  useEffect(() => {
    const subscription = player.addListener('playToEnd', () => {
      onFinish();
    });
    return () => subscription.remove();
  }, [player, onFinish]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
      <Pressable style={styles.skip} onPress={onFinish} hitSlop={12}>
        <View style={styles.skipPill}>
          <Text style={styles.skipText}>Saltar</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  video: { flex: 1 },
  skip: {
    position: 'absolute',
    top: 56,
    right: 20,
  },
  skipPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  skipText: { color: colors.white, fontSize: 13, fontWeight: '700' },
});
