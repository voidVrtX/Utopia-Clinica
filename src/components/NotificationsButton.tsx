import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';
import { useNotifications } from '../viewmodels/useNotificationsViewModel';

export default function NotificationsButton() {
  const { unreadCount, setPanelVisible } = useNotifications();

  return (
    <Pressable onPress={() => setPanelVisible(true)} style={styles.button} hitSlop={8}>
      <View style={styles.iconWrap}>
        <Ionicons name="notifications-outline" size={20} color={colors.white} />
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: spacing.xs },
  iconWrap: { width: 32, alignItems: 'flex-end' },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#ff4d4f',
    borderRadius: 8,
    minWidth: 16,
    paddingHorizontal: 3,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
