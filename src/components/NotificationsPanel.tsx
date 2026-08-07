import React from 'react';
import { View, Modal, StyleSheet, Text, Pressable, FlatList } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/theme';
import { useNotifications } from '../viewmodels/useNotificationsViewModel';

export default function NotificationsPanel() {
  const { notifications, panelVisible, setPanelVisible, markAsRead, deleteNotification } = useNotifications();

  return (
    <Modal visible={panelVisible} animationType="slide" transparent onRequestClose={() => setPanelVisible(false)}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Notificaciones</Text>
          <FlatList
            data={notifications}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMsg}>{item.message}</Text>
                <View style={styles.actions}>
                  {!item.read ? (
                    <Pressable onPress={() => markAsRead(item.id)} style={[styles.actionBtn, { backgroundColor: colors.primary }]}> 
                      <Text style={styles.actionText}>Marcar leída</Text>
                    </Pressable>
                  ) : null}
                  <Pressable onPress={() => deleteNotification(item.id)} style={[styles.actionBtn, { backgroundColor: '#e0e0e0' }]}> 
                    <Text style={[styles.actionText, { color: colors.text }]}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            )}
            ListEmptyComponent={() => <Text style={styles.empty}>No hay notificaciones</Text>}
          />

          <Pressable onPress={() => setPanelVisible(false)} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '92%', maxWidth: 720, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, ...shadow },
  title: { textAlign: 'center', fontWeight: '800', fontSize: 16, color: colors.text, marginBottom: spacing.sm },
  item: { backgroundColor: '#fff', borderRadius: 10, padding: spacing.sm, marginBottom: spacing.sm, ...shadow },
  itemTitle: { fontWeight: '700', color: colors.text, marginBottom: 6 },
  itemMsg: { color: colors.textMuted, fontSize: 13, marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginLeft: spacing.xs },
  actionText: { color: '#fff', fontWeight: '700' },
  closeBtn: { marginTop: spacing.sm, backgroundColor: colors.primaryDark, padding: spacing.sm, borderRadius: radius.sm },
  closeText: { color: colors.white, textAlign: 'center', fontWeight: '700' },
  empty: { textAlign: 'center', color: colors.textMuted, padding: spacing.md },
});
