import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme/theme';
import { notificationManager } from '../services/notificationService';

interface NotificationBadgeProps {
  onPress?: () => void;
}

export default function NotificationBadge({ onPress }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe((notifications) => {
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name="notifications" size={24} color={colors.white} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: spacing.md,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
