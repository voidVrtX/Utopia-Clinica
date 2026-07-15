import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import { notificationManager, Notification } from '../services/notificationService';

interface NotificationsPanelProps {
  onClose?: () => void;
  visible: boolean;
}

export default function NotificationsPanel({ onClose, visible }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (visible) {
      const unsubscribe = notificationManager.subscribe(setNotifications);
      return () => unsubscribe();
    }
  }, [visible]);

  const handleMarkAsRead = (notificationId: string) => {
    notificationManager.markAsRead(notificationId);
  };

  const handleDelete = (notificationId: string) => {
    notificationManager.delete(notificationId);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'doctor_registered':
        return 'medical';
      case 'patient_registered':
        return 'person';
      case 'document_verified':
        return 'checkmark-done';
      case 'alert':
        return 'alert-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'doctor_registered':
        return colors.primary;
      case 'patient_registered':
        return '#8E24AA';
      case 'document_verified':
        return '#2E9E5B';
      case 'alert':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.notificationItemUnread,
      ]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <Ionicons
          name={getNotificationIcon(item.type) as any}
          size={20}
          color={getNotificationColor(item.type)}
        />
      </View>

      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {formatTime(item.timestamp)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="close" size={16} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />

      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.title}>Notificaciones</Text>
          <View style={styles.headerRight}>
            {notificationManager.getUnreadCount() > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationManager.getUnreadCount()}
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Sin notificaciones</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            style={styles.list}
          />
        )}
      </View>
    </View>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;

  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '85%',
    maxWidth: 400,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badge: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  notificationItemUnread: {
    backgroundColor: '#F0F8F6',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
